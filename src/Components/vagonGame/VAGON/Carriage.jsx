import { useState } from "react";
import { SeatBlock } from "./SeatBlock";

export const Carriage = ({ totalSeats, setScore, setIsGameOver, score }) => {
  const [selectedTypes, setSelectedTypes] = useState({
    upper: false,
    lower: false,
    mainRow: false,
    sideRow: false,
  });
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [currentSeat, setCurrentSeat] = useState(
    Math.floor(Math.random() * totalSeats) + 1
  );
  const [answerSeat, setAnswerSeat] = useState(currentSeat)
  const [highlightedSeat, setHighlightedSeat] = useState(null);
  const [highlightType, setHighlightType] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [guessValue, setGuessValue] = useState('');
  const [guessResult, setGuessResult] = useState('');
  const [boundaryWarning, setBoundaryWarning] = useState('');

  let mainSeatsCount = Math.ceil(2 * totalSeats / 3);
  let sideSeatsCount = totalSeats - mainSeatsCount;

  mainSeatsCount = Math.ceil(mainSeatsCount / 4) * 4;
  sideSeatsCount = Math.ceil(sideSeatsCount / 2) * 2;
  const adjustedTotalSeats = mainSeatsCount + sideSeatsCount;

  const mainSeats = [];
  const sideSeats = [];
  // ГЛАВНЫЙ
  for (let i = 1; i <= mainSeatsCount; i += 4) {
    mainSeats.push(
      { number: i, isUpper: false, isMainRow: true },      
      { number: i + 1, isUpper: true, isMainRow: true },  
      { number: i + 2, isUpper: false, isMainRow: true }, 
      { number: i + 3, isUpper: true, isMainRow: true }  
    );
  }

  // БОКОВЙ
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

  // Обработка ввода перемещения
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = () => {
    const match = inputValue.match(/^([+-])(\d+)$/);
    if (!match) return;
    console.log(match)
    const direction = match[1];
    const steps = parseInt(match[2], 10);
    let newSeat = direction === '+' ? currentSeat + steps : currentSeat - steps; // куда идем

    let boundaryPenalty = 0;
    if (newSeat < 1) {
      newSeat = 1;
      boundaryPenalty = 16;
      setBoundaryWarning('Выход за границы вагона!');
      setTimeout(() => setBoundaryWarning(''), 3000);
    }
    if (newSeat > adjustedTotalSeats) {
      newSeat = adjustedTotalSeats;
      boundaryPenalty = 16;
      setBoundaryWarning('Выход за границы вагона!');
      setTimeout(() => setBoundaryWarning(''), 3000);
    }

    setCurrentSeat(newSeat);
    const seat = allSeats.find((s) => s.number === newSeat);
    console.log("SEAT", seat)
    if (seat) {
      // setHighlightedSeat(newSeat);
      setHighlightType({ isUpper: seat.isUpper, isMainRow: seat.isMainRow });

      setTimeout(() => {
        setHighlightedSeat(null);
        setHighlightType(null);
      }, 5000);
    }
    setScore((prev) => prev + 1 + boundaryPenalty);
    setInputValue('');
  };

  
  const handleGuessChange = (e) => {
    setGuessValue(e.target.value);
  };

  const handleGuessSubmit = () => {
    const guess = parseInt(guessValue, 10);
    if (isNaN(guess)) return;
    if (guess === answerSeat) {
      console.log("UGADAl");
      setGuessResult("Поздравляем! Вы угадали место!");
      setIsGameOver(true, score); // Pass score as attempts
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
    setIsGameOver(false, score); // Pass score as attempts
  };



 
  const handleSeatClick = (number, isUpper, isMainRow) => {
    console.log("NUMBER:", number)
    const newSelected = new Set(selectedSeats);
    if (newSelected.has(number)) {
      newSelected.delete(number);
    } else {
      newSelected.add(number);
    }
    setSelectedSeats(newSelected);
  };

  // Обработка выбора типа мест
  const toggleType = (type) => {
    setSelectedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // Проверка подсветки (кнопки)
  const isSeatSelected = (seat) => {
    if (selectedTypes.upper && seat.isUpper) return true;
    if (selectedTypes.lower && !seat.isUpper) return true;
    if (selectedTypes.mainRow && seat.isMainRow) return true;
    if (selectedTypes.sideRow && !seat.isMainRow) return true;
    return selectedSeats.has(seat.number);
  };

  // Проверка подсветки (анимация)
  const isSeatHighlighted = (seat) => {
    if (selectedSeats.has(seat.number)) return false;
    if (highlightedSeat === seat.number) return true;
    if (highlightType) {
      return (
        (highlightType.isUpper === seat.isUpper) &&
        (highlightType.isMainRow === seat.isMainRow)
      );
    }
    return false;
  };

  return (
    <div className="p-2 max-w-fit mx-auto border border-gray-300 rounded">
      <h1 className="text-xl font-bold mb-2 text-center">Плацкартный вагон, занадан: {answerSeat}</h1>
      {/* <h1 className="text-xl font-bold mb-2 text-center"> находимся на: {currentSeat}</h1> */}
      <h1 className="text-xl font-bold mb-2 text-center"> находимся на: хуй там а не ответ</h1>
      <div className="mb-2 text-lg font-semibold text-center">
        Баллы: {score}
      </div>
      <div className="mb-2 flex flex-wrap gap-1 justify-center">
        <button
          className={`px-2 py-1 rounded text-sm ${selectedTypes.upper ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => toggleType('upper')}
        >
          Верхние
        </button>
        <button
          className={`px-2 py-1 rounded text-sm ${selectedTypes.lower ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
          onClick={() => toggleType('lower')}
        >
          Нижние
        </button>
        <button
          className={`px-2 py-1 rounded text-sm ${selectedTypes.mainRow ? 'bg-yellow-500 text-white' : 'bg-gray-300'}`}
          onClick={() => toggleType('mainRow')}
        >
          Главный ряд
        </button>
        <button
          className={`px-2 py-1 rounded text-sm ${selectedTypes.sideRow ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
          onClick={() => toggleType('sideRow')}
        >
          Боковой
        </button>
        <button
          className="px-2 py-1 rounded text-sm bg-red-500 text-white"
          onClick={handleStopGame}
        >
          Остановить игру
        </button>
      </div>
      <div className="mb-2 flex flex-col gap-2 items-center">
        {boundaryWarning && (
          <div className="text-sm text-red-500">{boundaryWarning}</div>
        )}
        <div className="flex justify-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
            placeholder="+n или -n"
            className="border p-1 rounded text-sm w-32"
          />
          <button
            className="px-2 py-1 rounded text-sm bg-blue-500 text-white"
            onClick={handleInputSubmit}
          >
            Отправить
          </button>
        </div>
        <div className="flex justify-center gap-2">
          <input
            type="text"
            value={guessValue}
            onChange={handleGuessChange}
            onKeyPress={(e) => e.key === 'Enter' && handleGuessSubmit()}
            placeholder="Предполагаемое место"
            className="border p-1 rounded text-sm w-32"
          />
          <button
            className="px-2 py-1 rounded text-sm bg-blue-500 text-white"
            onClick={handleGuessSubmit}
          >
            Проверить
          </button>
        </div>
        {guessResult && (
          <div className={`text-sm ${guessResult.includes('Поздравляем') ? 'text-green-500' : 'text-red-500'}`}>
            {guessResult}
          </div>
        )}
      </div>
      <div className="flex flex-row gap-1 max-w-full justify-center">
        <div className="flex-1 min-w-0 ml-0">
          <h2 className="text-lg font-semibold mb-1 text-left">Главный ряд</h2>
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
        <div className="w-20 min-w-0 shrink">
          <h2 className="text-lg font-semibold mb-1 text-center">Боковой</h2>
          <div className="flex flex-col items-center">
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
    </div>
  );
};