export const GameOver = ({ score, onRestart, isWin }) => {
  return (
    <div className="p-4 max-w-fit mx-auto text-center">
      <h1 className="text-xl font-bold mb-4">Игра окончена</h1>
      <div className="mb-4 text-lg">
        {isWin ? `Поздравляем! Ваш счёт: ${score}` : 'Вы проиграли!'}
      </div>
      <button
        className="px-4 py-2 rounded bg-blue-500 text-white text-lg"
        onClick={onRestart}
      >
        Начать заново
      </button>
    </div>
  );
};