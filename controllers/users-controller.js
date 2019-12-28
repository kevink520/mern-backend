const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

  let newUser;
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('Sign up failed. Please try again.', 500);
    return next(error);
  }

  try {
    newUser = new User({
      name,
      email,
      password: hashedPassword,
      image: req.file.location,
      places: [],
    });

    await newUser.save();
  } catch (err) {
    const error = new HttpError('Signing up failed. Please try again.', 500);
    console.log(err.message);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError('Signing up failed. Please try again.', 500);
    console.log(err.message);
    return next(error);
  }

  res.status(201).json({
    userId: newUser.id,
    email: newUser.email,
    token,
  });
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

  if (!existingUser) {
    const error = new HttpError('Invalid credentials. Could not log you in.', 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError('Could not log you in. Please check your credentials and try again.', 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError('Invalid credentials. Could not log you in.', 401);
    return next(error);
  }
  
  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError('Signing up failed. Please try again.', 500);
    console.log(err.message);
    return next(error);
  }

  return res.status(200).json({
    userId: existingUser.id,
    email: existingUser.email,
    token,
  });
};

exports.getAllUsers = getAllUsers;
exports.signUpUser = signUpUser;
exports.loginUser = loginUser;

