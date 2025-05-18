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
      return 1;
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
        className="text-2xl"
        initial={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        🪨
      </motion.div>
    ));

    return (
      <AnimatePresence>
        <div className="flex flex-wrap justify-center gap-2 max-w-xs mx-auto">
          {stoneElements}
        </div>
      </AnimatePresence>
    );
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Последний Лунный Камень Ксилоса</h1>

      {/* Game Rules */}
      {!isGameOver && (
        <div className="mb-4 text-left text-sm">
          <h2 className="font-semibold">Правила:</h2>
          <ul className="list-disc list-inside">
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
        <div className="mb-4">
          <p className="mb-2">Выбери уровень сложности:</p>
          <div className="flex justify-center gap-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => handleDifficultySelect("easy")}
            >
              Легкий
            </button>
            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded"
              onClick={() => handleDifficultySelect("medium")}
            >
              Средний
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => handleDifficultySelect("hard")}
            >
              Сложный
            </button>
          </div>
        </div>
      )}

      {/* Turn Selection */}
      {difficulty !== null && playerTurn === null && !isGameOver && (
        <div className="mb-4">
          <p className="mb-2">Ходить первым?</p>
          <div className="flex justify-center gap-2">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => handleTurnSelect(true)}
            >
              Да
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={() => handleTurnSelect(false)}
            >
              Нет
            </button>
          </div>
        </div>
      )}

      {/* Game Status */}
      {playerTurn !== null && !isGameOver && (
        <div className="mb-4">
          <p>Осталось камней: {stones}</p>
          {difficulty && (
            <p>Сложность: {difficulty === "easy" ? "Легкая" : difficulty === "medium" ? "Средняя" : "Сложная"}</p>
          )}
          {isComputerThinking && <p className="animate-pulse">Компьютер думает...</p>}
        </div>
      )}

      {/* Stones */}
      {playerTurn !== null && !isGameOver && (
        <div className="mb-4">
          {renderStones()}
        </div>
      )}

      {/* Player Move Selection */}
      {playerTurn === true && !isGameOver && !isComputerThinking && stones > 0 && (
        <div className="mb-4">
          <p className="mb-2">Сколько камней взять?</p>
          <div className="flex justify-center gap-2">
            {[...Array(Math.min(4, stones))].map((_, i) => (
              <button
                key={i}
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => handlePlayerMove(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Game Message */}
      <p className="mb-4">{gameMessage}</p>

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="mb-4">
          <p className="text-lg mb-2">Игра окончена!</p>
          <p>Финальный счёт: {localFinalScore}</p>
          {gameScores?.stones?.max > 0 && <p>Лучший результат: {gameScores.stones.max}</p>}
          <p>Сыграно: {userPlayed[3] || 0}/3</p>
          <div className="mt-4">
            {userPlayed[3] < 3 && (
              <button
                onClick={restartGame}
                className="px-4 py-2 bg-green-500 text-white rounded mr-2"
              >
                Переиграть
              </button>
            )}
            <button
              onClick={goToMenu}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              В меню
            </button>
          </div>
        </div>
      )}
    </div>
  );
};