import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {toast} from "react-toastify";
import ChallengeFriend from './ChallengeFriend';
import {motion} from "framer-motion"



const Home = () => {
    const [username, setUsername] = useState("");
    const [finalScore, setFinalScore] = useState(null);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        const storedUsername = localStorage.getItem("username");
        if(storedUsername){
            axios.get(`http://localhost:5000/api/user/${storedUsername}/score`)
            .then(response => {setFinalScore(response.data.score);
             setIsGameFinished(true);})
            .catch(()=> setFinalScore(null));
        }
    },[]);

    const handleStartGame = async()=>{
        if(!username.trim())
            return toast.error("Please enter a username");
        try{
            await axios.post("http://localhost:5000/api/user/register", { username });
            localStorage.setItem("username", username);
            setIsGameFinished(false);
            navigate("/game");
        }catch(error){
            toast.error("Username already exists");
        }
    };
    const handleLogout = ()=> {
        localStorage.removeItem("username");
        setFinalScore(null);
        setUsername("");
        setIsGameFinished(false);
        navigate("/");
    };
   

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-600 to-blue-500 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-5xl font-extrabold mb-5 drop-shadow-md">🌍 Globetrotter Trivia</h1>

      {finalScore !== null ? (
        <>
          <motion.h2
            className="text-4xl font-bold bg-white/10 px-6 py-3 rounded-xl backdrop-blur-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            Final Score: {finalScore}
          </motion.h2>
          <button
            className="mt-6 bg-red-500 hover:bg-red-700 transition-all px-6 py-3 rounded-full shadow-lg text-lg font-semibold"
            onClick={handleLogout}
          >
            Logout & Reset
          </button>

          {isGameFinished && <ChallengeFriend username={username} />}
        </>
      ) : (
        <>
          <input
            className="mt-5 p-3 text-black rounded-lg shadow-md w-80 text-center text-lg"
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <motion.button
            className="mt-6 bg-green-500 hover:bg-green-700 px-6 py-3 rounded-full shadow-lg transition-all text-lg font-semibold"
            onClick={handleStartGame}
            whileHover={{ scale: 1.1 }}
          >
            Start Game
          </motion.button>
        </>
      )}
    </motion.div>
  );
}

export default Home
