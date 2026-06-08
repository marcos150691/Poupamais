import React, { useState } from 'react';
import { differenceInDays, format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Car, 
  Home, 
  MoreHorizontal, 
  Palmtree, 
  Plus, 
  ShieldCheck, 
  Trash2 
} from 'lucide-react';
import { FinancialGoal, GoalCategory } from '../types';
import { calculateProgress, formatCurrency, calculateMonthlyRequirement, calculateDailyRequirement } from '../lib/utils';

interface GoalCardProps {
  goal: FinancialGoal;
  onDelete: (id: string) => void;
  onUpdateAmount: (id: string, amount: number) => void;
}

const categoryIcons: Record<GoalCategory, any> = {
  travel: Palmtree,
  house: Home,
  car: Car,
  emergency: ShieldCheck,
  other: MoreHorizontal,
};

const categoryColors: Record<GoalCategory, string> = {
  travel: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  house: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  car: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  emergency: 'bg-red-500/10 text-red-400 border-red-500/20',
  other: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onDelete, onUpdateAmount }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const Icon = categoryIcons[goal.category];
  const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
  const deadlineDate = parseISO(goal.deadline);
  const today = new Date();
  const diff = differenceInDays(deadlineDate, today);
  const isExpired = diff < 0;
  const monthlyReq = calculateMonthlyRequirement(goal.targetAmount, goal.currentAmount, goal.deadline);
  const dailyReq = calculateDailyRequirement(goal.targetAmount, goal.currentAmount, goal.deadline);

  const handleAddCustom = () => {
    const val = parseFloat(inputValue);
    if (!isNaN(val) && val > 0) {
      onUpdateAmount(goal.id, goal.currentAmount + val);
      setInputValue('');
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-colors min-h-[280px]"
      id={`goal-${goal.id}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${categoryColors[goal.category]}`}>
            <Icon size={18} />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-tight">{goal.title}</h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase">
              {format(deadlineDate, "MMMM yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="p-1.5 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
          id={`delete-${goal.id}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acumulado</span>
                {progress === 100 && (
                   <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-bold uppercase">Concluído</span>
                )}
             </div>
             <p className="text-xl font-mono underline decoration-emerald-500/30 underline-offset-4 text-white">
               {formatCurrency(goal.currentAmount)}
             </p>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Objetivo</p>
             <p className="text-sm font-mono text-slate-300">{formatCurrency(goal.targetAmount)}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span>Progresso</span>
            <span className="text-white font-mono">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 border-t border-slate-800/50">
           <AnimatePresence mode="wait">
             {isAdding ? (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="flex items-center gap-2"
               >
                 <input 
                   type="number"
                   autoFocus
                   placeholder="Valor R$"
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                   className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                 />
                 <button 
                    onClick={handleAddCustom}
                    className="bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest"
                 >
                   Ok
                 </button>
                 <button 
                    onClick={() => setIsAdding(false)}
                    className="text-slate-500 p-1.5"
                 >
                   <Plus size={14} className="rotate-45" />
                 </button>
               </motion.div>
             ) : (
               <div className="flex justify-between items-center">
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest text-nowrap">Mensal</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {monthlyReq > 0 ? formatCurrency(monthlyReq) : 'Concluído'}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest text-nowrap">Diário</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {dailyReq > 0 ? formatCurrency(dailyReq) : 'Concluído'}
                    </span>
                  </div>
                </div>
                 <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsAdding(true)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 transition-all"
                      title="Adicionar valor personalizado"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => onUpdateAmount(goal.id, Math.max(0, goal.currentAmount - 100))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
                      id={`minus-${goal.id}`}
                    >
                      -
                    </button>
                    <button
                      onClick={() => onUpdateAmount(goal.id, goal.currentAmount + 100)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-all font-bold shadow-sm"
                      id={`plus-${goal.id}`}
                    >
                      +
                    </button>
                 </div>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
