// music.model.js
const mongoose = require('mongoose');

const MusicModel = mongoose.model('Music', {
  Title: String,
  Cover: String,
  Artist: String,
  Mood: String,
  Poet: String,
  DateUploaded: Date,
  Plays: Number,
  Category: String,
  Lyrics: String,
  Link: String,
});

module.exports = MusicModel;
