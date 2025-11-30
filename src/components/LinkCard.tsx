import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { ProxyContext } from '../App';

interface LinkItem {
  id: number;
  title: string;
  url: string;
  icon: string;
  category: string;
  needProxy?: boolean;
}

interface LinkCardProps {
  link: LinkItem;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link }) => {
  const { theme } = useTheme();
  const { useProxy, proxyUrl } = useContext(ProxyContext);
  
  // 为不同分类生成不同的背景色和光效
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '个人': 'from-purple-600 to-pink-600',
      '技术': 'from-blue-600 to-cyan-600',
      '开发': 'from-green-600 to-teal-600',
      '知识': 'from-amber-500 to-orange-600',
      '娱乐': 'from-rose-500 to-pink-600',
      '游戏': 'from-indigo-600 to-violet-600',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };
  
  const gradientClass = getCategoryColor(link.category);
  
  // 处理链接点击事件，支持可选的代理模式
  const handleClick = (e: React.MouseEvent) => {
    // 如果用户按住Ctrl或Cmd键，让浏览器默认行为处理（在新标签页打开）
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    
    e.preventDefault();
    
    // 确定最终的URL
    let finalUrl = link.url;
    
    // 如果需要使用代理并且该链接可能需要代理
    if (useProxy && link.needProxy) {
      // 在实际项目中，这里可以实现真实的代理跳转逻辑
      // finalUrl = `${proxyUrl}${encodeURIComponent(link.url)}`;
      
      // 目前我们只是简单地显示一个提示并直接跳转
      alert('此链接可能需要访问代理才能正常访问\n\n在实际使用时，您需要配置自己的代理服务器。\n\n当前将直接访问该站点。');
    }
    
    window.open(finalUrl, '_blank');
  };
  
  // 生成随机的浮动动画变体
  const getRandomFloatAnimation = () => {
    return {
      initial: { 
        y: 0,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      },
      hover: { 
        y: -8, 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      },
      tap: { scale: 0.97 }
    };
  };
  
  return (
    <motion.button
      onClick={handleClick}
      className={`block w-full rounded-2xl overflow-hidden backdrop-blur-sm border border-gray-800 bg-gray-800/90 hover:bg-gray-750/90 transition-all duration-300 cursor-pointer relative`}
      variants={getRandomFloatAnimation()}
      whileHover="hover"
      whileTap="tap"
      initial="initial"
    >
      {/* 二次元风格装饰线条 */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradientClass}`}></div>
      
      {/* 内部发光效果 */}
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${gradientClass} opacity-10 rounded-full blur-2xl`}></div>
      
      <div className="p-5 relative z-10">
        <div className="flex items-center gap-3 mb-3">
          {/* 图标背景使用渐变，增加二次元感 */}
          <motion.div 
            className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${gradientClass}`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <i className={`fas ${link.icon} text-white text-xl`}></i>
          </motion.div>
          
          <div>
            {/* 标题添加轻微的阴影效果 */}
            <h3 className="font-semibold text-white drop-shadow-sm">{link.title}</h3>
            <p className="text-xs text-gray-400">{link.category}</p>
          </div>
          
          {/* 代理标签样式优化 */}
          {link.needProxy && (
            <div className="ml-auto">
              <motion.span 
                className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30"
                whileHover={{ scale: 1.05 }}
              >
                可能需要代理
              </motion.span>
            </div>
          )}
        </div>
        
        {/* 网址显示 */}
        <motion.div 
          className="mt-2 text-sm text-gray-400 truncate"
          whileHover={{ x: 3 }}
        >
          {new URL(link.url).hostname}
        </motion.div>
        
        {/* 装饰性图标 */}
        <div className="absolute bottom-2 right-2 opacity-10">
          <i className={`fas ${link.icon} text-4xl text-white`}></i>
        </div>
      </div>
      
      {/* 底部装饰条 */}
      <div className={`h-1 w-1/2 ml-auto bg-gradient-to-r ${gradientClass} opacity-50`}></div>
    </motion.button>
  );
};