import "../styles/navbar.css";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"

function Navbar() {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] =  useState({})
    const navigate = useNavigate();


    const handleMenuBtn = () => {
        setToggleMenu(!toggleMenu); // Toggle menu visibility
    };


    function handleLogin(){
        isLoggedIn ? logout() : navigate("/login")
    }
    
    function loginStatus(){
        const token = localStorage.getItem('accessToken')
        if (token){
            setIsLoggedIn(true)
        }
    }
    useEffect(()=>{
        loginStatus()
    },[])

    useEffect(()=>{
        const token = localStorage.getItem('accessToken');
        fetch("http://127.0.0.1:8000/quizapp/get_user_details",{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`,
            }
        })
        .then(res=>res.json())
        .then(data=>{
            setUser(data)
        })
    },[])
    

    function logout() {
        const refreshToken = localStorage.getItem("refreshToken");  // Get the refresh token
        const accessToken = localStorage.getItem('accessToken');  // Get the access token
    
        console.log("Refresh Token: ", refreshToken);  // Log the refresh token to check if it's there
    
        fetch("http://127.0.0.1:8000/quizapp/logout/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`  // Send access token in Authorization header
            },
            body: JSON.stringify({ refresh_token: refreshToken })  // Send refresh token in request body
        })
        .then(res => {
            if (res.ok) {
                setIsLoggedIn(false);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");  // Optionally remove the refresh token
                navigate("/login");
            } else {
                console.log("Logout failed: ", res.status);
            }
        })
        .catch((error) => {
            console.error("Error logging out:", error);
        });
    }
    

    



    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark back-color">
                <a className="navbar-brand" href="#">PyGame</a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto"> {/* Ensure ml-auto is used to push items to the right */}
                        <li className="nav-item">
                            { isLoggedIn && <a className="nav-link" id="user" href="">{user.username}</a>}
                        </li>
                        <li className="nav-item">
                            <button id="logout" className="btn btn-primary" onClick={handleLogin}>{ isLoggedIn ? ('Log out'): ('Log in')}</button>
                        </li>
                        <li className="nav-item">
                            <img src="" alt="" />
                        </li>
                    </ul>
                </div>
            </nav>

            <div className={toggleMenu ? "expanded sidebar" : "sidebar"} id="sidebar">
                <button className="btn btn-primary" id="menuButton" onClick={handleMenuBtn}>☰</button>
                <div className="canvas-menu" id="canvasMenu">
                    <h3>
                        <a className="decorate" href="scores.html">Scores</a>
                    </h3>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
