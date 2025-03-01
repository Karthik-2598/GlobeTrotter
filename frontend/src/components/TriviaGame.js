import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Feedback from './Feedback';
import { useNavigate } from 'react-router-dom';
import {motion} from "framer-motion";

const TriviaGame = () => {
const [trivia, setTrivia] = useState(null);
const [selected, setSelected] = useState(null);
const [feedback, setFeedback] = useState(null);
const [questionCount, setQuestionCount] = useState(0);
const [score, setScore] = useState(0);
const navigate = useNavigate();
const username = localStorage.getItem("username");

useEffect(()=>{
    if(!username){
        navigate("/");
        return;
    }
    fetchTrivia();
    fetchScore();
}, []);

const fetchScore = async () => {
  try {
    const { data } = await axios.get(`http://localhost:5000/api/user/${username}/score`);
    setScore(data.score); // Ensure the score updates properly
  } catch (error) {
    console.error("Error fetching score:", error);
  }
};

const fetchTrivia = async()=>{
    const { data } = await axios.get("http://localhost:5000/api/trivia/random");
    setTrivia(data);
    setSelected(null);
    setFeedback(null);
    setQuestionCount((prevCount)=> prevCount+1);
};

const handleAnswer = async(option)=>{
    setSelected(option);
    const response = await axios.post("http://localhost:5000/api/trivia/answer", {
        username,
        selectedAnswer: option.city,
        correctAnswer: trivia.correctAnswer,
    });
    setFeedback(response.data);
    if(response.data.isCoreect){
        setScore((prevScore)=> prevScore + 10);
    }
    fetchScore();
};

  return (
    <motion.div
    className="p-10 text-center bg-gradient-to-r from-pink-500 to-orange-400 min-h-screen flex flex-col items-center justify-center text-white"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    <h1 className="text-5xl font-extrabold drop-shadow-md">🧠 Trivia Challenge</h1>

    {trivia && !feedback ? (
      <>
        <motion.h2
          className="text-3xl font-semibold mt-6 bg-white/10 px-6 py-3 rounded-xl backdrop-blur-md"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {trivia.clues[0]}
        </motion.h2>

        <motion.div
          className="flex justify-center mt-8 space-x-4 flex-wrap"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {trivia.options.map((opt) => (
            <motion.button
              key={opt.city}
              className="bg-white text-gray-900 px-8 py-4 rounded-full shadow-lg text-lg font-semibold transition-all hover:bg-gray-300"
              onClick={() => handleAnswer(opt)}
              whileHover={{ scale: 1.1 }}
            >
              {opt.city}
            </motion.button>
          ))}
        </motion.div>
      </>
    ) : feedback && <Feedback feedback={feedback} onNext={fetchTrivia} score={score} />}
  </motion.div>
  )
}

export default TriviaGame
