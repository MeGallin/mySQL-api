const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define(
    'Task',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      // No additional indexes needed - foreign key will create index for userId
    },
  );

  // Define association in the model
  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
  };

  return Task;
};
