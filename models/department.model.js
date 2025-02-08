const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')


// corresponds to CSED, ECED EIED
// Mostly predefined
const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter department name'],
    unique: true,
    trim: true
    // Electronics and communication
  },
  code: {
    type: String,
    required: [true, 'Please enter department code'],
    unique: true
    // ECED
  },
  description: {
    type: String,
    required: [true, 'Please enter department description']
  },
  email: {
    type: email,
    required: [true, 'Please enter department email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please enter department password'],
    minLength: [6, 'Password must be at least 6 characters']
    // password should be hashed and salted
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

departmentSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
}


departmentSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}


departmentSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
}

module.exports = mongoose.model('departmentModel', departmentSchema); 