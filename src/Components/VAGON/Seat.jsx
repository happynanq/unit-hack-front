import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
export const Seat = ({ number, isUpper, isMainRow, isSelected, isHighlighted, onClick }) => {
  const bgColor = isSelected
    ? isUpper
      ? 'bg-blue-500'
      : 'bg-blue-500'
    : isMainRow
      ? 'bg-green-300'
      : 'bg-red-300';

  const widthClass = isMainRow ? 'w-12' : 'w-10';
  const highlightClass = isHighlighted ? 'highlight-pulse' : '';
  return (
    <div
      className={`${widthClass} w-20 h-10 m-0.5 flex items-center justify-center rounded cursor-pointer text-sm text-white font-bold ${bgColor} ${highlightClass}`}
      style={isHighlighted ? { backgroundColor: 'rgba(153, 0, 255, 0.5)' } : {}}
      onClick={() => onClick(number, isUpper, isMainRow)}
    >
      <span>{number}</span>
      {isUpper?<VerticalAlignTopIcon/> : <VerticalAlignBottomIcon/>}
    </div>
  );
};