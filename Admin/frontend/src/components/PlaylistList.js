import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Image, Modal, Form } from 'react-bootstrap';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';

const PlaylistList = () => {
  const [playlists, setPlaylists] = useState([]);
  const [show, setShow] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [updatedPlaylist, setUpdatedPlaylist] = useState({ Name: '', Description: '' });

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('http://localhost:8000/playlists');
        setPlaylists(response.data);
      } catch (error) {
        console.error('Error fetching playlists:', error.message);
      }
    };

    fetchPlaylists();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/playlist/${id}`);
      setPlaylists(playlists.filter((playlist) => playlist._id !== id));
    } catch (error) {
      console.error('Error deleting playlist:', error.message);
    }
  };

  const handleUpdate = (playlist) => {
    setCurrentPlaylist(playlist);
    setUpdatedPlaylist({ 
      Name: playlist.Name, 
      Description: playlist.Description,
      Music: playlist.Music // Include the current music in the updatedPlaylist state
    });
    setShow(true);
  };

  const handleUpdateChange = (e) => {
    setUpdatedPlaylist({ ...updatedPlaylist, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/playlist/${currentPlaylist._id}`, updatedPlaylist);
      setPlaylists(playlists.map((playlist) => (playlist._id === currentPlaylist._id ? response.data : playlist)));
      setShow(false);
    } catch (error) {
      console.error('Error updating playlist:', error.message);
    }
  };

  return (
    <Container>
      <h2>All Playlists</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Music</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {playlists.map((playlist) => (
            <tr key={playlist._id}>
              <td>{playlist.Name}</td>
              <td>{playlist.Description}</td>
              <td style={{ display: 'flex', overflowX: 'auto' }}>
                {playlist.Music.map((music) => (
                  <div key={music._id} style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                    <Image src={music.Cover} thumbnail width={50} />
                    <div style={{ fontSize: '0.75rem', marginLeft: '5px' }}>{music.Title}</div>
                  </div>
                ))}
              </td>
              <td>
                <Button variant="warning" onClick={() => handleUpdate(playlist)}>
                  <BsPencilSquare />
                </Button>
                <Button variant="danger" onClick={() => handleDelete(playlist._id)} style={{ marginLeft: '10px' }}>
                  <BsTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="Name" value={updatedPlaylist.Name} onChange={handleUpdateChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" name="Description" value={updatedPlaylist.Description} onChange={handleUpdateChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PlaylistList;