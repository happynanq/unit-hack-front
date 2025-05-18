import { motion } from "framer-motion";

export const GameMenu = ({ userId, gameScores, onStart, nickname }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card max-w-md mx-auto text-center"
    >
      <h1 className="text-3xl font-bold mb-4 text-indigo-200">Игры</h1>
      <div className="mb-4 text-lg text-gray-300">
        Пользователь: <span className="font-semibold text-indigo-300">{nickname}</span>
      </div>

      {Object.keys(gameScores).length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-indigo-300 mb-2">Счёты:</h2>
          {Object.entries(gameScores).map(([game, data]) => (
            <div key={game} className="text-gray-300">
              <div className="text-md">
                {game === "train" ? "Плацкартный вагон, предыдущий результат" : game}:{" "}
                <span className="font-semibold text-yellow-400">{data.prev}</span>
              </div>
              <div className="text-md">
                {game === "train" ? "Лучший результат" : game}:{" "}
                <span className="font-semibold text-yellow-400">{data.max}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="btn-primary btn-blue"
        onClick={onStart}
        aria-label="Начать игру"
      >
        Начать
      </motion.button>
    </motion.div>
  );
};