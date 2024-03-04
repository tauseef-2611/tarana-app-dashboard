import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';

const ListData = ({ musicData, handleUpdateData, handleDeleteData }) => {
  console.log(musicData);
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
                onClick={() => handleUpdateData(music._id)}
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
    </div>
  );
};

export default ListData;
