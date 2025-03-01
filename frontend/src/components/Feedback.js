import React, {useEffect, useState} from 'react'
import Confetti from "react-confetti";
import {motion} from "framer-motion";
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

Modal.setAppElement("#root");

const Feedback = ({feedback, onNext, score}) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [finalScore, setFinalScore] = useState(score);

    useEffect(()=>{
        setFinalScore(score);
    },[score]);

    const handleFinishGame = ()=> {
        navigate("/");
    }
  return (
    <motion.div
      className="text-center p-10 bg-gradient-to-r from-green-400 to-blue-600 text-white rounded-lg shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {feedback.isCorrect && <Confetti />}

      <motion.h2
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`text-4xl font-bold flex items-center justify-center gap-2 ${
          feedback.isCorrect ? "text-green-300" : "text-red-400"
        }`}
      >
        {feedback.isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
        {feedback.feedback}
      </motion.h2>

      <p className="mt-4 text-lg font-medium">{feedback.funFact}</p>

      {/* Open modal if the answer is wrong */}
      {!feedback.isCorrect && (
        <motion.button
          className="mt-6 bg-red-500 hover:bg-red-700 px-6 py-3 rounded-full transition-all shadow-lg text-lg font-semibold"
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.1 }}
        >
          Show Score
        </motion.button>
      )}

      <motion.button
        className="mt-6 bg-blue-500 hover:bg-blue-700 px-6 py-3 rounded-full transition-all shadow-lg text-lg font-semibold"
        onClick={onNext}
        whileHover={{ scale: 1.1 }}
      >
        Next Question
      </motion.button>

      {/* Modal for Wrong Answer */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white p-8 rounded-3xl shadow-xl max-w-lg mx-auto mt-20 text-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-red-600">Oops! Wrong Answer 😢</h2>
          <p className="mt-4 text-xl text-gray-700 font-medium">Your Current Score: {finalScore}</p>

          <div className="mt-6 flex justify-center gap-5">
            <motion.button
              className="bg-green-500 hover:bg-green-700 text-white px-6 py-3 rounded-full transition-all shadow-md text-lg font-semibold"
              onClick={() => {
                setIsModalOpen(false);
                onNext();
              }}
              whileHover={{ scale: 1.1 }}
            >
              Continue Game
            </motion.button>

            <motion.button
              className="bg-red-600 hover:bg-red-800 text-white px-6 py-3 rounded-full transition-all shadow-md text-lg font-semibold"
              onClick={handleFinishGame}
              whileHover={{ scale: 1.1 }}
            >
              Finish Game
            </motion.button>
          </div>
        </motion.div>
      </Modal>
    </motion.div>
  )
}

export default Feedback
