import { Seat } from "./Seat";

export const SeatBlock = ({ seats, onSeatClick, isSelected, isHighlighted, isMainRow }) => {
  const renderSeats = () => {
    if (isMainRow) {
      const upperSeats = seats.slice(0, 2);
      const lowerSeats = seats.slice(2, 4);
      return (
        <div className="flex flex-col">
          <div className="flex flex-row">
            {upperSeats.map((seat) => (
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
          <div className="flex flex-row">
            {lowerSeats.map((seat) => (
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
        </div>
      );
    } else {
      return (
        <div className="flex flex-col">
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
    <div className="border border-gray-300 p-0.5 m-1 rounded">
      {renderSeats()}
    </div>
  );
};