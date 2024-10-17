import { useState, useEffect } from "react";

function Session({ questions, sessionId }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);  // State to track user's score
    const [quizComplete, setQuizComplete] = useState(false); // State to check if quiz is complete

    // Effect to handle countdown timer
    useEffect(() => {
        if (timeLeft === 0) {
            // Automatically move to the next question when time is up
            handleNextQuestion();
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Function to handle moving to the next question
    const handleNextQuestion = () => {
        const currentQuestion = questions[currentQuestionIndex];

        // Check if the selected option is correct
        if (selectedOption) {
            const selected = currentQuestion.options.find(option => option.id === selectedOption);
            if (selected && selected.is_correct) {
                setScore(prevScore => prevScore + 1); // Increment score if the answer is correct
            }
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setTimeLeft(20); // Reset timer to 20 seconds for the next question
            setSelectedOption(null); // Reset selected option for the new question
        } else {
            // Quiz is complete, calculate final score percentage
            setQuizComplete(true);
            persistScore(); // Call the function to persist the score
        }
    };

    // Function to persist the score to the backend
    const persistScore = () => {
        const token = localStorage.getItem('accessToken');
        const quizSessionId = sessionId;
        const totalScore = score;
        const correctAnswers = questions.filter((q) => q.options.find(option => option.is_correct));
        const wrongAnswers = questions.filter((q) => !q.options.find(option => option.is_correct));
    
        const payload = {
            quiz_session_id: quizSessionId,
            total_score: totalScore,
            correct_answers: correctAnswers.map(q => q.id),
            wrong_answers: wrongAnswers.map(q => q.id),
            time_taken: `${20 * questions.length} seconds` // Convert to a readable format
        };
    
        fetch('http://127.0.0.1:8000/quizapp/create_score/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })
        .then(res => res.json())
        .then(data => {
            if (data.score_id) {
                console.log('Score persisted successfully, ID:', data.score_id);
            } else {
                console.error('Failed to persist score:', data.error);
            }
        })
        .catch(err => {
            console.error('Error persisting score:', err);
        });
    };
    

    const currentQuestion = questions[currentQuestionIndex];

    // Calculate score percentage if the quiz is complete
    const scorePercentage = quizComplete ? (score / questions.length) * 100 : null;

    return (
        <div className="container mt-3 position-relative">
            <h3>Quiz Questions:</h3>

            {/* Countdown timer at the top right */}
            <div className="position-absolute top-0 end-0 p-3">
                <h5>Time Left: {timeLeft}s</h5>
            </div>

            {!quizComplete ? (
                <>
                    {/* Display the current question */}
                    <div key={currentQuestion.id} className="mb-3">
                        <p>
                            <strong>Question {currentQuestionIndex + 1}:</strong> {currentQuestion.text}
                        </p>
                    </div>

                    {/* Display the options */}
                    <div className="mb-3">
                        {currentQuestion.options.map((option) => (
                            <div key={option.id} className="form-check">
                                <input
                                    type="radio"
                                    id={`option-${option.id}`}
                                    name="quizOptions"
                                    value={option.id}
                                    className="form-check-input"
                                    checked={selectedOption === option.id}
                                    onChange={() => setSelectedOption(option.id)} // Set selected option
                                />
                                <label htmlFor={`option-${option.id}`} className="form-check-label">
                                    {option.text}
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Next button at the bottom right */}
                    <div className="d-flex justify-content-end">
                        <button
                            className="btn btn-primary"
                            onClick={handleNextQuestion}
                            disabled={selectedOption === null} // Disable button if no option is selected
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                // Display the score after the quiz is complete
                <div className="mb-3">
                    <h5>Your Score: {score} out of {questions.length}</h5>
                    <h5>Percentage: {scorePercentage.toFixed(2)}%</h5>
                </div>
            )}
        </div>
    );
}

export default Session;
