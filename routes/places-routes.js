const express = require('express');
const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require('../controllers/places-controller');
const router = express.Router();

router.get('/:pid', getPlaceById);
router.get('/user/:uid', getPlacesByUserId);
router.post('/', createPlace);
router.patch('/:pid', updatePlace);
router.delete('/:pid', deletePlace);

module.exports = router;

