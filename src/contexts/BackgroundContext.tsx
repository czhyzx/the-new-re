import React, { createContext, useState, useContext, ReactNode } from 'react';

interface BackgroundContextType {
  backgroundImage: string | null;
  setBackgroundImage: (image: string | null) => void;
  isBackgroundFixed: boolean;
  setIsBackgroundFixed: (fixed: boolean) => void;
  backgroundOpacity: number;
  setBackgroundOpacity: (opacity: number) => void;
  backgroundBlendMode: 'normal' | 'multiply' | 'screen' | 'overlay';
  setBackgroundBlendMode: (mode: 'normal' | 'multiply' | 'screen' | 'overlay') => void;
  availableBackgrounds: string[];
}

// 创建背景上下文
export const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

interface BackgroundProviderProps {
  children: ReactNode;
}

// 预设背景图片
const PRESET_BACKGROUNDS = [
  'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Anime%20style%20digital%20art%20workspace%2C%20colorful%20neon%20lights%2C%20cyberpunk%20elements%2C%20cozy%20atmosphere%2C%20detailed%20background&sign=c0734eb4b6f44369d66368e58d3b41ff',
  'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Anime%20scenery%20with%20cherry%20blossom%2C%20spring%20season%2C%20colorful%20sky%2C%20digital%20art&sign=9d93a9da4215ea8429c933c72df97cb9',
  'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Anime%20night%20sky%20with%20stars%2C%20galaxy%20background%2C%20vibrant%20colors%2C%20digital%20art&sign=cff2a6cbc829e3b9875fa7aaac69c40f',
  'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Anime%20city%20scape%20with%20neon%20lights%2C%20rainy%20atmosphere%2C%20cyberpunk%20vibe%2C%20digital%20art&sign=f4bb6ca639edb9942118da51c75f3f0d',
];

export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({ children }) => {
  // 从localStorage获取保存的背景设置
  const savedBackground = localStorage.getItem('backgroundImage');
  const savedFixed = localStorage.getItem('backgroundFixed') === 'true';
  const savedOpacity = parseFloat(localStorage.getItem('backgroundOpacity') || '0.2');
  const savedBlendMode = (localStorage.getItem('backgroundBlendMode') as 'normal' | 'multiply' | 'screen' | 'overlay') || 'normal';

  const [backgroundImage, setBackgroundImage] = useState<string | null>(savedBackground || PRESET_BACKGROUNDS[0]);
  const [isBackgroundFixed, setIsBackgroundFixed] = useState<boolean>(savedFixed);
  const [backgroundOpacity, setBackgroundOpacity] = useState<number>(savedOpacity);
  const [backgroundBlendMode, setBackgroundBlendMode] = useState<'normal' | 'multiply' | 'screen' | 'overlay'>(savedBlendMode);

  // 保存背景设置到localStorage
  useState(() => {
    const saveToLocalStorage = () => {
      localStorage.setItem('backgroundImage', backgroundImage || '');
      localStorage.setItem('backgroundFixed', isBackgroundFixed.toString());
      localStorage.setItem('backgroundOpacity', backgroundOpacity.toString());
      localStorage.setItem('backgroundBlendMode', backgroundBlendMode);
    };

    // 监听状态变化并保存
    setBackgroundImage(prev => {
      saveToLocalStorage();
      return prev;
    });

    return () => {
      // 组件卸载时保存
      saveToLocalStorage();
    };
  });

  const value: BackgroundContextType = {
    backgroundImage,
    setBackgroundImage,
    isBackgroundFixed,
    setIsBackgroundFixed,
    backgroundOpacity,
    setBackgroundOpacity,
    backgroundBlendMode,
    setBackgroundBlendMode,
    availableBackgrounds: PRESET_BACKGROUNDS,
  };
  
  // 处理热模块替换（HMR）
  if (import.meta.hot) {
    import.meta.hot.accept();
  }

  return (
    <BackgroundContext.Provider value={value}>
      {children}
    </BackgroundContext.Provider>
  );
};

// 自定义Hook方便使用背景上下文
export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};