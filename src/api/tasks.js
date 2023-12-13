const express = require('express');
const { User, Task, UserRole } = require('../models');
const { verifyToken, onlyTech, onlyManager } = require('../middleware/auth');
const { sendMessageToQueue } = require('../../publisher');
const logger = require('../logger');

const router = express.Router();

router.use(verifyToken);

// GET tasks
router.get('/', async (req, res, next) => {
  if (req.role === UserRole.MANAGER) {
    return next();
  }
  // tasks for techs
  const tasks = await Task.where({ user_id: req.user_id }, ['id', 'title', 'summary', 'date', 'updated_at', 'created_at']);
  res.status(200).json(tasks);
}, async (req, res) => {
  // all tasks (manager view)
  const tasks = await Task.all(['title', 'summary', 'date', 'updated_at', 'created_at']);
  res.status(200).json(tasks);
});

// POST create tasks
router.post('/', onlyTech, async (req, res) => {
  try {
    const { title, summary, date } = req.body;
    // Validate user input
    if (!(title && summary && date)) {
      return res.status(400).json({ message: 'Title, Summary and Date input is required' });
    }
    // Insert in our database and get the responsible tech
    const id = await Task.create({ title, summary, date, user_id: req.user_id });
    const tech = await User.find(req.user_id);

    // Send notification to message broker
    sendMessageToQueue(`The tech ${tech.name} performed the task ${title} on date ${date}`);

    return res.status(201).json({ id, title, summary });
  } catch (err) {
    logger.error(err.sqlMessage || err.message || err.toString());
    res.status(400).json({ message: err.sqlMessage || err.message || err.toString() });
  }
});

// PUT edit task
router.put('/:id', onlyTech, async (req, res) => {
  try {
    const { title, summary, date } = req.body;
    const { id } = req.params;
    // Validate user input
    if (!(title && summary && date)) {
      return res.status(400).json({ message: 'Title, Summary and Date input is required' });
    }

    // Update in our database
    const taskUpdated = await Task.update(id, { title, summary });
    if (!taskUpdated) {
      return res.status(400).json({ message: 'Wrong task id provided' });
    }

    return res.status(200).json({ id: Number(id), title, summary, date });
  } catch (err) {
    logger.error(err.sqlMessage || err.message || err.toString());
    res.status(400).json({ message: err.sqlMessage || err.message || err.toString() });
  }
});

// DELETE task
router.delete('/:id', onlyManager, async (req, res) => {
  try {
    const { id } = req.params;

    // Delete in database
    const taskDeleted = await Task.delete(id);
    if (!taskDeleted) {
      return res.status(400).json({ message: 'Wrong task id provided' });
    }

    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    logger.error(err.sqlMessage || err.message || err.toString());
    res.status(400).json({ message: err.sqlMessage || err.message || err.toString() });
  }
});

module.exports = router;
