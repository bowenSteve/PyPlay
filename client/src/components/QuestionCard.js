import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function QuestionCard() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        fetch(`http://127.0.0.1:8000/quizapp/get_topics_id/${id}`, {
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
            if (data.Questions.length === 0) {
                setError("No questions available for this topic.");
            } else {
                setQuestions(data.Questions);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching questions:", err);
            setError(err.message);
            setLoading(false);
        });
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <Navbar />
            <div className="container">
                {questions.length > 0 ? (
                    questions.map(question => (
                        <p key={question.id}>{question.text}</p>
                    ))
                ) : (
                    <p>No questions available for this topic.</p>
                )}
            </div>
        </div>
    );
}

export default QuestionCard;
