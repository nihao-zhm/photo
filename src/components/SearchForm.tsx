import React from 'react';
import { Search, Sparkles, Filter } from 'lucide-react';
import { PLATFORMS } from '../../shared/types';
import { useStore } from '../hooks/useStore';

interface SearchFormProps {
  onSearch: () => void;
  onLoadSample: () => void;
  loading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, onLoadSample, loading }) => {
  const { 
    searchKeyword, 
    setSearchKeyword, 
    selectedPlatforms, 
    setSelectedPlatforms 
  } = useStore();

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(
      selectedPlatforms.includes(platform)
        ? selectedPlatforms.filter(p => p !== platform)
        : [...selectedPlatforms, platform]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      onSearch();
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-success-500 rounded-2xl p-8 shadow-xl mb-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            🛒 电商价格对比工具
          </h1>
          <p className="text-primary-100 text-lg">
            一键搜索多平台商品，智能分析性价比
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="输入商品名称，例如：iPhone 15、MacBook Pro..."
              className="w-full pl-14 pr-4 py-4 text-lg rounded-xl border-0 focus:ring-4 focus:ring-white/30 focus:outline-none shadow-lg"
            />
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-5 w-5 text-white" />
              <span className="text-white font-medium">选择平台</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {Object.entries(PLATFORMS).map(([key, platform]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => togglePlatform(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    selectedPlatforms.includes(key)
                      ? 'bg-white text-gray-800 shadow-lg scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <span className="text-xl">{platform.icon}</span>
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading || !searchKeyword.trim()}
              className="flex-1 bg-white text-primary-600 font-bold py-4 px-8 rounded-xl hover:bg-primary-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  搜索中...
                </>
              ) : (
                <>
                  <Search className="h-6 w-6" />
                  开始搜索
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onLoadSample}
              disabled={loading}
              className="flex-1 bg-success-500 text-white font-bold py-4 px-8 rounded-xl hover:bg-success-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
            >
              <Sparkles className="h-6 w-6" />
              查看示例
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
