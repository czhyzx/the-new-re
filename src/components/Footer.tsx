import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

interface FooterProps {
  year: number;
}

export const Footer: React.FC<FooterProps> = ({ year }) => {
  const { theme } = useTheme();
  
  // 可以在这里修改页脚文本和链接
  const footerText = '个人导航博客 - 用心打造每一个链接'; // 页脚主文本
  const footerLinks = [
    { name: '关于', url: '#' },
    { name: '隐私政策', url: '#' },
    { name: '联系我', url: '#' },
  ];
  
  // 二次元风格装饰元素
  const footerDecorations = [
    { icon: 'fa-heart', top: '10%', left: '15%', delay: 0 },
    { icon: 'fa-star', top: '20%', left: '85%', delay: 0.2 },
    { icon: 'fa-magic', top: '70%', left: '25%', delay: 0.4 },
    { icon: 'fa-moon', top: '60%', left: '75%', delay: 0.6 },
  ];
  
  return (
    <footer className={`py-8 bg-gray-900/90 border-t border-purple-900/30 relative overflow-hidden`}>
      {/* 二次元风格装饰背景 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.3),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.3),transparent_40%)]" />
        
        {/* 装饰性浮动小图标 */}
        {footerDecorations.map((dec, index) => (
          <motion.div
            key={index}
            className="absolute text-pink-400 opacity-30"
            style={{ top: dec.top, left: dec.left }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1], 
              scale: [0.5, 0.8, 0.5],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              delay: dec.delay,
              ease: "easeInOut" 
            }}
          >
            <i className={`fas ${dec.icon} text-xl`}></i>
          </motion.div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        {/* 顶部装饰 */}
        <motion.div 
          className="h-0.5 w-32 mx-auto mb-8 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 128, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        
        {/* 页脚文本 */}
        <motion.p 
          className={`text-sm text-gray-400 mb-6`}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          © {year} {footerText}
        </motion.p>
        
        {/* 页脚链接 */}
        <motion.div 
          className="flex justify-center gap-8 mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {footerLinks.map((link, index) => (
            <motion.a 
              key={index}
              href={link.url} 
              className="text-sm text-gray-400 hover:text-white relative group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.name}
              <motion.div 
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              />
            </motion.a>
          ))}
        </motion.div>
        
        {/* 二次元风格签名 */}
        <motion.div
          className="text-xs text-purple-400 italic mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          ✨ 用代码创造二次元世界 ✨
        </motion.div>
        
        {/* 底部装饰 */}
        <motion.div 
          className="h-0.5 w-32 mx-auto mt-8 bg-gradient-to-r from-transparent via-pink-500 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 128, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </footer>
  );
};