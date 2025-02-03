const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter department name'],
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Please enter department code'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please enter department description']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Department', departmentSchema); 