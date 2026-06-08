import React from 'react';
import { Wallet, Target, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { FinancialGoal } from '../types';
import { formatCurrency, calculateProgress } from '../lib/utils';
import { GoalCharts } from './GoalCharts';

interface DashboardProps {
  goals: FinancialGoal[];
  onAddClick: () => void;
}

export function Dashboard({ goals, onAddClick }: DashboardProps) {
  const totalSaved = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
  const totalTarget = goals.reduce((acc, goal) => acc + goal.targetAmount, 0);
  const overallProgress = calculateProgress(totalSaved, totalTarget);

  return (
    <div className="grid grid-cols-12 grid-rows-2 gap-4">
      <div className="col-span-12 md:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Patrimônio Ativo
          </div>
        </div>

        <div>
           <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Visão Geral</h2>
           <div className="flex items-baseline gap-2">
             <p className="text-5xl font-mono font-bold text-white tracking-tighter">
               {overallProgress}<span className="text-emerald-500">%</span>
             </p>
             <p className="text-slate-400 text-sm font-medium">do objetivo total concluído</p>
           </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
             <span>Progresso Atual</span>
             <span className="text-white font-mono">{formatCurrency(totalSaved)} / {formatCurrency(totalTarget)}</span>
          </div>
        </div>
      </div>

      <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
        <div className="bg-emerald-500 rounded-3xl p-6 text-slate-950 flex flex-col justify-between shadow-lg shadow-emerald-500/20 flex-1">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
              <Wallet size={20} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest">Total Acumulado</p>
          </div>
          <div>
            <p className="text-3xl font-mono font-bold leading-none">{formatCurrency(totalSaved)}</p>
            <p className="text-[10px] font-bold uppercase tracking-tighter opacity-70 mt-2">Capital em custódia</p>
          </div>
        </div>
      </div>

      <div className="col-span-12">
        <GoalCharts goals={goals} />
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, id }: { title: string; value: string; icon: React.ReactNode; id?: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm" id={id}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}
