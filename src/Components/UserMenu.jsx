import { useState } from "react";
import { MainMenu } from "./vagonGame/MainMenu";
import { EggDropGame } from "./EggGame/EggDropGame";
import { useAppContext } from "../Context/AppContext";
import { RookVsBishopGame } from "./ChessGame/RookVsBishopGame";

const calculateScore = (gameId, attempts, win) => {
  if (!win) return 0;
  if (gameId === 0) {
    // Train game: 500 points for ≤6 attempts, -50 per attempt after
    if (attempts <= 6) return 500;
    const score = 500 - (attempts - 6) * 50;
    return Math.max(score, 0);
  } else if (gameId === 1) {
    // Egg game: 500 points for ≤14 attempts, -20 per attempt after
    if (attempts <= 14) return 500;
    const score = 500 - (attempts - 14) * 20;
    return Math.max(score, 0);
  } else if (gameId === 2) {
    // Chess game: 500 points for ≤6 attempts, -25 per attempt after
    if (attempts <= 6) return 500;
    const score = 500 - (attempts - 6) * 25;
    return Math.max(score, 0);
  }
  return 0;
};

const getGameName = { 0: "train", 1: "eggs", 2: "chess" };

export const UserMenu = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [gameScores, setGameScores] = useState({});
  const [chosenGame, setChosenGame] = useState(null);
  const [totalSeats, setTotalSeats] = useState(54);
  const [isWin, setIsWin] = useState(false);
  const [score, setScore] = useState(0);
  const { userId, nickname } = useAppContext();

  const games = [
  { name: "Плацкартный вагон", id: 0 },
  { name: "Яички", id: 1 },
  { name: "Ладья против Слона", id: 2 },
  { name: "Камешки", id: 3 },
];

  const startGame = (gameId) => {
    setChosenGame(gameId);
    setIsGameStarted(true);
    setIsGameOver(false);
    setIsWin(false);
    setScore(0);
    setFinalScore(0);
  };

  const restartGame = () => {
    if (isWin && finalScore > 0) {
      setGameScores((prev) => ({
        ...prev,
        [getGameName[chosenGame]]: {
          max: Math.max(finalScore, prev?.[getGameName[chosenGame]]?.max || 0),
          prev: finalScore,
        },
      }));
    }
    setIsGameStarted(true);
    setIsGameOver(false);
    setIsWin(false);
    setScore(0);
    setFinalScore(0);
  };

  const goToMenu = () => {
    if (isWin && finalScore > 0) {
      setGameScores((prev) => ({
        ...prev,
        [getGameName[chosenGame]]: {
          max: Math.max(finalScore, prev?.[getGameName[chosenGame]]?.max || 0),
          prev: finalScore,
        },
      }));
    }
    setIsGameStarted(false);
    setIsGameOver(false);
    setIsWin(false);
    setScore(0);
    setFinalScore(0);
    setChosenGame(null);
  };

  const handleGameOver = (win, attempts, gameId) => {
    setIsWin(win);
    setIsGameOver(true);
    const calculatedScore = calculateScore(gameId, attempts, win);
    setFinalScore(calculatedScore);
    console.log("calculatedScore", calculatedScore)
    if (win && calculatedScore > 0) {
      setGameScores((prev) => ({
        ...prev,
        [getGameName[gameId]]: {
          max: Math.max(calculatedScore, prev?.[getGameName[gameId]]?.max || 0),
          prev: calculatedScore,
        },
      }));
    }

    // API call
    const req = async () => {
      try {
        const response = await fetch("http://5.35.80.93:8000/result", {
          method: "POST",
          body: JSON.stringify({
            userId,
            nickname,
            score: calculatedScore,
            gameId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("API POST error");
        }
        const result = await response.json();
        console.log("API response:", result);
      } catch (e) {
        console.error("API error:", e);
      }
    };
    req();
  };

  // Calculate total score
  const totalScore = Object.values(gameScores).reduce(
    (sum, game) => sum + (game?.max || 0),
    0
  );

  return (
    <>
      {!isGameStarted && !isGameOver && (
        <div className="p-4 max-w-fit mx-auto text-center">
          <h1 className="text-xl font-bold mb-4">Игры</h1>
          <div className="mb-4 text-lg">Пользователь: {nickname}</div>
          {totalScore > 0 && (
            <div className="mb-4 text-lg">Общий счёт: {totalScore}</div>
          )}
          {games.map((game) => (
            <div className="mb-10" key={game.id}>
              {gameScores.hasOwnProperty(getGameName[game.id]) && (
                <div>Счёт: {gameScores[getGameName[game.id]].max}</div>
              )}
              <h2 className="text-lg font-semibold">{game.name}</h2>
              <button
                className="px-4 py-2 rounded bg-blue-500 text-white text-lg"
                onClick={() => startGame(game.id)}
              >
                Начать
              </button>
            </div>
          ))}
        </div>
      )}

      {chosenGame === 0 && (
        <MainMenu
          gameScores={gameScores}
          score={score}
          setScore={setScore}
          finalScore={finalScore}
          setFinalScore={setFinalScore}
          startGame={startGame}
          restartGame={restartGame}
          goToMenu={goToMenu}
          handleGameOver={(win, score) => handleGameOver(win, score, 0)}
          isGameOver={isGameOver}
          isGameStarted={isGameStarted}
          totalSeats={totalSeats}
          isWin={isWin}
        />
      )}

      {chosenGame === 1 && (
        <EggDropGame
          gameScores={gameScores}
          score={score}
          setScore={setScore}
          finalScore={finalScore}
          setFinalScore={setFinalScore}
          startGame={startGame}
          restartGame={restartGame}
          goToMenu={goToMenu}
          handleGameOver={(win, score) => handleGameOver(win, score, 1)}
          isGameOver={isGameOver}
          isGameStarted={isGameStarted}
        />
      )}

      {chosenGame === 2 && (
        <RookVsBishopGame
          gameScores={gameScores}
          score={score}
          setScore={setScore}
          finalScore={finalScore}
          setFinalScore={setFinalScore}
          startGame={startGame}
          restartGame={restartGame}
          goToMenu={goToMenu}
          handleGameOver={(win, score) => handleGameOver(win, score, 2)}
          isGameOver={isGameOver}
          isGameStarted={isGameStarted}
        />
      )}
    </>
  );
};