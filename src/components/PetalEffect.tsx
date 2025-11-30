import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PetalEffectProps {
  // 可以通过props传入默认设置
  defaultSettings?: PetalSettings;
}

interface PetalSettings {
  enabled: boolean;
  count: number;
  colors: string[];
  minSize: number;
  maxSize: number;
  minSpeed: number;
  maxSpeed: number;
  wobbleIntensity: number;
  rotationSpeed: number;
  petalType: 'flower' | 'heart' | 'star' | 'snowflake';
}

// 默认设置
const DEFAULT_SETTINGS: PetalSettings = {
  enabled: true,
  count: 20,
  colors: ['#ff9cc7', '#ffd79c', '#a6c6ff', '#a6ffe8', '#ffb4a6'],
  minSize: 12,
  maxSize: 24,
  minSpeed: 20,
  maxSpeed: 60,
  wobbleIntensity: 5,
  rotationSpeed: 3,
  petalType: 'flower',
};

// 从localStorage获取保存的设置
const getSavedSettings = (): PetalSettings => {
  try {
    const saved = localStorage.getItem('petalEffectSettings');
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Failed to load petal effect settings:', error);
  }
  return DEFAULT_SETTINGS;
};

// 花瓣元素接口
interface Petal {
  id: number;
  size: number;
  speed: number;
  horizontalOffset: number;
  delay: number;
  wobbleAmount: number;
  rotationAmount: number;
  color: string;
  icon: string;
}

export const PetalEffect: React.FC<PetalEffectProps> = ({ defaultSettings }) => {
  const [settings, setSettings] = useState<PetalSettings>(() => {
    // 优先使用localStorage中的设置，其次是传入的默认设置，最后是内置默认设置
    const saved = getSavedSettings();
    return { ...saved, ...(defaultSettings || {}) };
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [petals, setPetals] = useState<Petal[]>([]);

  // 保存设置到localStorage
  useEffect(() => {
    localStorage.setItem('petalEffectSettings', JSON.stringify(settings));
  }, [settings]);

  // 生成花瓣数据
  useEffect(() => {
    if (!settings.enabled) {
      setPetals([]);
      return;
    }

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const newPetals: Petal[] = [];

    // 创建新的花瓣数据
    for (let i = 0; i < settings.count; i++) {
      // 随机属性
      const size = settings.minSize + Math.random() * (settings.maxSize - settings.minSize);
      const speed = settings.minSpeed + Math.random() * (settings.maxSpeed - settings.minSpeed);
      const horizontalOffset = Math.random() * windowWidth;
      const delay = Math.random() * 5; // 随机延迟，使花瓣不同时开始
      const wobbleAmount = settings.wobbleIntensity * (0.5 + Math.random());
      const rotationAmount = 360 * (Math.random() > 0.5 ? 1 : -1);
      const colorIndex = Math.floor(Math.random() * settings.colors.length);
      const color = settings.colors[colorIndex];

      // 使用不同的图标表示不同类型的花瓣
      let icon = '';
      switch (settings.petalType) {
        case 'heart':
          icon = 'fa-heart';
          break;
        case 'star':
          icon = 'fa-star';
          break;
        case 'snowflake':
          icon = 'fa-snowflake';
          break;
        case 'flower':
        default:
          icon = 'fa-leaf'; // 用叶子图标表示花瓣
          break;
      }

      newPetals.push({
        id: i,
        size,
        speed,
        horizontalOffset,
        delay,
        wobbleAmount,
        rotationAmount,
        color,
        icon
      });
    }

    setPetals(newPetals);
  }, [settings]);

  // 处理设置更改
  const handleSettingChange = (key: keyof PetalSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // 切换控制面板显示
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  // 预设的颜色主题
  const colorThemes = [
    { name: '樱花粉', colors: ['#ff9cc7', '#ffd79c', '#ffb4a6'] },
    { name: '彩虹', colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9c74f', '#90be6d'] },
    { name: '冬雪', colors: ['#e0fbfc', '#c2dfe3', '#9db4c0', '#5c6b73'] },
    { name: '秋叶', colors: ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d'] },
  ];

  // 切换预设主题
  const applyTheme = (theme: typeof colorThemes[0]) => {
    setSettings(prev => ({ ...prev, colors: theme.colors }));
  };

  return (
    <>
      {/* 花瓣容器 - 显示在最顶层 */}
      <div className="fixed inset-0 z-[999999] pointer-events-none overflow-hidden">
        {settings.enabled && petals.map((petal) => (
          <motion.div
            key={petal.id}
            className="absolute pointer-events-none"
            style={{
              color: petal.color,
              fontSize: `${petal.size}px`,
              left: `${petal.horizontalOffset}px`,
              top: `-${petal.size}px`, // 初始位置在屏幕顶部外
            }}
            initial={{ 
              y: -petal.size, // 从屏幕顶部外开始
              opacity: 0 
            }}
            animate={{ 
              y: window.innerHeight + petal.size, // 飘落到屏幕底部外
              x: [0, petal.wobbleAmount, -petal.wobbleAmount, petal.wobbleAmount, -petal.wobbleAmount, 0], // 左右摆动
              rotate: petal.rotationAmount, // 旋转
              opacity: [1, 1, 0.8, 0.6, 0.3, 0] // 逐渐消失
            }}
            transition={{
              duration: petal.speed, // 飘落速度
              delay: petal.delay, // 随机延迟
              ease: "easeInOut",
              times: [0, 0.2, 0.4, 0.6, 0.8, 1], // 动画关键点时间
              repeat: Infinity, // 无限重复
              repeatDelay: Math.random() * 2, // 重复延迟
            }}
          >
            <i className={`fas ${petal.icon}`}></i>
          </motion.div>
        ))}
      </div>

      {/* 控制面板按钮 - 显示在花瓣容器之上 */}
      <motion.button
        onClick={togglePanel}
        className={`fixed top-20 right-4 z-[1000000] p-3 rounded-full shadow-lg flex items-center justify-center transition-all duration-300
          ${settings.enabled ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white' : 'bg-gray-800 text-gray-300'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        aria-label={settings.enabled ? "关闭花瓣效果" : "开启花瓣效果"}
      >
        {settings.enabled ? (
          <i className="fas fa-leaf-slash text-xl"></i>
        ) : (
          <i className="fas fa-leaf text-xl"></i>
        )}
      </motion.button>

      {/* 控制面板 */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed top-32 right-4 z-[1000000] w-80 bg-gray-900/95 backdrop-blur-lg rounded-2xl p-4 border border-gray-800 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">花瓣飘落效果</h3>
              <button 
                onClick={togglePanel}
                className="text-gray-400 hover:text-white p-1"
                aria-label="关闭"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* 开关 */}
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-gray-400">开启效果</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer ${
                  settings.enabled ? 'bg-green-500' : 'bg-gray-700'
                } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
              </label>
            </div>

            {/* 花瓣数量 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-400">花瓣数量</label>
                <span className="text-sm text-gray-400">{settings.count}</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={settings.count}
                onChange={(e) => handleSettingChange('count', parseInt(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            {/* 花瓣大小范围 */}
            <div className="mb-4">
              <label className="text-sm text-gray-400 block mb-1">花瓣大小</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">最小</span>
                    <span className="text-xs text-gray-500">{settings.minSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={settings.minSize}
                    onChange={(e) => handleSettingChange('minSize', parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-pink-500"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">最大</span>
                    <span className="text-xs text-gray-500">{settings.maxSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="40"
                    value={settings.maxSize}
                    onChange={(e) => handleSettingChange('maxSize', parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* 飘落速度 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-400">飘落速度</label>
                <span className="text-sm text-gray-400">
                  {settings.minSpeed.toFixed(0)}s - {settings.maxSpeed.toFixed(0)}s
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={settings.minSpeed + (settings.maxSpeed - settings.minSpeed)}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  const min = Math.max(5, value - 20);
                  const max = Math.min(100, value);
                  handleSettingChange('minSpeed', min);
                  handleSettingChange('maxSpeed', max);
                }}
                className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            {/* 摆动强度 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-400">摆动强度</label>
                <span className="text-sm text-gray-400">{settings.wobbleIntensity}</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={settings.wobbleIntensity}
                onChange={(e) => handleSettingChange('wobbleIntensity', parseInt(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            {/* 旋转速度 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-400">旋转速度</label>
                <span className="text-sm text-gray-400">{settings.rotationSpeed}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.rotationSpeed}
                onChange={(e) => handleSettingChange('rotationSpeed', parseInt(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            {/* 花瓣类型 */}
            <div className="mb-4">
              <label className="text-sm text-gray-400 block mb-1">花瓣类型</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { type: 'flower', icon: 'fa-leaf', label: '花瓣' },
                  { type: 'heart', icon: 'fa-heart', label: '心形' },
                  { type: 'star', icon: 'fa-star', label: '星星' },
                  { type: 'snowflake', icon: 'fa-snowflake', label: '雪花' },
                ].map(option => (
                  <motion.button
                    key={option.type}
                    onClick={() => handleSettingChange('petalType', option.type)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                      settings.petalType === option.type
                        ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className={`fas ${option.icon} text-xl mb-1`}></i>
                    <span className="text-xs">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 颜色主题 */}
            <div className="mb-2">
              <label className="text-sm text-gray-400 block mb-1">颜色主题</label>
              <div className="grid grid-cols-2 gap-2">
                {colorThemes.map((theme, index) => (
                  <motion.button
                    key={index}
                    onClick={() => applyTheme(theme)}
                    className="flex items-center justify-center p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{theme.name}</span>
                    <div className="ml-2 flex gap-0.5">
                      {theme.colors.slice(0, 3).map((color, i) => (
                        <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                      ))}
                      {theme.colors.length > 3 && <span className="text-xs">+{theme.colors.length - 3}</span>}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}