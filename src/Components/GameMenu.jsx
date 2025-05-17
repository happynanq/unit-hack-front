export const GameMenu = ({ userId, gameScores, onStart }) => {
  return (
    <div className="p-4 max-w-fit mx-auto text-center">
      <h1 className="text-xl font-bold mb-4">Игры</h1>
      <div className="mb-4 text-lg">Пользователь: {userId}</div>
      {Object.keys(gameScores).length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Счёты:</h2>
          {Object.entries(gameScores).map(([game, score]) => (
            <div key={game} className="text-md">
              {game === 'train' ? 'Плацкартный вагон' : game}: {score}
            </div>
          ))}
        </div>
      )}
      <button
        className="px-4 py-2 rounded bg-blue-500 text-white text-lg"
        onClick={onStart}
      >
        Начать
      </button>
    </div>
  );
};