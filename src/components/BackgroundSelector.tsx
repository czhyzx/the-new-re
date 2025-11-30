import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useBackground } from '../contexts/BackgroundContext';
import { toast } from 'sonner';

export const BackgroundSelector: React.FC = () => {
  const { 
    backgroundImage, 
    setBackgroundImage, 
    isBackgroundFixed, 
    setIsBackgroundFixed, 
    backgroundOpacity, 
    setBackgroundOpacity, 
    backgroundBlendMode, 
    setBackgroundBlendMode,
    availableBackgrounds
  } = useBackground();
  
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 选择预设背景
  const selectBackground = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
    toast('背景已更换');
    setIsOpen(false);
  };

  // 上传自定义背景
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 检查文件大小，限制为5MB
      if (file.size > 5 * 1024 * 1024) {
        toast('文件大小不能超过5MB');
        return;
      }
      
      // 检查文件类型是否为图片
      if (!file.type.startsWith('image/')) {
        toast('请选择图片文件');
        return;
      }

      // 创建临时URL
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
      toast('自定义背景已上传');
      
      // 重置文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setIsOpen(false);
    }
  };

  // 打开文件选择对话框
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 移除背景
  const removeBackground = () => {
    setBackgroundImage(null);
    toast('背景已移除');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* 主按钮 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full shadow-lg flex items-center justify-center
          ${backgroundImage 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
            : 'bg-gray-800 text-gray-300'
          }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        aria-label="更换背景"
      >
        <i className="fas fa-image text-xl"></i>
      </motion.button>

      {/* 背景选择面板 */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-full right-0 mb-2 w-80 bg-gray-900/95 backdrop-blur-lg rounded-2xl p-4 border border-gray-800 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">更换背景</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1"
              aria-label="关闭"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* 预设背景选择 */}
          <div className="mb-4">
            <h4 className="text-sm text-gray-400 mb-2">预设背景</h4>
            <div className="grid grid-cols-2 gap-2">
              {availableBackgrounds.map((bg, index) => (
                <motion.div
                  key={index}
                  className={`relative rounded-lg overflow-hidden cursor-pointer border-2 ${
                    backgroundImage === bg ? 'border-purple-500' : 'border-transparent'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectBackground(bg)}
                >
                  <img 
                    src={bg} 
                    alt={`预设背景 ${index + 1}`} 
                    className="w-full h-20 object-cover"
                  />
                  {backgroundImage === bg && (
                    <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                      <i className="fas fa-check text-white text-xl"></i>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* 自定义背景上传 */}
          <div className="mb-4">
            <h4 className="text-sm text-gray-400 mb-2">自定义背景</h4>
            <motion.button
              onClick={openFileDialog}
              className="w-full py-2 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <i className="fas fa-upload mr-2"></i> 上传图片
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* 背景设置 */}
          <div className="space-y-3">
            {/* 背景透明度 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-400">透明度</label>
                <span className="text-sm text-gray-400">{Math.round(backgroundOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={backgroundOpacity}
                onChange={(e) => setBackgroundOpacity(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* 固定背景 */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">固定背景</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBackgroundFixed}
                  onChange={(e) => setIsBackgroundFixed(e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer ${
                  isBackgroundFixed ? 'bg-purple-500' : 'bg-gray-700'
                } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
              </label>
            </div>

            {/* 混合模式 */}
            <div>
              <label className="text-sm text-gray-400 block mb-1">混合模式</label>
              <select
                value={backgroundBlendMode}
                onChange={(e) => setBackgroundBlendMode(e.target.value as 'normal' | 'multiply' | 'screen' | 'overlay')}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg text-sm text-white py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="normal">正常</option>
                <option value="multiply">正片叠底</option>
                <option value="screen">滤色</option>
                <option value="overlay">叠加</option>
              </select>
            </div>
          </div>

          {/* 移除背景按钮 */}
          {backgroundImage && (
            <motion.button
              onClick={removeBackground}
              className="w-full mt-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <i className="fas fa-trash-alt mr-2"></i> 移除背景
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
};