import { requireSupabase, supabase } from './supabaseClient.ts';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']);

export async function uploadHostelMedia(file: File, folder = 'gallery'): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Choose a PNG, JPG, WebP, or SVG image.');
  }
  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Image size must be greater than 0 and no more than 5 MB.');
  }

  if (!supabase) {
    return URL.createObjectURL(file);
  }

  const client = requireSupabase();
  const extensionFromName = file.name.split('.').pop()?.toLowerCase() ?? '';
  const extension = ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(extensionFromName)
    ? extensionFromName
    : file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1];
  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+|\/+$/g, '') || 'gallery';
  const filePath = `${safeFolder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await client.storage.from('hostel-media').upload(filePath, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: false
  });
  if (error) throw new Error(error.message);

  const { data } = client.storage.from('hostel-media').getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Ensures an image URL satisfies Supabase's `https://%` CHECK constraint on `gallery_items` and `logo_url`.
 * If a local asset path (e.g. `/images/room-single.jpg`) is provided, uploads it to `hostel-media` Storage
 * or resolves it to the HTTPS origin when deployed.
 */
export async function resolveHttpsMediaUrl(urlOrPath: string, folder = 'gallery'): Promise<string> {
  const trimmed = (urlOrPath || '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('https://')) return trimmed;

  if (trimmed.startsWith('/') && supabase && typeof window !== 'undefined') {
    try {
      const response = await fetch(trimmed);
      if (response.ok) {
        const blob = await response.blob();
        const fileName = trimmed.split('/').pop() || 'asset.jpg';
        const mimeType = blob.type || (fileName.endsWith('.png') ? 'image/png' : 'image/jpeg');
        const file = new File([blob], fileName, { type: mimeType });
        return await uploadHostelMedia(file, folder);
      }
    } catch {
      // Fall through to origin resolution if storage upload fails
    }

    if (window.location.origin.startsWith('https://')) {
      return `${window.location.origin}${trimmed}`;
    }
  }

  return trimmed;
}

export async function deleteHostelMedia(publicUrl: string): Promise<void> {
  if (!supabase) return;
  const client = requireSupabase();
  const bucketMarker = '/storage/v1/object/public/hostel-media/';
  const markerIndex = publicUrl.indexOf(bucketMarker);
  if (markerIndex < 0) return;
  const encodedPath = publicUrl.slice(markerIndex + bucketMarker.length);
  const filePath = encodedPath.split('?')[0].split('/').map((part) => decodeURIComponent(part)).join('/');
  if (!filePath) return;
  const { error } = await client.storage.from('hostel-media').remove([filePath]);
  if (error) throw new Error(error.message);
}
