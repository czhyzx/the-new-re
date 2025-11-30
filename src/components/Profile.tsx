import React from "react";
  import { motion } from "framer-motion";
  import { useAvatar } from "../contexts/AvatarContext";

interface SocialLink {
    name: string;
    url: string;
    icon: string;
}

interface PersonalInfo {
    name: string;
    bio: string;
    avatar: string;
    coverImage: string;
    socialLinks: SocialLink[];
    skills: string[];
}

interface ProfileProps {
    info: PersonalInfo;
}

export const Profile: React.FC<ProfileProps> = ({ info }) => {
  // 生成随机浮动气泡效果的数据
  const bubbles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 0.5,
  }));
  
  const { avatarImage } = useAvatar();

    return (
     <div className="relative overflow-hidden">
            {/* 二次元风格背景 */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url(${info.coverImage})` }}
                />
                
                {/* 装饰性浮动气泡 */}
                {bubbles.map((bubble) => (
                    <motion.div
                        key={bubble.id}
                        className="absolute rounded-full bg-gradient-to-r from-pink-400/20 to-blue-400/20 backdrop-blur-sm"
                        style={{
                            width: bubble.size,
                            height: bubble.size,
                            left: `${bubble.x}%`,
                            top: `${bubble.y}%`,
                        }}
                        animate={{
                            y: [0, -15, 0],
                            opacity: [0.4, 0.6, 0.4],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: bubble.delay,
                            ease: "easeInOut",
                        }}
                    />
                ))}
                
                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-purple-900/30 to-gray-900/90" />
            </div>

            {/* 个人信息卡片 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full"
            >
                {/* 二次元风格卡片 */}
                <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 border border-gray-800 shadow-xl relative overflow-hidden">
                    {/* 装饰性光效 */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-500/20 rounded-full filter blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl" />
                    
                    <motion.div
                        className="flex flex-col items-center text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* 头像区域 - 二次元风格 */}
                        <motion.div
                            className="w-32 h-32 rounded-full border-4 border-white/80 shadow-2xl shadow-purple-500/20 overflow-hidden mb-4 relative"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <img 
                                 src={avatarImage || info.avatar} 
  alt={info.name} 
  className="w-full h-full object-cover" 
                            />
                            {/* 头像装饰 */}
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-purple-500/10" />
                            <motion.div 
                                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-pink-500 rounded-full"
                                animate={{ scaleX: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>

                        {/* 个人信息 */}
                        <div className="relative z-10">
                            {/* 问候语 */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.span
                                    className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 mb-2"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {new Date().getHours() < 12 ? "早上好" : new Date().getHours() < 18 ? "下午好" : "晚上好"}！
                                </motion.span>
                                
                                {/* 名字 - 二次元风格文字 */}
                                <h2 
                                    className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"
                                >
                                    {info.name}
                                </h2>
                            </motion.div>
                                
                            {/* 简介 */}
                            <motion.p
                                className="text-gray-300 mb-4 text-sm leading-relaxed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                {info.bio}
                            </motion.p>

                            {/* 社交链接 */}
                            <motion.div 
                                className="flex gap-3 mb-4 justify-center"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                {info.socialLinks.map((link, index) => (
                                    <motion.a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{
                                            y: -5,
                                            scale: 1.2,
                                            rotate: [0, -5, 5, -5, 0]
                                        }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
                                        aria-label={link.name}
                                    >
                                        <i className={`fab ${link.icon} text-lg`}></i>
                                    </motion.a>
                                ))}
                            </motion.div>

                            {/* 技能标签 */}
                            <motion.div 
                                className="flex flex-wrap gap-2 justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                {info.skills.map((skill, index) => (
                                    <motion.span
                                        key={index}
                                        className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700"
                                        whileHover={{
                                            scale: 1.05,
                                            backgroundColor: "rgba(168, 85, 247, 0.2)",
                                            borderColor: "rgba(168, 85, 247, 0.4)"
                                        }}
                                    >
                                        {skill}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};