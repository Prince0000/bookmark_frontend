import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./styles.module.css";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = "http://localhost:8080/api/auth";
            const { data: res } = await axios.post(url, formData);

            // Set token in localStorage
            localStorage.setItem("token", res.data);

            // Set token in cookie
            document.cookie = `token=${res.data}; path=/`;

            toast.success(res.message);

            // Clear form data
            setFormData({ email: "", password: "" });

            // Reload the page
            window.location.reload();

            // navigate('/');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    toast.error("Invalid email or password");
                } else if (error.response.status === 500) {
                    toast.error("Internal server error");
                } else {
                    toast.error("Something went wrong. Please try again.");
                }
            } else {
                toast.error("Network error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.login_container}>
            <div className={styles.login_form_container}>
                <div className={styles.left}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Login to Your Account</h1>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={formData.email}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={formData.password}
                            required
                            className={styles.input}
                        />
                        <button type="submit" className={styles.green_btn} disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>
                <div className={styles.right}>
                    <h1>New Here ?</h1>
                    <Link to="/signup">
                        <button type="button" className={styles.white_btn}>
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;
