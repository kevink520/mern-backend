const { Router } = require('express');
const { check } = require('express-validator');
const { getAllUsers, signUpUser, loginUser } = require('../controllers/users-controller');
const { userPhotoUpload } = require('../middleware/file-upload');

const router = new Router();

router.get('/', getAllUsers);
router.post(
  '/signup',
  userPhotoUpload.single('image'),
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  signUpUser
);

router.post('/login', [
  check('email').normalizeEmail().isEmail(),
  check('password').isLength({ min: 6 }),
], loginUser);

module.exports = router;

