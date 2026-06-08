import React, { useState } from 'react';
import { X, Target, Calendar, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoalCategory } from '../types';

interface GoalFormProps {
  onAdd: (data: {
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    category: GoalCategory;
  }) => void;
  onClose: () => void;
}

const categories: { label: string; value: GoalCategory }[] = [
  { label: 'Viagem', value: 'travel' },
  { label: 'Casa', value: 'house' },
  { label: 'Carro', value: 'car' },
  { label: 'Reserva de Emergência', value: 'emergency' },
  { label: 'Outros', value: 'other' },
];

export function GoalForm({ onAdd, onClose }: GoalFormProps) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState<GoalCategory>('other');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount || !deadline) return;

    onAdd({
      title,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
      deadline,
      category,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-md bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800"
        id="goal-form"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tighter uppercase italic">Nova Meta</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white transition-colors"
            id="close-form"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Tag size={12} className="text-emerald-500" /> Objetivo de Capital
            </label>
            <input
              autoFocus
              type="text"
              placeholder="Ex: Reserva Estratégica"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
              required
              id="input-title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Target size={12} className="text-emerald-500" /> Meta (R$)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                required
                id="input-target"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                Alocado (R$)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                id="input-current"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Calendar size={12} className="text-emerald-500" /> Data Limite
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all [color-scheme:dark]"
              required
              id="input-deadline"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Escopo do Projeto</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl border transition-all ${
                    category === cat.value
                      ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                  }`}
                  id={`cat-${cat.value}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-emerald-500 text-slate-950 rounded-2xl font-black uppercase tracking-[0.3em] text-sm hover:bg-emerald-400 transition-all mt-4 shadow-xl shadow-emerald-500/10 active:scale-[0.98]"
            id="submit-goal"
          >
            Lançar Meta
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
