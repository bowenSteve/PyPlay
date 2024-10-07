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
    

    return (
        <div className="container d-flex justify-content-center align-items-center full-height">
            <div className="login-container col-md-4 col-sm-6">
                <h2 className="text-center">Login</h2>
                <form id="loginForm" onSubmit={handleLogin}> {/* Use handleLogin on form submission */}
                    <div className="form-group">
                        <label className="label-color" htmlFor="username">Username:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="username" 
                            name="username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} // Update state on input change
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="label-color" htmlFor="password">Password:</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="password" 
                            name="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Update state on input change
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Login</button>
                    <span className="mt-2 label-color">
                        Don't have an account? <a href="signup.html">Create Account</a>
                    </span>
                </form>
            </div>
        </div>
    );
}

export default Login;
