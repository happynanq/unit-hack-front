import { useEffect, useState } from "react";
import { GameMenu } from "./Components/vagonGame/GameMenu";
import { Carriage } from "./Components/vagonGame/VAGON/Carriage";
import { GameOver } from "./Components/vagonGame/GameOver";
import { useAppContext } from "./Context/AppContext";

export const Games = () => {
  const [totalSeats, setTotalSeats] = useState(54);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [gameScores, setGameScores] = useState({});
  // const [userId] = useState('user123');
  const {userId, nickname} = useAppContext()

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

      setGameScores((prev) => ({ ...prev, train: finalScore }));
    }
    setIsGameStarted(true);
    setIsGameOver(false);
    setIsWin(false);
    setScore(0);
  };
  const goToMenu = ()=>{
    
    console.log("GOT TO GAMES MENU")
    setIsGameStarted(false)
    setIsGameOver(false)
    setIsWin(false)
    setScore(0)
  }
  const calhScore=(score)=>{
    if(score <= 6){
      return 500
    }else if((score-6)*50 >= 500){
      return 0
    }else{
      return 500 -(score - 6)*50
    }
  }
  const handleGameOver = (win, score) => {
    setIsWin(win);
    setIsGameOver(true);
    console.log("SCORE:", score)
    setFinalScore(calhScore(score))
    if (win && score >= 0) {
      setGameScores((prev) => {
        console.log("PREV:", prev)
        return ({ ...prev, train: {
          max:Math.max(calhScore(score), prev?.train?.max || 0),
          prev:calhScore(score)
        } }
      )});

    }

    // ! API HERE
    const req = async()=>{
      await fetch("http://5.35.80.93:8000/result", {
        method:"POST",
        body:JSON.stringify({
          userId, nickname, score:calhScore(score), gameId:1
        }),
        headers:{
          "Content-Type":"application/json"
        }
      }).then(r=>{
        if(!r.ok){
          throw new Error("SOME POST ERROR")
        }
        return r.json()
      }).then(r=>{
        console.log("RES FROM POST: ",r )
      }).catch(e=>{
        console.error(e)
      })
    }
    req()

  };

  return (
    <div className="container p-2 max-w-fit mx-auto">
      {!isGameStarted && !isGameOver && (
        <GameMenu userId={userId} gameScores={gameScores} onStart={startGame} nickname={nickname} />
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
        <GameOver score={finalScore} onRestart={restartGame} isWin={isWin} goToMenu={goToMenu}/>
      )}
    </div>
  );
};