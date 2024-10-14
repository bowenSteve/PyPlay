import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Main() {
    const [topics, setTopics] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        fetch('http://127.0.0.1:8000/quizapp/get_topics', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            setTopics(data.Topics);
            setLoading(false); // Set loading to false after data is fetched
        })
        .catch(err => {
            console.error("Error fetching topics:", err);
            setError(err.message); // Set the error message
            setLoading(false); // Set loading to false even if there's an error
        });
    }, []);

    function handleTopic(id){
        navigate(`/questioncard/${id}`)
    }
    if (loading) return <p>Loading...</p>; // Show loading state
    if (error) return <p>Error: {error}</p>; // Show error if any

    return (
        <div>
            <Navbar />
            <div className="container">
                {topics.length > 0 ? (
                    topics.map(topic => (
                        <p key={topic.id} onClick={()=>handleTopic(topic.id)} >{topic.name}</p> // Use key prop
                    ))
                ) : (
                    <p>Login to continue</p>
                )}
            </div>
        </div>
    );
}

export default Main;
