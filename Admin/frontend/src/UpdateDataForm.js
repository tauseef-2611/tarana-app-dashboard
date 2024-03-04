import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateDataForm = ({ musicId, fetchMusicData }) => {
  const [formData, setFormData] = useState({
    Title: '',
    Cover: '',
    Artist: '',
    Mood: '',
    Poet: '',
    Category: '',
    Lyrics: '',
    file: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/music/${musicId}`);
        const music = response.data; // Assuming the endpoint returns a single music object

        setFormData({
          Title: music.Title || '',
          Cover: music.Cover || '',
          Artist: music.Artist || '',
          Mood: music.Mood || '',
          Poet: music.Poet || '',
          Category: music.Category || '',
          Lyrics: music.Lyrics || '',
          file: null, // You may need to handle file separately, as fetching the file requires additional logic
        });
      } catch (error) {
        console.error('Error fetching music data:', error.message);
      }
    };

    fetchData();
  }, [musicId]);

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateData = async () => {
    try {
      const formDataForRequest = new FormData();
      for (const key in formData) {
        formDataForRequest.append(key, formData[key]);
      }

      await axios.put(`http://localhost:8000/update/${musicId}`, formDataForRequest);
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

      toast.success('Data updated successfully', { position: 'bottom-right' });
      fetchMusicData();
    } catch (error) {
      console.error('Error updating data:', error.message);
      toast.error('Error updating data', { position: 'bottom-right' });
    }
  };

  return (
    <>
      <div>
        <h2>Update Data</h2>
        <div className="mb-3">
          <label className="form-label">Title:</label>
          <input
            type="text"
            className="form-control"
            name="Title"
            value={formData.Title}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cover:</label>
          <input
            type="text"
            className="form-control"
            name="Cover"
            value={formData.Cover}
            onChange={handleInputChange}
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Artist:</label>
            <input
              type="text"
              className="form-control"
              name="Artist"
              value={formData.Artist}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Mood:</label>
            <input
              type="text"
              className="form-control"
              name="Mood"
              value={formData.Mood}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Poet:</label>
            <input
              type="text"
              className="form-control"
              name="Poet"
              value={formData.Poet}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Category:</label>
            <input
              type="text"
              className="form-control"
              name="Category"
              value={formData.Category}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Lyrics:</label>
          <textarea
            className="form-control"
            name="Lyrics"
            value={formData.Lyrics}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">File:</label>
          <input type="file" className="form-control" onChange={handleFileChange} />
        </div>

        <button className="btn btn-primary" onClick={handleUpdateData}>
          Update Data
        </button>

        <ToastContainer />
      </div>
    </>
  );
};

export default UpdateDataForm;
