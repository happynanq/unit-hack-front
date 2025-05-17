import { Button } from "@mui/material"
import {TelegramLikeUI} from "./tg.jsx"

export function AppMenu(){ 
  const startGame = ()=>{
    console.log("game started")
  }
  return (
    <div>
      
      <Button
        sx={{
          display: 'block',
          mx: 'auto', 
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 500,
          px: 3,
          backgroundColor:"#000"
        }}
        onClick={startGame}
      >
          PLAY GAME
      </Button>
    </div>
  )
}