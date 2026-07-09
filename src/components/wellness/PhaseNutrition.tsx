'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { nutritionByPhase } from '@/data/nutrition';
import { useCycleStore } from '@/lib/store/cycleStore';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { Apple, ChevronDown, ChevronUp, Info } from 'lucide-react';

export function PhaseNutrition() {
  const getPhaseForDate = useCycleStore((s) => s.getPhaseForDate);
  const avgCycleLength = useSettingsStore((s) => s.averageCycleLength);
  const avgPeriodLength = useSettingsStore((s) => s.averagePeriodLength);
  const [expanded, setExpanded] = useState(false);

  const currentPhase = getPhaseForDate(new Date(), avgCycleLength, avgPeriodLength);
  const phaseData = nutritionByPhase.find((p) => p.phase === currentPhase) || nutritionByPhase[1];

  const [isRu, setIsRu] = useState(false);
  useEffect(() => {
    setIsRu((localStorage.getItem('cycle-tracker-settings') || '').includes('"lang":"ru"'));
  }, []);

  return (
    <div className="rounded-theme-xl bg-theme-card/80 backdrop-blur-xl border border-theme/50 shadow-theme p-5" style={{ marginTop: '-200px' }}>
      <div className="flex items-center gap-2 mb-4">
        <Apple className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold text-theme-primary">{isRu ? 'Питание по фазе' : 'Phase Nutrition'}</h3>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{phaseData.icon}</span>
        <div>
          <div className="text-sm font-medium text-theme-primary">
            {isRu ? phaseData.titleRu : phaseData.title}
          </div>
          <div className="text-xs text-theme-muted">{isRu ? phaseData.focusRu : phaseData.focus}</div>
        </div>
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-accent hover:text-accent-light transition-colors mb-2"
      >
        <Info className="w-3 h-3" />
        {isRu ? 'Рекомендации' : 'Recommendations'}
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {phaseData.foods.map((food, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-2 rounded-theme-md bg-theme-card-hover"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{food.emoji}</span>
                    <span className="text-xs font-medium text-theme-primary">{food.name}</span>
                  </div>
                  <p className="text-[10px] text-theme-muted mt-0.5 break-words">{isRu ? food.benefitRu : food.benefit}</p>
                </motion.div>
              ))}
            </div>
            <div>
              <p className="text-[10px] font-medium text-red-400 mb-1">{isRu ? 'Избегать:' : 'Avoid:'}</p>
              <div className="flex flex-wrap gap-1">
                {(isRu ? phaseData.avoidRu : phaseData.avoid).map((a, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-red-900/20 text-[10px] text-red-400">{a}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium text-theme-primary mb-1">{isRu ? 'Советы:' : 'Tips:'}</p>
              <ul className="list-disc list-inside text-[10px] text-theme-secondary space-y-0.5">
                {(isRu ? phaseData.tipsRu : phaseData.tips).map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
