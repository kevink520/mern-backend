const { Router } = require('express');
const fileUpload = require('../middleware/file-upload');
const { check } = require('express-validator');
const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require('../controllers/places-controller');

const router = new Router();
router.get('/:pid', getPlaceById);
router.get('/user/:uid', getPlacesByUserId);
router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
  ],
  createPlace
);

router.patch('/:pid', [
  check('title').not().isEmpty(),
  check('description').isLength({ min: 5 }),
], updatePlace);

router.delete('/:pid', deletePlace);

module.exports = router;

