const { Task } = require('../model');
const { Op } = require('sequelize');

const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority } = req.body || {};

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        status: 'error',
        message: 'Title is required',
      });
    }

    const userId = req.user.id;

    // Create task with validated data
    const task = await Task.create({
      title,
      description: description || null,
      dueDate: dueDate || null,
      priority: priority || 'medium',
      userId,
    });

    res.status(201).json({
      status: 'success',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      completed,
      priority,
      search,
      sortBy = 'createdAt',
      order = 'DESC',
      page = 1,
      limit = 10,
    } = req.query;

    // Build where clause
    const where = { userId };
    if (completed !== undefined) {
      where.completed = completed === 'true';
    }
    if (priority) {
      where.priority = priority;
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Get tasks with pagination
    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      order: [[sortBy, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      status: 'success',
      data: {
        tasks,
        pagination: {
          total: count,
          page: parseInt(page),
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findOne({
      where: { id, userId },
    });

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found',
      });
    }

    res.json({
      status: 'success',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, completed, dueDate, priority } = req.body || {};

    const task = await Task.findOne({
      where: { id, userId },
    });

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found',
      });
    }

    // Build update object with only provided fields
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = completed;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (priority !== undefined) updates.priority = priority;

    // Validate title if it's being updated
    if (updates.title === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Title cannot be empty',
      });
    }

    // Update task
    await task.update(updates);

    res.json({
      status: 'success',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findOne({
      where: { id, userId },
    });

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found',
      });
    }

    await task.destroy();

    res.json({
      status: 'success',
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};
