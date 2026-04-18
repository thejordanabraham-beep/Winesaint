import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getScoreBg(score: number): string {
  if (score >= 9.0) return 'bg-[#722F37]';
  if (score >= 8.0) return 'bg-[#ff6b35]';
  if (score >= 7.0) return 'bg-[#f4d35e]';
  if (score >= 6.0) return 'bg-[#2a9d8f]';
  return 'bg-gray-400';
}

function getScoreText(score: number): string {
  if (score >= 9.0) return 'text-white';
  if (score >= 8.0) return 'text-white';
  if (score >= 7.0) return 'text-[#1C1C1C]';
  if (score >= 6.0) return 'text-white';
  return 'text-white';
}

export function ScoreBadge({ score, size = 'md', className }: ScoreBadgeProps) {

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-serif italic score-badge border-2 border-[#1C1C1C]',
        getScoreBg(score),
        getScoreText(score),
        sizeClasses[size],
        className
      )}
    >
      {score.toFixed(1)}
    </div>
  );
}
