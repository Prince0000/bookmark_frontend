import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Main = () => {
	const [showModal, setShowModal] = useState(false);
	const [collections, setCollections] = useState([]);
	
	const token = localStorage.getItem("token");
	const decodedToken = jwtDecode(token);

	const [formData, setFormData] = useState({
		userId: decodedToken._id,
		title: "",
		notes: "",
		collectionData: "",
		tags: "",
		url: "",
	});

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const url = `http://localhost:8080/api/collections`;
				const response = await axios.get(url);
				setCollections(response.data); // Set collections in state
			} catch (error) {
				console.log("Failed to fetch collections.");
			}
		};
		fetchData();
	}, []);

	const openModal = () => {
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		// Split tags with comma and convert them to an array
		if (name === "tags") {
			setFormData({ ...formData, [name]: value.split(',') });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = `http://localhost:8080/api/bookmark`;
			const response = await axios.post(url, formData); // Send form data to the server
			toast.success(response.data.message); // Show success toast
			console.log(response.data); // Log response for testing
			// Optionally, you can clear the form after successful submission
			setFormData({
				title: "",
				notes: "",
				collectionData: "",
				tags: "",
				url: "",
			});
			setShowModal(false); // Close modal after submission
		} catch (error) {
			console.error("Failed to add bookmark:", error);
			toast.error("Failed to add bookmark"); // Show error toast

		}
	};

	return (
		<div className="container-fluid">
			<div className="row flex-nowrap">
				{/* Sidebar */}
				<div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
					<div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
						<div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
							<Link to="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
								<span className="fs-5 d-none d-sm-inline">Menu</span>
							</Link>
							<ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
								<li className="nav-item">
									<Link to="" className="nav-link align-middle px-0 text-white d-flex justify-content-center">
										<span className="material-icons">
											dashboard
										</span>
										<span className="ms-1 d-none d-sm-inline">Dashboard</span>
										<span className="material-icons">
											remove
										</span>
									</Link>
								</li>
								<li>
									<Link to="tags/favorite" className="nav-link px-0 align-middle text-white d-flex justify-content-center">
										<span className="material-icons">
											favorite
										</span>
										<span className="ms-1 d-none d-sm-inline">Favorite</span>
										<span className="material-icons">
											remove
										</span>
									</Link>
								</li>

								<li>
									<Link to="add-collection" className="nav-link px-0 align-middle text-white  d-flex justify-content-center">
										<span className="material-icons">
											library_add
										</span>
										<span className="ms-1 d-none d-sm-inline">Add Collections</span>
										<span className="material-icons">
											remove
										</span>
									</Link>
								</li>

								<li>
									<a href="#submenu3" data-bs-toggle="collapse" className="nav-link px-0 align-middle text-white d-flex justify-content-center">
										<span className="material-icons">
											collections_bookmark
										</span>
										<span className="ms-1 d-none d-sm-inline">Collections</span>
										<span className="material-icons">
											expand_more
										</span>
									</a>
									<ul className="collapse nav flex-column ms-1" id="submenu3" data-bs-parent="#menu">
										<li className="w-100">
											{
												collections.map((collection, i) => {
													return (
														<Link key={i} to={`collectionData/${collection.name}`} className="nav-link px-0 text-white">
															<span className="d-none d-sm-inline">{collection.name}</span>
														</Link>
													);
												})
											}

										</li>
									</ul>
								</li>
							</ul>
							<hr />
							<div className="dropdown pb-4">
								<Link to="" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
									<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNVi9cbmMkUabLiF_3kfI94qngwPIM4gnrztEUv6Hopw&s" alt="hugenerd" width="30" height="30" className="rounded-circle" />
									<span className="d-none d-sm-inline mx-1">{decodedToken.firstName}</span>
								</Link>
								<ul className="dropdown-menu dropdown-menu-dark text-small shadow">
									<li><Link className="dropdown-item" onClick={handleLogout}>Sign out</Link></li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				{/* Content */}
				<div className="col py-3" style={{ position: 'relative' }}>
					<Outlet />
					{/* Add Bookmark button */}
					<button className="btn m-5 shadow-lg bg-light border border-danger" title="Add Bookmark" style={{ position: 'fixed', bottom: 0, right: 0 }} onClick={openModal}>
						<span className="material-icons fs-1 text-danger">
							bookmark_add
						</span>
					</button>
				</div>
			</div>

			{/* Modal */}
			{showModal && (
				<div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
					<div className="modal-dialog shadow-lg">
						<div className="modal-content">
							<div className="modal-header bg-dark text-white">
								<h5 className="modal-title">Add Bookmark</h5>
								<button type="button" className="btn-close bg-white" onClick={closeModal}></button>
							</div>
							<div className="modal-body">
								<form onSubmit={handleSubmit}>
									<div className="form-group mb-2">
										<label htmlFor="title">Title</label>
										<input type="text" className="form-control" id="title" required={true} name="title" value={formData.title} onChange={handleChange} placeholder="Enter Title" />
									</div>
									<div className="form-group mb-2">
										<label htmlFor="notes">Notes</label>
										<textarea className="form-control" id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Enter Notes" ></textarea>
									</div>
									<div className="form-group mb-2">
										<label htmlFor="collectionData">Collection</label>
										<select name="collectionData" className="form-control" required={true} id="collectionData" value={formData.collectionData} onChange={handleChange}>
											<option value="">Select Collection</option>
											{collections.map((collection, index) => (
												<option key={index} value={collection.name}>{collection.name}</option>
											))}
										</select>
									</div>
									<div className="form-group mb-2">
										<label htmlFor="tags">Tags</label>
										<input type="text" className="form-control" id="tags" required={true} name="tags" value={formData.tags} onChange={handleChange} placeholder="Enter Tags" />
									</div>
									<div className="form-group mb-2">
										<label htmlFor="url">URL</label>
										<input type="url" className="form-control" id="url" required={true} name="url" value={formData.url} onChange={handleChange} placeholder="https://example.com" />
									</div>
									<div className="form--group my-2">
										<button type="submit" className="btn btn-danger w-100">Add</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Toast notifications */}
			<ToastContainer />

		</div>
	);
};

export default Main;
