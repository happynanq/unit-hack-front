import { useState, useEffect } from "react";

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
  userPlayed
}) => {
  const [eggs, setEggs] = useState(2);
  const [attempts, setAttempts] = useState(0);
  const [criticalFloor, setCriticalFloor] = useState(null);
  const [currentFloor, setCurrentFloor] = useState("");
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
      setGameMessage("Назови этаж для проверки (1-100):");
      setShowFinalGuess(false);
      setCurrentFloor("");
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
        `Яйцо разбилось! Осталось яиц: ${newEggs}. Попытка: ${newAttempts}.`
      );

      if (newEggs === 0) {
        setShowFinalGuess(true);
        setGameMessage("Оба яйца разбиты! Назови критический этаж:");
      }
    } else {
      setGameMessage(
        `Яйцо цело! Осталось яиц: ${eggs}. Попытка: ${newAttempts}. Назови следующий этаж:`
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
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Яички</h1>
      <h3 >{criticalFloor}</h3>
      {/* Game Rules */}
      {!isGameOver && (
        <div className="mb-4 text-left text-sm">
          <h2 className="font-semibold">Правила:</h2>
          <ul className="list-disc list-inside">
            <li>Компьютер загадал критический этаж N (1–100).</li>
            <li>У тебя есть 2 яйца.</li>
            <li>Яйцо разбивается, если бросить с этажа ≥ N.</li>
            <li>Яйцо остается целым, если бросить с этажа меньше N.</li>
            <li>Цель: найти N за минимальное количество попыток.</li>
            <li>Очки: 500 максимум, -20 за каждую попытку свыше 14. 0 очков, если не угадаешь.</li>
          </ul>
        </div>
      )}

      {/* Game Status */}
      {!isGameOver && !showFinalGuess && (
        <div className="mb-4">
          <p>Яиц осталось: {eggs}</p>
          <p>Попыток: {attempts}</p>
          <p>Очки: {score}</p>
        </div>
      )}

      {/* Game Message */}
      <p className="mb-4">{gameMessage}</p>

      {/* Floor Input */}
      {!isGameOver && !showFinalGuess && (
        <form onSubmit={handleFloorSubmit} className="mb-4">
          <input
            type="number"
            value={currentFloor}
            onChange={(e) => setCurrentFloor(e.target.value)}
            placeholder="Этаж (1-100)"
            className="px-4 py-2 border rounded mr-2"
            min="1"
            max="100"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Бросить
          </button>
        </form>
      )}

      {/* Final Guess Input */}
      {!isGameOver && showFinalGuess && (
        <form onSubmit={handleFinalGuess} className="mb-4">
          <input
            type="number"
            value={finalGuess}
            onChange={(e) => setFinalGuess(e.target.value)}
            placeholder="Критический этаж"
            className="px-4 py-2 border rounded mr-2"
            min="1"
            max="100"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Угадать
          </button>
        </form>
      )}

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="mb-4">
          <p className="text-lg mb-2">Игра окончена!</p>
          <p>Финальный счет: {finalScore}</p>
          {gameScores?.eggs?.max > 0 && (
            <p>Лучший результат: {gameScores.eggs.max}</p>
          )}
          <div className="mt-4">
            <p>Сыграно: {userPlayed[1] || 0}/3</p>
            <div className="mt-4">
              {userPlayed[1] < 3 && (
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
        </div>
      )}
    </div>
  );
};