import { useState, useEffect } from "react";

function Session({ questions, sessionId }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);
    const [totalTimeTaken, setTotalTimeTaken] = useState(0); // Track total time taken
    const [correctAnswers, setCorrectAnswers] = useState([]); // Track correct answers
    const [wrongAnswers, setWrongAnswers] = useState([]); // Track wrong answers

    useEffect(() => {
        if (quizComplete) return; // Stop timer when quiz is complete

        if (timeLeft === 0) {
            handleNextQuestion();
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, quizComplete]);

    const handleNextQuestion = () => {
        const currentQuestion = questions[currentQuestionIndex];

        if (selectedOption) {
            const selected = currentQuestion.options.find(option => option.id === selectedOption);
            if (selected && selected.is_correct) {
                setScore(prevScore => prevScore + 1);
                setCorrectAnswers(prevCorrect => [...prevCorrect, currentQuestion.id]); // Add to correct answers
            } else {
                setWrongAnswers(prevWrong => [...prevWrong, currentQuestion.id]); // Add to wrong answers
            }
        }

        // Accumulate time taken for the current question
        setTotalTimeTaken(prevTime => prevTime + (20 - timeLeft));

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setTimeLeft(20);
            setSelectedOption(null);
        } else {
            setQuizComplete(true);
        }
    };

    useEffect(() => {
        if (quizComplete) {
            persistScore();
        }
    }, [quizComplete, score, totalTimeTaken, correctAnswers, wrongAnswers]);

    const persistScore = () => {
        const token = localStorage.getItem('accessToken');
        const payload = {
            quiz_session_id: sessionId,
            total_score: score,
            correct_answers: correctAnswers,
            wrong_answers: wrongAnswers,
            time_taken: totalTimeTaken // Send as a string
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
    const scorePercentage = quizComplete ? (score / questions.length) * 100 : null;

    return (
        <div className="container mt-3 position-relative">
            <h3>Quiz Questions:</h3>

            <div className="position-absolute top-0 end-0 p-3">
                {!quizComplete ? (
                    <h5>Time Left: {timeLeft}s</h5>
                ) : (
                    <h5>Total Time Taken: {totalTimeTaken} seconds</h5>
                )}
            </div>

            {!quizComplete ? (
                <>
                    <div key={currentQuestion.id} className="mb-3">
                        <p>
                            <strong>Question {currentQuestionIndex + 1}:</strong> {currentQuestion.text}
                        </p>
                    </div>

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
                                    onChange={() => setSelectedOption(option.id)}
                                />
                                <label htmlFor={`option-${option.id}`} className="form-check-label">
                                    {option.text}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex justify-content-end">
                        <button
                            className="btn btn-primary"
                            onClick={handleNextQuestion}
                            disabled={selectedOption === null}
                        >
                            {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
                        </button>
                    </div>
                </>
            ) : (
                <div className="mb-3">
                    <h5>Your Score: {score} out of {questions.length}</h5>
                    <h5>Percentage: {scorePercentage.toFixed(2)}%</h5>
                </div>
            )}
        </div>
    );
}

export default Session;
