'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle, Hash, Brain } from 'lucide-react';
import { useDiaryStore } from '@/lib/store/diaryStore';
import { useCycleStore } from '@/lib/store/cycleStore';

interface Insight {
  icon: typeof Lightbulb;
  title: string;
  desc: string;
  type: 'positive' | 'neutral' | 'warning';
  color: string;
}

const typeConfig = {
  positive: { bg: 'from-emerald-500/5 to-emerald-500/10', border: 'border-emerald-500/20', icon: TrendingUp },
  neutral: { bg: 'from-accent/5 to-accent/10', border: 'border-accent/20', icon: Hash },
  warning: { bg: 'from-amber-500/5 to-amber-500/10', border: 'border-amber-500/20', icon: AlertCircle },
};

export function useInsights(): Insight[] {
  const entries = useDiaryStore((s) => s.entries);
  const cycles = useCycleStore((s) => s.cycles);

  return useMemo(() => {
    const result: Insight[] = [];
    if (entries.length < 3) {
      result.push({
        icon: Lightbulb,
        title: 'Keep logging!',
        desc: 'Log at least 3 entries to unlock personalized insights about your cycle.',
        type: 'neutral',
        color: 'var(--accent)',
      });
      return result;
    }

    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const recent = sorted.slice(-10);
    const avgMood = recent.reduce((s, e) => s + e.mood, 0) / recent.length;
    const avgPain = recent.reduce((s, e) => s + e.pain, 0) / recent.length;

    if (avgMood > 3.5) {
      result.push({
        icon: TrendingUp,
        title: 'Mood is rising',
        desc: `Your average mood recently is ${avgMood.toFixed(1)}/5 — higher than your overall average. Something is working!`,
        type: 'positive',
        color: 'var(--mood-5)',
      });
    }
    if (avgPain > 3) {
      result.push({
        icon: AlertCircle,
        title: 'Pain levels elevated',
        desc: `Average pain is ${avgPain.toFixed(1)}/5. Consider tracking which days are worst to find patterns.`,
        type: 'warning',
        color: 'var(--mood-1)',
      });
    }

    if (cycles.length >= 2) {
      const lengths = cycles.map((c) => c.cycleLength);
      const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      const variance = Math.max(...lengths) - Math.min(...lengths);
      if (variance <= 3) {
        result.push({
          icon: Brain,
          title: 'Very regular cycle',
          desc: `Your cycles vary by only ${variance} days (avg ${Math.round(avg)} days). That's a sign of good hormonal health!`,
          type: 'positive',
          color: 'var(--accent)',
        });
      } else {
        result.push({
          icon: TrendingDown,
          title: 'Cycle varies a lot',
          desc: `Your cycles range by ${variance} days. Stress, travel, or lifestyle changes can affect this.`,
          type: 'neutral',
          color: 'var(--phase-luteal)',
        });
      }
    }

    const symptomFreq: Record<string, number> = {};
    sorted.forEach((e) => e.symptoms?.forEach((s) => { symptomFreq[s] = (symptomFreq[s] || 0) + 1; }));
    const topSymptom = Object.entries(symptomFreq).sort((a, b) => b[1] - a[1])[0];
    if (topSymptom && topSymptom[1] >= 3) {
      result.push({
        icon: Hash,
        title: `Most common: ${topSymptom[0]}`,
        desc: `You logged "${topSymptom[0]}" ${topSymptom[1]} times. Check if it correlates with a specific phase.`,
        type: 'neutral',
        color: 'var(--phase-menstrual)',
      });
    }

    return result.slice(0, 5);
  }, [entries, cycles]);
}

export function InsightCards() {
  const insights = useInsights();

  if (insights.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-theme-primary text-sm">Smart Insights</h3>
      </div>
      {insights.map((insight, i) => {
        const tc = typeConfig[insight.type];
        const Icon = insight.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', damping: 22, stiffness: 200 }}
            className={`p-4 rounded-theme-lg bg-gradient-to-r ${tc.bg} border ${tc.border} backdrop-blur-sm`}
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-theme-sm bg-theme-card/50">
                <Icon className="w-4 h-4" style={{ color: insight.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-theme-primary">{insight.title}</p>
                <p className="text-xs text-theme-secondary mt-0.5">{insight.desc}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
