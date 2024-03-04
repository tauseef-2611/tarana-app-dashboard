import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, ListGroup } from 'react-bootstrap';

const PlaylistList = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('http://localhost:8000/playlists'); // Replace with your backend server URL
        setPlaylists(response.data);
      } catch (error) {
        console.error('Error fetching playlists:', error.message);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <Container>
      <h2>All Playlists</h2>
      {playlists.map((playlist) => (
        <Card key={playlist._id} className="mb-3">
          <Card.Body>
            <Card.Title>{playlist.Name}</Card.Title>
            <Card.Text>{playlist.Description}</Card.Text>
          </Card.Body>
          <ListGroup className="list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {playlist.Music.map((music) => (
              <ListGroup.Item key={music._id}>
                {/* Access and render individual properties of the music object */}
                <div>Title: {music.Title}</div>
                {/* <div>Artist: {music.Artist}</div> */}
                {/* Add more properties as needed */}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      ))}
    </Container>
  );
};

export default PlaylistList;
