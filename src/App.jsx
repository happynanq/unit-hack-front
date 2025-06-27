import { useState } from 'react'

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Games } from './Games';

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
