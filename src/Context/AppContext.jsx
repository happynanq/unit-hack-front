import { createContext, useContext, useEffect, useState } from "react"


const AppContext = createContext() // создали контекст

export const useAppContext = ()=>{
	return useContext(AppContext) // уже готовый подключенный контекст
}


export const AppProvider = ({children})=>{
	const [userId, setUserId] = useState(null); 
  const [nickname, setNickname] = useState("")
  const [gameId, setGameId] = useState(); 


  // ! INIT WEB APP 
  useEffect(()=>{

    const start = async()=>{

      const queryString = window.location.search;
    
    // Создаём объект URLSearchParams для парсинга параметров
      const urlParams = new URLSearchParams(queryString);
      
      // Получаем userId и nickname
      const userId = urlParams.get('userId'); // "454676294"
      const nickname = urlParams.get('nickname'); // "кирилл"
      
      setNickname(nickname)
      setUserId(userId)

      
      // await fetch("http://5.35.80.93:8000/get_data").then(res=>{
      //   if(!res.ok){
      //     console.log("ERROR")
      //   }else{
      //     return res.json()
      //   }
      // }).then(res=>{
      //   console.log(res)
      //   setNickname(res.nickname)
      //   setUserId(res.userId)
      // })
      // await setTimeout(()=>{
      //   setUserId(111)
      // }, 500)
    } 
    start()
  }, [])



	return (
		<AppContext.Provider value = {{userId, setUserId, nickname}}>
			{children}
		</AppContext.Provider>
	)

}