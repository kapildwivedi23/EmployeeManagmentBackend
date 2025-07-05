const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const Task = require('../models/Task');

exports.addEmployee = async (req, res) => {
  const { name, role, username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const employee = new Employee({ name, role, username, password: hash });
  await employee.save();
  res.json(employee);
};

exports.getEmployees = async (req, res) => {
  const list = await Employee.find({ role: 'employee' });
  res.json(list);
};

exports.assignTask = async (req, res) => {
  const { employeeId, description } = req.body;
  const task = new Task({ employeeId, description });
  await task.save();
  res.json(task);
};

exports.getReport = async (req, res) => {
  const employees = await Employee.find({ role: 'employee' });
  const report = await Promise.all(employees.map(async (emp) => {
    const tasks = await Task.find({ employeeId: emp._id });
    return {
      name: emp.name,
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      pending: tasks.filter(t => t.status === 'Pending').length,
      tasks
    };
  }));
  res.json(report);
};
