import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  location: string;
}

export const DateTimeWeather: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    condition: '晴天',
    icon: 'fa-sun',
    location: '上海市',
  });

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 模拟天气更新
  useEffect(() => {
    // 这里可以添加实际的天气API调用
    // 目前使用模拟数据

    // 随机更新天气（每10分钟）
    const weatherTimer = setInterval(() => {
      const conditions = [
        { condition: '晴天', icon: 'fa-sun' },
        { condition: '多云', icon: 'fa-cloud' },
        { condition: '小雨', icon: 'fa-cloud-rain' },
        { condition: '阴天', icon: 'fa-cloud-sun' },
        { condition: '大风', icon: 'fa-wind' },
      ];
      
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const randomTemp = 18 + Math.floor(Math.random() * 12); // 18-30度之间

      setWeather({
        ...weather,
        temperature: randomTemp,
        condition: randomCondition.condition,
        icon: randomCondition.icon,
      });
    }, 600000); // 10分钟更新一次

    return () => clearInterval(weatherTimer);
  }, [weather]);

  // 格式化时间显示
  const formatDateTime = (date: Date): { time: string; date: string } => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[date.getDay()];
    
    return {
      time: `${hours}:${minutes}:${seconds}`,
      date: `${year}-${month}-${day} ${weekday}`,
    };
  };

  const { time, date } = formatDateTime(currentDateTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row items-center justify-center gap-8 text-white w-full"
    >
      {/* 时间显示 */}
      <motion.div 
        className="flex items-center gap-3 bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-lg"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <i className="fas fa-clock text-xl text-blue-400"></i>
        </motion.div>
        <div>
          <div className="text-2xl md:text-3xl font-mono font-bold">{time}</div>
          <div className="text-sm text-gray-400">{date}</div>
        </div>
      </motion.div>

      {/* 天气显示 */}
      <motion.div 
        className="flex items-center gap-3 bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-lg"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="p-3 rounded-lg bg-yellow-500/20 border border-yellow-500/30"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <i className={`fas ${weather.icon} text-xl text-yellow-400`}></i>
        </motion.div>
        <div>
          <div className="text-2xl md:text-3xl font-bold">{weather.temperature}°C</div>
          <div className="text-sm text-gray-400">{weather.location} · {weather.condition}</div>
        </div>
      </motion.div>
    </motion.div>
  );
};