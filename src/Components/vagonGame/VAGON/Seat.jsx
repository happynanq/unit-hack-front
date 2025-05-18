import { motion } from "framer-motion";

export const Seat = ({ number, isUpper, isMainRow, isSelected, isHighlighted, onClick }) => {
  const baseClass = isMainRow ? "seat-main" : "seat-side";
  const statusClass = isSelected ? "seat-selected" : isHighlighted ? "seat-highlighted" : "";
  const widthClass = isMainRow ? "w-20" : "w-12"; // Wider main row seats

  return (
    <motion.div
      className={`seat ${baseClass} ${statusClass} ${widthClass} h-12 m-1 flex items-center justify-center text-sm font-bold`}
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