const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());
app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE',
  });

  next();
});

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);
app.use((req, res, next) => {
  next(new HttpError('Could not find this route.', 404));
});

app.use((err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(err);
  }

  res.status(err.code || 500);
  res.json({ message: err.message || 'An unknown error occurred' });
});

(async () => {
  try {
    await mongoose.connect(`mongodb+srv://mernUser:${encodeURIComponent('Nypl\@060191143')}@cluster0-mf8wc.mongodb.net/mern?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
    app.listen(5000);
  } catch(error) {
    console.log(error);
  }
})();

