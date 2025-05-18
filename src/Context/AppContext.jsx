import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [nickname, setNickname] = useState("");
  const [userPlayed, setUserPlayed] = useState([0, 0, 0, 0]); // [train, eggs, chess, stones]

  // Initialize web app and fetch user data
  useEffect(() => {
    const start = async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const userId = urlParams.get("userId");
      const nickname = urlParams.get("nickname");

      setNickname(nickname || "Guest");
      setUserId(userId);
      setUserPlayed([0,0,0,0])
      // try {
      //   const response = await fetch("http://5.35.80.93:8000/get_data");
      //   if (!response.ok) {
      //     console.error("Failed to fetch user data");
      //     return;
      //   }
      //   const data = await response.json();
      //   setUserPlayed(data.userPlayed || [0, 0, 0, 0]); // Fallback to zeros
      // } catch (error) {
      //   console.error("Error fetching user data:", error);
      // }
    };
    start();
  }, []);

  // Function to update userPlayed and sync with server
  const updateUserPlayed = async (gameId) => {
    setUserPlayed((prev) => {
      const newPlayed = [...prev];
      newPlayed[gameId] = (newPlayed[gameId] || 0) + 1;
      console.log("PLAYED: ", newPlayed)
      return newPlayed;
    });

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
      });
      if (!response.ok) {
        console.error("Failed to update userPlayed");
      }
    } catch (error) {
      console.error("Error updating userPlayed:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{ userId, setUserId, nickname, userPlayed, updateUserPlayed }}
    >
      {children}
    </AppContext.Provider>
  );
};