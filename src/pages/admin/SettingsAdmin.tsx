import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService.ts';
import type { SiteSettings, Lang } from '../../types/index.ts';
import { Input } from '../../components/ui/Input.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { useToast } from '../../components/ui/Toast.tsx';
import { Save, Settings as SettingsIcon, MessageSquare, Search, Lock } from 'lucide-react';
import { LogoSettingsCard } from '../../components/admin/LogoSettingsCard.tsx';

export const SettingsAdmin: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    settingsService.get().then(setSettings);
  }, []);

  if (!settings) {
    return <div className="p-8 text-center text-slate-500">Loading Settings...</div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await settingsService.update(settings);
      toast('Website settings updated successfully!', 'success');
    } catch {
      toast('Failed to save settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-start max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Website & Branding Settings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure official hostel logo, search engine optimization, default language, and WhatsApp templates.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleSave}
          loading={loading}
          variant="primary"
          icon={<Save className="w-4 h-4" />}
        >
          Save Settings
        </Button>
      </div>

      {/* Official Hostel Logo Section */}
      <LogoSettingsCard />

      <form onSubmit={handleSave} className="space-y-6">
        {/* SEO Meta Configuration */}
        <Card className="p-6 bg-white space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b pb-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-teal-700" />
            <span>Search Engine Optimization (SEO) & Social Meta</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="SEO Title (English)"
              value={settings.seo_title_en}
              onChange={(e) =>
                setSettings({ ...settings, seo_title_en: e.target.value })
              }
            />
            <Input
              label="SEO Title (Urdu)"
              value={settings.seo_title_ur}
              onChange={(e) =>
                setSettings({ ...settings, seo_title_ur: e.target.value })
              }
              dir="rtl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea
              label="SEO Meta Description (English)"
              value={settings.seo_description_en}
              onChange={(e) =>
                setSettings({ ...settings, seo_description_en: e.target.value })
              }
              rows={3}
            />
            <Textarea
              label="SEO Meta Description (Urdu)"
              value={settings.seo_description_ur}
              onChange={(e) =>
                setSettings({ ...settings, seo_description_ur: e.target.value })
              }
              dir="rtl"
              rows={3}
            />
          </div>
        </Card>

        {/* Language & Communication Templates */}
        <Card className="p-6 bg-white space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b pb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Default Language & WhatsApp Chat Templates</span>
          </h3>

          <Select
            label="Default Website Language for New Visitors"
            value={settings.default_language}
            onChange={(e) =>
              setSettings({ ...settings, default_language: e.target.value as Lang })
            }
          >
            <option value="en">English (default)</option>
            <option value="ur">اردو (Urdu)</option>
          </Select>

          <Textarea
            label="WhatsApp Floating Button Template (English)"
            value={settings.whatsapp_message_template_en}
            onChange={(e) =>
              setSettings({
                ...settings,
                whatsapp_message_template_en: e.target.value
              })
            }
            rows={2}
          />

          <Textarea
            label="WhatsApp Floating Button Template (Urdu)"
            value={settings.whatsapp_message_template_ur}
            onChange={(e) =>
              setSettings({
                ...settings,
                whatsapp_message_template_ur: e.target.value
              })
            }
            dir="rtl"
            rows={2}
          />
        </Card>

        {/* Security / Admin Credential Hook for Stage C */}
        <Card className="p-6 bg-slate-50 border-slate-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Lock className="w-4 h-4 text-teal-700" />
            <span>Admin Authentication (Supabase Auth)</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Admin sign-in is handled by Supabase Auth and access is limited to the owner account with an admin profile. Use “Forgot password?” on the login screen to receive a password-reset email. Public registration is not offered on the website.
          </p>
        </Card>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            icon={<Save className="w-4 h-4" />}
          >
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
