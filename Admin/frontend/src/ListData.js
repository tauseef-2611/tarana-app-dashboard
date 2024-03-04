import React, { useState } from 'react';
import { ListGroup, Button, Modal, Form } from 'react-bootstrap';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import axios from 'axios';

const ListData = ({ musicData, handleDeleteData }) => {
  const [show, setShow] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [updatedMusic, setUpdatedMusic] = useState({ Title: '', Cover: '' });

  const handleUpdateData = (music) => {
    setCurrentMusic(music);
    setUpdatedMusic({ Title: music.Title, Cover: music.Cover });
    setShow(true);
  };

  const handleUpdateChange = (e) => {
    setUpdatedMusic({ ...updatedMusic, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/update/${currentMusic._id}`, updatedMusic);
      // Update the music data in the parent component...
      setShow(false);
    } catch (error) {
      console.error('Error updating music:', error.message);
    }
  };

  return (
    <div className='font-sora'>
      <h2 className="text-2xl font-semibold mb-4">Tarane</h2>
      <ul role="list" className="divide-y divide-gray-100">
        {musicData.map((music, index) => (
          <li key={music._id} className={`flex justify-between items-center gap-x-4 py-4 px-4 border-b border-gray-300 shadow-md ${index !== 0 && 'mt-4'}`}>
            <div className="flex min-w-0 gap-x-2">
              <img
                className="h-10 w-10 flex-none rounded-full bg-gray-50"
                src={music.Cover}  
                alt=""
              />
              <div className="min-w-0 flex-auto">
                <p className="text-lg font-semibold leading-6 text-gray-900">{music.Title}</p>
                {/* Display other music data... */}
              </div>
            </div>
            <div className="flex">
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={() => handleUpdateData(music)}
              >
                <BsPencilSquare />
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => handleDeleteData(music._id)}
              >
                <BsTrash />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Music</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="Title" value={updatedMusic.Title} onChange={handleUpdateChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Cover</Form.Label>
              <Form.Control type="text" name="Cover" value={updatedMusic.Cover} onChange={handleUpdateChange} />
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
    </div>
  );
};

export default ListData;