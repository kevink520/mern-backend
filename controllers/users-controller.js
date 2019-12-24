const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Could not fetch users.', 500);
    return next(error);
  }

  res.status(200).json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signUpUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Validation failed', 422));
  }

  const {
    name,
    email,
    password,
  } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Sign up failed. Please try again.', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError('The user exists already. Please log in instead.', 422);
    return next(error);
  }

  try {
    const newUser = new User({
      name,
      email,
      password,
      image: `https://i.pravatar.cc/300?v=${id}`,
      places: [],
    });

    await newUser.save();
  } catch (err) {
    const error = new HttpError('Signing up failed. Please try again.', 500);
    return next(error);
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Validation failed', 422));
  }

  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Login failed. Please try again.', 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError('Invalid credentials. Could not log you in.', 401);
    return next(error);
  }

  return res.status(200).json({
    message: 'Logged In',
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getAllUsers = getAllUsers;
exports.signUpUser = signUpUser;
exports.loginUser = loginUser;

