import React from "react";
import { motion } from "framer-motion";
import { FaTelegram, FaEnvelope } from "react-icons/fa";

const Support = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm p-8"
    >
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Поддержка
      </h1>
      
      <div className="border border-dashed border-gray-300 rounded-xl overflow-hidden">
        <div className="p-6 bg-white border-b border-dashed border-gray-300 flex justify-between items-center gap-5 hover:bg-gray-50 transition-colors last:border-b-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              <FaTelegram className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex-1">
              <div className="text-base font-medium text-gray-900 mb-1">
                Напишите нам в телеграм
              </div>
              <div className="text-sm text-gray-500">
                Мы постараемся ответить быстрее
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <FaTelegram className="w-4 h-4" />
            Написать
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default Support;