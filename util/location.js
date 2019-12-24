const axios = require('axios');
const HttpError = require('../models/http-error');
const API_KEY = 'AIzaSyAJ7oXuEeTq5Fui1jHkbo59_DGoeuZDuzw';

const getCoordsForAddress = async address => {
  const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);
  if (!data || data.status === 'ZERO_RESULTS') {
    const error =  new HttpError('Could not find location for the specified address.', 422);
    throw error;
  }

  const coordinates = data.results[0].geometry.location;
  return coordinates;
};

module.exports = getCoordsForAddress;

