import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Image, Container, Row, Col, Table } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Poet = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [poets, setPoets] = useState([]);
  const [update, setUpdate] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  const fetchPoets = async () => {
    const response = await axios.get('http://localhost:8000/poets');
    setPoets(response.data);
  };

  useEffect(() => {
    fetchPoets();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (update) {
      await axios.put(`http://localhost:8000/poet/${updateId}`, { Name: name, Image: image });
      toast.success('Poet updated successfully!');
      setUpdate(false);
      setUpdateId(null);
    } else {
      await axios.post('http://localhost:8000/poet', { Name: name, Image: image });
      toast.success('Poet added successfully!');
    }

    setName('');
    setImage('');
    fetchPoets();
  };

  const handleUpdate = (poet) => {
    setName(poet.Name);
    setImage(poet.Image);
    setUpdate(true);
    setUpdateId(poet._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/poet/${id}`);
    toast.success('Poet deleted successfully!');
    fetchPoets();
  };

  return (
    <Container style={{padding:'50px'}}>
      <ToastContainer />
      <Row>
        <Col>
        <h1>Poets</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formPoetName">
              <Form.Label>Poet's Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formPoetImage">
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
              {poets.map((poet) => (
                <tr key={poet._id}>
                  <td>{poet.Name}</td>
                  <td><Image src={poet.Image} thumbnail style={{ width: '100px' }} /></td>
                  <td>
                    <Button variant="outline-primary" onClick={() => handleUpdate(poet)}><PencilSquare /></Button>{' '}
                    <Button variant="outline-danger" onClick={() => handleDelete(poet._id)}><Trash /></Button>
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

export default Poet;