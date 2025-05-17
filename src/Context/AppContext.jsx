import { createContext, useEffect, useState } from "react"


const AppContext = createContext() // создали контекст

export const useAppContext = ()=>{
	return useContext(AppContext) // уже готовый подключенный контекст
}

// ! тут мы передаем контекст 

export const AppProvider = ({children})=>{
	const [uid, setUid] = useState(null); 
  const [gameId, setGameId] = useState(); 


  // ! INIT WEB APP 
  useEffect(()=>{
    const start = async()=>{
      await setTimeout(()=>{
        setUid(111)
      }, 500)
    } 
    start()
  }, [])



	return (
		<AppContext.Provider value = {{uid, setUid}}>
			{children}
		</AppContext.Provider>
	)

}