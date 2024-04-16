import React, { useState } from 'react';
import { useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import axios from 'axios';
import { useTable, useSortBy } from 'react-table';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ListData = ({ musicData, fetchMusicData }) => {
  const [show, setShow] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [artists, setArtists] = useState([]);
  const [poets, setPoets] = useState([]);

  const categories = [
    { value: 'Hamd', label: 'Hamd' },
    { value: 'Naat', label: 'Naat' },
    { value: 'Tarana', label: 'Tarana' },
    { value: 'Arabic Nasheed', label: 'Arabic Nasheed' },
    { value: 'Tanzeemi', label: 'Tanzeemi' },
    { value: 'Youth', label: 'Youth' },
    // Add more categories as needed
  ];
  const [updatedMusic, setUpdatedMusic] = useState({ Title: '', Cover: '', Artist: '', Poet: '', Category: '', Lyrics: '' });
  const handleDeleteData = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/delete/${id}`);
      toast.success('Data deleted successfully');
      fetchMusicData();
    } catch (error) {
      toast.error('Error deleting data: ' + error.message);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const poetsResponse = await axios.get(`${process.env.REACT_APP_URL}/poets`);
        const artistsResponse = await axios.get(`${process.env.REACT_APP_URL}/artists`);

        setPoets(poetsResponse.data);
        setArtists(artistsResponse.data);
        console.log(poetsResponse.data);
        console.log(artistsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);
  const handleUpdateData = (music) => {
    console.log(music);
    setCurrentMusic(music);
    setUpdatedMusic({ Title: music.Title, Cover: music.Cover, Artist: music.Artist, Poet: music.Poet, Category: music.Category, Lyrics: music.Lyrics });
    setShow(true);
  };

  const handleUpdateChange = (e) => {
    setUpdatedMusic({ ...updatedMusic, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/update/${currentMusic._id}`, updatedMusic);
      fetchMusicData();
      toast.success('Music updated successfully');
      // Update the music data in the parent component...
      setShow(false);

    } catch (error) {
      toast.error('Error updating music:', error.message);
    }
  };
  const columns = React.useMemo(
    () => [
      {
        Header: 'Cover',
        accessor: 'Cover', // accessor is the "key" in the data
        Cell: ({ value }) => <img src={value} alt="" className="h-10 w-10 flex-none rounded-full bg-gray-50" />
      },
      {
        Header: 'Title',
        accessor: 'Title',
      },
      {
        Header: 'Artist',
        accessor: 'Artist',
      },
      {
        Header: 'Poet',
        accessor: 'Poet',
      },
      {
        Header: 'Category',
        accessor: 'Category',
      },
      {
        Header: 'Actions',
        accessor: '_id',
        Cell: ({ row }) => (
          <div className="flex">
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={() => handleUpdateData(row.original)}
            >
              <BsPencilSquare />
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => handleDeleteData(row.original._id)}
            >
              <BsTrash />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: musicData }, useSortBy);


  return (
    <div className='font-sora'>
      <h2 className="text-2xl font-semibold mb-4">Tarane</h2>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
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
            <Form.Group>
              <Form.Label>Artist</Form.Label>
              <Form.Select name="Artist" value={updatedMusic.Artist} onChange={handleUpdateChange}>
                {artists.map(artist => (
                  <option value={artist.Name}>{artist.Name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Poet</Form.Label>
              <Form.Select name="Poet" value={updatedMusic.Poet} onChange={handleUpdateChange}>
                {poets.map(poet => (
                  <option value={poet.Name}>{poet.Name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select name="Category" value={updatedMusic.Category} onChange={handleUpdateChange}>
                {categories.map(category => (
                  <option value={category.label}>{category.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
            <Form.Label>Lyrics</Form.Label>
            <Form.Control as="textarea" name="Lyrics" value={updatedMusic.Lyrics} onChange={handleUpdateChange} />
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
    <ToastContainer />
    </div >
  );
};

export default ListData;