import { useEffect, useState } from "react";
import { MainMenu } from "./vagonGame/MainMenu";
import { useAppContext } from "../Context/AppContext";
const calhScore=(score)=>{
    if(score <= 6){
      return 500
    }else if((score-6)*50 >= 500){
      return 0
    }else{
      return 500 -(score - 6)*50
    }
  }


const getGameName = {1:"train", 2:"eggs"}

export const UserMenu=()=>{
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [resScore, setResScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [gameScores, setGameScores] = useState({train:{max:0, prev:0}});
  const [chosenGame, setChosenGame] = useState(null);
  const [totalSeats, setTotalSeats] = useState(54)
  const [isWin, setIsWin] = useState(false);
  const [score, setScore] = useState(0)
  const {userId, nickname} = useAppContext()
  const games = [{name:"Плацкартный вагон", id:1}, 
    {name:"Яички", id:2}, 
    {name:"ВАдим балахонов", id:3}
  ]
  const startGame = (gameId) => {
    setChosenGame(gameId)
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
  const handleGameOver = (win, score) => {
    console.log("WW: ", win)
    setIsWin(win);
    setIsGameOver(true);
    console.log("SCORE:", score)
    setFinalScore(calhScore(score))
    if (win && score >= 0) {
      setGameScores((prev) => {
        console.log("PREV:", prev)
        setFinalScore(p=> calhScore(score)) // Math.max(calhScore(score), prev?.train?.max || 0)
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
  useEffect(()=>{
    console.log(gameScores[getGameName[1]])
  }, [])
  return(
    <>
    {!isGameStarted && !isGameOver &&(
      <div className="p-4 max-w-fit mx-auto text-center">
      <h1 className="text-xl font-bold mb-4">Игры</h1>
      <div className="mb-4 text-lg">Пользователь: {nickname}</div>
      {games.map(game=>(
        <div className="mb-10 " key ={game.id}>
          {/* // ! ПОЛУЧАЮ МАКСИМУМАЛЬНЫЙ СЧЕТ В ИГРЕ */}
          {gameScores.hasOwnProperty(getGameName[game.id]) && (
            <div>Счет: {gameScores[getGameName[game.id]].max} </div>
          )}
          <h2 className="text-lg font-semibold">{game.name}</h2>
          
          <button
          className="px-4 py-2 rounded bg-blue-500 text-white text-lg"
          onClick={()=>{
            startGame(game.id)
          }}
          >
            Начать
          </button>
        </div>
      ))}
    </div>
    )}
    
    {chosenGame==1 && (<MainMenu isWin = {isWin}gameScores={gameScores} score={score} setScore = {setScore} finalScore={finalScore} startGame = {startGame} restartGame={restartGame} goToMenu = {goToMenu} handleGameOver={handleGameOver} isGameOver={isGameOver} isGameStarted={isGameStarted} totalSeats={totalSeats} setFinalScore={setFinalScore}/>)}



    </>
  
  )
}