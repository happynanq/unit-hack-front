import { useAppContext } from "../../Context/AppContext";
import { motion } from "framer-motion";

import webP from "../../assets/ticket.png"
export const Prize = ({ goToMenu, totalScore }) => {
  const { nickname, userPlayed } = useAppContext();
  const totalAttempts = userPlayed.reduce((sum, count) => sum + count, 0);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen lunar-bg p-6 flex items-center justify-center"
    >
      {}
      <div className="card max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-indigo-200">
          Ваш приз, {nickname}!
        </h1>
        <p className="text-lg text-gray-300 mb-4">
          Поздравляем! Вы сыграли{" "}
          <span className="font-semibold text-yellow-400">{totalAttempts}</span>{" "}
          игр и заработали <span className="font-semibold text-yellow-400">{totalScore} </span>суммарно!
        </p>
        <p className="text-lg text-gray-300 mb-4">
          Подойдите к организаторам и покажите им золотой билет!
        </p>
        <motion.img
          src={webP}
          alt="Золотой билет"
          className="mx-auto mb-4 rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary btn-gray"
          onClick={goToMenu}
          aria-label="Вернуться в меню"
        >
          В меню
        </motion.button>
      </div>
    </motion.div>
  );
};