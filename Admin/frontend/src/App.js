import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Navbar, Nav } from 'react-bootstrap';
import UploadData from './UploadData';
import ListData from './ListData';
import UpdateDataForm from './UpdateDataForm';
import PlaylistForm from './components/PlaylistForm'; // Assuming you have a PlaylistForm component
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PlaylistList from './components/PlaylistList';
import Home from './components/Home';

const App = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [musicData, setMusicData] = useState([]);
  const [selectedMusicId, setSelectedMusicId] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState('Home');

  const fetchMusicData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/music`);
      setMusicData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching music data:', error.message);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchMusicData();
    }
  }, [authenticated]);

  const handleUpdateData = (musicId) => {
    setSelectedMusicId(musicId);
    setSelectedMenuItem('Update Data');
  };

  const handleDeleteData = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/delete/${id}`);
      console.log('Data deleted successfully');
      fetchMusicData();
    } catch (error) {
      console.error('Error deleting data:', error.message);
    }
  };

  const handleLogin = () => {
    if (password === '1234') {
      setAuthenticated(true);
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setSelectedMusicId(null);
    setSelectedMenuItem('Home');
  };

  console.log(process.env.REACT_APP_URL);

  return (
    <Container>
      {!authenticated && (
        <Row className="justify-content-center mt-5">
          <Col md={4}>
            <Form>
              <Form.Group controlId="formPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleLogin}>
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      )}

      {authenticated && (
        <>
          <Navbar bg="light" expand="lg">
            <Navbar.Brand>Tarana Portal</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link onClick={() => setSelectedMenuItem('Home')}>Home</Nav.Link>
                <Nav.Link onClick={() => setSelectedMenuItem('Stats')}>Stats</Nav.Link>
                <Nav.Link onClick={() => setSelectedMenuItem('Upload Data')}>Upload Data</Nav.Link>
                <Nav.Link onClick={() => setSelectedMenuItem('List')}>List</Nav.Link>
                <Nav.Link onClick={() => setSelectedMenuItem('Playlists')}>New Playlist</Nav.Link>
                <Nav.Link onClick={() => setSelectedMenuItem('PlaylistsList')}>Playlists</Nav.Link>
              </Nav>
              <Button variant="outline-secondary" onClick={handleLogout}>
                Logout
              </Button>
            </Navbar.Collapse>
          </Navbar>

          {selectedMenuItem === 'Upload Data' && (
            <UploadData fetchMusicData={fetchMusicData} />
          )}

          {selectedMenuItem === 'Update Data' && selectedMusicId && (
            <UpdateDataForm musicId={selectedMusicId} fetchMusicData={fetchMusicData} />
          )}

          {selectedMenuItem === 'List' && (
            //  <h1>hello</h1>
              <ListData
              musicData={musicData}
              handleUpdateData={handleUpdateData}
              handleDeleteData={handleDeleteData}
            />
           
          )}

          {selectedMenuItem === 'Playlists' && (
            <PlaylistForm />
          )}
          {selectedMenuItem === 'PlaylistsList' && (
            <PlaylistList />
          )}

          {selectedMenuItem === 'Home' && (
            <Home/>
          )}

          {selectedMenuItem === 'Stats' && (
            <Home/>
          )}

        </>
      )}
    </Container>
  );
};

export default App;
