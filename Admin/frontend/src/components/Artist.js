import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Image, Container, Row, Col, Table } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Artist = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [artists, setArtists] = useState([]);
  const [update, setUpdate] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  const fetchArtists = async () => {
    const response = await axios.get('http://localhost:8000/artists');
    setArtists(response.data);
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (update) {
      await axios.put(`http://localhost:8000/artist/${updateId}`, { Name: name, Image: image });
      toast.success('Artist updated successfully!');
      setUpdate(false);
      setUpdateId(null);
    } else {
      await axios.post('http://localhost:8000/artist', { Name: name, Image: image });
      toast.success('Artist added successfully!');
    }

    setName('');
    setImage('');
    fetchArtists();
  };

  const handleUpdate = (artist) => {
    setName(artist.Name);
    setImage(artist.Image);
    setUpdate(true);
    setUpdateId(artist._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/artist/${id}`);
    toast.success('Artist deleted successfully!');
    fetchArtists();
  };

  return (
    <Container style={{padding:'50px'}}>
      <ToastContainer />
      <Row>
        <Col>
        <h1>Artists</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formArtistName">
              <Form.Label>Artist's Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formArtistImage">
              <Form.Label>Image URL</Form.Label>
              <Form.Control type="text" placeholder="Enter image URL" value={image} onChange={(e) => setImage(e.target.value)} />
              {image && <Image src={image} thumbnail />}
            </Form.Group>

            <Button variant="primary" type="submit">
              {update ? <PencilSquare /> : 'Submit'}
            </Button>
          </Form>
        </Col>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist) => (
                <tr key={artist._id}>
                  <td>{artist.Name}</td>
                  <td><Image src={artist.Image} thumbnail style={{ width: '100px' }} /></td>
                  <td>
                    <Button variant="outline-primary" onClick={() => handleUpdate(artist)}><PencilSquare /></Button>{' '}
                    <Button variant="outline-danger" onClick={() => handleDelete(artist._id)}><Trash /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Artist;