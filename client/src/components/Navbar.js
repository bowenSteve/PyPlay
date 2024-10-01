import "../styles/navbar.css";
import { useState } from "react";

function Navbar() {
    const [toggleMenu, setToggleMenu] = useState(false);

    const handleMenuBtn = () => {
        setToggleMenu(!toggleMenu); // Toggle menu visibility
    };

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
                            <a className="nav-link" id="user" href="">User</a>
                        </li>
                        <li className="nav-item">
                            <button id="logout" className="btn btn-primary">Log out</button>
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
