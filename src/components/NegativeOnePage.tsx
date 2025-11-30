import React from 'react';
import { motion } from 'framer-motion';
import { DateTimeWeather } from './DateTimeWeather';

interface NegativeOnePageProps {
  isVisible: boolean;
}

export const NegativeOnePage: React.FC<NegativeOnePageProps> = ({ isVisible }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[99999] bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50"
      initial={{ y: -window.innerHeight }}
      animate={{ 
        y: isVisible ? 0 : -window.innerHeight,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ 
        duration: 0.4,
        ease: "easeInOut"
      }}
    >
      <div className="h-full flex flex-col items-center justify-center p-4">
        {/* 装饰性背景元素 */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.3),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.3),transparent_40%)]" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          {/* 页面标题 */}
          <motion.h2 
            className="text-xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <i className="fas fa-chevron-down mr-2 text-gray-400"></i>
            向下滑动返回
          </motion.h2>
          
          {/* 时间和天气信息 */}
          <motion.div
            className="w-full max-w-md p-6 bg-gray-800/70 backdrop-blur-lg rounded-3xl border border-gray-700 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <DateTimeWeather />
          </motion.div>
          
          {/* 装饰元素 */}
          <motion.div 
            className="mt-8 p-6 bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 shadow-lg w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center text-gray-300">
              <h3 className="text-lg font-semibold mb-2">快捷信息</h3>
              <p className="text-sm">下滑返回主页面</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};