import { Seat } from "./Seat";

export const SeatBlock = ({ seats, onSeatClick, isSelected, isHighlighted, isMainRow, className }) => {
  const renderSeats = () => {
    if (isMainRow) {
      const upperSeats = seats.slice(0, 2); 
      const lowerSeats = seats.slice(2, 4); 
      return (
        <div className="flex flex-col gap-y-2 h-full">
          <div className="flex flex-row gap-x-1">
            {upperSeats.map((seat) => (
              <Seat
                key={seat.number}
                number={seat.number}
                isUpper={seat.isUpper}
                isMainRow={seat.isMainRow}
                isSelected={isSelected(seat)}
                isHighlighted={isHighlighted(seat)}
                onClick={onSeatClick}
                className="flex-1" 
              />
            ))}
          </div>
          <div className="table" aria-hidden="true"></div> {}
          <div className="flex flex-row gap-x-1">
            {lowerSeats.map((seat) => (
              <Seat
                key={seat.number}
                number={seat.number}
                isUpper={seat.isUpper}
                isMainRow={seat.isMainRow}
                isSelected={isSelected(seat)}
                isHighlighted={isHighlighted(seat)}
                onClick={onSeatClick}
                className="flex-1" 
              />
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className={`flex flex-col h-full justify-between ${className}`}>
          {seats.map((seat) => (
            <Seat
              key={seat.number}
              number={seat.number}
              isUpper={seat.isUpper}
              isMainRow={seat.isMainRow}
              isSelected={isSelected(seat)}
              isHighlighted={isHighlighted(seat)}
              onClick={onSeatClick}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className={`seat-block ${isMainRow ? 'main-row' : 'side-row'}`}>
      {renderSeats()}
    </div>
  );
};