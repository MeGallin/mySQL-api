const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'todo_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

// Import models
const User = require('./User')(sequelize);
const Task = require('./Task')(sequelize);

// Set up associations
User.hasMany(Task, {
  foreignKey: 'userId',
  as: 'tasks',
  onDelete: 'CASCADE',
});

Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Sync all models with database
const syncDatabase = async () => {
  try {
    // Force sync in development mode to recreate tables
    if (process.env.NODE_ENV === 'development') {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      await sequelize.sync({ force: true });
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    } else {
      await sequelize.sync();
    }
  } catch (error) {
    throw new Error(`Failed to sync database: ${error.message}`);
  }
};

module.exports = {
  sequelize,
  User,
  Task,
  syncDatabase,
};
