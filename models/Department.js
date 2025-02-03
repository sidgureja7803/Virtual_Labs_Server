const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // e.g., CSED, ECED
  name: { type: String, required: true },
  branches: [{
    code: { type: String, required: true }, // e.g., CSE, COE, COBS
    name: { type: String, required: true }
  }]
});

module.exports = mongoose.model('Department', departmentSchema); 