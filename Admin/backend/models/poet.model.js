// poet.model.js
const mongoose = require('mongoose');

const PoetModel = mongoose.model('Poet', {
  Name: String,
  Image: String,
});

module.exports = PoetModel;
