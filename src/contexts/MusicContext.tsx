import React, { createContext, useState, useContext, ReactNode, useRef, useEffect } from 'react';
import { toast } from 'sonner';

// 音乐轨道类型定义 - 扩展支持外部音乐源
interface MusicTrack {
  id: string;
  name: string;
  artist?: string;
  album?: string;
  coverUrl?: string;
  file?: File; // 本地文件
  url: string; // 播放URL
  source: 'local' | 'netease' | 'kugou' | 'qqmusic' | 'other'; // 音乐来源
}

// 音乐上下文类型定义
interface MusicContextType {
  tracks: MusicTrack[];
  currentTrackIndex: number | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  addTrack: (file: File) => void;
  addExternalTrack: (track: Omit<MusicTrack, 'id'>) => void;
  removeTrack: (id: string) => void;
  playTrack: (index: number) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
}

// 创建音乐上下文
export const MusicContext = createContext<MusicContextType | undefined>(undefined);

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  // 音乐状态管理
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // 音频元素引用
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const updateTimeInterval = useRef<number | null>(null);

  // 初始化音频元素
  useEffect(() => {
    audioRef.current = new Audio();
    
    // 设置音频事件监听
    const audioElement = audioRef.current;
    
    // 播放结束时自动播放下一首
    audioElement.onended = () => {
      nextTrack();
    };
    
    // 元数据加载完成时设置总时长
    audioElement.onloadedmetadata = () => {
      if (audioElement.duration) {
        setDuration(audioElement.duration);
      }
    };
    
    // 设置初始音量
    audioElement.volume = volume;
    
    // 保存到localStorage的轨道数据
    const savedTracks = localStorage.getItem('musicTracks');
    if (savedTracks) {
      try {
        const parsedTracks = JSON.parse(savedTracks);
        // 过滤掉本地文件轨道，因为它们无法被持久化
        const externalTracks = parsedTracks.filter((track: any) => track.source !== 'local');
        setTracks(externalTracks);
      } catch (error) {
        console.error('加载保存的音乐轨道失败:', error);
      }
    }
    
    // 清理函数
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
        audioElement.removeEventListener('ended', nextTrack);
        audioElement.removeEventListener('loadedmetadata', () => {});
      }
      
      // 清除时间更新定时器
      if (updateTimeInterval.current) {
        clearInterval(updateTimeInterval.current);
      }
    };
  }, []);

  // 监听音量变化
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 监听播放状态变化，更新当前时间
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      // 启动定时器更新当前播放时间
      updateTimeInterval.current = window.setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 1000);
    } else if (updateTimeInterval.current) {
      // 停止定时器
      clearInterval(updateTimeInterval.current);
      updateTimeInterval.current = null;
    }
    
    return () => {
      if (updateTimeInterval.current) {
        clearInterval(updateTimeInterval.current);
      }
    };
  }, [isPlaying]);

  // 保存外部音乐轨道到localStorage
  useEffect(() => {
    // 只保存外部轨道，不保存本地文件
    const externalTracks = tracks.filter(track => track.source !== 'local');
    localStorage.setItem('musicTracks', JSON.stringify(externalTracks));
  }, [tracks]);

  // 添加本地音乐轨道
  const addTrack = (file: File) => {
    // 检查文件类型是否为音频
    if (!file.type.startsWith('audio/')) {
      toast('请选择音频文件');
      return;
    }

    const track: MusicTrack = {
      id: Date.now().toString(),
      name: file.name.replace(/\.[^/.]+$/, ''), // 移除文件扩展名
      file,
      url: URL.createObjectURL(file),
      source: 'local',
    };

    setTracks(prevTracks => [...prevTracks, track]);
    toast(`已添加音乐: ${track.name}`);
  };

  // 添加外部音乐轨道（如网易云、酷狗、QQ音乐等）
  const addExternalTrack = (track: Omit<MusicTrack, 'id'>) => {
    const newTrack: MusicTrack = {
      ...track,
      id: Date.now().toString(),
    };

    setTracks(prevTracks => [...prevTracks, newTrack]);
    toast(`已添加音乐: ${track.name}`);
  };

  // 移除音乐轨道
  const removeTrack = (id: string) => {
    const trackToRemove = tracks.find(track => track.id === id);
    if (!trackToRemove) return;

    const updatedTracks = tracks.filter(track => track.id !== id);
    setTracks(updatedTracks);
    
    // 如果移除的是当前播放的轨道
    if (currentTrackIndex !== null && trackToRemove.id === tracks[currentTrackIndex].id) {
      // 停止播放
      pauseTrack();
      setCurrentTrackIndex(null);
      setCurrentTime(0);
      setDuration(0);
    }

    toast(`已移除音乐: ${trackToRemove.name}`);
  };

  // 播放指定轨道
  const playTrack = (index: number) => {
    if (index < 0 || index >= tracks.length) return;

    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setDuration(0);
    
    if (audioRef.current) {
      audioRef.current.src = tracks[index].url;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('播放失败:', error);
        toast('播放失败，请检查音乐源是否可访问');
      });
    }
  };

  // 暂停播放
  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // 切换播放状态
  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrackIndex !== null) {
      playTrack(currentTrackIndex);
    } else if (tracks.length > 0) {
      playTrack(0);
    }
  };

  // 下一首
  const nextTrack = () => {
    if (tracks.length === 0) return;
    
    const nextIndex = currentTrackIndex === null || currentTrackIndex === tracks.length - 1 
      ? 0 
      : currentTrackIndex + 1;
    
    playTrack(nextIndex);
  };

  // 上一首
  const prevTrack = () => {
    if (tracks.length === 0) return;
    
    const prevIndex = currentTrackIndex === null || currentTrackIndex === 0 
      ? tracks.length - 1 
      : currentTrackIndex - 1;
    
    playTrack(prevIndex);
  };

  // 设置当前播放时间（用于进度条拖动）
  const setAudioCurrentTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // 音乐上下文值
  const value: MusicContextType = {
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
    setCurrentTime: setAudioCurrentTime,
  };
  
  // 处理热模块替换（HMR）
  if (import.meta.hot) {
    import.meta.hot.accept();
    
    // 确保热更新时清理资源
    import.meta.hot.dispose(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      
      if (updateTimeInterval.current) {
        clearInterval(updateTimeInterval.current);
      }
    });
  }

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

// 自定义Hook方便使用音乐上下文
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};