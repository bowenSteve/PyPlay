import React, { useState } from "react";
import "../styles/login.css"; 
import { useNavigate, Link } from "react-router-dom"; 

function Register() {
    const [username, setUsername] = useState(""); // State for username
    const [password, setPassword] = useState(""); // State for password
    const [email, setEmail] = useState(""); // State for email
    const [errorMessage, setErrorMessage] = useState(""); // State for error messages
    const navigate = useNavigate();

    function handleRegister(event) {
        event.preventDefault(); 
        setErrorMessage(""); 

        fetch('http://127.0.0.1:8000/quizapp/register/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email
            })
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(errData => {
                    throw new Error(errData.detail || 'Registration failed');
                });
            }
            return res.json();
        })
        .then(data => {
            console.log("Registration successful:", data);
            navigate("/login"); // Redirect to login after successful registration
        })
        .catch(error => {
            console.error('Error during registration:', error);
            setErrorMessage(error.message); // Display error message
        });
    }

    return (
        <div className="auth-wrapper d-flex justify-content-center align-items-center vh-100">
            <div className="auth-container col-md-4 col-sm-6">
                <h2 className="auth-title text-center">Register</h2>
                <form id="authForm" onSubmit={handleRegister}> 
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
                        <label className="auth-label" htmlFor="email">Email:</label>
                        <input
                            type="email"
                            className="auth-input"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Update state on input change
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
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                        />
                    </div>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <button type="submit" className="auth-btn btn btn-primary btn-block">Register</button>
                    <span className="auth-footer mt-2">
                        Already have an account? <Link to="/login" className="auth-link">Login</Link>
                    </span>
                </form>
            </div>
        </div>
    );
}

export default Register;
