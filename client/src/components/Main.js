import Navbar from "./Navbar";
import { useState, useEffect } from "react";

function Main(){

    const [questions, setQuestions] =  useState([])

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        fetch('http://127.0.0.1:8000/quizapp/get_questions/', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,  
            },
        })
        .then(res => res.json())
        .then(data => {
                setQuestions(data.Questions);
                
        })
        .catch(err => {
            console.error("Error fetching questions:", err);
        });
    }, []);
    
    console.log(questions);
    return(
        <div>
            <Navbar />
            <div className="container">
            {questions.map(question=>(
                <p>{question.text}</p>
            ))}
            </div>
        </div>
    )
}
export default Main;