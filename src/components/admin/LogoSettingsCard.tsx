import React, { useState, useEffect } from 'react';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import { mockStore } from '../../services/mockStore.ts';
import { normalizeImageUrl } from '../../utils/helpers.ts';
import { Input } from '../ui/Input.tsx';
import { Button } from '../ui/Button.tsx';
import { Card } from '../ui/Card.tsx';
import { useToast } from '../ui/Toast.tsx';
import {
  Image as ImageIcon,
  Save,
  RefreshCw,
  X,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const PROVIDED_LOGO_URL = 'https://kommodo.ai/i/0IV3pZTemc49bUwLxmEI';

interface LogoSettingsCardProps {
  onSaved?: (newLogoUrl: string) => void;
  className?: string;
}

export const LogoSettingsCard: React.FC<LogoSettingsCardProps> = ({ onSaved, className = '' }) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [hostelName, setHostelName] = useState('Sadiqabad Student Hostel');
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoadedSuccessfully, setImageLoadedSuccessfully] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;
    const fetchInfo = () => {
      hostelInfoService.get().then((info) => {
        if (!active) return;
        setLogoUrl(info.logo_url || '');
        setHostelName(info.name_en || 'Sadiqabad Student Hostel');
        setImageLoadError(false);
        setImageLoadedSuccessfully(false);
      });
    };
    fetchInfo();
    const unsubscribe = mockStore.subscribe(fetchInfo);
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const handleApplyProvidedLogo = () => {
    setLogoUrl(PROVIDED_LOGO_URL);
    setImageLoadError(false);
    setImageLoadedSuccessfully(false);
    toast('Official provided logo link loaded! Click "Save Logo" to apply.', 'info');
  };

  const handleClearLogo = () => {
    setLogoUrl('');
    setImageLoadError(false);
    setImageLoadedSuccessfully(false);
  };

  const handleSaveLogo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const updated = await hostelInfoService.update({ logo_url: logoUrl.trim() });
      setLogoUrl(updated.logo_url);
      setImageLoadError(false);
      toast('Hostel Logo saved successfully and updated live across the entire website!', 'success');
      if (onSaved) onSaved(updated.logo_url);
    } catch (err) {
      console.error('Failed to save logo:', err);
      toast('Failed to save logo. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const effectiveDisplayUrl = normalizeImageUrl(logoUrl);

  return (
    <Card className={`p-6 bg-white border border-teal-200/90 shadow-sm space-y-6 ${className}`}>
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <span>Hostel Brand Logo (لوگو سیٹنگز)</span>
              <span className="text-xs bg-teal-100/70 text-teal-800 font-semibold px-2 py-0.5 rounded-full">
                Supabase Synced
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter any public image URL or paste the provided Kommodo emblem link.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleApplyProvidedLogo}
            icon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
            className="text-xs font-semibold"
          >
            Use Provided Logo
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSaveLogo}
            loading={saving}
            icon={<Save className="w-3.5 h-3.5" />}
            className="text-xs font-bold shadow-xs"
          >
            Save Logo
          </Button>
        </div>
      </div>

      {/* Input Field & Helper actions */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
          <div className="flex-1 w-full">
            <Input
              label="Logo Image URL (لوگو کا لنک)"
              value={logoUrl}
              onChange={(e) => {
                setLogoUrl(e.target.value);
                setImageLoadError(false);
                setImageLoadedSuccessfully(false);
              }}
              placeholder={PROVIDED_LOGO_URL}
              helperText="Paste direct image link (.png, .jpg, .svg) or Kommodo share URL. Saved to Supabase 'hostel_info' table."
            />
          </div>
          <div className="flex items-center gap-2 shrink-0 pb-0.5">
            {logoUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearLogo}
                icon={<X className="w-3.5 h-3.5" />}
                className="text-slate-500 hover:text-red-600"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Provided Quick Shortcut Chip */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 min-w-0">
            <span className="font-semibold text-teal-800 shrink-0">Official Logo Link:</span>
            <code className="text-slate-600 font-mono text-[11px] truncate bg-white px-2 py-0.5 rounded border border-slate-200 max-w-xs md:max-w-md">
              {PROVIDED_LOGO_URL}
            </code>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleApplyProvidedLogo}
              className="text-teal-700 hover:text-teal-900 font-bold hover:underline cursor-pointer"
            >
              Fill URL
            </button>
            <span className="text-slate-300">•</span>
            <a
              href={PROVIDED_LOGO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <span>Inspect</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Real-time Previews */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <span>Live Logo Previews (پیش نظارہ)</span>
            {effectiveDisplayUrl && !imageLoadError && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active & Ready</span>
              </span>
            )}
          </span>
          <span className="text-[11px] text-slate-400">
            Updates in real-time across all public and admin views
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Header Preview (Light Theme) */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-600">Header Navbar (Light)</span>
              <span>Desktop & Mobile Nav</span>
            </div>
            <div className="flex items-center gap-3 py-1">
              {effectiveDisplayUrl && !imageLoadError ? (
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/90 shadow-xs p-1 flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={effectiveDisplayUrl}
                    alt="Logo Light Preview"
                    className="w-full h-full object-contain"
                    onLoad={() => {
                      setImageLoadedSuccessfully(true);
                      setImageLoadError(false);
                    }}
                    onError={(e) => {
                      if ((e.currentTarget as HTMLImageElement).src !== window.location.origin + '/logo.png') {
                        (e.currentTarget as HTMLImageElement).src = '/logo.png';
                      } else {
                        setImageLoadError(true);
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-xs shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
              )}
              <div className="text-start">
                <span className="font-extrabold text-sm text-slate-900 block leading-tight">
                  {hostelName}
                </span>
                <span className="text-[11px] text-teal-700 font-semibold tracking-wider uppercase">
                  Sadiqabad • Punjab
                </span>
              </div>
            </div>
          </div>

          {/* Footer & Sidebar Preview (Dark Theme) */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-semibold text-slate-300">Footer & Admin Sidebar (Dark)</span>
              <span>Dark Theme Views</span>
            </div>
            <div className="flex items-center gap-3 py-1">
              {effectiveDisplayUrl && !imageLoadError ? (
                <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-700 shadow-xs flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={effectiveDisplayUrl}
                    alt="Logo Dark Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      if ((e.currentTarget as HTMLImageElement).src !== window.location.origin + '/logo.png') {
                        (e.currentTarget as HTMLImageElement).src = '/logo.png';
                      } else {
                        setImageLoadError(true);
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
              )}
              <div className="text-start">
                <span className="font-extrabold text-sm text-white block leading-tight">
                  {hostelName}
                </span>
                <span className="text-[11px] text-teal-400 font-medium">
                  Verified Student Residence
                </span>
              </div>
            </div>
          </div>
        </div>

        {imageLoadError && logoUrl && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Could not load the image from this URL. If using an external image, make sure it is publicly accessible and allows hotlinking, or click <strong>Use Provided Logo</strong>.
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
