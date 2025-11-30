import React, { useState, useContext, useEffect } from 'react';
  import { useTheme } from '../hooks/useTheme';
  import { LinkCard } from '../components/LinkCard';
  import { Profile } from '../components/Profile';
  import { BlogHeader } from '../components/BlogHeader';
  import { CategorySection } from '../components/CategorySection';
  import { Footer } from '../components/Footer';
  import { ProxyContext } from '../App';
  import { BackgroundSelector } from '../components/BackgroundSelector';
  import { MusicPlayer } from '../components/MusicPlayer';
  import { useBackground } from '../contexts/BackgroundContext';
  import { useMusic } from '../contexts/MusicContext';
  import { CustomLinkManager } from '../components/CustomLinkManager';
  import { AvatarSelector } from '../components/AvatarSelector';
  import { NegativeOnePage } from '../components/NegativeOnePage';

  // 导航链接数据 - 在这里修改您想要展示的链接
  // 每个链接包含：id(唯一标识)、title(显示名称)、url(跳转地址)、icon(图标类名)、category(所属分类)、needProxy(是否可能需要代理)
  const navigationLinks = [
    { id: 1, title: '摸鱼', url: 'https://moyugongju.com/?section=15-section', icon: 'fa-home', category: '个人', needProxy: false },
    { id: 2, title: '开发者导航', url: 'https://codernav.com/', icon: 'fa-briefcase', category: '个人', needProxy: false },
    { id: 3, title: '技术博客', url: 'https://example.com/blog', icon: 'fa-code', category: '技术', needProxy: false },
    { id: 4, title: 'GitHub', url: 'https://github.com', icon: 'fa-github', category: '开发', needProxy: true },
    { id: 5, title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'fa-stack-overflow', category: '开发', needProxy: true },
    { id: 6, title: '掘金', url: 'https://juejin.cn', icon: 'fa-fire', category: '技术', needProxy: false },
    { id: 7, title: '知乎', url: 'https://zhihu.com', icon: 'fa-question-circle', category: '知识', needProxy: false },
    { id: 8, title: 'B站', url: 'https://bilibili.com', icon: 'fa-play-circle', category: '娱乐', needProxy: false },
    { id: 9, title: 'Steam', url: 'https://store.steampowered.com', icon: 'fa-steam', category: '游戏', needProxy: true },
    { id: 10, title: 'Epic Games', url: 'https://store.epicgames.com', icon: 'fa-gamepad', category: '游戏', needProxy: true },
    { id: 11, title: '游戏资源', url: 'https://www.kdocs.cn/l/cjg28ixQSgd7', icon: 'fa-newspaper', category: '游戏', needProxy: true },
    { id: 12, title: '还是资源', url: 'https://www.kdocs.cn/l/cjg28ixQSgd7', icon: 'fa-mobile-alt', category: '游戏', needProxy: false },
  ];

  // 分类数据 - 在这里修改您想要使用的分类
  // 每个分类包含：id(唯一标识)、name(分类名称)、icon(分类图标)、color(分类颜色)
  const categories = [
    { id: 'personal', name: '个人', icon: 'fa-user', color: 'bg-purple-500' },
    { id: 'tech', name: '技术', icon: 'fa-laptop-code', color: 'bg-blue-500' },
    { id: 'dev', name: '开发', icon: 'fa-terminal', color: 'bg-green-500' },
    { id: 'knowledge', name: '知识', icon: 'fa-book', color: 'bg-amber-500' },
    { id: 'entertainment', name: '娱乐', icon: 'fa-film', color: 'bg-pink-500' },
    { id: 'gaming', name: '游戏', icon: 'fa-gamepad', color: 'bg-indigo-500' },
  ];

  // 个性化内容数据 - 在这里修改您的个人信息
  const personalInfo = {
    name: 'CZHYZX', // 您的名字
    bio: '抽象 | 鼠鼠我啊 | 终身学习者 | 疑似二次元', // 您的简介
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Anime%20style%20portrait%20of%20a%20young%20Asian%20man%2C%20modern%20hairstyle%2C%20smiling%2C%20colorful%20eyes%2C%20digital%20art%2C%20detailed%20features&sign=a6b3ac17e354ddd6b2896d2fb198c139', // 二次元风格头像
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Anime%20style%20digital%20art%20workspace%2C%20colorful%20neon%20lights%2C%20cyberpunk%20elements%2C%20cozy%20atmosphere%2C%20detailed%20background&sign=c0734eb4b6f44369d66368e58d3b41ff', // 二次元风格背景
    socialLinks: [ // 您的社交媒体链接
      { name: 'Twitter', url: 'https://twitter.com', icon: 'fa-twitter' },
      { name: '微博（无）', url: 'https://weibo.com', icon: 'fa-weibo' },
      { name: 'B站', url: 'https://space.bilibili.com/492508801?spm_id_from=333.1007.0.0', icon: 'fa-bilibili' },
    ],
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'UI Design', 'ACG文化', '二次元'], // 您的技能标签
  };

  export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { useProxy, setUseProxy } = useContext(ProxyContext);
  const { backgroundImage, isBackgroundFixed, backgroundOpacity, backgroundBlendMode } = useBackground();
  const { playTrack } = useMusic();
  const [customLinks, setCustomLinks] = useState<Array<{
    id: string;
    title: string;
    url: string;
    icon: string;
    category: string;
    needProxy?: boolean;
  }>>([]);
  
  // 负一页面状态管理
  const [isNegativeOnePageVisible, setIsNegativeOnePageVisible] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  
  // 监听音乐播放请求事件
  useEffect(() => {
    const handleMusicPlayRequest = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.trackIndex === 'number') {
        playTrack(customEvent.detail.trackIndex);
      }
    };
    
    window.addEventListener('musicPlayRequest', handleMusicPlayRequest);
    
    return () => {
      window.removeEventListener('musicPlayRequest', handleMusicPlayRequest);
    };
  }, [playTrack]);
  
  // 加载自定义链接
  useEffect(() => {
    const loadCustomLinks = () => {
      const savedLinks = localStorage.getItem('customLinks');
      if (savedLinks) {
        try {
          const parsedLinks = JSON.parse(savedLinks).map((link: any) => ({
            ...link,
            needProxy: false // 默认不需要代理
          }));
          // 过滤掉可能存在的重复链接或无效链接
          const validLinks = parsedLinks.filter((link: any) => 
            link.id && link.title && link.url && link.category && 
            // 确保分类是有效的
            categories.some(cat => cat.name === link.category)
          );
          setCustomLinks(validLinks);
        } catch (error) {
          console.error('加载自定义链接失败:', error);
        }
      }
    };
    
    // 初始加载
    loadCustomLinks();
    
    // 监听自定义链接更新事件
    window.addEventListener('customLinksUpdated', loadCustomLinks);
    
    return () => {
      window.removeEventListener('customLinksUpdated', loadCustomLinks);
    };
  }, []);
  
  // 处理热模块替换（HMR）
  useEffect(() => {
    if (import.meta.hot) {
      // 监听导航链接数据变化，实现热更新
      import.meta.hot.accept((newModule) => {
        if (newModule && newModule.default !== Home) {
          // 在开发环境中，当组件更新时重新渲染
          console.log('Home component updated via HMR');
        }
      });
    }
  }, []);
  
  // 触摸事件处理 - 用于移动设备
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0) {
      setStartY(e.touches[0].clientY);
      setCurrentY(e.touches[0].clientY);
      setIsTracking(true);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isTracking) {
      setCurrentY(e.touches[0].clientY);
      const diff = startY - currentY;
      
      // 当用户在顶部向下滑动超过100px时，显示负一页面
      if (diff < -100 && !isNegativeOnePageVisible) {
        setIsNegativeOnePageVisible(true);
      }
    }
  };
  
  const handleTouchEnd = () => {
    if (isTracking) {
      setIsTracking(false);
      
      // 当释放触摸时，如果滑动距离不足，则不显示负一页面
      const diff = startY - currentY;
      if (diff >= -100 && isNegativeOnePageVisible) {
        setIsNegativeOnePageVisible(false);
      }
    }
  };
  
  // 鼠标滚轮事件处理 - 用于桌面设备
  const handleWheel = (e: React.WheelEvent) => {
    // 只有当页面已经滚动到顶部，并且用户还在尝试向上滚动时才触发负一页面
    if (window.scrollY <= 0 && e.deltaY < 0) {
      setIsNegativeOnePageVisible(true);
    }
    
    // 当在负一页面中向下滚动时，隐藏负一页面
    if (isNegativeOnePageVisible && e.deltaY > 0) {
      setIsNegativeOnePageVisible(false);
    }
  };
  
  // 合并默认链接和自定义链接
  const allLinks = [...navigationLinks, ...customLinks];
  
  // 根据分类筛选链接
  const filteredLinks = activeCategory 
    ? allLinks.filter(link => link.category.toLowerCase() === activeCategory.toLowerCase())
    : allLinks;
  
  // 按分类分组链接
  const linksByCategory = allLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, typeof navigationLinks>);

  // 设置背景样式
  const backgroundStyle = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundAttachment: isBackgroundFixed ? 'fixed' : 'scroll',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: backgroundOpacity,
    filter: 'blur(4px)',
    mixBlendMode: backgroundBlendMode,
  };

  return (
    <div 
      className="relative min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* 背景层 */}
      {backgroundImage && (
        <div 
          className="fixed inset-0 z-0 bg-black"
          style={backgroundStyle}
        />
      )}
      
      {/* 负一页面 */}
      <NegativeOnePage isVisible={isNegativeOnePageVisible} />
      
      {/* 主内容容器 - 透明背景 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 头部区域 */}
        <BlogHeader onToggleTheme={toggleTheme} currentTheme={theme} />
        
         {/* 主体内容区 - 左右布局 */}
        <div className="flex-grow flex flex-col lg:flex-row">
           {/* 左侧：个人资料区域和音乐播放器 */}
          <div className="lg:w-1/3 xl:w-1/4 p-4 lg:sticky lg:top-24 lg:self-start space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-1 border border-gray-800 shadow-xl">
              <Profile info={personalInfo} />
            </div>
            
            {/* 音乐播放器 */}
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-1 border border-gray-800 shadow-xl z-10 relative">
              <MusicPlayer />
            </div>
          </div>
          
          {/* 右侧：主要内容区 */}
          <div className="flex-grow">
            {/* 代理设置切换 */}
            <div className="px-4 py-3 bg-gray-800/50 backdrop-blur-sm">
              <div className="container mx-auto flex items-center justify-center gap-3">
                <i className="fas fa-shield-alt text-blue-400"></i>
                <span className="text-sm">代理模式</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={useProxy}
                    onChange={(e) => setUseProxy(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full peer ${useProxy ? 'bg-green-500' : 'bg-gray-700'} peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
                <span className="text-xs text-gray-400">
                  {useProxy ? '已开启 - 访问部分站点会通过代理' : '已关闭 - 直接访问所有站点'}
                </span>
              </div>
            </div>
            
            {/* 分类筛选 */}
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                <button 
                  onClick={() => setActiveCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === null 
                      ? 'bg-primary text-white shadow-md' 
                      : theme === 'dark' 
                        ? 'bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm' 
                        : 'bg-gray-200/80 hover:bg-gray-300/80 backdrop-blur-sm'
                  }`}
                >
                  全部
                </button>
                {categories.map(category => (
                  <button 
                    key={category.id}
                    onClick={() => setActiveCategory(category.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      activeCategory === category.name 
                        ? `${category.color} text-white shadow-md` 
                        : theme === 'dark' 
                          ? 'bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm' 
                          : 'bg-gray-200/80 hover:bg-gray-300/80 backdrop-blur-sm'
                    }`}
                  >
                    <i className={`fas ${category.icon}`}></i>
                    {category.name}
                  </button>
                ))}
              </div>
              
              {/* 链接卡片展示 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredLinks.map(link => (
                  <LinkCard key={link.id} link={link} />
                ))}
              </div>
            </div>
            
            {/* 分类区块展示 */}
            {Object.entries(linksByCategory).map(([category, links]) => (
              <CategorySection 
                key={category} 
                title={category} 
                links={links} 
                icon={categories.find(c => c.name === category)?.icon || 'fa-folder'}
              />
            ))}
          </div>
        </div>
        
        {/* 页脚 */}
        <Footer year={new Date().getFullYear()} />
        
         {/* 背景选择器 */}
         <BackgroundSelector />
         
         {/* 头像选择器 */}
         <AvatarSelector />
         
          {/* 音乐播放器已移至左侧个人资料下方 */}
         
         {/* 自定义链接管理器 */}
         <CustomLinkManager />
       </div>
     </div>
   );
}