const tagColorPalette = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#d946ef', '#ec4899', '#14b8a6',
  '#f43f5e', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa',
  '#fb923c', '#4ade80', '#2dd4bf', '#818cf8', '#c084fc',
];

function hashTag(tag: string): number {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = ((hash << 5) - hash) + tag.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getTagColor(tag: string): string {
  return tagColorPalette[hashTag(tag) % tagColorPalette.length];
}
