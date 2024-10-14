import Navbar from "./Navbar";
import { useState, useEffect } from "react";

function Questions() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        fetch('http://127.0.0.1:8000/quizapp/get_questions/', {
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
            setQuestions(data.Questions);
            setLoading(false); // Set loading to false after data is fetched
        })
        .catch(err => {
            console.error("Error fetching questions:", err);
            setError(err.message); // Set the error message
            setLoading(false); // Set loading to false even if there's an error
        });
    }, []);
    
    if (loading) return <p>Loading...</p>; // Show loading state
    if (error) return <p>Error: {error}</p>; // Show error if any

    return (
        <div>
            <Navbar />
            <div className="container">
                {questions.length > 0 ? (
                    questions.map(question => (
                        <p key={question.id}>{question.text}</p> // Use key prop
                    ))
                ) : (
                    <p>Login to view data</p>
                )}
            </div>
        </div>
    );
}

export default Questions;
