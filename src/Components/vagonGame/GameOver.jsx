import { useEffect } from "react";
import { motion } from "framer-motion";

export const GameOver = ({ userPlayed, score, onRestart, isWin, goToMenu }) => {
  useEffect(() => {
    console.log("isWin", isWin); // TODO: Remove in production
  }, [isWin]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card max-w-md mx-auto text-center"
    >
      <h1 className="text-2xl font-bold mb-4 text-indigo-200">Игра окончена!</h1>
      <div className="mb-4 text-lg">
        {isWin ? (
          <p className="text-green-400">
            Поздравляем! Ваш счёт: <span className="font-semibold text-yellow-400">{score}</span>
          </p>
        ) : (
          <p className="text-red-400">Вы проиграли!</p>
        )}
      </div>
      <p className="text-lg text-gray-300 mb-4">
        Сыграно: <span className="font-semibold text-indigo-300">{userPlayed[0] || 0}/3</span>
      </p>
      <div className="flex justify-center gap-3">
        {userPlayed[0] < 3 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary btn-green"
            onClick={onRestart}
            aria-label="Переиграть"
          >
            Переиграть
          </motion.button>
        )}
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