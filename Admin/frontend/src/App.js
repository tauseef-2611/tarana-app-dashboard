import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Navbar, Nav, Dropdown } from 'react-bootstrap';
import axios from 'axios';
// import { Container, Row, Col, Form, Button, Navbar, Nav } from 'react-bootstrap';
import UploadData from './UploadData';
import ListData from './ListData';
import UpdateDataForm from './UpdateDataForm';
import PlaylistForm from './components/PlaylistForm'; // Assuming you have a PlaylistForm component
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PlaylistList from './components/PlaylistList';
import Home from './components/Home';
import Poet from './components/Poet';
import Artist from './components/Artist';


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
            <Form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <Form.Group controlId="formPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      )}

      {authenticated && (
        <>
          <Navbar bg="light" expand="lg" style={{ fontFamily: 'Sora, sans-serif', padding: '30px' }}>
            <Navbar.Brand><h3>Tarana Portal</h3></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link onClick={() => setSelectedMenuItem('Home')}>Home</Nav.Link>
                <Nav.Link onClick={() => setSelectedMenuItem('List')}>Tarane</Nav.Link>
                <Nav.Link onClick={() => setSelectedMenuItem('PlaylistsList')}>Playlists</Nav.Link>

                <Dropdown style={{ marginRight: '10px' }}>
                  <Dropdown.Toggle variant="sedondary" id="dropdown-basic">
                    More
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSelectedMenuItem('Poets')}>Poets</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedMenuItem('Artist')}>Artist</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    + Add
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSelectedMenuItem('Music')}>Tarana</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedMenuItem('Playlists')}>Album</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>

              <Button variant="outline-secondary" onClick={handleLogout}>
                Logout
              </Button>
            </Navbar.Collapse>
          </Navbar>

          {selectedMenuItem === 'Music' && (
            <UploadData fetchMusicData={fetchMusicData} />
          )}
          {selectedMenuItem === 'List' && (
            //  <h1>hello</h1>
            <ListData
              musicData={musicData}
              fetchMusicData={fetchMusicData}
            />

          )}

          {selectedMenuItem === 'Playlists' && (
            <PlaylistForm />
          )}
          {selectedMenuItem === 'Poets' && (
            <Poet />
          )}
          {selectedMenuItem === 'Artist' && (
            <Artist />
          )}
          {selectedMenuItem === 'PlaylistsList' && (
            <PlaylistList />
          )}

          {selectedMenuItem === 'Home' && (
            <Home />
          )}

          {selectedMenuItem === 'Stats' && (
            <Home />
          )}

        </>
      )}
    </Container>
  );
};

export default App;
