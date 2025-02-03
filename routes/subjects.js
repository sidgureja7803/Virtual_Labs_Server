const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const auth = require('../middleware/auth');

// Add new subject (HOD only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'hod') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const subject = new Subject({
      ...req.body,
      createdBy: req.user.userId
    });

    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get subjects by department and branch
router.get('/:department/:branch', async (req, res) => {
  try {
    const subjects = await Subject.find({
      department: req.params.department,
      branch: req.params.branch
    });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get experiments for a course
router.get('/:courseId/experiments', auth, async (req, res) => {
  try {
    const course = await Subject.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course.experiments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new experiment to a course
router.post('/:courseId/experiments', auth, async (req, res) => {
  try {
    const course = await Subject.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    course.experiments.push(req.body);
    await course.save();
    res.status(201).json(course.experiments[course.experiments.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete experiment from a course
router.delete('/:courseId/experiments/:experimentId', auth, async (req, res) => {
  try {
    const course = await Subject.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    course.experiments = course.experiments.filter(
      exp => exp._id.toString() !== req.params.experimentId
    );
    await course.save();
    res.json({ message: 'Experiment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 