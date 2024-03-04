// playlist.model.js
const mongoose = require('mongoose');

const PlaylistModel = mongoose.model('Playlist', {
  Name: String,
  Description: String,
  Music: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Music' }],
});

module.exports = PlaylistModel;
