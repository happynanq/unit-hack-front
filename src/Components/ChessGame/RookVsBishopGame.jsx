import { useState, useEffect } from "react";

export const RookVsBishopGame = ({
  gameScores,
  score,
  setScore,
  finalScore,
  setFinalScore,
  startGame,
  restartGame,
  goToMenu,
  handleGameOver,
  isGameOver,
  isGameStarted,
  userPlayed
}) => {
  const [board, setBoard] = useState({
    rook: "A1",
    bishop: "C3",
  });
  const [moves, setMoves] = useState(0);
  const [gameMessage, setGameMessage] = useState("Твой ход: выбери клетку для Ладьи (например, A4)");
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [gameState, setGameState] = useState("playing");

  // Initialize game
  useEffect(() => {
    if (isGameStarted && !isGameOver) {
      setBoard({ rook: "A1", bishop: "C3" });
      setMoves(0);
      setScore(500);
      setGameMessage("Твой ход: выбери клетку для Ладьи (например, A4)");
      setPossibleMoves([]);
      setGameState("playing");
    }
  }, [isGameStarted, isGameOver, setScore]);

  // Convert position to row,col (e.g., A1 -> [0,0])
  const posToCoords = (pos) => {
    const row = pos.charCodeAt(0) - 65; // A=0, B=1, C=2
    const col = parseInt(pos[1]) - 1; // 1=0, ..., 9=8
    return [row, col];
  };

  // Convert row,col to position (e.g., [0,0] -> A1)
  const coordsToPos = (row, col) => {
    return String.fromCharCode(65 + row) + (col + 1);
  };

  // Get possible Rook moves
  const getRookMoves = (pos) => {
    const [row, col] = posToCoords(pos);
    const moves = [];
    // Horizontal
    for (let c = 0; c < 9; c++) {
      if (c !== col) moves.push(coordsToPos(row, c));
    }
    // Vertical
    for (let r = 0; r < 3; r++) {
      if (r !== row) moves.push(coordsToPos(r, col));
    }
    return moves;
  };

  // Get possible Bishop moves
  const getBishopMoves = (pos) => {
    const [row, col] = posToCoords(pos);
    const moves = [];
    const directions = [
      [-1, -1], // Up-left
      [-1, 1],  // Up-right
      [1, -1],  // Down-left
      [1, 1],   // Down-right
    ];
    directions.forEach(([dr, dc]) => {
      let r = row + dr, c = col + dc;
      while (r >= 0 && r < 3 && c >= 0 && c < 9) {
        moves.push(coordsToPos(r, c));
        r += dr;
        c += dc;
      }
    });
    return moves;
  };

  // Check if a square is attacked by Rook
  const isAttackedByRook = (pos, rookPos) => {
    const [row, col] = posToCoords(pos);
    const [rRow, rCol] = posToCoords(rookPos);
    return row === rRow || col === rCol;
  };

  // Check if a square is attacked by Bishop
  const isAttackedByBishop = (pos, bishopPos) => {
    const [row, col] = posToCoords(pos);
    const [bRow, bCol] = posToCoords(bishopPos);
    return Math.abs(row - bRow) === Math.abs(col - bCol);
  };

  // Handle Rook click to show possible moves
  const handleRookClick = () => {
    if (gameState !== "playing") return;
    const moves = getRookMoves(board.rook);
    setPossibleMoves(moves);
  };

  // Handle square click
  const handleSquareClick = (pos) => {
    if (gameState !== "playing") return;
    const rookMoves = getRookMoves(board.rook);
    if (!rookMoves.includes(pos)) {
      setGameMessage("Недопустимый ход! Выбери другую клетку.");
      return;
    }

    // Move Rook
    const newMoves = moves + 1;
    setMoves(newMoves);
    setBoard((prev) => ({ ...prev, rook: pos }));
    setPossibleMoves([]);
    setScore(newMoves <= 6 ? 500 : Math.max(500 - (newMoves - 6) * 25, 0));

    // Check win: Rook captures Bishop
    if (pos === board.bishop) {
      setGameState("win");
      setGameMessage(`Победа! Ты поймал Слона за ${newMoves} ходов!`);
      handleGameOver(true, newMoves);
      return;
    }

    // Check loss: Rook moves to square attacked by Bishop
    if (isAttackedByBishop(pos, board.bishop) && pos !== board.bishop) {
      setGameState("loss");
      setGameMessage("Поражение! Слон срубил Ладью!");
      handleGameOver(false, newMoves);
      return;
    }

    // Check draw: 50 moves
    if (newMoves >= 50) {
      setGameState("draw");
      setGameMessage("Ничья! Превышен лимит в 50 ходов.");
      handleGameOver(false, newMoves);
      return;
    }

    // Computer move (Bishop)
    const bishopMoves = getBishopMoves(board.bishop);
    const safeMoves = bishopMoves.filter((move) => !isAttackedByRook(move, pos));
    let newBishopPos = board.bishop;

    if (safeMoves.length > 0) {
      newBishopPos = safeMoves[Math.floor(Math.random() * safeMoves.length)];
    } else if (bishopMoves.length > 0) {
      newBishopPos = bishopMoves[Math.floor(Math.random() * bishopMoves.length)];
    }

    setBoard((prev) => ({ ...prev, bishop: newBishopPos }));
    setGameMessage("Ход Слона. Твой ход: выбери клетку для Ладьи.");

    // Check win: Bishop trapped and attacked
    if (bishopMoves.length === 0 && isAttackedByRook(newBishopPos, pos)) {
      setGameState("win");
      setGameMessage(`Победа! Слон в мате за ${newMoves} ходов!`);
      handleGameOver(true, newMoves);
      return;
    }
  };

  // Render board
  const renderBoard = () => {
    const rows = ["A", "B", "C"];
    const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return (
      <div className="inline-grid grid-cols-9 gap-0 border-2 border-gray-500">
        {rows.map((row) =>
          cols.map((col) => {
            const pos = `${row}${col}`;
            const isLight = (rows.indexOf(row) + col) % 2 === 0;
            const isPossibleMove = possibleMoves.includes(pos);
            return (
              <div
                key={pos}
                className={`w-12 h-12 flex items-center justify-center text-2xl cursor-pointer
                  ${isLight ? "bg-gray-200" : "bg-gray-400"}
                  ${isPossibleMove ? "animate-pulse border-2 border-blue-500" : ""}
                  ${board.rook === pos || board.bishop === pos ? "font-bold" : ""}`}
                onClick={() => {
                  if (board.rook === pos) handleRookClick();
                  else handleSquareClick(pos);
                }}
              >
                {board.rook === pos && <span>♖</span>}
                {board.bishop === pos && <span>♝</span>}
              </div>
            );
          })
        )}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Ладья против Слона</h1>

      {/* Game Rules */}
      {!isGameOver && (
        <div className="mb-4 text-left text-sm">
          <h2 className="font-semibold">Правила:</h2>
          <ul className="list-disc list-inside">
            <li>Ты управляешь Ладьей (начало: A1). Поймай Слона (начало: C3).</li>
            <li>Ладья ходит по горизонтали или вертикали на любое число клеток.</li>
            <li>Слон ходит по диагонали и старается избегать захвата.</li>
            <li>Победа: Ладья срубает Слона или ставит мат (Слон не может ходить и атакован).</li>
            <li>Поражение: Ладья попадает под удар Слона.</li>
            <li>Ничья: 50 ходов без победы.</li>
            <li>Очки: 500 за ≤6 ходов, -25 за каждый ход после, 0 за поражение/ничью.</li>
          </ul>
        </div>
      )}

      {/* Game Status */}
      {!isGameOver && (
        <div className="mb-4">
          <p>Ходов: {moves}</p>
          <p>Очки: {score}</p>
        </div>
      )}

      {/* Board */}
      <div className="mb-4">{renderBoard()}</div>

      {/* Game Message */}
      <p className="mb-4">{gameMessage}</p>

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="mb-4">
          <p className="text-lg mb-2">Игра окончена!</p>
          <p>Финальный счёт: {finalScore}</p>
          {gameScores?.chess?.max > 0 && <p>Лучший результат: {gameScores.chess.max}</p>}
          <p>Сыграно: {userPlayed[2] || 0}/3</p>
          <div className="mt-4">
            {userPlayed[2] < 3 && (
              <button
                onClick={restartGame}
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
      )}
    </div>
  );
};