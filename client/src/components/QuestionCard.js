import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Session from "./Session";

function QuestionCard() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState("Beginner");  // Default to "Beginner"
    const [showQuestions, setShowQuestions] = useState(false);  // State to show/hide questions
    const [sessionId, setSessionId] = useState()
    const { id } = useParams();

    // Difficulty level mapping
    const difficultyLevelMap = {
        Beginner: 'Beginner',       // Use string values as defined in the backend
        Intermediate: 'Intermediate',
        Pro: 'Pro',
    };

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
                console.log(data.Questions);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching questions:", err);
            setError(err.message);
            setLoading(false);
        });
    }, [id]);

    const handleLevelChange = (event) => {
        setSelectedLevel(event.target.value);
    };

    const handleStart = () => {
        const token = localStorage.getItem('accessToken');

        const payload = {
            topic_ids: id,  // Directly use the single topic ID
            difficulty_level: difficultyLevelMap[selectedLevel],  // Use string value for difficulty level
        };

        fetch('http://127.0.0.1:8000/quizapp/create_session/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })
        .then(res => res.json())
        .then(data => {
            if (data.session_id) {
                console.log('Quiz session created, ID:', data.session_id);
                setSessionId(data.session_id)
                setShowQuestions(true);  // Show questions after session creation
            } else {
                console.error('Failed to create quiz session:', data.error);
            }
        })
        .catch(err => {
            console.error('Error creating quiz session:', err);
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <Navbar />
            <div className="container">
                {/* Conditionally render Select Level and Start Button */}
                {!showQuestions && (
                    <>
                        <h3>Select Level:</h3>
                        <div className="form-group">
                            {/* Radio buttons for selecting level */}
                            <div className="form-check form-check-inline">
                                <input 
                                    className="form-check-input" 
                                    type="radio" 
                                    name="levelOptions" 
                                    id="beginner" 
                                    value="Beginner" 
                                    checked={selectedLevel === "Beginner"} 
                                    onChange={handleLevelChange} 
                                />
                                <label className="form-check-label" htmlFor="beginner">
                                    Beginner
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input 
                                    className="form-check-input" 
                                    type="radio" 
                                    name="levelOptions" 
                                    id="intermediate" 
                                    value="Intermediate" 
                                    checked={selectedLevel === "Intermediate"} 
                                    onChange={handleLevelChange} 
                                />
                                <label className="form-check-label" htmlFor="intermediate">
                                    Intermediate
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input 
                                    className="form-check-input" 
                                    type="radio" 
                                    name="levelOptions" 
                                    id="pro" 
                                    value="Pro" 
                                    checked={selectedLevel === "Pro"} 
                                    onChange={handleLevelChange} 
                                />
                                <label className="form-check-label" htmlFor="pro">
                                    Pro
                                </label>
                            </div>
                        </div>
    
                        {/* Start Button */}
                        <div className="text-end">
                            <button className="btn btn-primary" onClick={handleStart}>
                                Start
                            </button>
                        </div>
                    </>
                )}
    
                {/* Render Session component if showQuestions is true */}
                {showQuestions && <Session questions={questions} sessionId={sessionId} />}
            </div>
        </div>
    );
    
}

export default QuestionCard;
