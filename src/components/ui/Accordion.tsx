import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenId?: string;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenId,
  className = ''
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-xs transition duration-200"
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full px-5 py-4 flex items-center justify-between text-start gap-4 hover:bg-slate-50/80 transition duration-150 cursor-pointer"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              id={`accordion-btn-${item.id}`}
            >
              <span className="font-semibold text-slate-900 text-sm md:text-base">
                {item.title}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-teal-700' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div
                id={`accordion-content-${item.id}`}
                role="region"
                aria-labelledby={`accordion-btn-${item.id}`}
                className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
