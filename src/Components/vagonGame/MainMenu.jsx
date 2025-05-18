import { useState } from "react";
import { GameMenu } from "./GameMenu";
import { GameOver } from "./GameOver";
import { Carriage } from "./VAGON/Carriage";
import { motion } from "framer-motion";

export const MainMenu = ({
  gameScores,
  score,
  setScore,
  handleGameOver,
  goToMenu,
  restartGame,
  isWin,
  totalSeats,
  finalScore,
  setFinalScore,
  isGameOver,
  isGameStarted,
  userPlayed,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen lunar-bg p-6"
    >
      <div className="card max-w-4xl mx-auto">
        {isGameStarted && !isGameOver && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-200">
              Плацкартный вагон
            </h1>
            <Carriage
              userPlayed={userPlayed}
              totalSeats={totalSeats}
              setScore={setScore}
              setIsGameOver={handleGameOver}
              score={score}
            />
          </>
        )}
        {isGameOver && (
          <GameOver
            userPlayed={userPlayed}
            score={finalScore}
            onRestart={restartGame}
            isWin={isWin}
            goToMenu={goToMenu}
          />
        )}
      </div>
    </motion.div>
  );
};