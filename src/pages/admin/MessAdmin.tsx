import React, { useState, useEffect } from 'react';
import { messService } from '../../services/messService.ts';
import type { MessPlan, MessMenuDay } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Tabs } from '../../components/ui/Tabs.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { useToast } from '../../components/ui/Toast.tsx';
import { getDayName, formatCurrency } from '../../utils/helpers.ts';
import { Save, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

export const MessAdmin: React.FC = () => {
  const [plans, setPlans] = useState<MessPlan[]>([]);
  const [menuDays, setMenuDays] = useState<MessMenuDay[]>([]);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(1);
  const [savingMenu, setSavingMenu] = useState(false);

  // Mess Plan CRUD Modal State
  const [editingPlan, setEditingPlan] = useState<MessPlan | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<MessPlan | null>(null);

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
      loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save menu.', 'error');
    } finally {
      setSavingMenu(false);
    }
  };

  const handleSaveAllDays = async () => {
    setSavingMenu(true);
    try {
      for (const day of menuDays) {
        await messService.updateMenuDay(day.day_of_week, day);
      }
      toast('All 7 days of the weekly mess menu saved!', 'success');
      loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save weekly menu.', 'error');
    } finally {
      setSavingMenu(false);
    }
  };

  const handleOpenAddPlan = () => {
    setEditingPlan({
      id: '',
      name_en: '',
      name_ur: '',
      price_monthly: 5500,
      description_en: '',
      description_ur: '',
      is_active: true,
      sort_order: plans.length + 1
    });
    setIsPlanModalOpen(true);
  };

  const handleOpenEditPlan = (plan: MessPlan) => {
    setEditingPlan({ ...plan });
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan || !editingPlan.name_en.trim()) {
      toast('Plan name is required.', 'error');
      return;
    }
    setSavingPlan(true);
    try {
      if (editingPlan.id) {
        await messService.updatePlan(editingPlan.id, editingPlan);
        toast('Mess plan updated!', 'success');
      } else {
        await messService.createPlan(editingPlan);
        toast('New mess plan created!', 'success');
      }
      setIsPlanModalOpen(false);
      loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save mess plan.', 'error');
    } finally {
      setSavingPlan(false);
    }
  };

  const handleConfirmDeletePlan = async () => {
    if (!planToDelete) return;
    try {
      await messService.removePlan(planToDelete.id);
      toast('Mess plan deleted.', 'info');
      setPlanToDelete(null);
      loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to delete mess plan.', 'error');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mess Plans & Dining Schedule</h1>
          <p className="text-xs text-slate-500 mt-1">
            Add, edit, or delete monthly meal packages and customize the 7-day breakfast, lunch, and dinner menu.
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAddPlan}
          className="whitespace-nowrap"
        >
          Add Mess Plan
        </Button>
      </div>

      {/* 1. Mess Plans Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Monthly Mess Plans ({plans.length})</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-5 text-start flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-bold text-slate-900 block text-base">
                    {plan.name_en}
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      await messService.updatePlan(plan.id, { is_active: !plan.is_active });
                      toast('Plan status updated.', 'info');
                      loadData();
                    }}
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md cursor-pointer shrink-0 ${
                      plan.is_active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {plan.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{plan.is_active ? 'Active' : 'Hidden'}</span>
                  </button>
                </div>

                <span className="text-xs text-teal-800 font-semibold font-urdu block mb-2" dir="rtl">
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

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleOpenEditPlan(plan)}
                  icon={<Edit2 className="w-3.5 h-3.5" />}
                >
                  Edit Plan
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPlanToDelete(plan)}
                  className="text-red-600 hover:bg-red-50"
                  aria-label={`Delete ${plan.name_en}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
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
              Select a day below to edit breakfast, lunch, and dinner dishes in English & Urdu.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              loading={savingMenu}
              onClick={handleSaveAllDays}
            >
              Save All 7 Days
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Save className="w-4 h-4" />}
              loading={savingMenu}
              onClick={handleSaveMenuDay}
            >
              Save Day Menu
            </Button>
          </div>
        </div>

        {/* Day Tabs */}
        <Tabs
          tabs={dayTabs}
          activeTab={String(activeDayIndex)}
          onChange={(id) => setActiveDayIndex(parseInt(id, 10))}
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
              <h4 className="font-bold text-xs text-amber-900">
                Breakfast (ناشتہ — 7:30 AM – 9:00 AM)
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
              <h4 className="font-bold text-xs text-teal-900">
                Lunch (دوپہر کا کھانا — 1:00 PM – 2:30 PM)
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
              <h4 className="font-bold text-xs text-indigo-900">
                Dinner (رات کا کھانا — 8:00 PM – 9:30 PM)
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

      {/* Add / Edit Mess Plan Modal */}
      {editingPlan && (
        <Modal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          title={editingPlan.id ? 'Edit Mess Plan' : 'Create New Mess Plan'}
          maxWidth="lg"
        >
          <form onSubmit={handleSavePlan} className="space-y-4 text-start">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Plan Name (English)"
                value={editingPlan.name_en}
                onChange={(e) => setEditingPlan({ ...editingPlan, name_en: e.target.value })}
                placeholder="e.g. 3-Time Full Home-Style Mess"
                required
              />
              <Input
                label="Plan Name (Urdu - اردو)"
                value={editingPlan.name_ur}
                onChange={(e) => setEditingPlan({ ...editingPlan, name_ur: e.target.value })}
                placeholder="مثلاً: تین وقت کا مکمل گھریلو میس"
                dir="rtl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Monthly Price (PKR)"
                min={0}
                value={editingPlan.price_monthly}
                onChange={(e) =>
                  setEditingPlan({
                    ...editingPlan,
                    price_monthly: Math.max(0, parseInt(e.target.value, 10) || 0)
                  })
                }
                required
              />
              <Input
                type="number"
                label="Display Order"
                min={1}
                value={editingPlan.sort_order}
                onChange={(e) =>
                  setEditingPlan({
                    ...editingPlan,
                    sort_order: parseInt(e.target.value, 10) || 1
                  })
                }
              />
            </div>

            <Textarea
              label="Description (English)"
              value={editingPlan.description_en}
              onChange={(e) => setEditingPlan({ ...editingPlan, description_en: e.target.value })}
              rows={2}
            />

            <Textarea
              label="Description (Urdu - اردو)"
              value={editingPlan.description_ur}
              onChange={(e) => setEditingPlan({ ...editingPlan, description_ur: e.target.value })}
              dir="rtl"
              rows={2}
            />

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={editingPlan.is_active}
                onChange={(e) => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
                className="rounded text-teal-700"
              />
              <span>Active & visible on the website</span>
            </label>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setIsPlanModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={savingPlan}>
                Save Mess Plan
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Plan Confirmation Modal */}
      {planToDelete && (
        <Modal
          isOpen={!!planToDelete}
          onClose={() => setPlanToDelete(null)}
          title="Delete Mess Plan"
          maxWidth="sm"
        >
          <div className="space-y-4 text-start">
            <p className="text-sm text-slate-600">
              Delete <strong className="text-slate-900">{planToDelete.name_en}</strong> from monthly meal plans?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setPlanToDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDeletePlan}>
                Delete Plan
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
