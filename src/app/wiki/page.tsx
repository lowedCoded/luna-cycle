'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, BookOpen, FileSearch } from 'lucide-react';
import { wikiArticles } from '@/data/wiki';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, damping: 22, stiffness: 200 } },
};

export default function WikiPage() {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return wikiArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.titleRu.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.categoryRu.toLowerCase().includes(q)
    );
  }, [search]);

  const categories = useMemo(() => {
    const cats = new Set(filtered.map((a) => a.category));
    return Array.from(cats);
  }, [filtered]);

  return (
    <div className="relative min-h-[calc(100vh-6rem)]">
      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="flex items-center gap-2 mb-6"
        >
          <BookOpen className="w-5 h-5 text-accent" />
          <h1 className="text-2xl font-bold text-theme-primary">Википедия цикла</h1>
        </motion.div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск статей..."
            className="w-full bg-theme-card border border-theme rounded-theme-xl pl-10 pr-4 py-3 text-sm text-theme-primary outline-none transition-all focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow)]"
          />
        </div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FileSearch className="w-16 h-16 text-theme-muted mb-4" />
            </motion.div>
            <p className="text-lg font-medium text-theme-primary mb-1">Ничего не найдено</p>
            <p className="text-sm text-theme-muted">Попробуйте изменить поисковый запрос</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {categories.map((cat) => {
              const articles = filtered.filter((a) => a.category === cat);
              const catRu = articles[0]?.categoryRu || cat;
              return (
                <div key={cat}>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-theme-muted mb-3">{catRu}</h2>
                  <div className="space-y-2">
                    {articles.map((article) => (
                      <motion.div
                        key={article.id}
                        variants={cardVariants}
                        whileHover={{ x: 4, transition: { type: 'spring', damping: 20 } }}
                        layout
                        className="rounded-theme-xl bg-theme-card border border-theme overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                          className="w-full flex items-center gap-3 p-4 text-left hover:bg-theme-card-hover transition-colors"
                        >
                          <span className="text-xl">{article.icon}</span>
                          <span className="flex-1 text-sm font-medium text-theme-primary">{article.titleRu}</span>
                          {expandedId === article.id ? (
                            <ChevronUp className="w-4 h-4 text-theme-muted" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-theme-muted" />
                          )}
                        </button>
                        <AnimatePresence>
                          {expandedId === article.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 space-y-2">
                                {article.contentRu.map((paragraph, i) => (
                                  <motion.p
                                    key={i}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04, type: 'spring', damping: 24, stiffness: 200 }}
                                    className="text-xs text-theme-secondary leading-relaxed"
                                  >
                                    {paragraph}
                                  </motion.p>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
