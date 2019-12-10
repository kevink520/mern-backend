const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
let DUMMY_USERS = [{
  id: 'u1',
  name: 'Sam Schwartz',
  image: 'https://i.pravatar.cc/300?v=1',
  places: 3,
}, {
  id: 'u2',
  name: 'Avery K.',
  image: 'https://i.pravatar.cc/300?v=2',
  places: 1,
}, {
  id: 'u3',
  name: 'Angel Lee',
  image: 'https://i.pravatar.cc/300?v=3',
  places: 1,
}];

const getAllUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signUpUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Validation failed', 422));
  }

  const {
    name,
    email,
    password,
  } = req.body;

  const foundUser = DUMMY_USERS.find(u => u.email === email);
  if (foundUser) {
    return next(new HttpError('User with that email already exists.', 401));
  }

  const newUser = {
    id: uuid(),
    name,
    email,
    password,
    image: `https://i.pravatar.cc/300?v=${id}`,
    places: 0,
  };

  DUMMY_USERS.push(newUser);
  res.status(201).json({ user: newUser });
};

const loginUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Validation failed', 422));
  }

  const { email, password } = req.body;
  const loggedInUser = DUMMY_USERS.find(u => u.email === email && u.password === password);
  if (loggedInUser) {
    return res.status(200).json({ user: loggedInUser });
  }

  next(new HttpError('Could not log in user', 401));
};

exports.getAllUsers = getAllUsers;
exports.signUpUser = signUpUser;
exports.loginUser = loginUser;

