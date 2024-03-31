import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

const BookmarkList = () => {
    const [loading, setLoading] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);

    const fetchData = async () => {
        setLoading(true);
        try {
            const url = `http://localhost:8080/api/bookmark/${decodedToken._id}?page=${currentPage}&limit=${itemsPerPage}`;
            const response = await axios.get(url);
            setBookmarks(response.data);
        } catch (error) {
            toast.error("Failed to fetch bookmarks.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, itemsPerPage]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredBookmarks = bookmarks.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.collectionData.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentBookmarks = filteredBookmarks.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this collection?")) {
            setLoading(true);
            try {
                const url = `http://localhost:8080/api/bookmark/${id}`;
                await axios.delete(url);
                toast.success("Bookmark deleted successfully");
                fetchData();
                setCurrentPage(1);
            } catch (error) {
                toast.error("Failed to delete collection.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>


                    <h2>All Bookmarks</h2>
                    <hr/>

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
                    <table className="table table-responsive">
                        <thead>
                            <tr>
                                <th scope="col">S/N</th>
                                <th>Title</th>
                                <th>Note</th>
                                <th>Collection</th>
                                <th>Tags</th>
                                <th>URL</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBookmarks.length > 0 ? (
                                currentBookmarks.map((bookmark, index) => (
                                    <tr key={indexOfFirstItem + index + 1}>
                                        <td>{indexOfFirstItem + index + 1}</td>
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
                    <nav>
                        <ul className="pagination">
                            {[...Array(Math.ceil(filteredBookmarks.length / itemsPerPage))].map((_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </>
            )}
        </>
    );
};

export default BookmarkList;
