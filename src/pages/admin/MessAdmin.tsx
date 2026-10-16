import React, { useState, useEffect } from 'react';
import { messService } from '../../services/messService.ts';
import type { MessPlan, MessMenuDay } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Tabs } from '../../components/ui/Tabs.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { useToast } from '../../components/ui/Toast.tsx';
import { getDayName, formatCurrency } from '../../utils/helpers.ts';
import { Utensils, Save, Plus, Edit2, Trash2 } from 'lucide-react';

export const MessAdmin: React.FC = () => {
  const [plans, setPlans] = useState<MessPlan[]>([]);
  const [menuDays, setMenuDays] = useState<MessMenuDay[]>([]);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(1); // Monday default
  const [savingMenu, setSavingMenu] = useState(false);
  const { toast } = useToast();

  const loadData = () => {
    messService.getAllPlans().then(setPlans);
    messService.getMenu().then(setMenuDays);
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentMenuDay = menuDays.find((m) => m.day_of_week === activeDayIndex);

  const handleUpdateCurrentDay = (field: keyof MessMenuDay, value: string) => {
    if (!currentMenuDay) return;
    setMenuDays((prev) =>
      prev.map((day) =>
        day.day_of_week === activeDayIndex ? { ...day, [field]: value } : day
      )
    );
  };

  const handleSaveMenuDay = async () => {
    if (!currentMenuDay) return;
    setSavingMenu(true);
    try {
      await messService.updateMenuDay(currentMenuDay.day_of_week, currentMenuDay);
      toast(`${getDayName(currentMenuDay.day_of_week, 'en')} menu updated!`, 'success');
    } catch {
      toast('Failed to save menu.', 'error');
    } finally {
      setSavingMenu(false);
    }
  };

  const dayTabs = [
    { id: '1', label: 'Monday (پیر)' },
    { id: '2', label: 'Tuesday (منگل)' },
    { id: '3', label: 'Wednesday (بدھ)' },
    { id: '4', label: 'Thursday (جمعرات)' },
    { id: '5', label: 'Friday (جمعہ)' },
    { id: '6', label: 'Saturday (ہفتہ)' },
    { id: '0', label: 'Sunday (اتوار)' }
  ];

  return (
    <div className="space-y-10 text-start">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Mess Plans & Dining Schedule</h1>
        <p className="text-xs text-slate-500 mt-1">
          Update monthly meal packages and 7-day breakfast, lunch, and dinner menus.
        </p>
      </div>

      {/* 1. Mess Plans Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Monthly Mess Plans</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-5 text-start flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-900 block text-base mb-1">
                  {plan.name_en}
                </span>
                <span className="text-xs text-teal-800 font-semibold block mb-2" dir="rtl">
                  {plan.name_ur}
                </span>
                <div className="text-xl font-extrabold text-teal-700 my-2 num-ltr">
                  {plan.price_monthly === 0 ? 'Rs. 0' : formatCurrency(plan.price_monthly)}
                  <span className="text-xs text-slate-500 font-normal ms-1">/month</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {plan.description_en}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className={plan.is_active ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                  {plan.is_active ? '● Active' : '○ Inactive'}
                </span>
                <button
                  onClick={async () => {
                    await messService.updatePlan(plan.id, { is_active: !plan.is_active });
                    toast('Plan status toggled.', 'info');
                    loadData();
                  }}
                  className="text-teal-700 hover:underline font-semibold cursor-pointer"
                >
                  Toggle Active
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 2. 7-Day Menu Schedule Editor */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">7-Day Weekly Menu Editor</h2>
            <p className="text-xs text-slate-500">
              Select a day below to edit breakfast, lunch, and dinner items.
            </p>
          </div>
          <Button
            variant="primary"
            icon={<Save className="w-4 h-4" />}
            loading={savingMenu}
            onClick={handleSaveMenuDay}
          >
            Save Day Menu
          </Button>
        </div>

        {/* Day Tabs */}
        <Tabs
          tabs={dayTabs}
          activeTab={String(activeDayIndex)}
          onChange={(id) => setActiveDayIndex(parseInt(id))}
        />

        {currentMenuDay && (
          <Card className="p-6 bg-white space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Menu for {getDayName(currentMenuDay.day_of_week, 'en')} ({getDayName(currentMenuDay.day_of_week, 'ur')})
              </h3>
              <span className="text-xs text-slate-500">Bilingual (English & Urdu)</span>
            </div>

            {/* Breakfast */}
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800">
                🍳 Breakfast (ناشتہ)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Breakfast (English)"
                  value={currentMenuDay.breakfast_en}
                  onChange={(e) => handleUpdateCurrentDay('breakfast_en', e.target.value)}
                />
                <Input
                  label="Breakfast (Urdu - اردو)"
                  value={currentMenuDay.breakfast_ur}
                  onChange={(e) => handleUpdateCurrentDay('breakfast_ur', e.target.value)}
                  dir="rtl"
                />
              </div>
            </div>

            {/* Lunch */}
            <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-teal-800">
                ☀️ Lunch (دوپہر کا کھانا)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Lunch (English)"
                  value={currentMenuDay.lunch_en}
                  onChange={(e) => handleUpdateCurrentDay('lunch_en', e.target.value)}
                />
                <Input
                  label="Lunch (Urdu - اردو)"
                  value={currentMenuDay.lunch_ur}
                  onChange={(e) => handleUpdateCurrentDay('lunch_ur', e.target.value)}
                  dir="rtl"
                />
              </div>
            </div>

            {/* Dinner */}
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-800">
                🌙 Dinner (رات کا کھانا)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Dinner (English)"
                  value={currentMenuDay.dinner_en}
                  onChange={(e) => handleUpdateCurrentDay('dinner_en', e.target.value)}
                />
                <Input
                  label="Dinner (Urdu - اردو)"
                  value={currentMenuDay.dinner_ur}
                  onChange={(e) => handleUpdateCurrentDay('dinner_ur', e.target.value)}
                  dir="rtl"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                icon={<Save className="w-4 h-4" />}
                loading={savingMenu}
                onClick={handleSaveMenuDay}
              >
                Save {getDayName(currentMenuDay.day_of_week, 'en')} Menu
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
