import { useEffect } from "react";

export const GameOver = ({ userPlayed, score, onRestart, isWin, goToMenu }) => {
  useEffect(()=>{
    console.log("isWin", isWin)
  })
  
  return (
    <div className="p-4 max-w-fit mx-auto text-center">
      <h1 className="text-xl font-bold mb-4">Игра окончена</h1>
      <div className="mb-4 text-lg">
        {isWin ? `Поздравляем! Ваш счёт: ${score}` : 'Вы проиграли!'}
      </div>
      <p>Сыграно: {userPlayed[0] || 0}/3</p>
          <div className="mt-4">
            {userPlayed[0] < 3 && (
              <button
                onClick={onRestart}
                className="px-4 py-2 bg-green-500 text-white rounded mr-2"
              >
                Переиграть
              </button>
            )}
            <button
              onClick={goToMenu}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              В меню
            </button>
          </div>
    </div>
  );
};