import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { useState, createContext } from "react";
import { AuthContext } from '@/contexts/authContext';
import { BackgroundProvider } from '@/contexts/BackgroundContext';
  import { MusicProvider } from '@/contexts/MusicContext';
  import { AvatarProvider } from '@/contexts/AvatarContext';
  import { PetalEffect } from '@/components/PetalEffect';

// 创建代理设置上下文
interface ProxySettings {
  useProxy: boolean;
  setUseProxy: (value: boolean) => void;
  proxyUrl?: string;
  setProxyUrl: (value: string) => void;
}

export const ProxyContext = createContext<ProxySettings>({
  useProxy: false,
  setUseProxy: () => {},
  proxyUrl: '/proxy?url=', // 使用相对路径的代理设置
  setProxyUrl: () => {},
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [useProxy, setUseProxy] = useState(false);
  const [proxyUrl, setProxyUrl] = useState('/proxy?url='); // 使用相对路径的代理设置

  const logout = () => {
    setIsAuthenticated(false);
  };

  // 处理热模块替换（HMR）
  if (import.meta.hot) {
    import.meta.hot.accept();
    import.meta.hot.dispose(() => {
      // 清理资源，确保热更新时不会有内存泄漏
      console.log('App component disposed for HMR');
    });
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <BackgroundProvider>
        <MusicProvider>
          <AvatarProvider>
            <ProxyContext.Provider
              value={{ useProxy, setUseProxy, proxyUrl, setProxyUrl }}
            >
              {/* 花瓣效果组件 */}
              <PetalEffect />
              
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
              </Routes>
            </ProxyContext.Provider>
          </AvatarProvider>
        </MusicProvider>
      </BackgroundProvider>
    </AuthContext.Provider>
  );
}
