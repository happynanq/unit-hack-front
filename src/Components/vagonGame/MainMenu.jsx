import { useState } from "react";
import { GameMenu } from "./GameMenu"
import { GameOver } from "./GameOver"
import { Carriage } from "./VAGON/Carriage"
import { useAppContext } from "../../Context/AppContext";

export const MainMenu = ({gameScores, score, setScore,handleGameOver, goToMenu, restartGame, isWin, totalSeats, finalScore, setFinalScore, isGameOver, isGameStarted})=>{
  
  const {userId, nickname} = useAppContext()

  

  return (
    <div className="container p-2 max-w-fit mx-auto">
          
          {isGameStarted && !isGameOver && (
            <>
              <div className="mb-2">
                <label className="block mb-1 text-sm">
                  Общее количество мест: {totalSeats}
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
            <GameOver score={finalScore} onRestart={restartGame} isWin={isWin} goToMenu={goToMenu}/>
          )}
        </div>
  )
}