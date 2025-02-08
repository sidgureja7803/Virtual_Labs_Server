const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const courseCoordinatorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter course name'],
        trim: true
    },
    courseCode: {
        type: mongoose.Schema.ObjectId,
        ref: 'courseSchema',
        unique: true,
        required: true
    },
    department: {
        type: mongoose.Schema.ObjectId,
        ref: 'departmentSchema',
        required: true
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
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

courseCoordinatorSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
}


courseCoordinatorSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}


courseCoordinatorSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
}


module.exports = mongoose.model('courseCoordinatorModel', courseCoordinatorSchema); 