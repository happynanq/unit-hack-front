import { useState } from 'react'

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Games } from './Games';
// import {}



const tgTheme = createTheme({
  palette: {
    primary: {
      main: "#2ea6ff", // Голубой, как в Telegram
    },
    background: {
      default: "#18222d", // Тёмный фон
      paper: "#1e2c3a",   // Цвет карточек
    },
    text: {
      primary: "#ffffff", // Белый текст
    },
    mode: "dark", // Тёмная тема
  },
});

function App() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState("")


  if(true){
    return(
      <Games/>
    )
  }
}

export default App
