// artist.model.js
const mongoose = require('mongoose');

const ArtistModel = mongoose.model('Artist', {
  Name: String,
  Image: String,
});

module.exports = ArtistModel;
