import { initials } from '../lib/utils';
import { cn } from '../lib/utils';

type AvatarType = 'blind' | 'family' | 'head' | 'helper' | 'admin';

const gradients: Record<AvatarType, string> = {
  blind: 'bg-gradient-to-br from-[#FF6B1A] to-[#FF8533] text-black',
  family: 'bg-gradient-to-br from-[#1565C0] to-[#42A5F5] text-white',
  head: 'bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] text-black',
  helper: 'bg-gradient-to-br from-[#7B1FA2] to-[#AB47BC] text-white',
  admin: 'bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] text-white',
};

export function UserAvatar({
  name,
  type = 'family',
  size = 36,
  className,
}: {
  name: string;
  type?: AvatarType;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center font-bold flex-shrink-0 rounded-full',
        gradients[type],
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials(name)}
    </div>
  );
}
