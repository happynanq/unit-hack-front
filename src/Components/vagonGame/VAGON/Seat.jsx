import { motion } from "framer-motion";

export const Seat = ({ number, isUpper, isMainRow, isSelected, isHighlighted, onClick }) => {
  const baseClass = isMainRow ? "seat-main" : "seat-side";
  const statusClass = isSelected ? "seat-selected" : isHighlighted ? "seat-highlighted" : "";
  console.log(number, isHighlighted)
  return (
    <motion.div
      className={`seat ${baseClass} ${statusClass} w-12 h-12 m-1 flex items-center justify-center text-sm font-bold`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(number, isUpper, isMainRow)}
      aria-label={`Место ${number}, ${isUpper ? "верхнее" : "нижнее"}, ${isMainRow ? "главный ряд" : "боковой ряд"}`}
      aria-checked={isSelected}
    >
      <span>{number}</span>
      <span className="ml-1">{isUpper ? "⬆️" : "⬇️"}</span>
    </motion.div>
  );
};