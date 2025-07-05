const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ employeeId: req.user.id, status: 'Pending' });
  res.json(tasks);
};

exports.completeTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.status = 'Completed';
  task.remark = req.body.remark;
  task.photoPath = req.file.path;
  task.completedAt = new Date();
  await task.save();
  res.json(task);
};

exports.dashboard = async (req, res) => {
  const tasks = await Task.find({ employeeId: req.user.id });
  res.json({
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    history: tasks
  });
};
