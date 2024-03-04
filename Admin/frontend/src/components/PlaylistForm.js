import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card, InputGroup, FormControl, Toast, ListGroup } from 'react-bootstrap';

const PlaylistForm = () => {
  const [playlistData, setPlaylistData] = useState({
    Name: '',
    Description: '',
    Music: [],
  });

  const [allMusic, setAllMusic] = useState([]);
  const [search, setSearch] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchAllMusic = async () => {
      try {
        const response = await axios.get('http://localhost:8000/music');
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

  const handleMusicSelection = (musicId) => {
    setPlaylistData((prevData) => {
      if (prevData.Music.includes(musicId)) {
        return {
          ...prevData,
          Music: prevData.Music.filter((id) => id !== musicId),
        };
      } else {
        return {
          ...prevData,
          Music: [...prevData.Music, musicId],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const playlistObject = {
        Name: playlistData.Name,
        Description: playlistData.Description,
        Music: playlistData.Music,
      };

      await axios.post('http://localhost:8000/playlist', playlistObject, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setShowToast(true);
    } catch (error) {
      console.error('Error creating playlist:', error.message);
    }
  };

  const filteredMusic = allMusic.filter((music) =>
    music.Title.toLowerCase().includes(search.toLowerCase())
  );

  const selectedMusic = allMusic.filter((music) =>
    playlistData.Music.includes(music._id)
  );

  return (
    <Container>
      <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
        <Toast.Header>
          <strong className="mr-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>Playlist created successfully!</Toast.Body>
      </Toast>
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
            <Button type="submit">Create Playlist</Button>
          </Form>
          <h2 className="mt-4">Selected Music</h2>
          <ListGroup>
            {selectedMusic.map((music) => (
              <ListGroup.Item key={music._id}>{music.Title}</ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={6}>
          <h2>Available Music</h2>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search Music"
              aria-label="Search Music"
              aria-describedby="basic-addon2"
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <Row>
            {filteredMusic.map((music) => (
              <Col key={music._id} md={4} className="mb-3">
                <Card
                  onClick={() => handleMusicSelection(music._id)}
                  style={{ cursor: 'pointer', height: '100%', boxShadow: playlistData.Music.includes(music._id) ? '0 0 10px blue' : 'none' }}
                >
                  <Card.Img variant="top" src={music.Cover} alt={`${music.Title} Cover`} style={{ height: '200px', objectFit: 'cover' }} />
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