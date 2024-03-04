import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

const PlaylistForm = () => {
  const [playlistData, setPlaylistData] = useState({
    Name: '',
    Description: '',
    Music: [],
  });

  const [allMusic, setAllMusic] = useState([]);

  useEffect(() => {
    // Fetch all music data when the component mounts
    const fetchAllMusic = async () => {
      try {
        const response = await axios.get('http://localhost:8000/music'); // Update with your backend server URL
        setAllMusic(response.data);
      } catch (error) {
        console.error('Error fetching music data:', error.message);
      }
    };

    fetchAllMusic();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlaylistData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleMusicSelection = (e) => {
    const selectedMusicId = e.target.value;
    const isChecked = e.target.checked;

    setPlaylistData((prevData) => {
      if (isChecked) {
        // If the checkbox is checked, add the music ID to the array
        return {
          ...prevData,
          Music: [...prevData.Music, selectedMusicId],
        };
      } else {
        // If the checkbox is unchecked, remove the music ID from the array
        return {
          ...prevData,
          Music: prevData.Music.filter((id) => id !== selectedMusicId),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a playlist object with the required properties
      const playlistObject = {
        Name: playlistData.Name,
        Description: playlistData.Description,
        Music: playlistData.Music,
      };

      // Post the playlist data to your backend server
      await axios.post('http://localhost:8000/playlist', playlistObject, {
        headers: {
          'Content-Type': 'application/json',
        },
      }); // Update with your backend server URL

      console.log('Playlist created successfully!');
      // Optionally, you can redirect the user or perform any other action after successful submission
    } catch (error) {
      console.error('Error creating playlist:', error.message);
    }
  };

  return (
    <Container>
      <Row>
        <Col md={6}>
          <h2>Create a New Playlist</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Playlist Name:</Form.Label>
              <Form.Control
                type="text"
                name="Name"
                value={playlistData.Name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description:</Form.Label>
              <Form.Control
                as="textarea"
                name="Description"
                value={playlistData.Description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Select Music:</Form.Label>
              <Row>
                {allMusic.map((music) => (
                  <Col key={music._id} md={4} className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label={music.Title}
                      value={music._id}
                      checked={playlistData.Music.includes(music._id)}
                      onChange={handleMusicSelection}
                    />
                  </Col>
                ))}
              </Row>
            </Form.Group>
            <Button type="submit">Create Playlist</Button>
          </Form>
        </Col>
        <Col md={6}>
          <h2>Available Music</h2>
          <Row>
            {allMusic.map((music) => (
              <Col key={music._id} md={4} className="mb-3">
                <Card>
                  <Card.Img variant="top" src={music.Cover} alt={`${music.Title} Cover`} />
                  <Card.Body>
                    <Card.Title>{music.Title}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaylistForm;
