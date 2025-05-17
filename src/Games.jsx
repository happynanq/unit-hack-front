import { useEffect, useState } from "react";
import { GameMenu } from "./Components/GameMenu";
import { Carriage } from "./Components/VAGON/Carriage";
import { GameOver } from "./Components/GameOver";

export const Games = () => {
  const [totalSeats, setTotalSeats] = useState(54);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [score, setScore] = useState(0);
  const [gameScores, setGameScores] = useState({});
  const [userId] = useState('user123');

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  const startGame = () => {
    setIsGameStarted(true);
    setIsGameOver(false);
    setIsWin(false);
    setScore(0);
  };

  const restartGame = () => {
    if (isWin && score > 0) {
      setGameScores((prev) => ({ ...prev, train: score }));
    }
    setIsGameStarted(true);
    setIsGameOver(false);
    setIsWin(false);
    setScore(0);
  };

  const handleGameOver = (win) => {
    setIsWin(win);
    setIsGameOver(true);
  };

  return (
    <div className="container p-2 max-w-fit mx-auto">
      {!isGameStarted && !isGameOver && (
        <GameMenu userId={userId} gameScores={gameScores} onStart={startGame} />
      )}
      {isGameStarted && !isGameOver && (
        <>
          <div className="mb-2">
            <label className="block mb-1 text-sm">
              Общее количество мест:
              <input
                type="number"
                value={totalSeats}
                onChange={(e) => setTotalSeats(Math.max(0, parseInt(e.target.value) || 0))}
                className="border p-1 rounded w-full text-sm"
              />
            </label>
          </div>
          <Carriage
            totalSeats={totalSeats}
            setScore={setScore}
            setIsGameOver={handleGameOver}
            score={score}
          />
        </>
      )}
      {isGameOver && (
        <GameOver score={score} onRestart={restartGame} isWin={isWin} />
      )}
    </div>
  );
};