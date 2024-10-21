import React, { useState } from "react";
import "../styles/login.css"; // Link to external CSS file
import {useNavigate} from "react-router-dom"

function Login() {
    const [username, setUsername] = useState(""); // State for username
    const [password, setPassword] = useState(""); // State for password
    const navigate = useNavigate();

    function handleLogin(event) {
        event.preventDefault(); // Prevent default form submission
        fetch('http://127.0.0.1:8000/quizapp/login/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Login failed'); // Handle non-2xx responses
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            navigate("/");
        })
        .catch(error => {
            console.error('Error during login:', error);
            alert('Login failed: Please check your credentials.'); // Inform the user
        });
    }

    function handleSignup(){
        navigate('/register')
    }
    return (
        <div className="auth-wrapper d-flex justify-content-center align-items-center vh-100">
            <div className="auth-container col-md-4 col-sm-6">
                <h2 className="auth-title text-center">Login</h2>
                <form id="authForm" onSubmit={handleLogin}> {/* Use handleLogin on form submission */}
                    <div className="auth-form-group">
                        <label className="auth-label" htmlFor="username">Username:</label>
                        <input
                            type="text"
                            className="auth-input"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} // Update state on input change
                            required
                        />
                    </div>
                    <div className="auth-form-group">
                        <label className="auth-label" htmlFor="password">Password:</label>
                        <input
                            type="password"
                            className="auth-input"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Update state on input change
                            required
                        />
                    </div>
                    <button type="submit" className="auth-btn btn btn-primary btn-block">Login</button>
                    <span className="auth-footer mt-2">
                        Don't have an account? <a className="auth-link" onClick={handleSignup}>Create Account</a>
                    </span>
                </form>
            </div>
        </div>
    );
}

export default Login;
