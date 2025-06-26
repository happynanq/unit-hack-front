import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [nickname, setNickname] = useState("");
  const [userPlayed, setUserPlayed] = useState([0, 0, 0, 0]);
  const [upScore, setUpScore] = useState([0, 0, 0, 0])
  const [sumScore, setSumScore] = useState(0)
 
  useEffect(() => {
    const start = async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      let userId = +urlParams.get("userId"); // ! changes only if fake user
      const nickname = urlParams.get("nickname");
      const oldId = localStorage.getItem("gameId")
      console.log("old id, ",oldId);
      setUserId(userId || 0);
      
      if(oldId != null && userId != 0 && oldId != userId ){
        userId = oldId
        setUserId(oldId) 
        console.log("попытка изменить айди!!")
      }
      setNickname(nickname || "Guest");
      setUserPlayed([0,0,0,0])
      if(userId != 0 && oldId == null){
        localStorage.setItem("gameId", userId )

      }
      try {
        const response = await fetch(`http://5.35.80.93:8000/get_data/${userId}`).then(r=>{
          

          return r.json()
        }).then(r=>{
          console.log("RRR", r)
          if(r == undefined || r.length != 4){
            setUserPlayed([0, 0, 0, 0])
          }else{
          setUserPlayed(r )

          }
          
        })
        await fetch("http://5.35.80.93:8000/scoreboard").then(r=>{
          if(!r.ok){
            throw new Error("Error from getting score app context")
          }
          return r.json()
        }).then(r=>{
          let sum = 0
          let arr = [0, 0, 0, 0]

          r?.scoreboards.map((e, i)=>{
            e.scores.map(e=>{
              if(e.userId === userId){
                console.log("EE", e)
                arr[i] = e.score
                sum += e.score
              }
            })
          })
          setUpScore(arr)
          setSumScore(sum)
        })
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    start();
  }, []);

  const updateUserPlayed = async (gameId) => {
    setUserPlayed((prev) => {
      const newPlayed = [...prev];
      newPlayed[gameId] = (newPlayed[gameId] || 0) + 1;
      console.log("PLAYED: ", newPlayed)
      return newPlayed;
    });
    console.log("UpdatetPlayedbrrr")

    try {
      const response = await fetch("http://5.35.80.93:8000/update_played", {
        method: "POST",
        body: JSON.stringify({
          userId,
          userPlayed: userPlayed.map((count, i) => (i === gameId ? count + 1 : count)),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(r=>{
        if(!r.ok){
          throw new Error("Error while update post")
        }
        return r.json()
      }).then(r=>{
        console.log(r)
      })
      
      
    } catch (error) {
      console.error("Error updating userPlayed:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{ userId, setUserId, nickname, userPlayed, updateUserPlayed, upScore, sumScore }}
    >
      {children}
    </AppContext.Provider>
  );
};