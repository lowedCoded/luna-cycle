'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Printer, Download, X } from 'lucide-react';
import { useDiaryStore } from '@/lib/store/diaryStore';
import { useCycleStore } from '@/lib/store/cycleStore';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useUserStore } from '@/lib/store/userStore';
import { getTotalStats } from '@/lib/analysis';
import { format, parseISO } from 'date-fns';

interface HealthReportProps {
  onClose: () => void;
}

const moodColor = (m: number) => ['#ef9a9a', '#ffab91', '#ffe0b2', '#c5e1a5', '#a5d6a7'][m - 1] || '#eee';

export function HealthReport({ onClose }: HealthReportProps) {
  const entries = useDiaryStore((s) => s.entries);
  const cycles = useCycleStore((s) => s.cycles);
  const lang = useSettingsStore((s) => s.lang);
  const user = useUserStore();

  const stats = useMemo(() => getTotalStats(entries, cycles), [entries, cycles]);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [entries]);

  const sortedCycles = useMemo(() => {
    return [...cycles].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [cycles]);

  const extraStats = useMemo(() => {
    const withWater = entries.filter((e) => e.water !== undefined);
    const withSleep = entries.filter((e) => e.sleep !== undefined);
    const withBbt = entries.filter((e) => e.bbt !== undefined);
    const withEnergy = entries.filter((e) => e.energy !== undefined);
    const withStress = entries.filter((e) => e.stress !== undefined);
    const withPmdd = entries.filter((e) => e.pmdd);

    const avgWater = withWater.length > 0 ? (withWater.reduce((s, e) => s + (e.water || 0), 0) / withWater.length).toFixed(1) : '—';
    const avgSleep = withSleep.length > 0 ? (withSleep.reduce((s, e) => s + (e.sleep || 0), 0) / withSleep.length).toFixed(1) : '—';
    const avgBbt = withBbt.length > 0 ? (withBbt.reduce((s, e) => s + (e.bbt || 0), 0) / withBbt.length).toFixed(2) : '—';
    const avgEnergy = withEnergy.length > 0 ? (withEnergy.reduce((s, e) => s + (e.energy || 0), 0) / withEnergy.length).toFixed(1) : '—';
    const avgStress = withStress.length > 0 ? (withStress.reduce((s, e) => s + (e.stress || 0), 0) / withStress.length).toFixed(1) : '—';

    const pmddAverages: Record<string, string> = {};
    if (withPmdd.length > 0) {
      const keys = ['irritability', 'anxiety', 'depression', 'crying_spells', 'overwhelm', 'anger', 'hopelessness'];
      for (const key of keys) {
        const vals = withPmdd.map((e) => e.pmdd?.[key as keyof typeof e.pmdd] || 0);
        pmddAverages[key] = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
      }
    }

    return { avgWater, avgSleep, avgBbt, avgEnergy, avgStress, pmddAverages, pmddCount: withPmdd.length };
  }, [entries]);

  const handlePrint = () => window.print();

  const t = (ru: string, en: string) => lang === 'ru' ? ru : en;

  const pmddLabels: Record<string, [string, string]> = {
    irritability: ['Раздражительность', 'Irritability'],
    anxiety: ['Тревожность', 'Anxiety'],
    depression: ['Подавленность', 'Depression'],
    crying_spells: ['Плаксивость', 'Crying spells'],
    overwhelm: ['Перегрузка', 'Overwhelm'],
    anger: ['Гнев', 'Anger'],
    hopelessness: ['Безнадёжность', 'Hopelessness'],
  };

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #health-report, #health-report * { visibility: visible; }
          #health-report { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          @page { margin: 1.5cm; size: A4; }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 no-print">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10 no-print">
            <h2 className="text-lg font-bold text-gray-800">
              {t('Отчёт для врача', 'Health Report')}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors">
                <Printer className="w-4 h-4" /> {t('Печать', 'Print')}
              </button>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div id="health-report" className="p-6 text-gray-800">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-purple-700">🌸 Luna Health Report</h1>
              <p className="text-sm text-gray-500">{t('Сформирован', 'Generated')}: {format(new Date(), 'MMMM d, yyyy')}</p>
              {user.profile?.nickname && (
                <p className="text-sm text-gray-500">{t('Пациент', 'Patient')}: {user.profile?.nickname}</p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('Динамика настроения', 'Mood Trend')}</h3>
              <div className="flex items-end gap-1 h-24">
                {sortedEntries.slice(-30).map((e) => (
                  <div
                    key={e.id}
                    className="flex-1 rounded-t-sm transition-all hover:opacity-80 relative group"
                    style={{ height: `${(e.mood / 5) * 100}%`, background: moodColor(e.mood), minHeight: '4px' }}
                    title={`${e.date}: ${e.mood}/5`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>1 {t('мес', 'mo')}</span>
                <span>{t('сейчас', 'now')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: t('Среднее настроение', 'Avg Mood'), value: stats.avgMood, emoji: '😊' },
                { label: t('Средняя боль', 'Avg Pain'), value: stats.avgPain, emoji: '🔥' },
                { label: t('Всего записей', 'Total Entries'), value: stats.totalEntries, emoji: '📝' },
                { label: t('Циклов отслежено', 'Cycles Tracked'), value: stats.totalCycles, emoji: '🔄' },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                  <p className="text-xl mb-1">{s.emoji}</p>
                  <p className="text-lg font-bold text-gray-800">{s.value}</p>
                  <p className="text-[10px] text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {extraStats.avgWater !== '—' && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-lg font-bold text-gray-800">{extraStats.avgWater} 💧</p>
                  <p className="text-[10px] text-gray-500">{t('Вода (среднее)', 'Avg Water (glasses)')}</p>
                </div>
              )}
              {extraStats.avgSleep !== '—' && (
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                  <p className="text-lg font-bold text-gray-800">{extraStats.avgSleep}ч 🌙</p>
                  <p className="text-[10px] text-gray-500">{t('Сон (среднее)', 'Avg Sleep')}</p>
                </div>
              )}
              {extraStats.avgBbt !== '—' && (
                <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
                  <p className="text-lg font-bold text-gray-800">{extraStats.avgBbt}°C 🌡️</p>
                  <p className="text-[10px] text-gray-500">{t('БТТ (средняя)', 'Avg BBT')}</p>
                </div>
              )}
              {extraStats.avgEnergy !== '—' && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                  <p className="text-lg font-bold text-gray-800">{extraStats.avgEnergy}/5 ⚡</p>
                  <p className="text-[10px] text-gray-500">{t('Энергия (среднее)', 'Avg Energy')}</p>
                </div>
              )}
              {extraStats.avgStress !== '—' && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                  <p className="text-lg font-bold text-gray-800">{extraStats.avgStress}/5 🧠</p>
                  <p className="text-[10px] text-gray-500">{t('Стресс (средний)', 'Avg Stress')}</p>
                </div>
              )}
            </div>

            {extraStats.pmddCount > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('ПМДР симптомы (среднее)', 'Avg PMDD Symptoms')}</h3>
                <div className="space-y-2">
                  {Object.entries(extraStats.pmddAverages).map(([key, val]) => {
                    const labels = pmddLabels[key] || [key, key];
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-28">{lang === 'ru' ? labels[0] : labels[1]}</span>
                        <div className="flex-1 h-4 rounded bg-orange-100 overflow-hidden">
                          <div className="h-full rounded bg-orange-400" style={{ width: `${(Number(val) / 5) * 100}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-6 text-right">{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {stats.topSymptoms.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('Частые симптомы', 'Top Symptoms')}</h3>
                <div className="space-y-2">
                  {stats.topSymptoms.map(([symptom, count], i) => (
                    <div key={symptom} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                      <div className="flex-1 h-5 rounded bg-purple-100 overflow-hidden">
                        <div
                          className="h-full rounded bg-purple-500 flex items-center px-2"
                          style={{ width: `${Math.min(100, (count / Math.max(...stats.topSymptoms.map(([, c]) => c))) * 100)}%` }}
                        >
                          <span className="text-[10px] text-white font-medium">{symptom}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 w-6 text-right">{count}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sortedCycles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('История циклов', 'Cycle History')}</h3>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-1 text-gray-500 font-medium">{t('Начало', 'Start')}</th>
                      <th className="text-left py-1 text-gray-500 font-medium">{t('Конец', 'End')}</th>
                      <th className="text-right py-1 text-gray-500 font-medium">{t('Длина', 'Length')}</th>
                      <th className="text-right py-1 text-gray-500 font-medium">{t('Менстр.', 'Period')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCycles.slice(-10).reverse().map((c) => (
                      <tr key={c.id} className="border-b border-gray-100">
                        <td className="py-1.5">{format(parseISO(c.startDate), 'MMM d, yyyy')}</td>
                        <td className="py-1.5">{c.endDate ? format(parseISO(c.endDate), 'MMM d, yyyy') : '—'}</td>
                        <td className="py-1.5 text-right">{c.cycleLength}d</td>
                        <td className="py-1.5 text-right">{c.periodLength}d</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="text-center text-[10px] text-gray-400 mt-6">
              {t('Сгенерировано приложением Luna. Данные хранятся локально.', 'Generated by Luna app. Data stored locally.')}
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
