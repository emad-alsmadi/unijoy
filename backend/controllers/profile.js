const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const User = require('../models/user');
const HostCategory = require('../models/hostCategory');

exports.getProfile = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId)
    .select('-password') // Don't send password
    .populate('hostCategory', 'name')
    .then((user) => {
      if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Profile fetched', user });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.updateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }
  const userId = req.userId;
  const userRole = req.userRole;

  // Build update data based on role
  let updateData = {
    name: req.body.name,
    email: req.body.email,
  };

  try {
    if (userRole === 'host') {
      updateData.profileInfo = req.body.profileInfo;

      // Map hostCategory name to its ObjectId if provided
      if (
        typeof req.body.hostCategory === 'string' &&
        req.body.hostCategory.trim().length > 0
      ) {
        const category = await HostCategory.findOne({
          name: req.body.hostCategory.trim(),
        });
        if (!category) {
          const error = new Error('Invalid host category name');
          error.statusCode = 404;
          throw error;
        }
        updateData.hostCategory = category._id;
      }
    }

    // For users and admins, only name and email updated here

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    )
      .select('-password')
      .populate('hostCategory', 'name');

    if (!updatedUser) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
