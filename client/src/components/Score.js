import { useEffect, useState } from "react";
import Navbar from "./Navbar";

function Score() {
    const [scores, setScores] = useState([]); // State to hold the scores
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to hold any errors

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        fetch('http://127.0.0.1:8000/quizapp/scores/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(res => res.json())
        .then(data => {
            setScores(data.scores);
            console.log(data.scores);
            setLoading(false);
        })
        .catch(err => {
            setError(err);
            setLoading(false);
        });
    }, []);
    

    return (
        <div>
            <Navbar />
            <div className="container">
                <h3>Your Scores</h3>
                {loading ? (
                    <p>Loading...</p> // Handle loading state
                ) : error ? (
                    <p>Error loading scores: {error.message}</p> // Handle error state
                ) : scores.length === 0 ? (
                    <p>No scores available.</p> // Handle case with no scores
                ) : (
                    <ul>
                        {scores.map((score) => {
                            const totalQuestions = score.correct_answers.length + score.wrong_answers.length;
                            const percentage = totalQuestions > 0 
                                ? (score.correct_answers.length / totalQuestions) * 100 
                                : 0; // Avoid division by zero

                            return (
                                <li key={score.id}>
                                    <p>Topic: {score.quiz_session.topics.join(', ')}</p>
                                    <p>Difficulty: {score.quiz_session.difficulty}</p>
                                    <p>Total Score: {percentage.toFixed(2)}%</p> {/* Display score as percentage */}
                                    <p>Time Taken: {score.time_taken} seconds</p>
                                    <p>Correct Answers: {score.correct_answers.length}</p>
                                    <p>Wrong Answers: {score.wrong_answers.length}</p>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Score;
