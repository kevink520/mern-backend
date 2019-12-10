const uuid = require('uuid/v4');
const HttpError = require('../models/http-error');
let DUMMY_PLACES = [{
  id: 'p1',
  title: 'Empire State Building',
  description: 'One of the most famous skyscrapers in the world',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg',
  address: '20 W 34th St, New York, NY 10001',
  location: {
    lat: 40.748433,
    lng: -73.985656,
  },
  creator: 'u1',
},
{
  id: 'p2',
  title: 'Empire State Building',
  description: 'One of the most famous skyscrapers in the world',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg',
  address: '20 W 34th St, New York, NY 10001',
  location: {
    lat: 40.748433,
    lng: -73.985656,
  },
  creator: 'u2',
}];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find(p => p.id === placeId);
  if (!place) {
    return next(new HttpError('Could not find a place for the provided id.', 404));
  }

  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter(p => p.creator === userId);
  if (places.length === 0) {
    return next(new Error('Could not find places for the provided uset id', 404));
  }

  res.json({ places });
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place, createdPlace });
};

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;
  const updatedIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
  const updatedPlace = {
    ...DUMMY_PLACES[updatedIndex],
    title,
    description,
  };
  
  DUMMY_PLACES[updatedIndex] = updatedPlace;
  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
  res.status(200).json({ message: 'Deleted place' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

