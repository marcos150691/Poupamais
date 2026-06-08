/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, PiggyBank } from 'lucide-react';
import { FinancialGoal, GoalCategory } from './types';
import { Dashboard } from './components/Dashboard';
import { GoalCard } from './components/GoalCard';
import { GoalForm } from './components/GoalForm';

export default function App() {
  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    const saved = localStorage.getItem('financial-goals');
    return saved ? JSON.parse(saved) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);

  useEffect(() => {
    localStorage.setItem('financial-goals', JSON.stringify(goals));
  }, [goals]);

  const handleSaveGoal = (data: {
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    category: GoalCategory;
  }) => {
    if (editingGoal) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editingGoal.id
            ? { ...g, ...data }
            : g
        )
      );
      setEditingGoal(null);
    } else {
      const newGoal: FinancialGoal = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setGoals((prev) => [newGoal, ...prev]);
    }
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleEditGoal = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleUpdateAmount = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, currentAmount: amount } : g))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <header className="mb-12 flex justify-between items-end">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl">
               <PiggyBank className="text-slate-950" size={32} />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-emerald-400">
              POUPA<span className="text-white">MAIS</span>
            </h1>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Patrimônio Alocado</p>
            <p className="text-2xl font-mono text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goals.reduce((acc, g) => acc + g.currentAmount, 0))}
            </p>
          </div>
        </header>

        <main className="space-y-12">
          <Dashboard goals={goals} onAddClick={() => setIsFormOpen(true)} />

          <section>
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest text-[10px]">Objetivos Ativos</h2>
               {goals.length > 0 && (
                 <span className="bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                   {goals.length} {goals.length === 1 ? 'meta' : 'metas'}
                 </span>
               )}
            </div>

            {goals.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center gap-4"
              >
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
                  <Plus className="text-emerald-400" size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Inicie seu Capital</h3>
                  <p className="text-slate-500 max-w-xs mx-auto text-sm">
                    Defina um objetivo, valor e data limite para começar sua jornada.
                  </p>
                </div>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="mt-4 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg active:scale-95 text-sm"
                  id="add-first-goal"
                >
                  Nova Meta Personalizada
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {/* Action Card first */}
                  <motion.div
                    layout
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setIsFormOpen(true)}
                    className="bg-indigo-600 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer group border border-indigo-500/50 shadow-xl"
                    id="add-goal-card"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Plus className="text-white" size={24} />
                    </div>
                    <p className="text-white font-bold">Adicionar Meta</p>
                    <p className="text-indigo-200 text-[10px] mt-1 px-4 font-medium uppercase tracking-wider">Novo objetivo financeiro</p>
                  </motion.div>

                  {goals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onEdit={handleEditGoal}
                      onDelete={handleDeleteGoal}
                      onUpdateAmount={handleUpdateAmount}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </main>

        <footer className="mt-16 pt-8 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-600 uppercase tracking-widest font-bold">
           <div className="flex gap-6">
             <span>Plano: Diversificado</span>
             <span>Status: Ativo</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <span>Sincronizado</span>
           </div>
        </footer>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <GoalForm
            onSave={handleSaveGoal}
            onClose={() => {
              setIsFormOpen(false);
              setEditingGoal(null);
            }}
            initialData={editingGoal || undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

