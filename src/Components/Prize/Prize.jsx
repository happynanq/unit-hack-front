// import { useAppContext } from "../Context/AppContext";

import { useAppContext } from "../../Context/AppContext";

export const Prize = ({ goToMenu, totalScore }) => {
  const { nickname, userPlayed } = useAppContext();
  const totalAttempts = userPlayed.reduce((sum, count) => sum + count, 0);

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Ваш приз, {nickname}!</h1>
      <p className="text-lg mb-4">
        Поздравляем! Вы сыграли {totalAttempts} раундов и заработали {totalScore} суммарно!
      </p>
      <img
        src="https://via.placeholder.com/300x200?text=Golden+Ticket"
        alt="Golden Ticket"
        className="mx-auto mb-4"
      />
      <button
        onClick={goToMenu}
        className="px-4 py-2 bg-gray-500 text-white rounded"
      >
        В меню
      </button>
    </div>
  );
};