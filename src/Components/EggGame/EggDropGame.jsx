import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const EggDropGame = ({
  score,
  setScore,
  finalScore,
  setFinalScore,
  startGame,
  restartGame,
  goToMenu,
  handleGameOver,
  isGameOver,
  isGameStarted,
  gameScores,
  userPlayed,
}) => {
  const [eggs, setEggs] = useState(2);
  const [attempts, setAttempts] = useState(0);
  const [criticalFloor, setCriticalFloor] = useState(null);
  const [currentFloor, setCurrentFloor] = useState();
  const [gameMessage, setGameMessage] = useState("");
  const [finalGuess, setFinalGuess] = useState("");
  const [showFinalGuess, setShowFinalGuess] = useState(false);

  // Initialize game
  useEffect(() => {
    if (isGameStarted && !isGameOver) {
      setCriticalFloor(Math.floor(Math.random() * 100) + 1);
      setEggs(2);
      setAttempts(0);
      setScore(500);
      setGameMessage("Назови этаж для проверки (1–100):");
      setShowFinalGuess(false);
      setCurrentFloor(50);
      setFinalGuess("");
    }
  }, [isGameStarted, isGameOver, setScore]);

  // Calculate score based on attempts
  const calculateScore = (currentAttempts) => {
    if (currentAttempts > 14) {
      return Math.max(500 - (currentAttempts - 14) * 20, 0);
    }
    return 500;
  };

  // Handle floor submission
  const handleFloorSubmit = (e) => {
    e.preventDefault();
    const floor = parseInt(currentFloor);

    // Input validation
    if (isNaN(floor) || floor < 1 || floor > 100) {
      setGameMessage("Пожалуйста, введи число от 1 до 100.");
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Check if egg breaks
    if (floor >= criticalFloor) {
      const newEggs = eggs - 1;
      setEggs(newEggs);
      setGameMessage(
        `Яйцо разбилось! 🥚💥 Осталось яиц: ${newEggs}. Попытка: ${newAttempts}.`
      );

      if (newEggs === 0) {
        setShowFinalGuess(true);
        setGameMessage("Оба яйца разбиты! Назови критический этаж:");
      }
    } else {
      setGameMessage(
        `Яйцо цело! 🥚 Осталось яиц: ${eggs}. Попытка: ${newAttempts}. Назови следующий этаж:`
      );
    }

    // Update score
    const newScore = calculateScore(newAttempts);
    setScore(newScore);

    setCurrentFloor("");
  };

  // Handle final guess submission
  const handleFinalGuess = (e) => {
    e.preventDefault();
    const guess = parseInt(finalGuess);

    if (isNaN(guess) || guess < 1 || guess > 100) {
      setGameMessage("Пожалуйста, введи число от 1 до 100.");
      return;
    }

    const isCorrect = guess === criticalFloor;
    const finalScore = isCorrect ? score : 0;

    setFinalScore(finalScore);
    handleGameOver(isCorrect, attempts);

    setGameMessage(
      isCorrect
        ? `Поздравляем! Ты угадал критический этаж ${criticalFloor}! Очки: ${finalScore}`
        : `Неверно! Критический этаж был ${criticalFloor}. Очки: 0`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen lunar-bg p-6"
    >
      <div className="card max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-200">
          Яички
        </h1>

        {/* Game Rules */}
        {!isGameOver && (
          <div className="mb-6 text-sm text-gray-300">
            <h2 className="font-semibold text-lg text-indigo-300 mb-2">Правила:</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Компьютер загадал критический этаж N (1–100).</li>
              <li>У тебя есть 2 яйца 🥚.</li>
              <li>Яйцо разбивается, если бросить с этажа ≥ N.</li>
              <li>Яйцо остается целым, если бросить с этажа меньше N.</li>
              <li>Цель: найти N за минимальное количество попыток.</li>
              <li>Очки: 500 максимум, -20 за каждую попытку свыше 14. 0 очков, если не угадаешь.</li>
            </ul>
          </div>
        )}

        {/* Game Status */}
        {!isGameOver && !showFinalGuess && (
          <div className="mb-6 text-center">
            <p className="text-lg text-gray-300">
              Яиц осталось: <span className="font-semibold text-indigo-300">{eggs} 🥚</span>
            </p>
            <p className="text-lg text-gray-300">
              Попыток: <span className="font-semibold text-indigo-300">{attempts}</span>
            </p>
            <p className="text-lg text-gray-300">
              Очки: <span className="font-semibold text-yellow-400">{score}</span>
            </p>
          </div>
        )}

        {/* Game Message */}
        <p
          className={`mb-6 text-lg ${
            gameMessage.includes("Поздравляем")
              ? "text-green-400"
              : gameMessage.includes("Неверно") || gameMessage.includes("разбилось")
              ? "text-red-400"
              : "text-gray-300"
          }`}
        >
          {gameMessage}
        </p>

        {/* Floor Input */}
        {!isGameOver && !showFinalGuess && (
          <motion.form
            onSubmit={handleFloorSubmit}
            className="mb-6 flex justify-center gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="number"
              value={currentFloor}
              onChange={(e) => setCurrentFloor(e.target.value)}
              placeholder="Этаж (1–100)"
              className="px-4 py-2 bg-gray-700 bg-opacity-50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="100"
              aria-label="Ввести этаж для проверки"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary btn-blue"
              aria-label="Бросить яйцо"
            >
              Бросить
            </motion.button>
          </motion.form>
        )}

        {/* Final Guess Input */}
        {!isGameOver && showFinalGuess && (
          <motion.form
            onSubmit={handleFinalGuess}
            className="mb-6 flex justify-center gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="number"
              value={finalGuess}
              onChange={(e) => setFinalGuess(e.target.value)}
              placeholder="Критический этаж"
              className="px-4 py-2 bg-gray-700 bg-opacity-50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="100"
              aria-label="Ввести критический этаж"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary btn-blue"
              aria-label="Угадать критический этаж"
            >
              Угадать
            </motion.button>
          </motion.form>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="card"
          >
            <h2 className="text-2xl font-bold mb-4 text-indigo-200">
              Игра окончена!
            </h2>
            <p className="text-lg text-gray-300 mb-2">
              Финальный счёт: <span className="font-semibold text-yellow-400">{finalScore}</span>
            </p>
            {gameScores?.eggs?.max > 0 && (
              <p className="text-lg text-gray-300 mb-2">
                Лучший результат: <span className="font-semibold text-yellow-400">{gameScores.eggs.max}</span>
              </p>
            )}
            <p className="text-lg text-gray-300 mb-4">
              Сыграно: <span className="font-semibold text-indigo-300">{userPlayed[1] || 0}/3</span>
            </p>
            <div className="flex justify-center gap-3">
              {userPlayed[1] < 3 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary btn-green"
                  onClick={restartGame}
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
        )}
      </div>
    </motion.div>
  );
};