import { useState } from "react";
import { SeatBlock } from "./SeatBlock";
import { motion, AnimatePresence } from "framer-motion";

export const Carriage = ({ userPlayed, totalSeats, setScore, setIsGameOver, score }) => {
  const [selectedTypes, setSelectedTypes] = useState({
    upper: false,
    lower: false,
    mainRow: false,
    sideRow: false,
  });
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [currentSeat, setCurrentSeat] = useState(Math.floor(Math.random() * totalSeats) + 1);
  const [answerSeat, setAnswerSeat] = useState(currentSeat);
  const [highlightedSeat, setHighlightedSeat] = useState(null);
  const [highlightType, setHighlightType] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [guessValue, setGuessValue] = useState("");
  const [guessResult, setGuessResult] = useState("");
  const [boundaryWarning, setBoundaryWarning] = useState("");

  let mainSeatsCount = Math.ceil((2 * totalSeats) / 3);
  let sideSeatsCount = totalSeats - mainSeatsCount;

  mainSeatsCount = Math.ceil(mainSeatsCount / 4) * 4;
  sideSeatsCount = Math.ceil(sideSeatsCount / 2) * 2;
  const adjustedTotalSeats = mainSeatsCount + sideSeatsCount;

  const mainSeats = [];
  const sideSeats = [];
  
  for (let i = 1; i <= mainSeatsCount; i += 4) {
    mainSeats.push(
      { number: i, isUpper: false, isMainRow: true },
      { number: i + 1, isUpper: true, isMainRow: true },
      { number: i + 2, isUpper: false, isMainRow: true },
      { number: i + 3, isUpper: true, isMainRow: true }
    );
  }

  
  for (let i = mainSeatsCount + 1; i <= adjustedTotalSeats; i += 2) {
    sideSeats.push(
      { number: i, isUpper: false, isMainRow: false },
      { number: i + 1, isUpper: true, isMainRow: false }
    );
  }

  const allSeats = [...mainSeats, ...sideSeats];

  const mainBlocks = [];
  for (let i = 0; i < mainSeats.length; i += 4) {
    mainBlocks.push(mainSeats.slice(i, i + 4));
  }
  const sideBlocks = [];
  for (let i = 0; i < sideSeats.length; i += 2) {
    sideBlocks.push(sideSeats.slice(i, i + 2));
  }

  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = () => {
    const match = inputValue.match(/^([+-])(\d+)$/);
    if (!match) return;

    const direction = match[1];
    const steps = parseInt(match[2], 10);
    let newSeat = direction === "+" ? currentSeat + steps : currentSeat - steps;

    let boundaryPenalty = 0;
    if (newSeat < 1) {
      newSeat = 1;
      boundaryPenalty = 16;
      setBoundaryWarning("Выход за границы вагона! Сейчас вы на первом месте");
      setTimeout(() => setBoundaryWarning(""), 3000);
    }
    if (newSeat > adjustedTotalSeats) {
      newSeat = adjustedTotalSeats;
      boundaryPenalty = 16;
      setBoundaryWarning("Выход за границы вагона! Сейчас вы на последнем месте");
      setTimeout(() => setBoundaryWarning(""), 3000);
    }

    setCurrentSeat(newSeat);
    const seat = allSeats.find((s) => s.number === newSeat);
    if (seat) {
      setHighlightedSeat(newSeat);
      setHighlightType({ isUpper: seat.isUpper, isMainRow: seat.isMainRow });
      setTimeout(() => {
        setHighlightedSeat(null);
        setHighlightType(null);
      }, 5000);
    }
    setScore((prev) => prev + 1 + boundaryPenalty);
    setInputValue("");
  };

  const handleGuessChange = (e) => {
    setGuessValue(e.target.value);
  };

  const handleGuessSubmit = () => {
    const guess = parseInt(guessValue, 10);
    if (isNaN(guess)) return;
    if (guess === answerSeat) {
      setGuessResult("Поздравляем! Вы угадали место!");
      setIsGameOver(true, score);
    } else {
      setGuessResult("Неправильно");
      setScore((prev) => prev + 3);
      setTimeout(() => {
        setGuessResult("");
      }, 3000);
    }
    setGuessValue("");
  };

  const handleStopGame = () => {
    setIsGameOver(false, score);
  };

  const handleSeatClick = (number, isUpper, isMainRow) => {
    const newSelected = new Set(selectedSeats);
    if (newSelected.has(number)) {
      newSelected.delete(number);
    } else {
      newSelected.add(number);
    }
    setSelectedSeats(newSelected);
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const isSeatSelected = (seat) => {
    if (selectedSeats.has(seat.number)) return true;
    if (selectedTypes.upper && seat.isUpper) return true;
    if (selectedTypes.lower && !seat.isUpper) return true;
    if (selectedTypes.mainRow && seat.isMainRow) return true;
    if (selectedTypes.sideRow && !seat.isMainRow) return true;
    return false;
  };

  const isSeatHighlighted = (seat) => {
    if (highlightedSeat === seat.number) return true;
    if (highlightType) {
      return (
        highlightType.isUpper === seat.isUpper &&
        highlightType.isMainRow === seat.isMainRow
      );
    }
    return false;
  };

  return (
    <div className="card">
      {/* <h1 className="text-3xl font-bold mb-4 text-center text-indigo-200">
        Плацкартный вагон, загадано: {answerSeat}
      </h1> */}
      <div className="mb-4 text-sm text-gray-300">
        <h2 className="font-semibold text-lg text-indigo-300 mb-2">Правила:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>В вагоне 54 места (1–36 — главные ряды, 37–54 — боковые).</li>
          <li>Компьютер загадал случайное место — ваша цель его угадать.</li>
          <li>Используйте команды: "+n" (переместиться на n мест вперед) или "-n" (назад).</li>
          <li>После перемещения вы увидите тип ряда (главный/боковой) и позицию (верхнее/нижнее).</li>
          <li>Когда готовы угадать, введите номер места в поле “Ответ”.</li>
          <li>Победа: угадали место с первой попытки.</li>
          <li>В случае выхода за границы вагона, вам прибавится штраф в 16 очков за выход.</li>
          <li>Очки: 500 за ≤6 попыток, -50 за каждую дополнительную попытку (минимум 0).</li>
          <li>Финальный подсчет баллов вы увидете в конце игры</li>
        </ul>
      </div>

      <div className="mb-4 text-lg text-center text-gray-300">
        Баллы: <span className="font-semibold text-yellow-400">{score}</span>
      </div>
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`btn-primary ${selectedTypes.upper ? "btn-blue" : "btn-gray"}`}
          onClick={() => toggleType("upper")}
          aria-label="Переключить верхние места"
        >
          Верхние
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`btn-primary ${selectedTypes.lower ? "btn-green" : "btn-gray"}`}
          onClick={() => toggleType("lower")}
          aria-label="Переключить нижние места"
        >
          Нижние
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`btn-primary ${selectedTypes.mainRow ? "btn-yellow" : "btn-gray"}`}
          onClick={() => toggleType("mainRow")}
          aria-label="Переключить главный ряд"
        >
          Главный ряд
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`btn-primary ${selectedTypes.sideRow ? "btn-red" : "btn-gray"}`}
          onClick={() => toggleType("sideRow")}
          aria-label="Переключить боковой ряд"
        >
          Боковой
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary btn-red"
          onClick={handleStopGame}
          aria-label="Остановить игру"
        >
          Остановить
        </motion.button>
      </div>
      <div className="mb-4 flex flex-col gap-3 items-center">
        <AnimatePresence>
          {boundaryWarning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-400"
            >
              {boundaryWarning}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === "Enter" && handleInputSubmit()}
            placeholder="+n или -n"
            className="input-field w-32"
            aria-label="Ввести перемещение (например, +5 или -3)"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary btn-blue"
            onClick={handleInputSubmit}
            aria-label="Отправить перемещение"
          >
            Отправить
          </motion.button>
        </div>
        <div className="flex justify-center gap-2">
          <input
            type="text"
            value={guessValue}
            onChange={handleGuessChange}
            onKeyPress={(e) => e.key === "Enter" && handleGuessSubmit()}
            placeholder="Ответ"
            className="input-field w-32"
            aria-label="Ввести Ответ"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary btn-blue"
            onClick={handleGuessSubmit}
            aria-label="Проверить Ответ"
          >
            Проверить
          </motion.button>
        </div>
        <AnimatePresence>
          {guessResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-sm ${guessResult.includes("Поздравляем") ? "text-green-400" : "text-red-400"}`}
            >
              {guessResult}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="carriage-container flex flex-col gap-4">
        {}
        <div className="tambour">
          Вход (Тамбур)
        </div>
        <div className="flex flex-row gap-0.5 justify-center">
          <div className="main-row-container">
            <h2 className="text-lg font-semibold mb-2 text-indigo-300 text-left m-1">Главный ряд</h2>
            <div className="flex flex-col">
              {mainBlocks.map((block, index) => (
                <SeatBlock
                  key={index}
                  seats={block}
                  onSeatClick={handleSeatClick}
                  isSelected={isSeatSelected}
                  isHighlighted={isSeatHighlighted}
                  isMainRow={true}
                />
              ))}
            </div>
          </div>
          <div className="corridor"></div> {}
          <div className="side-row-container">
            <h2 className="text-lg font-semibold mb-2 text-indigo-300 text-center m-1">Боковой</h2>
            <div className="flex flex-col">
              {sideBlocks.map((block, index) => (
                <SeatBlock
                  key={index}
                  seats={block}
                  onSeatClick={handleSeatClick}
                  isSelected={isSeatSelected}
                  isHighlighted={isSeatHighlighted}
                  isMainRow={false}
                  className="flex-row-reverse"
                />
              ))}
            </div>
          </div>
        </div>
        {}
        <div className="tambour">
          Вход (Тамбур)
        </div>
      </div>
    </div>
  );
};