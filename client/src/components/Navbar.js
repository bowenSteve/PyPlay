import "../styles/navbar.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(null);  // Set initial value to null
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);  // Loading state

    const handleMenuBtn = () => {
        setToggleMenu(!toggleMenu);  // Toggle menu visibility
    };

    function handleLogin() {
        isLoggedIn ? logout() : navigate("/login");
    }

    function loginStatus() {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        setIsLoading(false);  // Set loading to false after checking login status
    }

    // Check login status on component mount
    useEffect(() => {
        loginStatus();
    }, []);

    // Redirect to login page if not logged in
    useEffect(() => {
        if (!isLoading && isLoggedIn === false) {
            navigate("/login");  // Automatically redirect to login if not logged in
        }
    }, [isLoggedIn, isLoading, navigate]);

    useEffect(() => {
        if (isLoggedIn) {
            const token = localStorage.getItem('accessToken');
            fetch("http://127.0.0.1:8000/quizapp/get_user_details", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            })
            .then(res => res.json())
            .then(data => {
                setUser(data);
            });
        }
    }, [isLoggedIn]);

    function handleScore(){
        navigate('/score')
    }

    function logout() {
        const refreshToken = localStorage.getItem("refreshToken");
        const accessToken = localStorage.getItem('accessToken');

        fetch("http://127.0.0.1:8000/quizapp/logout/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({ refresh_token: refreshToken })
        })
        .then(res => {
            if (res.ok) {
                setIsLoggedIn(false);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                navigate("/login");
            } else {
                console.log("Logout failed: ", res.status);
            }
        })
        .catch((error) => {
            console.error("Error logging out:", error);
        });
    }
     function handleHome(){
        navigate('/')
     }
    if (isLoading) {
        return <div>Loading...</div>;  // Render loading message while checking login status
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark back-color">
                <a className="navbar-brand" onClick={handleHome}>PyGame</a>
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
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            { isLoggedIn && <a className="nav-link" id="user" href="">{user.username}</a>}
                        </li>
                        <li className="nav-item">
                            <button id="logout" className="btn btn-primary" onClick={handleLogin}>{ isLoggedIn ? ('Log out') : ('Log in')}</button>
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
                        <a className="decorate" onClick={handleScore}>Scores</a>
                    </h3>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
