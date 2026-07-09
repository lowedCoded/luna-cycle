import { HeatingPad } from '@/components/wellness/HeatingPad';

export default function WarmthPage() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-theme-primary">Грелка и тепло</h1>
        <p className="text-sm text-theme-muted mt-1">Таймер для согревающих процедур</p>
      </div>
      <HeatingPad />
    </div>
  );
}
