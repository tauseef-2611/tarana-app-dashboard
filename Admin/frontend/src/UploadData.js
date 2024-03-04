import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadData = ({ fetchMusicData }) => {
  const [formData, setFormData] = useState({
    Title: '',
    Artist: '',
    Mood: '',
    Poet: '',
    Category: '',
    Lyrics: '',
    file: null,
  });


  const categories = [
    { value: 'Hamd', label: 'Hamd' },
    { value: 'Naat', label: 'Naat' },
    { value: 'Tarana', label: 'Tarana' },
    { value: 'Arabic Nasheed', label: 'Arabic Nasheed' },
    { value: 'Tanzeemi', label: 'Tanzeemi' },
    { value: 'Youth', label: 'Youth' },
    // Add more categories as needed
  ];

  const moods = [
    { value: 'happy', label: '😊 Happy' },
    { value: 'sad', label: '😢 Sad' },
    { value: 'energetic', label: '💃 Energetic' },
    // Add more moods with emojis as needed
  ];

  
  const [loading, setLoading] = useState(false);
  const [poets, setPoets] = useState([]);
  const [artists, setArtists] = useState([]);
  const [newPoet, setNewPoet] = useState('');
  const [newArtist, setNewArtist] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const poetsResponse = await axios.get(`${process.env.REACT_APP_URL}/poets`);
        const artistsResponse = await axios.get(`${process.env.REACT_APP_URL}/artists`);

        setPoets(poetsResponse.data);
        setArtists(artistsResponse.data);
        console.log(poetsResponse.data);
        console.log(artistsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []); 
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      Poet: poets.length > 0 ? poets[poets.length - 1].Name : '',
      Artist: artists.length > 0 ? artists[artists.length - 1].Name : '',
    }));
  }, [poets, artists]);

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handlePoetChange = (e) => {
    setFormData({ ...formData, Poet: e.target.value });
  };
  const handleArtistChange = (e) => {
    setFormData({ ...formData, Artist: e.target.value });
  };
  const handleAddNewPoet = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/poet`, {
        Name: newPoet,
        Image: '',
      });
  
      const addedPoet = response.data;
  
      // Update the poets state only after a successful addition
      setPoets((prevPoets) => [...prevPoets, addedPoet]);
      setFormData((prevData) => ({ ...prevData, Poet: addedPoet.Name }));
      setNewPoet('');
    } catch (error) {
      console.error('Error adding new poet:', error.message);
      // Handle error as needed
    }
  };
  
  const handleAddNewArtist = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/artist`, {
        Name: newArtist,
        Image: '', // You can pass an image if you have one
      });
  
      // Assuming your server returns the added artist data
      const addedArtist = response.data;
  
      setArtists((prevArtists) => [...prevArtists, addedArtist]);
      setNewArtist('');
    } catch (error) {
      console.error('Error adding new artist:', error.message);
      // Handle error as needed
    }
  };
  
  const handleAddData = async () => {
    try {
      setLoading(true);

      const formDataForRequest = new FormData();
      for (const key in formData) {
        formDataForRequest.append(key, formData[key]);
      }

      const progressToastId = toast.info('Uploading...', {
        position: 'top-right',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        progress: 0,
      });

      const config = {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          toast.update(progressToastId, { progress });
        },
      };

      await axios.post(`${process.env.REACT_APP_URL}/upload`, formDataForRequest, config);

      toast.dismiss(progressToastId);

      setFormData({
        Title: '',
        Cover: '',
        Artist: '',
        Mood: '',
        Poet: '',
        Category: '',
        Lyrics: '',
        file: null,
      });

      fetchMusicData();
      toast.success('Data uploaded successfully!', { position: 'top-right' });
    } catch (error) {
      console.error('Error adding data:', error.message);
      toast.error('Error uploading data. Please try again.', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="container mt-5 font-sora text-lg">
      <h2 className="mb-4 text-2xl font-semibold">Add Data</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title:</label>
          <input
            type="text"
            className="mt-1 p-3 border rounded-md w-full focus:outline-none focus:ring focus:border-indigo-500"
            name="Title"
            value={formData.Title}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Artist:</label>
  <select
    className="mt-1 p-3 border rounded-md w-full bg-gray-100 focus:outline-none focus:ring focus:border-indigo-500"
    name="Artist"
    value={formData.Artist}
    onChange={handleArtistChange}
  >
    <option value="">Select an artist</option>
    {artists.map((artist) => (
      <option key={artist._id} value={artist.Name}>
        {artist.Name}
      </option>
    ))}
  </select>
</div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Cover:</label>
        <input
          type="text"
          className="mt-1 p-3 border rounded-md w-full focus:outline-none focus:ring focus:border-indigo-500"
          name="Cover"
          value={formData.Cover}
          onChange={handleInputChange}
        />
        {formData.Cover && <img src={formData.Cover} alt="Cover preview" />}
      </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Mood:</label>
          <select
    className="mt-1 p-3 border rounded-md w-full bg-gray-100 focus:outline-none focus:ring focus:border-indigo-500"
    name="Mood"
            value={formData.Mood}
            onChange={handleInputChange}
          >
            {moods.map((mood) => (
              <option key={mood.value} value={mood.value}>
                {mood.label}
              </option>
            ))}
          </select>
        </div>

        
        <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Poet:</label>
  <select
    className="mt-1 p-3 border rounded-md w-full bg-gray-100 focus:outline-none focus:ring focus:border-indigo-500"
    name="Poet"
    value={formData.Poet}
    onChange={handlePoetChange}
  >
    <option value="">Select a poet</option>
    {poets.map((poet) => (
      <option key={poet._id} value={poet.Name}>
        {poet.Name}
      </option>
    ))}
  </select>
</div>

        <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Category:</label>
  <select
    className="mt-1 p-3 border rounded-md w-full bg-gray-100 focus:outline-none focus:ring focus:border-indigo-500"
    name="Category"
    value={formData.Category}
    onChange={handleInputChange}
  >
    {categories.map((category) => (
      <option key={category.value} value={category.value}>
        {category.label}
      </option>
    ))}
  </select>
</div>


        <div className="col-span-full mb-4">
          <label className="block text-sm font-medium text-gray-700">Lyrics:</label>
          <textarea
            className="mt-1 p-3 border rounded-md w-full focus:outline-none focus:ring focus:border-indigo-500"
            name="Lyrics"
            value={formData.Lyrics}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-span-full mb-4">
          <label className="block text-sm font-medium text-gray-700">File:</label>
          <input
            type="file"
            className="mt-1 p-3 border rounded-md w-full focus:outline-none focus:ring focus:border-indigo-500"
            onChange={handleFileChange}
          />
        </div>

        <div className="col-span-full mb-4">
          <button
            type="button"
            className="px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring focus:border-indigo-700"
            onClick={handleAddData}
          >
            Add Data
          </button>
        </div>
      </div>

      <ToastContainer />
    </form>
  );
};

export default UploadData;
