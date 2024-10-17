import { useEffect, useState } from "react";

function Score(){


    const [scores, setScores] = useState([]); // State to hold the scores
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to hold any errors

    useEffect(()=>{
        const token = localStorage.getItem('accessToken')

        fetch('http://127.0.0.1:8000/quizapp/scores/',{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(res=>res.json())
        .then(data=>{
            setScores(data.scores);
        })
    },[])
    return(
        <div className="container">
              <h3>Your Score Sessions</h3>
            {scores.length === 0 ? (
                <p>No scores available.</p> // Handle case with no scores
            ) : (
                <ul>
                    {scores.map((score) => (
                        <li key={score.id}>
                            <p>Session ID: {score.quiz_session.id}</p>
                            <p>Total Score: {score.total_score}</p>
                            <p>Time Taken: {score.time_taken} seconds</p>
                            <p>Correct Answers: {score.correct_answers.length}</p>
                            <p>Wrong Answers: {score.wrong_answers.length}</p>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    )
}
export default Score