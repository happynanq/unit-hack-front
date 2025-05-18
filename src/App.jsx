import { useState } from 'react'

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Games } from './Games';




const tgTheme = createTheme({
  palette: {
    primary: {
      main: "#2ea6ff", 
    },
    background: {
      default: "#18222d", 
      paper: "#1e2c3a",   
    },
    text: {
      primary: "#ffffff", 
    },
    mode: "dark", 
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
