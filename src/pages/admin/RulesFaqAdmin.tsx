import React, { useState, useEffect } from 'react';
import { rulesService } from '../../services/rulesService.ts';
import { faqsService } from '../../services/faqsService.ts';
import { mockStore } from '../../services/mockStore.ts';
import type { Rule, Faq } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { useToast } from '../../components/ui/Toast.tsx';
import { Plus, Trash2, Edit2, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export const RulesFaqAdmin: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [activeTab, setActiveTab] = useState<'rules' | 'faqs'>('rules');

  // Rule Modal state
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);

  // FAQ Modal state
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'rule' | 'faq';
    id: string;
    label: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { toast } = useToast();

  const loadData = () => {
    rulesService.getAll().then(setRules);
    faqsService.getAll().then(setFaqs);
  };

  useEffect(() => {
    loadData();
    return mockStore.subscribe(loadData);
  }, []);

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;

    if (!editingRule.text_en.trim()) {
      toast('English rule text is required.', 'error');
      return;
    }

    try {
      if (editingRule.id) {
        await rulesService.update(editingRule.id, editingRule);
        toast('Rule updated!', 'success');
      } else {
        await rulesService.create(editingRule);
        toast('Rule created!', 'success');
      }
      setIsRuleModalOpen(false);
      loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save rule.', 'error');
    }
  };

  const handleToggleRulePublished = async (rule: Rule) => {
    try {
      await rulesService.update(rule.id, { is_published: !rule.is_published });
      toast(rule.is_published ? 'Rule hidden from public page.' : 'Rule published.', 'info');
      loadData();
    } catch {
      toast('Failed to update rule status.', 'error');
    }
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;

    if (!editingFaq.question_en.trim() || !editingFaq.answer_en.trim()) {
      toast('English Question and Answer are required.', 'error');
      return;
    }

    try {
      if (editingFaq.id) {
        await faqsService.update(editingFaq.id, editingFaq);
        toast('FAQ updated!', 'success');
      } else {
        await faqsService.create(editingFaq);
        toast('FAQ created!', 'success');
      }
      setIsFaqModalOpen(false);
      loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save FAQ.', 'error');
    }
  };

  const handleToggleFaqPublished = async (faq: Faq) => {
    try {
      await faqsService.update(faq.id, { is_published: !faq.is_published });
      toast(faq.is_published ? 'FAQ hidden from public page.' : 'FAQ published.', 'info');
      loadData();
    } catch {
      toast('Failed to update FAQ status.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.type === 'rule') {
        await rulesService.remove(deleteTarget.id);
        toast('Rule deleted.', 'info');
      } else {
        await faqsService.remove(deleteTarget.id);
        toast('FAQ deleted.', 'info');
      }
      setDeleteTarget(null);
      loadData();
    } catch {
      toast('Failed to delete item.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rules & FAQs Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain hostel discipline rules and public answers to resident and parent inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'rules' ? (
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingRule({
                  id: '',
                  text_en: '',
                  text_ur: '',
                  is_published: true,
                  sort_order: rules.length + 1
                });
                setIsRuleModalOpen(true);
              }}
            >
              Add Rule
            </Button>
          ) : (
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingFaq({
                  id: '',
                  question_en: '',
                  question_ur: '',
                  answer_en: '',
                  answer_ur: '',
                  is_published: true,
                  sort_order: faqs.length + 1
                });
                setIsFaqModalOpen(true);
              }}
            >
              Add FAQ
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-5 py-2.5 font-bold text-sm border-b-2 cursor-pointer transition whitespace-nowrap ${
            activeTab === 'rules'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Hostel Rules ({rules.length})
        </button>
        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-5 py-2.5 font-bold text-sm border-b-2 cursor-pointer transition whitespace-nowrap ${
            activeTab === 'faqs'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Frequently Asked Questions ({faqs.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'rules' ? (
        <div className="space-y-3">
          {rules.map((rule, idx) => (
            <div
              key={rule.id}
              className={`p-4 bg-white rounded-2xl border transition flex items-start justify-between gap-4 ${
                rule.is_published ? 'border-slate-200' : 'border-slate-200 bg-slate-50/70 opacity-75'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                  {idx + 1}
                </span>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{rule.text_en}</p>
                    {!rule.is_published && (
                      <span className="text-xs font-medium text-slate-500">· Hidden</span>
                    )}
                  </div>
                  <p className="text-xs text-teal-800 font-urdu" dir="rtl">
                    {rule.text_ur || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleToggleRulePublished(rule)}
                  className="p-1.5 text-slate-500 hover:text-teal-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  aria-label={rule.is_published ? 'Hide rule' : 'Publish rule'}
                  title={rule.is_published ? 'Published (click to hide)' : 'Hidden (click to publish)'}
                >
                  {rule.is_published ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setEditingRule({ ...rule });
                    setIsRuleModalOpen(true);
                  }}
                  className="p-1.5 text-slate-500 hover:text-teal-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  aria-label="Edit rule"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setDeleteTarget({
                      type: 'rule',
                      id: rule.id,
                      label: rule.text_en
                    })
                  }
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                  aria-label="Delete rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`p-4 bg-white rounded-2xl border transition flex items-start justify-between gap-4 ${
                faq.is_published ? 'border-slate-200' : 'border-slate-200 bg-slate-50/70 opacity-75'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">{faq.question_en}</h4>
                  {!faq.is_published && (
                    <span className="text-xs font-medium text-slate-500">· Hidden</span>
                  )}
                </div>
                <p className="text-xs text-teal-800 font-medium font-urdu" dir="rtl">
                  {faq.question_ur || '—'}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-100">
                  {faq.answer_en}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed font-urdu" dir="rtl">
                  {faq.answer_ur || '—'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleToggleFaqPublished(faq)}
                  className="p-1.5 text-slate-500 hover:text-teal-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  aria-label={faq.is_published ? 'Hide FAQ' : 'Publish FAQ'}
                  title={faq.is_published ? 'Published (click to hide)' : 'Hidden (click to publish)'}
                >
                  {faq.is_published ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setEditingFaq({ ...faq });
                    setIsFaqModalOpen(true);
                  }}
                  className="p-1.5 text-slate-500 hover:text-teal-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  aria-label="Edit FAQ"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setDeleteTarget({
                      type: 'faq',
                      id: faq.id,
                      label: faq.question_en
                    })
                  }
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                  aria-label="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rule Edit Modal */}
      {editingRule && (
        <Modal
          isOpen={isRuleModalOpen}
          onClose={() => setIsRuleModalOpen(false)}
          title={editingRule.id ? 'Edit Rule' : 'Add Rule'}
        >
          <form onSubmit={handleSaveRule} className="space-y-4 text-start">
            <Textarea
              label="Rule Description (English)"
              value={editingRule.text_en}
              onChange={(e) => setEditingRule({ ...editingRule, text_en: e.target.value })}
              required
              rows={3}
            />
            <Textarea
              label="Rule Description (Urdu)"
              value={editingRule.text_ur}
              onChange={(e) => setEditingRule({ ...editingRule, text_ur: e.target.value })}
              dir="rtl"
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4 items-center">
              <Input
                type="number"
                label="Display Order"
                min={1}
                value={editingRule.sort_order}
                onChange={(e) =>
                  setEditingRule({
                    ...editingRule,
                    sort_order: parseInt(e.target.value) || 1
                  })
                }
              />
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 pt-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingRule.is_published}
                  onChange={(e) =>
                    setEditingRule({ ...editingRule, is_published: e.target.checked })
                  }
                  className="rounded text-teal-700 focus:ring-teal-700"
                />
                <span>Published on Website</span>
              </label>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setIsRuleModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Rule
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* FAQ Edit Modal */}
      {editingFaq && (
        <Modal
          isOpen={isFaqModalOpen}
          onClose={() => setIsFaqModalOpen(false)}
          title={editingFaq.id ? 'Edit FAQ' : 'Add FAQ'}
        >
          <form onSubmit={handleSaveFaq} className="space-y-4 text-start">
            <Input
              label="Question (English)"
              value={editingFaq.question_en}
              onChange={(e) => setEditingFaq({ ...editingFaq, question_en: e.target.value })}
              required
            />
            <Input
              label="Question (Urdu)"
              value={editingFaq.question_ur}
              onChange={(e) => setEditingFaq({ ...editingFaq, question_ur: e.target.value })}
              dir="rtl"
            />
            <Textarea
              label="Answer (English)"
              value={editingFaq.answer_en}
              onChange={(e) => setEditingFaq({ ...editingFaq, answer_en: e.target.value })}
              required
              rows={3}
            />
            <Textarea
              label="Answer (Urdu)"
              value={editingFaq.answer_ur}
              onChange={(e) => setEditingFaq({ ...editingFaq, answer_ur: e.target.value })}
              dir="rtl"
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4 items-center">
              <Input
                type="number"
                label="Display Order"
                min={1}
                value={editingFaq.sort_order}
                onChange={(e) =>
                  setEditingFaq({
                    ...editingFaq,
                    sort_order: parseInt(e.target.value) || 1
                  })
                }
              />
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 pt-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingFaq.is_published}
                  onChange={(e) =>
                    setEditingFaq({ ...editingFaq, is_published: e.target.checked })
                  }
                  className="rounded text-teal-700 focus:ring-teal-700"
                />
                <span>Published on Website</span>
              </label>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setIsFaqModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save FAQ
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title={`Delete ${deleteTarget.type === 'rule' ? 'Rule' : 'FAQ'}`}
          maxWidth="sm"
        >
          <div className="space-y-4 text-start">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <strong className="font-semibold">"{deleteTarget.label}"</strong>?
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                loading={deleting}
                onClick={handleConfirmDelete}
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
