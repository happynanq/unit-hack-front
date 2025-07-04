import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./chess.css"
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
  userPlayed,
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

  // Convert position to row,col (e.g., A1 -> [0,0] for 9x3)
  const posToCoords = (pos) => {
    const col = pos.charCodeAt(0) - 65; // A=0, B=1, C=2
    const row = parseInt(pos[1]) - 1; // 1=0, ..., 9=8
    return [row, col];
  };

  // Convert row,col to position (e.g., [0,0] -> A1)
  const coordsToPos = (row, col) => {
    return String.fromCharCode(65 + col) + (row + 1);
  };

  // Get possible Rook moves
  const getRookMoves = (pos) => {
    const [row, col] = posToCoords(pos);
    const moves = [];
    // Horizontal (across columns A, B, C)
    for (let c = 0; c < 3; c++) {
      if (c !== col) moves.push(coordsToPos(row, c));
    }
    // Vertical (across rows 1 to 9)
    for (let r = 0; r < 9; r++) {
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
      while (r >= 0 && r < 9 && c >= 0 && c < 3) {
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

  // Render board (9x3: 9 rows [1 to 9], 3 columns [A, B, C])
  const renderBoard = () => {
    const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const cols = ["A", "B", "C"];
    return (
      <div className="chessboard-container">
        <div className="chessboard">
          {rows.map((row, rowIndex) =>
            cols.map((col, colIndex) => {
              const pos = `${col}${row}`;
              const isLight = (rowIndex + colIndex) % 2 === 0;
              const isPossibleMove = possibleMoves.includes(pos);
              return (
                <motion.div
                  key={pos}
                  className={`square ${isLight ? "square-light" : "square-dark"} ${
                    isPossibleMove ? "outline outline-2 outline-blue-500 animate-pulse" : ""
                  }`}
                  onClick={() => {
                    if (board.rook === pos) handleRookClick();
                    else handleSquareClick(pos);
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  aria-label={`Клетка ${pos}${isPossibleMove ? ", возможный ход" : ""}`}
                >
                  <AnimatePresence>
                    {board.rook === pos && (
                      <motion.span
                        key="rook"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3 }}
                        className="piece merida-rook drop-shadow-[0_0_16px_rgba(0,0,255,0.9)]"
                      />
                    )}
                    {board.bishop === pos && (
                      <motion.span
                        key="bishop"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3 }}
                        className="piece merida-bishop drop-shadow-[0_0_16px_rgba(255,0,0,0.9)]"
                      />
                    )}
                  </AnimatePresence>
                  {}
                  {colIndex === 0 && (
                    <span className="rank-label">{row}</span>
                  )}
                  {}
                  {rowIndex === 8 && (
                    <span className="file-label">{cols[colIndex]}</span>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen lunar-bg p-4 flex items-center justify-center"
    >
      <div className="card max-w-xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center text-indigo-200">
          Ладья против Слона
        </h1>

        {}
        {!isGameOver && (
          <div className="mb-8 text-lg text-gray-300">
            <h2 className="font-semibold text-2xl text-indigo-300 mb-3">Правила:</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Ты управляешь Ладьей (начало: A1). Поймай Слона (начало: C3).</li>
              <li>Ладья ходит по горизонтали или вертикали на любое число клеток.</li>
              <li>Слон ходит по диагонали и старается избегать захвата.</li>
              <li>Победа: Ладья срубает Слона </li>
              <li>Поражение: Ладья попадает под удар Слона.</li>
              <li>Ничья: 50 ходов без победы.</li>
              <li>Очки: 500 за ≤6 ходов, -25 за каждый ход после, 0 за поражение/ничью.</li>
            </ul>
          </div>
        )}

        {!isGameOver && (
          <div className="mb-6 text-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary btn-red"
            onClick={()=>{
              setGameState("loss")
              handleGameOver(false, score);
            }}
            aria-label="Остановить игру"
          >
            Остановить игру
          </motion.button>
          </div>
        )}

        {}
        {!isGameOver && (
          <div className="mb-8 text-center">
            <p className="text-2xl text-gray-300">
              Ходов: <span className="font-semibold text-indigo-300">{moves}</span>
            </p>
            <p className="text-2xl text-gray-300">
              Очки: <span className="font-semibold text-yellow-400">{score}</span>
            </p>
          </div>
        )}

        {}
        <div className="mb-8 flex justify-center">{renderBoard()}</div>

        {}
        {(gameState === "win" || gameState === "draw") && (
          <p
            className={`mb-8 text-2xl ${
              gameMessage.includes("Победа") ? "text-green-400" : "text-red-400"
            }`}
          >
            {gameMessage}
          </p>
        )}

        {}
        <AnimatePresence>
          {gameState === "loss" && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="loss-modal"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-4xl font-bold mb-4 text-red-400">
                  Поражение!
                </h2>
                <p className="text-2xl text-gray-300 mb-4">
                  Слон срубил Ладью!
                </p>
                <p className="text-2xl text-gray-300 mb-4">
                  Финальный счёт: <span className="font-semibold text-yellow-400">{finalScore}</span>
                </p>
                {gameScores?.chess?.max > 0 && (
                  <p className="text-2xl text-gray-300 mb-4">
                    Лучший результат: <span className="font-semibold text-yellow-400">{gameScores.chess.max}</span>
                  </p>
                )}
                <p className="text-2xl text-gray-300 mb-6">
                  Сыграно: <span className="font-semibold text-indigo-300">{userPlayed[2] || 0}/3</span>
                </p>
                <div className="flex justify-center gap-6">
                  {userPlayed[2] < 3 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary btn-green text-xl px-8 py-3"
                      onClick={restartGame}
                      aria-label="Переиграть"
                    >
                      Переиграть
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary btn-gray text-xl px-8 py-3"
                    onClick={goToMenu}
                    aria-label="Вернуться в меню"
                  >
                    В меню
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {}
        {isGameOver && (gameState === "win" || gameState === "draw") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="card"
          >
            <h2 className="text-4xl font-bold mb-6 text-indigo-200">
              Игра окончена!
            </h2>
            <p className="text-2xl text-gray-300 mb-3">
              Финальный счёт: <span className="font-semibold text-yellow-400">{finalScore}</span>
            </p>
            {gameScores?.chess?.max > 0 && (
              <p className="text-2xl text-gray-300 mb-3">
                Лучший результат: <span className="font-semibold text-yellow-400">{gameScores.chess.max}</span>
              </p>
            )}
            <p className="text-2xl text-gray-300 mb-6">
              Сыграно: <span className="font-semibold text-indigo-300">{userPlayed[2] || 0}/3</span>
            </p>
            <div className="flex justify-center gap-6">
              {userPlayed[2] < 3 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary btn-green text-xl px-8 py-3"
                  onClick={restartGame}
                  aria-label="Переиграть"
                >
                  Переиграть
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary btn-gray text-xl px-8 py-3"
                onClick={goToMenu}
                aria-label="Вернуться в меню"
              >
                В меню
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};