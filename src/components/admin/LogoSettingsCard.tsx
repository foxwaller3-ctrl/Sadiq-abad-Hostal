import React, { useState, useEffect, useRef } from 'react';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import { uploadHostelMedia } from '../../services/mediaService.ts';
import { mockStore } from '../../services/mockStore.ts';
import { normalizeImageUrl } from '../../utils/helpers.ts';
import { Input } from '../ui/Input.tsx';
import { Button } from '../ui/Button.tsx';
import { Card } from '../ui/Card.tsx';
import { useToast } from '../ui/Toast.tsx';
import {
  Image as ImageIcon,
  Save,
  Upload,
  X,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

export const PROVIDED_LOGO_URL = 'https://kommodo.ai/i/0IV3pZTemc49bUwLxmEI';

interface LogoSettingsCardProps {
  onSaved?: (newLogoUrl: string) => void;
  className?: string;
}

export const LogoSettingsCard: React.FC<LogoSettingsCardProps> = ({ onSaved, className = '' }) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hostelName, setHostelName] = useState('Sadiqabad Student Hostel');
  const [imageLoadError, setImageLoadError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;
    const fetchInfo = () => {
      hostelInfoService.get().then((info) => {
        if (!active) return;
        setLogoUrl(info.logo_url || '');
        setHostelName(info.name_en || 'Sadiqabad Student Hostel');
        setImageLoadError(false);
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
    toast('Official hostel logo link loaded. Click "Save Logo" to apply everywhere.', 'info');
  };

  const handleClearLogo = () => {
    setLogoUrl('');
    setImageLoadError(false);
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const publicUrl = await uploadHostelMedia(file, 'branding');
      setLogoUrl(publicUrl);
      setImageLoadError(false);
      const updated = await hostelInfoService.update({ logo_url: publicUrl });
      setLogoUrl(updated.logo_url);
      toast('Logo uploaded to Supabase Storage and saved across the website!', 'success');
      if (onSaved) onSaved(updated.logo_url);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Logo upload failed.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveLogo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const updated = await hostelInfoService.update({ logo_url: logoUrl.trim() });
      setLogoUrl(updated.logo_url);
      setImageLoadError(false);
      toast('Hostel Logo saved to Supabase and updated live across the entire website!', 'success');
      if (onSaved) onSaved(updated.logo_url);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save logo. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const effectiveDisplayUrl = normalizeImageUrl(logoUrl);

  return (
    <Card className={`p-6 bg-white border border-slate-200 shadow-xs space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Hostel Brand Logo (لوگو سیٹنگز)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Paste a public image URL, upload a logo file to Supabase Storage, or use the official Kommodo emblem.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleUploadFile}
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            loading={uploading}
            onClick={() => fileInputRef.current?.click()}
            icon={<Upload className="w-3.5 h-3.5" />}
            className="text-xs font-semibold whitespace-nowrap"
          >
            Upload File
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleApplyProvidedLogo}
            icon={<RotateCcw className="w-3.5 h-3.5 text-teal-700" />}
            className="text-xs font-semibold whitespace-nowrap"
          >
            Official Logo
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSaveLogo}
            loading={saving}
            icon={<Save className="w-3.5 h-3.5" />}
            className="text-xs font-bold whitespace-nowrap"
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
              }}
              placeholder={PROVIDED_LOGO_URL}
              helperText="Paste any direct HTTPS image URL (.png, .jpg, .svg, .webp) or Kommodo share URL. Saved directly to Supabase hostel_info."
            />
          </div>
          {logoUrl && (
            <div className="shrink-0 pb-0.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearLogo}
                icon={<X className="w-3.5 h-3.5" />}
                className="text-slate-500 hover:text-red-600 whitespace-nowrap"
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Provided Quick Shortcut */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 min-w-0">
            <span className="font-semibold text-teal-800 shrink-0">Official Logo URL:</span>
            <code className="text-slate-600 font-mono text-[11px] truncate bg-white px-2 py-0.5 rounded border border-slate-200 max-w-xs md:max-w-md">
              {PROVIDED_LOGO_URL}
            </code>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleApplyProvidedLogo}
              className="text-teal-700 hover:text-teal-900 font-bold hover:underline cursor-pointer whitespace-nowrap"
            >
              Load URL
            </button>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <a
              href={PROVIDED_LOGO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 whitespace-nowrap"
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
          <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
            <span>Live Logo Previews (پیش نظارہ)</span>
            {effectiveDisplayUrl && !imageLoadError && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Synced & Active</span>
              </span>
            )}
          </span>
          <span className="text-[11px] text-slate-400">
            Header, Footer & Admin Sidebar
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Header Preview (Light Theme) */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-600">Header Navbar (Light)</span>
              <span>Public Top Bar</span>
            </div>
            <div className="flex items-center gap-3 py-1">
              {effectiveDisplayUrl && !imageLoadError ? (
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={effectiveDisplayUrl}
                    alt="Logo Light Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                    onLoad={() => setImageLoadError(false)}
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
                <div className="w-11 h-11 rounded-xl bg-teal-700 flex items-center justify-center text-white shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
              )}
              <div className="text-start">
                <span className="font-bold text-sm text-slate-900 block leading-tight">
                  {hostelName}
                </span>
              </div>
            </div>
          </div>

          {/* Footer & Sidebar Preview (Dark Theme) */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-semibold text-slate-300">Footer & Admin Sidebar (Dark)</span>
              <span>Dark Surfaces</span>
            </div>
            <div className="flex items-center gap-3 py-1">
              {effectiveDisplayUrl && !imageLoadError ? (
                <div className="w-11 h-11 rounded-xl bg-white p-1 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={effectiveDisplayUrl}
                    alt="Logo Dark Preview"
                    referrerPolicy="no-referrer"
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
                <span className="font-bold text-sm text-white block leading-tight">
                  {hostelName}
                </span>
                <span className="text-[11px] text-teal-400 font-medium">
                  Sadiqabad, Punjab
                </span>
              </div>
            </div>
          </div>
        </div>

        {imageLoadError && logoUrl && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Could not load the image from this URL. Ensure the link is public or upload a logo file directly using <strong>Upload File</strong>.
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
