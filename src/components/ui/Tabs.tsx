import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'pills' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'pills'
}) => {
  return (
    <div
      role="tablist"
      className={`flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none ${
        variant === 'underline' ? 'border-b border-slate-200' : 'p-1 bg-slate-100 rounded-xl'
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        if (variant === 'underline') {
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`px-4 py-2.5 text-sm font-semibold transition-colors duration-150 relative cursor-pointer whitespace-nowrap ${
                isActive ? 'text-teal-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="ms-2 px-1.5 py-0.5 text-xs rounded-full bg-slate-200 text-slate-800">
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-teal-700 rounded-full" />
              )}
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              isActive
                ? 'bg-white text-teal-800 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`px-1.5 py-0.2 text-xs rounded-full ${
                  isActive ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
