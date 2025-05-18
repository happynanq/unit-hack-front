import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const MoonStoneGame = ({
  gameScores,
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
  userPlayed,
}) => {
  const [stones, setStones] = useState(21);
  const [playerTurn, setPlayerTurn] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [gameMessage, setGameMessage] = useState("Выбери уровень сложности");
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const [removedStones, setRemovedStones] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [localFinalScore, setLocalFinalScore] = useState(0);

  // Initialize or reset game
  useEffect(() => {
    if (isGameStarted && !isGameOver) {
      setStones(21);
      setPlayerTurn(null);
      setDifficulty(null);
      setScore(0);
      setFinalScore(0);
      setLocalFinalScore(0);
      setGameMessage("Выбери уровень сложности");
      setIsComputerThinking(false);
      setRemovedStones([]);
      setMoveCount(0);
    }
  }, [isGameStarted, restartGame, isGameOver, setScore, setFinalScore]);

  // Handle computer move when it's their turn
  useEffect(() => {
    if (!playerTurn && playerTurn !== null && !isGameOver && !isComputerThinking && stones > 0) {
      computerMove();
    }
  }, [playerTurn, isGameOver, isComputerThinking, stones]);

  // Computer move logic
  const computerMove = () => {
    setIsComputerThinking(true);
    setTimeout(() => {
      if (stones <= 0) {
        setIsComputerThinking(false);
        return;
      }

      let take;
      if (difficulty === "easy") {
        take = Math.min(Math.floor(Math.random() * 4) + 1, stones);
      } else if (difficulty === "medium") {
        if (moveCount < 2) {
          take = Math.min(Math.floor(Math.random() * 4) + 1, stones);
        } else {
          take = hardStrategy();
        }
      } else {
        take = hardStrategy();
      }

      const newStones = stones - take;
      setStones(newStones);
      setRemovedStones(Array(take).fill(true));
      setGameMessage(`Компьютер взял ${take} ${take === 1 ? "камень" : "камня"}. Твой ход.`);
      setIsComputerThinking(false);
      setMoveCount((prev) => prev + 1);

      if (newStones === 0) {
        const points = difficulty === "easy" ? 100 : difficulty === "medium" ? 200 : 300;
        setLocalFinalScore(points);
        setFinalScore(points);
        setGameMessage(`Победа! Компьютер взял последний камень! Очки: ${points}`);
        handleGameOver(true, points);
        return;
      }

      setPlayerTurn(true);
    }, 1000);
  };

  // Hard difficulty strategy
  const hardStrategy = () => {
    if(stones == 1){
      return 1
    }
    if (stones <= 5) {
      return stones - 1;
    }
    const remainder = stones % 5;
    if (remainder === 1) {
      return Math.min(Math.floor(Math.random() * 4) + 1, stones);
    }
    return remainder === 0 ? 4 : remainder;
  };

  // Handle difficulty selection
  const handleDifficultySelect = (level) => {
    setDifficulty(level);
    setGameMessage("Ходить первым?");
  };

  // Handle turn selection
  const handleTurnSelect = (first) => {
    setPlayerTurn(first);
    if (!first) {
      setGameMessage("Компьютер ходит первым...");
      setIsComputerThinking(true);
      computerMove();
    } else {
      setGameMessage("Твой ход: выбери количество камней (1–4)");
    }
  };

  // Handle player move
  const handlePlayerMove = (num) => {
    if (!playerTurn || isComputerThinking || stones <= 0) return;
    if (num < 1 || num > Math.min(4, stones)) {
      setGameMessage("Недопустимый ход! Выбери от 1 до " + Math.min(4, stones));
      return;
    }

    const newStones = stones - num;
    setStones(newStones);
    setRemovedStones(Array(num).fill(true));
    setGameMessage(`Ты взял ${num} ${num === 1 ? "камень" : "камня"}.`);

    if (newStones === 0) {
      setLocalFinalScore(0);
      setFinalScore(0);
      setGameMessage("Поражение! Ты взял последний камень!");
      handleGameOver(false, 0);
      return;
    }

    setPlayerTurn(false);
  };

  // Render stones
  const renderStones = () => {
    if (stones < 0) {
      console.error("Invalid stone count:", stones);
      return null;
    }

    const stoneElements = Array(stones).fill().map((_, index) => (
      <motion.div
        key={`${stones}-${index}`}
        className="moonstone"
        initial={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        🪨
      </motion.div>
    ));

    return (
      <AnimatePresence>
        <div className="flex flex-wrap justify-center gap-4 max-w-md mx-auto bg-gray-800 bg-opacity-50 rounded-lg p-4">
          {stoneElements}
        </div>
      </AnimatePresence>
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
          Последний Лунный Камень Ксилоса
        </h1>

        {/* Game Rules */}
        {!isGameOver && (
          <div className="mb-6 text-sm text-gray-300">
            <h2 className="font-semibold text-lg text-indigo-300 mb-2">Правила:</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>В куче 21 камень. Игроки ходят по очереди.</li>
              <li>За ход можно взять 1–4 камня (или меньше, если осталось мало).</li>
              <li>Цель: не взять последний камень. Кто взял последний — проиграл.</li>
              <li>Выбери, ходить первым или вторым, и уровень сложности.</li>
              <li>Очки за победу: 100 (Легкий), 200 (Средний), 300 (Сложный).</li>
            </ul>
          </div>
        )}

        {/* Difficulty Selection */}
        {difficulty === null && !isGameOver && (
          <div className="mb-6">
            <p className="mb-3 text-lg text-gray-300">Выбери уровень сложности:</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary btn-blue"
                onClick={() => handleDifficultySelect("easy")}
                aria-label="Выбрать легкий уровень"
              >
                Легкий
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary btn-yellow"
                onClick={() => handleDifficultySelect("medium")}
                aria-label="Выбрать средний уровень"
              >
                Средний
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary btn-red"
                onClick={() => handleDifficultySelect("hard")}
                aria-label="Выбрать сложный уровень"
              >
                Сложный
              </motion.button>
            </div>
          </div>
        )}

        {/* Turn Selection */}
        {difficulty !== null && playerTurn === null && !isGameOver && (
          <div className="mb-6">
            <p className="mb-3 text-lg text-gray-300">Ходить первым?</p>
            <div className="flex justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary btn-green"
                onClick={() => handleTurnSelect(true)}
                aria-label="Ходить первым"
              >
                Да
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary btn-gray"
                onClick={() => handleTurnSelect(false)}
                aria-label="Ходить вторым"
              >
                Нет
              </motion.button>
            </div>
          </div>
        )}

        {/* Game Status */}
        {playerTurn !== null && !isGameOver && (
          <div className="mb-6 text-center">
            <p className="text-lg text-gray-300">Осталось камней: <span className="font-semibold text-indigo-300">{stones}</span></p>
            {difficulty && (
              <p className="text-lg text-gray-300">
                Сложность: <span className="font-semibold text-indigo-300">
                  {difficulty === "easy" ? "Легкая" : difficulty === "medium" ? "Средняя" : "Сложная"}
                </span>
              </p>
            )}
            {isComputerThinking && (
              <motion.p
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-lg text-yellow-400"
              >
                Компьютер думает...
              </motion.p>
            )}
          </div>
        )}

        {/* Stones */}
        {playerTurn !== null && !isGameOver && (
          <div className="mb-6">{renderStones()}</div>
        )}

        {/* Player Move Selection */}
        {playerTurn === true && !isGameOver && !isComputerThinking && stones > 0 && (
          <div className="mb-6">
            <p className="mb-3 text-lg text-gray-300">Сколько камней взять?</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {[...Array(Math.min(4, stones))].map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary btn-blue w-12 h-12 flex items-center justify-center text-lg"
                  onClick={() => handlePlayerMove(i + 1)}
                  aria-label={`Взять ${i + 1} камней`}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Game Message */}
        <p className={`mb-6 text-lg ${gameMessage.includes("Победа") ? "text-green-400" : gameMessage.includes("Поражение") ? "text-red-400" : "text-gray-300"}`}>
          {gameMessage}
        </p>

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
              Финальный счёт: <span className="font-semibold text-yellow-400">{localFinalScore}</span>
            </p>
            {gameScores?.stones?.max > 0 && (
              <p className="text-lg text-gray-300 mb-2">
                Лучший результат: <span className="font-semibold text-yellow-400">{gameScores.stones.max}</span>
              </p>
            )}
            <p className="text-lg text-gray-300 mb-4">
              Сыграно: <span className="font-semibold text-indigo-300">{userPlayed[3] || 0}/3</span>
            </p>
            <div className="flex justify-center gap-3">
              {userPlayed[3] < 3 && (
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