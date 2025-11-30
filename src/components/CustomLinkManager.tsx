import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface CustomLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  category: string;
}

export const CustomLinkManager: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
  const [editingLink, setEditingLink] = useState<CustomLink | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    url: 'https://',
    icon: 'fa-link',
    category: '个人'
  });

  // 所有可用的分类
  const allCategories = ['个人', '技术', '开发', '知识', '娱乐', '游戏'];

  // 从localStorage加载自定义链接
  useEffect(() => {
    const savedLinks = localStorage.getItem('customLinks');
    if (savedLinks) {
      setCustomLinks(JSON.parse(savedLinks));
    }
  }, []);

  // 保存自定义链接到localStorage
  useEffect(() => {
    localStorage.setItem('customLinks', JSON.stringify(customLinks));
    // 触发自定义链接更新事件
    window.dispatchEvent(new CustomEvent('customLinksUpdated'));
  }, [customLinks]);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证URL
    try {
      new URL(formData.url);
    } catch (error) {
      toast('请输入有效的URL地址');
      return;
    }

    // 验证标题
    if (!formData.title.trim()) {
      toast('请输入链接标题');
      return;
    }

    if (editingLink) {
      // 更新现有链接
      setCustomLinks(prev => 
        prev.map(link => 
          link.id === editingLink.id 
            ? { ...formData, id: editingLink.id } 
            : link
        )
      );
      toast('自定义链接已更新');
    } else {
      // 添加新链接
      // 检查总数量限制
      if (customLinks.length >= 5) {
        toast('最多只能添加5个自定义链接');
        return;
      }

      const newLink: CustomLink = {
        ...formData,
        id: Date.now().toString()
      };
      
      setCustomLinks(prev => [...prev, newLink]);
      toast('自定义链接已添加');
    }

    // 重置表单
    setEditingLink(null);
    setFormData({
      title: '',
      url: 'https://',
      icon: 'fa-link',
      category: '个人'
    });
    setIsOpen(false);
  };

  // 编辑链接
  const handleEdit = (link: CustomLink) => {
    setEditingLink(link);
    setFormData(link);
    setIsOpen(true);
  };

  // 删除链接
  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个自定义链接吗？')) {
      setCustomLinks(prev => prev.filter(link => link.id !== id));
      toast('自定义链接已删除');
    }
  };

  // 取消编辑
  const handleCancel = () => {
    setEditingLink(null);
    setFormData({
      title: '',
      url: 'https://',
      icon: 'fa-link',
      category: '个人'
    });
    setIsOpen(false);
  };

  // 常用图标列表
  const popularIcons = [
    'fa-link', 'fa-gamepad', 'fa-film', 'fa-music', 'fa-globe',
    'fa-star', 'fa-heart', 'fa-rocket', 'fa-bolt', 'fa-dragon',
    'fa-trophy', 'fa-puzzle-piece', 'fa-chess', 'fa-paint-brush', 'fa-microphone'
  ];

  // 根据分类获取图标颜色
  const getCategoryIconColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      '个人': 'purple',
      '技术': 'blue',
      '开发': 'green',
      '知识': 'amber',
      '娱乐': 'pink',
      '游戏': 'indigo'
    };
    return categoryColors[category] || 'gray';
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* 添加按钮 */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        aria-label="添加自定义链接"
      >
        <i className="fas fa-plus text-xl"></i>
      </motion.button>

      {/* 自定义链接管理面板 */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-full left-0 mb-2 w-80 bg-gray-900/95 backdrop-blur-lg rounded-2xl p-4 border border-gray-800 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">{editingLink ? '编辑自定义链接' : '添加自定义链接'}</h3>
            <button 
              onClick={handleCancel}
              className="text-gray-400 hover:text-white p-1"
              aria-label="关闭"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 链接标题 */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">链接标题</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="例如：我的游戏主页"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            {/* 链接URL */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">链接地址</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            {/* 链接分类 */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">分类</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {allCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                最多只能添加5个自定义链接
              </p>
            </div>

            {/* 链接图标 */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">选择图标</label>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                {popularIcons.map((icon, index) => (
                  <motion.div
                    key={index}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                      formData.icon === icon 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  >
                    <i className={`fas ${icon}`}></i>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 提交按钮 */}
            <motion.button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {editingLink ? '更新链接' : '添加链接'}
            </motion.button>
          </form>

          {/* 现有自定义链接列表 */}
          {customLinks.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm text-gray-400 mb-2">已添加的自定义链接</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                {customLinks.map(link => (
                  <motion.div
                    key={link.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50 border border-gray-700"
                    whileHover={{ x: 3 }}
                  >
                    <div className="flex items-center gap-2">
                      <i className={`fas ${link.icon} text-${getCategoryIconColor(link.category)}-400`}></i>
                      <div>
                        <p className="text-sm font-medium text-white truncate">{link.title}</p>
                        <p className="text-xs text-gray-400 truncate">{link.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <motion.button
                        onClick={() => handleEdit(link)}
                        className="p-1.5 text-blue-400 hover:text-blue-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="编辑"
                      >
                        <i className="fas fa-edit"></i>
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(link.id)}
                        className="p-1.5 text-red-400 hover:text-red-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="删除"
                      >
                        <i className="fas fa-trash"></i>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}