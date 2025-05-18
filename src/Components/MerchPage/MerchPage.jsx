import { motion } from "framer-motion";
import m500 from "../../assets/500.png"
import m600 from "../../assets/600.png"
import m1000 from "../../assets/1000.png"
import m1200 from "../../assets/1200.png"
import m1600 from "../../assets/1600.png"


const merchItems = [
  {
    points: 1600,
    image: m1600,
    caption: "Лонгслив «Закодим»",
  },
  {
    points: 1200,
    image: m1200,
    caption: "Шарф «Закодим»",
  },
  {
    points: 1000,
    image: m1000,
    caption: "Керамическая кружка",
  },
  {
    points: 600,
    image: m600,
    caption: "Стикеры из эпоксидной смолы",
  },
  {
    points: 500,
    image: m500,
    caption: "Ремувка «Закодим»",
  },
];

export const MerchPage = ({ goToMenu, totalScore }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen lunar-bg p-4 flex items-center justify-center"
    >
      <div className="merch-card max-w-xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center text-indigo-200">
          Мерч за очки
        </h1>
        {totalScore > 0 && (
          <div className="mb-6 text-lg text-center text-yellow-400">
            Ваш счёт: <span className="font-semibold">{totalScore}</span>
          </div>
        )}
        <div className="space-y-12">
          {merchItems.map((item, index) => (
            <div key={index} className="merch-item flex flex-col items-center">
              <h2 className="merch-points text-4xl font-bold mb-4 text-indigo-200">
                {item.points} очков
              </h2>
              <motion.img
                src={item.image}
                alt={item.caption}
                className="merch-img mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              <p className="merch-caption text-lg text-gray-300 text-center">
                {item.caption}
              </p>
            </div>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary btn-purple mt-8 w-full"
          onClick={goToMenu}
          aria-label="Вернуться в меню"
        >
          Назад
        </motion.button>
      </div>
    </motion.div>
  );
};