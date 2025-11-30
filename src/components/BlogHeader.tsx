import React from 'react';
  import { motion } from 'framer-motion';

interface BlogHeaderProps {
  onToggleTheme: () => void;
  currentTheme: string;
}

export const BlogHeader: React.FC<BlogHeaderProps> = ({ onToggleTheme, currentTheme }) => {
  // 可以在这里修改博客标题和图标
  const blogTitle = '导航博客测试项目'; // 博客标题
  const iconClass = 'fa-compass'; // 博客图标（Font Awesome类名）
  
  // 头部装饰元素 - 二次元风格小图标
  const decorations = [
    { icon: 'fa-star', x: '15%', delay: 0.1 },
    { icon: 'fa-heart', x: '85%', delay: 0.2 },
    { icon: 'fa-magic', x: '50%', delay: 0.3 },
  ];
  
  // 处理热模块替换（HMR）
  if (import.meta.hot) {
    import.meta.hot.accept();
  }
  
  return (
     <header className={`sticky top-0 z-50 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-md border-b border-gray-700/50 shadow-lg transition-all duration-300`}>
  {/* 二次元风格装饰背景 */}
  <div className="absolute inset-0 overflow-hidden opacity-20">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.3),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.3),transparent_40%)]" />
    
    {/* 装饰性浮动小图标 */}
    {decorations.map((dec, index) => (
      <motion.div
        key={index}
        className="absolute top-1/2 transform -translate-y-1/2 text-pink-400 opacity-40"
        style={{ left: dec.x }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0.2, 0.5, 0.2], 
          scale: [0.8, 1.2, 0.8],
          y: [0, -8, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          delay: dec.delay,
          ease: "easeInOut" 
        }}
      >
        <i className={`fas ${dec.icon} text-xl`}></i>
      </motion.div>
    ))}
  </div>
  
  <div className="container mx-auto px-4 py-4 relative z-10">
    {/* 标题和主题切换 */}
    <div className="flex justify-between items-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2"
      >
        {/* 图标使用渐变背景和阴影效果，增强二次元感 */}
        <motion.div 
          className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-600/30"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <i className={`fas ${iconClass} text-white text-xl`}></i>
        </motion.div>
        
        {/* 标题添加文字阴影和渐变效果 */}
        <motion.h1 
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 drop-shadow-sm"
          whileHover={{ scale: 1.02 }}
        >
          {blogTitle}
        </motion.h1>
      </motion.div>
      
      {/* 主题切换按钮 */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggleTheme}
        className="p-2.5 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 shadow-lg transition-colors"
        aria-label={currentTheme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
      >
        {currentTheme === 'dark' ? (
          <motion.i 
            className="fas fa-sun text-yellow-400 text-xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        ) : (
          <motion.i 
            className="fas fa-moon text-blue-300 text-xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  </div>
  
  {/* 底部装饰条 */}
  <div className="h-0.5 w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600"></div>
    </header>
  );
}