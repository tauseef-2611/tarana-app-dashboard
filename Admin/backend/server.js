const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { BlobServiceClient, StorageSharedKeyCredential, BlobSASPermissions } = require('@azure/storage-blob');
const cors = require('cors'); 
const shortid = require('shortid');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8000;

// Replace these with your Azure Storage account details
const accountName = 'taranadb';
const accountKey = 'imgfHw2KjWeKpFKJztxfzn6/8nM2NGsm48fGoG9SV4jKKnBbUWSQD+tnvz8jhOh0TzaAVwuzJtot+AStOFgh6Q==';
const containerName = 'tarane';

// Create a StorageSharedKeyCredential object with your Storage account and account key
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

// Create a BlobServiceClient object that will be used to interact with the Blob service
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);

// Connect to MongoDB (replace the connection string with your MongoDB URL)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// Add this to your code
const PlaylistModel = require('./models/playlist.model');
const MusicModel = require('./models/music.model');
const PoetModel = require('./models/poet.model');
const ArtistModel = require('./models/artist.model');


// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Update with your frontend origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));


  // Route for handling form submissions
  app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      const { Title, Cover, Artist, Mood, Poet, Category, Lyrics } = req.body;
      const file = req.file;
        console.log('File:', file);
      // Save file to Azure Blob Storage
      const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Format timestamp
      const blobName = `${timestamp.substring(0, 8)}_${shortid.generate()}`.concat('.mp3');      
 // Use a suitable name for your blob
      await uploadFile(file.buffer, blobName);
  console.log('File uploaded successfully.');
      // Get a temporary read URL for the uploaded blob
      const downloadURL = await getDownloadLink(blobName);
  console.log('Download URL:', downloadURL);
      // Save form data with the shareable link into MongoDB
      const musicData = new MusicModel({
        Title,
        Cover,
        Artist,
        Mood,
        Poet,
        DateUploaded: new Date(),
        Plays: 0,
        Category,
        Lyrics,
        Link: downloadURL,
      });


  
      await musicData.save();
  
      res.status(201).json({ message: 'Form data and file uploaded successfully.' });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Route to delete data from MongoDB and Blob Storage
  app.delete('/delete/:id', async (req, res) => {
    try {
      const musicId = req.params.id;
  
      // Find and delete data from MongoDB
      const musicData = await MusicModel.findByIdAndDelete(musicId);
  
      if (!musicData) {
        return res.status(404).json({ error: 'Music not found.' });
      }
      console.log('Music data:', musicData.Link.split('/tarane/').pop().split('?')[0]);
      // Delete blob from Azure Blob Storage
      await deleteFile(musicData.Link.split('/tarane/').pop().split('?')[0]);
  
      res.json({ message: 'Music data deleted successfully.' });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Route to get music by category
  app.get('/music/category/:category', async (req, res) => {
    try {
      const category = req.params.category;
      const musicByCategory = await MusicModel.find({ Category: category });
  
      res.json(musicByCategory);
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Route to get music by mood
  app.get('/music/mood/:mood', async (req, res) => {
    try {
      const mood = req.params.mood;
      const musicByMood = await MusicModel.find({ Mood: mood });
  
      res.json(musicByMood);
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.get('/music', async (req, res) => {
    try {
      const allMusicData = await MusicModel.find();
      res.status(200).json(allMusicData);
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
// Route to update data in MongoDB and Blob Storage
app.put('/update/:id', upload.single('file'), async (req, res) => {
    try {
      const musicId = req.params.id;
      const { Title, Cover, Artist, Mood, Poet, Category, Lyrics } = req.body;
      const file = req.file;
  
      // Retrieve existing music data from MongoDB
      const existingMusicData = await MusicModel.findById(musicId);
  
      if (!existingMusicData) {
        return res.status(404).json({ error: 'Music data not found.' });
      }
  
      // Delete existing blob from Azure Blob Storage
      await deleteFile(existingMusicData.Link);
  
      // Save the new file to Azure Blob Storage
      const newBlobName = file.originalname; // Use a suitable name for your blob
      await uploadFile(file.buffer, newBlobName);
  
      // Get a temporary read URL for the new uploaded blob
      const newDownloadURL = await getDownloadLink(newBlobName);
  
      // Update form data with the new shareable link in MongoDB
      existingMusicData.Title = Title;
      existingMusicData.Cover = Cover;
      existingMusicData.Artist = Artist;
      existingMusicData.Mood = Mood;
      existingMusicData.Poet = Poet;
      existingMusicData.Category = Category;
      existingMusicData.Lyrics = Lyrics;
      existingMusicData.Link = newDownloadURL;
  
      await existingMusicData.save();
  
      res.status(200).json({ message: 'Data updated successfully.' });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  // Function to delete a file from Azure Blob Storage
  async function deleteFile(blobName) {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    await blobClient.delete();
    console.log(`Blob "${blobName}" deleted successfully.`);
  }
  
  // Function to upload a file to Azure Blob Storage
  async function uploadFile(fileBuffer, blobName) {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(blobName);
    await blobClient.uploadData(fileBuffer, fileBuffer.length);
    console.log(`File "${blobName}" uploaded successfully.`);
  }
  
  // Function to get a temporary read URL for a blob
  async function getDownloadLink(blobName) {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const downloadURL = await blobClient.generateSasUrl({
        permissions: BlobSASPermissions.parse('r'),
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 315360000000), // Expires in 10 years
      });
       // Expires in 24 hours
    console.log(`Download URL for "${blobName}": ${downloadURL}`);
    return downloadURL;
  }
  
// Add these endpoints to your code

// Route to get all playlists
app.get('/playlists', async (req, res) => {
  try {
    const allPlaylists = await PlaylistModel.find().populate('Music');
    res.status(200).json(allPlaylists);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get playlist by id
app.get('/playlist/:id', async (req, res) => {
  try {
    const playlistId = req.params.id;
    const playlist = await PlaylistModel.findById(playlistId).populate('Music');
    
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found.' });
    }

    res.json(playlist);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to post a new playlist
app.post('/playlist', async (req, res) => {
  try {
    const { Name, Description, Music } = req.body;
        console.log('Received Music IDs:', Music);
    // Validate if the provided music IDs exist in the MusicModel
    const existingMusicCount = await MusicModel.countDocuments({ _id: { $in: Music } });

    if (existingMusicCount !== Music.length) {
      return res.status(400).json({ error: 'Invalid music IDs in the playlist.' });
    }

    const playlistData = new PlaylistModel({
      Name,
      Description,
      Music,
    });

    await playlistData.save();

    res.status(201).json({ message: 'Playlist created successfully.' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/poet', async (req, res) => {
  try {
    const { Name, Image } = req.body;

    const poetData = new PoetModel({
      Name,
      Image,
    });

    await poetData.save();

    res.status(201).json({ message: 'Poet created successfully.' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get all poets
app.get('/poets', async (req, res) => {
  try {
    const allPoets = await PoetModel.find();
    res.status(200).json(allPoets);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get music by poet
app.get('/music/poet/:poet', async (req, res) => {
  try {
    const poet = req.params.poet;
    const musicByPoet = await MusicModel.find({ Poet: poet });

    res.json(musicByPoet);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get all artists
app.get('/artists', async (req, res) => {
  try {
    const allArtists = await ArtistModel.find();
    res.status(200).json(allArtists);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to post a new artist
app.post('/artist', async (req, res) => {
  try {
    const { Name, Image } = req.body;

    const artistData = new ArtistModel({
      Name,
      Image,
    });

    await artistData.save();

    res.status(201).json({ message: 'Artist created successfully.' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/stats', async (req, res) => {
  try {
    const totalMusicCount = await MusicModel.countDocuments();
    const totalPlaylistCount = await PlaylistModel.countDocuments();
    const totalPlayCount = await MusicModel.aggregate([{ $group: { _id: null, plays: { $sum: "$Plays" } } }]);
    
    res.json({
      totalMusicCount,
      totalPlaylistCount,
      totalPlayCount: totalPlayCount.length > 0 ? totalPlayCount[0].plays : 0
    });
  } catch (error) {
    console.error('Error fetching statistics:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get most played category
  app.get('/most-played-category', async (req, res) => {
    try {
      const mostPlayedCategory = await MusicModel.aggregate([
        {
          $group: {
            _id: '$Category',
            totalPlays: { $sum: '$Plays' },
          },
        },
        {
          $sort: { totalPlays: -1 },
        },
        {
          $limit: 5,
        },
      ]);
  
      const labels = mostPlayedCategory.map((category) => category._id);
      const data = mostPlayedCategory.map((category) => category.totalPlays);
  
      res.json({ labels, data });
    } catch (error) {
      console.error('Error fetching most played category data:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.put('/playlist/:id', async (req, res) => {
    const updatedPlaylist = await PlaylistModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPlaylist);
});

app.put('/poet/:id', async (req, res) => {
    const updatedPoet = await PoetModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPoet);
});

app.put('/artist/:id', async (req, res) => {
    const updatedArtist = await ArtistModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedArtist);
});

// Delete endpoints
app.delete('/playlist/:id', async (req, res) => {
    await PlaylistModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Playlist deleted' });
});

app.delete('/poet/:id', async (req, res) => {
    await PoetModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Poet deleted' });
});

app.delete('/artist/:id', async (req, res) => {
    await ArtistModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Artist deleted' });
});




  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });