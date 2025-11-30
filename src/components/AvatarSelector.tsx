import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAvatar } from '../contexts/AvatarContext';
import { toast } from 'sonner';

export const AvatarSelector: React.FC = () => {
  const { 
    avatarImage, 
    setAvatarImage, 
    availableAvatars
  } = useAvatar();
  
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 选择预设头像
  const selectAvatar = (imageUrl: string) => {
    setAvatarImage(imageUrl);
    toast('头像已更换');
    setIsOpen(false);
  };

  // 上传自定义头像
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 检查文件大小，限制为2MB
      if (file.size > 2 * 1024 * 1024) {
        toast('文件大小不能超过2MB');
        return;
      }
      
      // 检查文件类型是否为图片
      if (!file.type.startsWith('image/')) {
        toast('请选择图片文件');
        return;
      }

      // 创建临时URL
      const imageUrl = URL.createObjectURL(file);
      setAvatarImage(imageUrl);
      toast('自定义头像已上传');
      
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

  // 重置头像
  const resetAvatar = () => {
    setAvatarImage(availableAvatars[0]);
    toast('头像已重置');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-28 z-50">
      {/* 主按钮 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full shadow-lg flex items-center justify-center
          ${avatarImage 
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
            : 'bg-gray-800 text-gray-300'
          }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        aria-label="更换头像"
      >
        <i className="fas fa-user-edit text-xl"></i>
      </motion.button>

      {/* 头像选择面板 */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-full right-0 mb-2 w-80 bg-gray-900/95 backdrop-blur-lg rounded-2xl p-4 border border-gray-800 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">更换头像</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1"
              aria-label="关闭"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* 预设头像选择 */}
          <div className="mb-4">
            <h4 className="text-sm text-gray-400 mb-2">预设头像</h4>
            <div className="grid grid-cols-4 gap-2">
              {availableAvatars.map((avatar, index) => (
                <motion.div
                  key={index}
                  className={`relative rounded-lg overflow-hidden cursor-pointer border-2 ${
                    avatarImage === avatar ? 'border-blue-500' : 'border-transparent'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectAvatar(avatar)}
                >
                  <img 
                    src={avatar} 
                    alt={`预设头像 ${index + 1}`} 
                    className="w-full h-20 object-cover"
                  />
                  {avatarImage === avatar && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <i className="fas fa-check text-white text-xl"></i>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* 自定义头像上传 */}
          <div className="mb-4">
            <h4 className="text-sm text-gray-400 mb-2">自定义头像</h4>
            <motion.button
              onClick={openFileDialog}
              className="w-full py-2 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
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

          {/* 重置头像按钮 */}
          <motion.button
            onClick={resetAvatar}
            className="w-full mt-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <i className="fas fa-undo-alt mr-2"></i> 重置头像
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};