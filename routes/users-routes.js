const { Router } = require('express');
const { check } = require('express-validator');
const { getAllUsers, signUpUser, loginUser } = require('../controllers/users-controller');

const router = new Router();

router.get('/', getAllUsers);
router.post('/signup', [
  check('name').not().isEmpty(),
  check('email').normalizeEmail().isEmail(),
  check('password').isLength({ min: 7 }),
], signUpUser);

router.post('/login', [
  check('email').normalizeEmail().isEmail(),
  check('password').isLength({ min: 5 }),
], loginUser);

module.exports = router;

