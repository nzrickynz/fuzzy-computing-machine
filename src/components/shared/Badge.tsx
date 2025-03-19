interface BadgeProps {
  label: string;
  type: 'tag' | 'project';
  isUsed?: boolean;
}

export function Badge({ label, type, isUsed = false }: BadgeProps) {
  const prefix = type === 'tag' ? '#' : '@';
  const baseStyles = 'px-2 py-1 text-sm rounded-lg';
  
  const variants = {
    tag: isUsed
      ? 'bg-gray-700/50 text-gray-400'
      : 'bg-blue-900/50 text-blue-300',
    project: isUsed
      ? 'bg-gray-700/50 text-gray-400'
      : 'bg-green-900/50 text-green-300',
  };

  return (
    <span className={`${baseStyles} ${variants[type]}`}>
      {prefix}{label}
    </span>
  );
} 