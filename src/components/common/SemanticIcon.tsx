import React from 'react';
import {
  Wifi,
  Droplets,
  Zap,
  BatteryCharging,
  Flame,
  Wind,
  UtensilsCrossed,
  Coffee,
  Shirt,
  BookOpen,
  LampDesk,
  Video,
  ShieldCheck,
  Bike,
  Sparkles,
  BedDouble,
  BedSingle,
  Lock,
  Bath,
  Wallet,
  Clock,
  Users,
  Ban,
  VolumeX,
  IdCard,
  HeartPulse,
  Compass,
  GraduationCap,
  CalendarCheck,
  CheckCircle2
} from 'lucide-react';
import {
  resolveAmenityIconKey,
  resolveRuleIconKey,
  type SemanticIconKey
} from '../../utils/iconResolver.ts';

export const SEMANTIC_ICON_COMPONENTS: Record<
  SemanticIconKey,
  React.FC<{ className?: string }>
> = {
  wifi: Wifi,
  droplet: Droplets,
  droplets: Droplets,
  zap: Zap,
  'battery-charging': BatteryCharging,
  flame: Flame,
  wind: Wind,
  utensils: UtensilsCrossed,
  coffee: Coffee,
  shirt: Shirt,
  'book-open': BookOpen,
  'lamp-desk': LampDesk,
  video: Video,
  'shield-check': ShieldCheck,
  bike: Bike,
  sparkles: Sparkles,
  bed: BedDouble,
  'bed-single': BedSingle,
  lock: Lock,
  bath: Bath,
  wallet: Wallet,
  clock: Clock,
  users: Users,
  ban: Ban,
  'volume-x': VolumeX,
  'id-card': IdCard,
  'heart-pulse': HeartPulse,
  compass: Compass,
  'graduation-cap': GraduationCap,
  'calendar-check': CalendarCheck,
  'check-circle': CheckCircle2
};

export const FACILITY_ICON_OPTIONS: {
  key: SemanticIconKey;
  label: string;
  Icon: React.FC<{ className?: string }>;
}[] = [
  { key: 'wifi', label: 'WiFi', Icon: Wifi },
  { key: 'droplet', label: 'RO Water', Icon: Droplets },
  { key: 'zap', label: 'Power / UPS', Icon: Zap },
  { key: 'flame', label: 'Geyser', Icon: Flame },
  { key: 'wind', label: 'Cooling', Icon: Wind },
  { key: 'utensils', label: 'Mess', Icon: UtensilsCrossed },
  { key: 'shirt', label: 'Laundry', Icon: Shirt },
  { key: 'book-open', label: 'Study Hall', Icon: BookOpen },
  { key: 'lamp-desk', label: 'Study Desk', Icon: LampDesk },
  { key: 'video', label: 'CCTV', Icon: Video },
  { key: 'shield-check', label: 'Security', Icon: ShieldCheck },
  { key: 'bike', label: 'Parking', Icon: Bike },
  { key: 'sparkles', label: 'Cleaning', Icon: Sparkles },
  { key: 'bed', label: 'Beds', Icon: BedDouble },
  { key: 'lock', label: 'Lockers', Icon: Lock },
  { key: 'bath', label: 'Washroom', Icon: Bath },
  { key: 'heart-pulse', label: 'First Aid', Icon: HeartPulse },
  { key: 'compass', label: 'Prayer Area', Icon: Compass },
  { key: 'battery-charging', label: 'Solar / Backup', Icon: BatteryCharging },
  { key: 'graduation-cap', label: 'Academics', Icon: GraduationCap },
  { key: 'wallet', label: 'Affordable', Icon: Wallet }
];

export const FacilityIcon: React.FC<{
  iconKey?: string | null;
  fallbackText?: string;
  className?: string;
}> = ({ iconKey, fallbackText, className = 'w-5 h-5' }) => {
  const direct = iconKey ? SEMANTIC_ICON_COMPONENTS[iconKey as SemanticIconKey] : undefined;
  if (direct) {
    const DirectComp = direct;
    return <DirectComp className={className} />;
  }
  const resolvedKey = resolveAmenityIconKey(fallbackText || iconKey || '');
  const ResolvedComp = SEMANTIC_ICON_COMPONENTS[resolvedKey] || Sparkles;
  return <ResolvedComp className={className} />;
};

export const AmenityIcon: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = 'w-4 h-4' }) => {
  const key = resolveAmenityIconKey(text);
  const IconComp = SEMANTIC_ICON_COMPONENTS[key] || CheckCircle2;
  return <IconComp className={className} />;
};

export const RuleIcon: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = 'w-4 h-4' }) => {
  const key = resolveRuleIconKey(text);
  const IconComp = SEMANTIC_ICON_COMPONENTS[key] || ShieldCheck;
  return <IconComp className={className} />;
};
