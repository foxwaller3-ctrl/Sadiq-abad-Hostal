import React, { useState, useEffect } from 'react';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import type { HostelInfo, HostelType } from '../../types/index.ts';
import { Input } from '../../components/ui/Input.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { useToast } from '../../components/ui/Toast.tsx';
import { Save, Building2 } from 'lucide-react';

export const HostelInfoAdmin: React.FC = () => {
  const [info, setInfo] = useState<HostelInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    hostelInfoService.get().then(setInfo);
  }, []);

  if (!info) {
    return <div className="p-8 text-center text-slate-500">Loading Hostel Info...</div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await hostelInfoService.update(info);
      toast('Hostel information updated successfully!', 'success');
    } catch (err) {
      toast('Failed to save changes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-start max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hostel Profile & Contact Info</h1>
          <p className="text-xs text-slate-500 mt-1">
            These details appear across the header, footer, hero, and location page.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleSave}
          loading={loading}
          variant="primary"
          icon={<Save className="w-4 h-4" />}
        >
          Save Changes
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Brand Info */}
        <Card className="p-6 bg-white space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b pb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-700" />
            <span>Hostel Identity & Category</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Hostel Name (English)"
              value={info.name_en}
              onChange={(e) => setInfo({ ...info, name_en: e.target.value })}
              required
            />
            <Input
              label="Hostel Name (Urdu - اردو)"
              value={info.name_ur}
              onChange={(e) => setInfo({ ...info, name_ur: e.target.value })}
              dir="rtl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tagline (English)"
              value={info.tagline_en}
              onChange={(e) => setInfo({ ...info, tagline_en: e.target.value })}
            />
            <Input
              label="Tagline (Urdu - اردو)"
              value={info.tagline_ur}
              onChange={(e) => setInfo({ ...info, tagline_ur: e.target.value })}
              dir="rtl"
            />
          </div>

          <Select
            label="Hostel Type (Target Demographic)"
            value={info.hostel_type}
            onChange={(e) => setInfo({ ...info, hostel_type: e.target.value as HostelType })}
          >
            <option value="boys">Boys Hostel (طلبہ و مرد حضرات)</option>
            <option value="girls">Girls Hostel (طالبات و خواتین)</option>
            <option value="both">Both / General Residence</option>
          </Select>
        </Card>

        {/* Contact Numbers & Channels */}
        <Card className="p-6 bg-white space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b pb-2">
            Contact & Support Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Phone Number"
              value={info.phone}
              onChange={(e) => setInfo({ ...info, phone: e.target.value })}
              placeholder="0300-1234567"
              required
            />
            <Input
              label="WhatsApp Number"
              value={info.whatsapp}
              onChange={(e) => setInfo({ ...info, whatsapp: e.target.value })}
              placeholder="0300-1234567"
              required
            />
            <Input
              label="Official Email"
              type="email"
              value={info.email}
              onChange={(e) => setInfo({ ...info, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Visiting / Office Hours (English)"
              value={info.office_hours_en}
              onChange={(e) => setInfo({ ...info, office_hours_en: e.target.value })}
            />
            <Input
              label="Visiting / Office Hours (Urdu)"
              value={info.office_hours_ur}
              onChange={(e) => setInfo({ ...info, office_hours_ur: e.target.value })}
              dir="rtl"
            />
          </div>
        </Card>

        {/* Address & Google Map */}
        <Card className="p-6 bg-white space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b pb-2">
            Physical Location & Google Maps
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Address (English)"
              value={info.address_en}
              onChange={(e) => setInfo({ ...info, address_en: e.target.value })}
            />
            <Input
              label="Full Address (Urdu)"
              value={info.address_ur}
              onChange={(e) => setInfo({ ...info, address_ur: e.target.value })}
              dir="rtl"
            />
          </div>

          <Input
            label="Google Maps Embed URL (starts with https://www.google.com/maps/embed...)"
            value={info.map_embed_url}
            onChange={(e) => setInfo({ ...info, map_embed_url: e.target.value })}
            placeholder="https://www.google.com/maps/embed?..."
          />
        </Card>

        {/* About Bio */}
        <Card className="p-6 bg-white space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b pb-2">
            About Hostel Narrative
          </h3>

          <Textarea
            label="About Text (English)"
            value={info.about_en}
            onChange={(e) => setInfo({ ...info, about_en: e.target.value })}
            rows={4}
          />

          <Textarea
            label="About Text (Urdu)"
            value={info.about_ur}
            onChange={(e) => setInfo({ ...info, about_ur: e.target.value })}
            dir="rtl"
            rows={4}
          />
        </Card>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            icon={<Save className="w-4 h-4" />}
          >
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
