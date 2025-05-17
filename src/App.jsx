import { useState } from 'react'

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Layout } from './Components/Layout';
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
  return (
    <ThemeProvider theme={tgTheme}>

    <Layout/>


    {/* <Grid container justifyContent="center"> */}
      {/* <Grid item xs={12} sm={10} md={8} lg={6}> */}
      {/* </Grid> */}
      {/* <div className="card">
        <button onClick={() => {
            const f = async ()=>{
              await fetch("http://5.35.80.93:8000/").then(res=>{
                if(!res.ok){
                  throw new Error("BAD REQ")

                  setText("not good")
                }else{
                  
                  setText("good")
                  return res.json()
                }

              }).then(res=>{
                console.log(res)
              }).catch(e=>{
                console.ERROR("ПРОБЛЕМЫ")
              })
            }
            f()
        }}>
          GET {text}
        </button>
      </div>

      <div className="card">
        <button onClick={() => {
            const f = async ()=>{
              await fetch("http://5.35.80.93:8000/", {
                method:"POST", 
                headers:{
                  'Content-Type': 'application/json',
                }

              }).then(res=>{
                if(!res.ok){
                  throw new Error("BAD REQ")

                  setText("not good")
                }else{
                  
                  setText("good")
                  return res.json()
                }

              }).then(res=>{
                console.log(res)
              }).catch(e=>{
                console.ERROR("ПРОБЛЕМЫ")
              })
            }
            f()
        }}>
          POST {text}
        </button>
      </div> */}
      
      {/* <Menu/> */}

      

    {/* </Grid> */}
    
    </ThemeProvider>

  )
}

export default App
