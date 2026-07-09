import { BreathingExercise } from '@/components/wellness/BreathingExercise';

export default function BreathePage() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-theme-primary">Дыхание</h1>
        <p className="text-sm text-theme-muted mt-1">Дыхательные практики для расслабления и снятия боли</p>
      </div>
      <BreathingExercise />
    </div>
  );
}
