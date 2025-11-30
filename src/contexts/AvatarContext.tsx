import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AvatarContextType {
  avatarImage: string;
  setAvatarImage: (image: string) => void;
  availableAvatars: string[];
}

// 创建头像上下文
export const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

interface AvatarProviderProps {
  children: ReactNode;
}

// 预设头像图片
const PRESET_AVATARS = [
  'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Anime%20style%20portrait%20of%20a%20young%20Asian%20man%2C%20modern%20hairstyle%2C%20smiling%2C%20colorful%20eyes%2C%20digital%20art%2C%20detailed%20features&sign=a6b3ac17e354ddd6b2896d2fb198c139',
  'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Anime%20style%20portrait%20of%20a%20cool%20character%2C%20digital%20art&sign=69e281b5eb4168492f4a048dc22e4075',
  'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Anime%20style%20portrait%20of%20a%20happy%20character%2C%20digital%20art&sign=aa862a6a7cb7378359b8997af410a42a',
  'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=Anime%20style%20portrait%20of%20a%20mystery%20character%2C%20digital%20art&sign=b5011a91bbe22b4e85207378e6be194f',
];

export const AvatarProvider: React.FC<AvatarProviderProps> = ({ children }) => {
  // 从localStorage获取保存的头像设置
  const savedAvatar = localStorage.getItem('avatarImage') || PRESET_AVATARS[0];

  const [avatarImage, setAvatarImage] = useState<string>(savedAvatar);

  // 保存头像设置到localStorage
  useState(() => {
    const saveToLocalStorage = () => {
      localStorage.setItem('avatarImage', avatarImage);
    };

    // 监听状态变化并保存
    setAvatarImage(prev => {
      saveToLocalStorage();
      return prev;
    });

    return () => {
      // 组件卸载时保存
      saveToLocalStorage();
    };
  });

  const value: AvatarContextType = {
    avatarImage,
    setAvatarImage,
    availableAvatars: PRESET_AVATARS,
  };
  
  // 处理热模块替换（HMR）
  if (import.meta.hot) {
    import.meta.hot.accept();
  }

  return (
    <AvatarContext.Provider value={value}>
      {children}
    </AvatarContext.Provider>
  );
};

// 自定义Hook方便使用头像上下文
export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (context === undefined) {
    throw new Error('useAvatar must be used within a AvatarProvider');
  }
  return context;
};