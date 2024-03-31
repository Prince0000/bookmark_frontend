import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ItemDetail = () => {
  const { id, collections } = useParams();
  const [fetchType, setFetchType] = useState(collections);
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFetchType(collections)
  }, [collections, id]);

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  const fetchData = async () => {
    try {
      const url = `http://localhost:8080/api/bookmark/${fetchType}/${id}/${decodedToken._id}`;
      const response = await axios.get(url);
      setBookmarks(response.data);
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchType, id, decodedToken._id]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      try {
        const url = `http://localhost:8080/api/bookmark/${id}`;
        await axios.delete(url);
        toast.success("Bookmark deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete collection.");
      }
    }
  };

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.collectionData.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Bookmark Data Detail</h2>
      <p>Collection ID: {id}</p>

      <div className="card">
        <div className="card-body">
          <label>Search Data Based on Requirements</label>
          <input
            type="text"
            className='form-control'
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <hr />

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Notes</th>
            <th>Collection</th>
            <th>Tags</th>
            <th>URL</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookmarks.length > 0 ? (
            filteredBookmarks.map((bookmark, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{bookmark.title}</td>
                <td>{bookmark.notes}</td>
                <td>{bookmark.collectionData}</td>
                <td>{bookmark.tags.join(', ')}</td>
                <td><a href={bookmark.url} target="_blank" rel="noopener noreferrer">{bookmark.url}</a></td>
                <td>
                  <span className="material-icons text-danger" style={{ cursor: 'pointer' }} onClick={() => handleDelete(bookmark._id)}>
                    delete
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No bookmarks found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ItemDetail;
