import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LinkCard } from './LinkCard';
import { ProxyContext } from '../App';

interface LinkItem {
  id: number;
  title: string;
  url: string;
  icon: string;
  category: string;
  needProxy?: boolean;
}

interface CategorySectionProps {
  title: string;
  links: LinkItem[];
  icon: string;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ title, links, icon }) => {
  // 为不同分类生成不同的渐变背景
  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      '个人': 'from-purple-900/30 via-purple-800/20 to-pink-900/30',
      '技术': 'from-blue-900/30 via-blue-800/20 to-cyan-900/30',
      '开发': 'from-green-900/30 via-green-800/20 to-teal-900/30',
      '知识': 'from-amber-900/30 via-amber-800/20 to-orange-900/30',
      '娱乐': 'from-rose-900/30 via-rose-800/20 to-pink-900/30',
      '游戏': 'from-indigo-900/30 via-indigo-800/20 to-violet-900/30',
    };
    return gradients[category] || 'from-gray-900/30 via-gray-800/20 to-gray-700/30';
  };
  
  // 为不同分类生成不同的图标颜色
  const getCategoryIconColor = (category: string) => {
    const colors: Record<string, string> = {
      '个人': 'text-purple-400',
      '技术': 'text-blue-400',
      '开发': 'text-green-400',
      '知识': 'text-amber-400',
      '娱乐': 'text-pink-400',
      '游戏': 'text-indigo-400',
    };
    return colors[category] || 'text-gray-400';
  };
  
  const gradientClass = getCategoryGradient(title);
  const iconColorClass = getCategoryIconColor(title);
  
  // 创建滚动容器的变体动画
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // 创建卡片项目的变体动画
  const itemVariants = {
    hidden: { opacity: 0, x: -20, y: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  return (
    <section className={`py-16 bg-gradient-to-b ${gradientClass} backdrop-blur-sm/70 relative overflow-hidden`}>
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* 标题区域 */}
        <motion.div 
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* 装饰线条 */}
          <div className={`h-px w-12 ${iconColorClass.replace('text-', 'bg-')}`}></div>
          
          <motion.div 
            className={`p-2 rounded-xl ${iconColorClass.replace('text-', 'bg-').replace('400', '500/20')} border border-${iconColorClass.replace('text-', '')}/30`}
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <i className={`fas ${icon} text-xl ${iconColorClass}`}></i>
          </motion.div>
          
          <h2 className="text-2xl font-bold">{title}专区</h2>
          
          {/* 装饰线条 */}
          <div className="flex-grow h-px bg-gray-700/50"></div>
        </motion.div>
        
        {/* 链接卡片滚动容器 */}
        <motion.div 
          className="flex gap-6 overflow-x-auto pb-8 no-scrollbar"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {links.map(link => (
            <motion.div 
              key={link.id} 
              className="flex-shrink-0 w-64"
              variants={itemVariants}
            >
              <LinkCard link={link} />
            </motion.div>
          ))}
          
          {/* 添加一个空白的占位元素，让滚动区域末尾有更好的视觉效果 */}
          <div className="flex-shrink-0 w-16"></div>
        </motion.div>
      </div>
      
      {/* 底部装饰条 */}
      <div className={`h-0.5 w-full bg-gradient-to-r from-transparent ${iconColorClass.replace('text-', 'bg-')} to-transparent`}></div>
    </section>
  );
};