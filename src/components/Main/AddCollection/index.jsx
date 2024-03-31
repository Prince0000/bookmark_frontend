import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCollections = () => {
    const [data, setData] = useState({
        name: "",
        Desc: ""
    });
    const [collections, setCollections] = useState([]); // State variable to store collections
    const [loading, setLoading] = useState(false); // State variable for loader
    const [currentPage, setCurrentPage] = useState(1); // State variable for current page
    const [itemsPerPage] = useState(5); // Number of items to display per page

    const fetchData = async () => {
        setLoading(true); // Show loader while fetching data
        try {
            const url = `http://localhost:8080/api/collections?page=${currentPage}&limit=${itemsPerPage}`;
            const response = await axios.get(url);
            setCollections(response.data); // Set collections in state
        } catch (error) {
            toast.error("Failed to fetch collections.");
        } finally {
            setLoading(false); // Hide loader after fetching data
        }
    };


    useEffect(() => {
        fetchData();
    }, [currentPage, itemsPerPage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loader when form is submitted
        try {
            const url = "http://localhost:8080/api/collections";
            const { data: res } = await axios.post(url, data);
            toast.success(res.message);
            setData({ name: "", Desc: "" });
            fetchData();
            // Refresh collections after adding a new collection
            setCurrentPage(1);
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                toast.error(error.response.data.message);
            }
        } finally {
            setLoading(false); // Hide loader after request is completed
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this collection?")) {
            setLoading(true); // Show loader when deleting
            try {
                const url = `http://localhost:8080/api/collections/${id}`;
                await axios.delete(url);
                toast.success("Collection deleted successfully");
                fetchData();
                setCurrentPage(1); // Refresh collections after deletion
            } catch (error) {
                toast.error("Failed to delete collection.");
            } finally {
                setLoading(false); // Hide loader after deletion
            }
        }
    };

    // Logic for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = collections.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='container'>
            <h1 className='fs-1'><b>Collections Controls</b></h1>
            <hr />
            <div className="card bg-light">
                <div className="card-body">
                    <h3>Add Collection</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-6">
                                <div className="form-group mb-2">
                                    <label htmlFor="collection">Collection Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="collection"
                                        placeholder="Enter Collection Name"
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-group mb-2">
                                    <label htmlFor="coll_des">Collection Description</label>
                                    <textarea
                                        className="form-control"
                                        id="coll_des"
                                        placeholder="Enter Collection Description"
                                        value={data.Desc}
                                        onChange={(e) => setData({ ...data, Desc: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-6">
                                <button type="submit" className='btn btn-primary'>{loading ? 'Adding...' : 'Add Collection'}</button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>

            <div className='card bg-light my-5'>
                <div className="card-body">
                    <h3>Collection Lists</h3>
                    {loading ? (
                        <p>Loading collections...</p>
                    ) : (
                        <React.Fragment>
                            <table className="table table-responsive">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Collection Name</th>
                                        <th>Collection Description</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((collection, i) => (
                                        <tr key={indexOfFirstItem + i + 1}>
                                            <td>{indexOfFirstItem + i + 1}</td>
                                            <td>{collection.name}</td>
                                            <td>{collection.Desc}</td>
                                            <td>
                                                <span className="material-icons text-danger" style={{ cursor: 'pointer' }} onClick={() => handleDelete(collection._id)}>
                                                    delete
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Pagination */}
                            <nav>
                                <ul className="pagination">
                                    {Array.from({ length: Math.ceil(collections.length / itemsPerPage) }).map((_, index) => (
                                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </React.Fragment>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddCollections;
