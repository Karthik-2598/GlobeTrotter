import React, {useState,useEffect} from 'react'
import {QRCodeSVG} from "qrcode.react";
import Modal from 'react-modal';
import {motion} from "framer-motion";
import { FaWhatsapp, FaTimes } from "react-icons/fa"

if (typeof window !== "undefined") {
    Modal.setAppElement("#root");
  }

const ChallengeFriend = () => {
  const [username, setUsername]=useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(()=>{
    const storedUsername = localStorage.getItem("username");
    if(storedUsername){
      setUsername(storedUsername);
    }
  },[]);
  const inviteLink = `http://yourapp.com/challenge/${username}`;
  const handleShareWhatsApp = () => {
    const whatsappMessage = `Hey! Join me in playing Globetrotter Trivia 🌍. Click here to accept the challenge: ${inviteLink}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank");
  };
  return (
    <div className="text-center mt-10">
      <motion.button
        className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full shadow-lg transition-all text-lg font-semibold"
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.1 }}
      >
        Share Challenge
      </motion.button>

      {/* Share Modal */}
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
          <h2 className="text-3xl font-bold text-blue-700">Invite Your Friend 🎉</h2>
          <p className="mt-3 text-gray-700">Scan the QR code or share the link:</p>

          <div className="mt-5 flex justify-center">
            <QRCodeSVG value={inviteLink} size={150} className="shadow-lg rounded-lg" />
          </div>

          <input
            className="mt-4 p-3 w-full text-center border border-gray-300 rounded-xl text-lg font-medium"
            value={inviteLink}
            readOnly
          />

          <div className="mt-6 flex justify-center gap-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full transition-all shadow-md flex items-center gap-2 text-lg"
              onClick={handleShareWhatsApp}
            >
              <FaWhatsapp className="text-xl" /> Share via WhatsApp
            </button>

            <button
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full transition-all shadow-md flex items-center gap-2 text-lg"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes className="text-xl" /> Close
            </button>
          </div>
        </motion.div>
      </Modal>
    </div>
  )
}

export default ChallengeFriend
