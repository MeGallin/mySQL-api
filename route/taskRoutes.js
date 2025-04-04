const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require('../controller/taskController');
const { verifyToken } = require('../middleware/auth');

// Task routes
router.get('/', verifyToken, getTasks);
router.get('/:id', verifyToken, getTask);
router.post('/', verifyToken, createTask);
router.put('/:id', verifyToken, updateTask);
router.delete('/:id', verifyToken, deleteTask);

module.exports = router;
