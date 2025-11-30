import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMusic } from '../contexts/MusicContext';
import { toast } from 'sonner';

export const MusicPlayer: React.FC = () => {
  const {
    tracks,
    currentTrackIndex,
    isPlaying,
    volume,
    currentTime,
    duration,
    addTrack,
    addExternalTrack,
    removeTrack,
    playTrack,
    pauseTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    setVolume,
    setCurrentTime
  } = useMusic();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const [showAddExternalForm, setShowAddExternalForm] = useState(false);
  const [externalTrackForm, setExternalTrackForm] = useState({
    name: '',
    artist: '',
    url: '',
    source: 'netease' as 'netease' | 'kugou' | 'qqmusic' | 'other'
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 当前播放的轨道
  const currentTrack = currentTrackIndex !== null ? tracks[currentTrackIndex] : null;

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      addTrack(file);
      
      // 重置文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 打开文件选择对话框
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 格式化时间显示
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 获取音乐源图标
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'netease':
        return 'fa-music';
      case 'kugou':
        return 'fa-headphones';
      case 'qqmusic':
        return 'fa-microphone-alt';
      case 'local':
        return 'fa-file-audio';
      default:
        return 'fa-link';
    }
  };

  // 处理外部音乐表单提交
  const handleAddExternalTrack = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!externalTrackForm.name || !externalTrackForm.url) {
      toast('请填写音乐名称和URL');
      return;
    }
    
    // 验证URL
    try {
      new URL(externalTrackForm.url);
    } catch (error) {
      toast('请输入有效的URL地址');
      return;
    }
    
    addExternalTrack({
      name: externalTrackForm.name,
      artist: externalTrackForm.artist,
      url: externalTrackForm.url,
      source: externalTrackForm.source
    });
    
    // 重置表单
    setExternalTrackForm({
      name: '',
      artist: '',
      url: '',
      source: 'netease'
    });
    setShowAddExternalForm(false);
  };

  // 渲染播放列表
  const renderPlaylist = () => {
    if (tracks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-6 text-gray-400">
          <i className="fas fa-music text-4xl mb-3 opacity-50"></i>
          <p className="text-sm">暂无音乐</p>
          <div className="flex gap-2 mt-3">
            <motion.button
              onClick={openFileDialog}
              className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-upload mr-1"></i>导入音乐
            </motion.button>
            <motion.button
              onClick={() => setShowAddExternalForm(true)}
              className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-plus mr-1"></i>添加外部链接
            </motion.button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-h-64 overflow-y-auto no-scrollbar">
        {tracks.map((track, index) => (
          <motion.div
            key={track.id}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
              currentTrackIndex === index 
                ? 'bg-purple-500/20 text-purple-300' 
                : 'text-gray-300 hover:bg-gray-800/50'
            }`}
            whileHover={{ x: 4 }}
            onClick={() => {
              // 如果点击的是当前播放的轨道，则切换播放状态；否则播放新轨道
              if (currentTrackIndex === index) {
                togglePlay();
              } else {
                playTrack(index);
              }
            }}
          >
            <div className="flex items-center flex-1 min-w-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                currentTrackIndex === index ? 'bg-purple-500' : 'bg-gray-700'
              }`}>
                {currentTrackIndex === index && isPlaying ? (
                  <i className="fas fa-pause text-xs"></i>
                ) : (
                  <i className="fas fa-play text-xs"></i>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{track.name}</p>
                {track.artist && (
                  <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                )}
                {track.source === 'local' && track.file && (
                  <p className="text-xs text-gray-500 truncate">{(track.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                )}
              </div>
              {track.source !== 'local' && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-300">
                  <i className={`fas ${getSourceIcon(track.source)} mr-1`}></i>
                  {track.source === 'netease' ? '网易云' : 
                   track.source === 'kugou' ? '酷狗' : 
                   track.source === 'qqmusic' ? 'QQ音乐' : '外部链接'}
                </span>
              )}
            </div>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                removeTrack(track.id);
              }}
              className="text-gray-500 hover:text-red-400 p-1"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fas fa-times"></i>
            </motion.button>
          </motion.div>
        ))}
      </div>
    );
  };

  // 计算进度百分比
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // 处理进度条拖动
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value) / 100 * duration;
    setCurrentTime(newTime);
  };

  // 获取轨道总大小（仅用于本地文件）
  const getTotalSize = () => {
    const localTracks = tracks.filter(track => track.source === 'local' && track.file);
    return localTracks.reduce((total, track) => total + track.file!.size, 0);
  };

  return (
    <div className="w-full bg-gray-900/80 backdrop-blur-md rounded-2xl p-4 border border-gray-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <i className="fas fa-music text-purple-400"></i>
          音乐播放器
        </h3>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </motion.button>
      </div>

      {/* 当前播放信息和进度条 */}
      {currentTrack && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                currentTrack.coverUrl 
                  ? 'overflow-hidden' 
                  : 'bg-gradient-to-br from-purple-600 to-pink-600'
              }`}>
                {currentTrack.coverUrl ? (
                  <img src={currentTrack.coverUrl} alt={currentTrack.name} className="w-full h-full object-cover" />
                ) : (
                  <i className="fas fa-music text-white"></i>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{currentTrack.name}</p>
                {currentTrack.artist && (
                  <p className="text-xs text-gray-400 truncate">{currentTrack.artist}</p>
                )}
              </div>
              {currentTrack.source !== 'local' && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-300 whitespace-nowrap">
                  {currentTrack.source === 'netease' ? '网易云' : 
                   currentTrack.source === 'kugou' ? '酷狗' : 
                   currentTrack.source === 'qqmusic' ? 'QQ音乐' : '外部链接'}
                </span>
              )}
            </div>
          </div>
          
          {/* 进度条 */}
          <div className="relative">
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
                layoutId="progressBar"
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercentage}
              onChange={handleProgressChange}
              className="absolute top-0 left-0 w-full h-1 opacity-0 cursor-pointer"
              style={{ cursor: 'pointer' }}
            />
          </div>
          
          {/* 时间显示 */}
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* 控制按钮 */}
      <div className="flex items-center justify-between mb-3">
        <motion.button
          onClick={prevTrack}
          className="p-2 text-gray-400 hover:text-white rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={tracks.length === 0}
        >
          <i className="fas fa-step-backward"></i>
        </motion.button>

        <motion.button
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
            isPlaying 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
              : 'bg-gradient-to-r from-gray-700 to-gray-600'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={tracks.length === 0}
        >
          {isPlaying ? (
            <i className="fas fa-pause"></i>
          ) : (
            <i className="fas fa-play ml-1"></i>
          )}
        </motion.button>

        <motion.button
          onClick={nextTrack}
          className="p-2 text-gray-400 hover:text-white rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={tracks.length === 0}
        >
          <i className="fas fa-step-forward"></i>
        </motion.button>

        {/* 音量控制 */}
        <div className="relative">
          <motion.button
            onClick={() => setIsVolumeVisible(!isVolumeVisible)}
            className="p-2 text-gray-400 hover:text-white rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {volume === 0 ? (
              <i className="fas fa-volume-mute"></i>
            ) : volume < 0.5 ? (
              <i className="fas fa-volume-down"></i>
            ) : (
              <i className="fas fa-volume-up"></i>
            )}
          </motion.button>

          {/* 音量滑块 */}
          {isVolumeVisible && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full right-0 mb-2 p-3 bg-gray-900/95 backdrop-blur-lg rounded-xl border border-gray-800 shadow-2xl"
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-purple-500"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* 播放列表面板 */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {renderPlaylist()}
          
          {/* 批量操作按钮 */}
          {tracks.length > 0 && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
              <div className="text-xs text-gray-400">
                {tracks.filter(track => track.source === 'local' && track.file).length > 0 && (
                  `${(getTotalSize() / (1024 * 1024)).toFixed(2)} MB`
                )}
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={openFileDialog}
                  className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fas fa-upload mr-1"></i>导入音乐
                </motion.button>
                <motion.button
                  onClick={() => setShowAddExternalForm(true)}
                  className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fas fa-plus mr-1"></i>添加外部链接
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* 添加外部音乐表单 */}
      {showAddExternalForm && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-gray-900/95 backdrop-blur-lg rounded-2xl p-4 border border-gray-800 shadow-2xl z-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">添加外部音乐</h3>
            <button 
              onClick={() => setShowAddExternalForm(false)}
              className="text-gray-400 hover:text-white p-1"
              aria-label="关闭"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleAddExternalTrack} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">音乐名称 *</label>
              <input
                type="text"
                value={externalTrackForm.name}
                onChange={(e) => setExternalTrackForm({...externalTrackForm, name: e.target.value})}
                placeholder="例如：晴天"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">艺术家</label>
              <input
                type="text"
                value={externalTrackForm.artist}
                onChange={(e) => setExternalTrackForm({...externalTrackForm, artist: e.target.value})}
                placeholder="例如：周杰伦"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">音乐URL *</label>
              <input
                type="url"
                value={externalTrackForm.url}
                onChange={(e) => setExternalTrackForm({...externalTrackForm, url: e.target.value})}
                placeholder="https://"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                请输入音乐的直接播放链接（支持网易云、酷狗、QQ音乐等平台的直链）
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">音乐来源</label>
              <select
                value={externalTrackForm.source}
                onChange={(e) => setExternalTrackForm({...externalTrackForm, source: e.target.value as any})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="netease">网易云音乐</option>
                <option value="kugou">酷狗音乐</option>
                <option value="qqmusic">QQ音乐</option>
                <option value="other">其他平台</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <motion.button
                type="submit"
                className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                添加音乐
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setShowAddExternalForm(false)}
                className="py-2.5 px-4 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                取消
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
};