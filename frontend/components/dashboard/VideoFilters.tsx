'use client';

import { Search, Filter, X, SortAsc, SortDesc } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface VideoFiltersProps {
  onSearchChange: (search: string) => void;
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: 'newest' | 'oldest' | 'title') => void;
  currentFilter: string;
  currentSort: 'newest' | 'oldest' | 'title';
  totalCount: number;
  filteredCount: number;
}

export function VideoFilters({
  onSearchChange,
  onFilterChange,
  onSortChange,
  currentFilter,
  currentSort,
  totalCount,
  filteredCount
}: VideoFiltersProps) {
  const { t } = useLanguage();
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange(value);
  };

  const filters = [
    { value: 'all', label: t('allVideos'), color: 'bg-gray-100 text-gray-800' },
    { value: 'completed', label: t('completed'), color: 'bg-green-100 text-green-800' },
    { value: 'processing', label: t('processing'), color: 'bg-yellow-100 text-yellow-800' },
    { value: 'pending', label: t('pending'), color: 'bg-blue-100 text-blue-800' },
    { value: 'failed', label: t('failed'), color: 'bg-red-100 text-red-800' },
  ];

  const sortOptions = [
    { value: 'newest', label: t('newestFirst') },
    { value: 'oldest', label: t('oldestFirst') },
    { value: 'title', label: t('titleAZ') },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchVideos')}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          />
          {searchValue && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
            showFilters 
              ? 'bg-primary-50 border-primary-300 text-primary-700' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4" />
          {t('filters')}
          {currentFilter !== 'all' && (
            <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              1
            </span>
          )}
        </button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="space-y-3 pt-3 border-t border-gray-200 animate-slide-up">
          {/* Status Filters */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">{t('filterStatus')}</label>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => onFilterChange(filter.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    currentFilter === filter.value
                      ? filter.color + ' ring-2 ring-offset-2 ring-primary-500'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">{t('sortBy')}</label>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    currentSort === option.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.value === 'newest' ? <SortDesc className="h-3.5 w-3.5" /> : <SortAsc className="h-3.5 w-3.5" />}
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {t('showing')} <span className="font-semibold text-gray-900">{filteredCount}</span> {t('of')}{' '}
          <span className="font-semibold text-gray-900">{totalCount}</span> {t('videos')}
        </p>
        
        {(searchValue || currentFilter !== 'all') && (
          <button
            onClick={() => {
              handleSearchChange('');
              onFilterChange('all');
            }}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            <X className="h-3.5 w-3.5" />
            {t('clearAllFilters')}
          </button>
        )}
      </div>
    </div>
  );
}
