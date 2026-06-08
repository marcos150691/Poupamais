import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { FinancialGoal } from '../types';
import { formatCurrency } from '../lib/utils';

interface GoalChartsProps {
  goals: FinancialGoal[];
}

export function GoalCharts({ goals }: GoalChartsProps) {
  if (goals.length === 0) return null;

  const data = goals.map(goal => ({
    name: goal.title.length > 15 ? goal.title.substring(0, 12) + '...' : goal.title,
    Alocado: goal.currentAmount,
    Meta: goal.targetAmount,
    color: '#34d399', // Default emerald
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm font-mono text-emerald-400">
              Acumulado: {formatCurrency(payload[0].value)}
            </p>
            <p className="text-sm font-mono text-slate-400">
              Objetivo: {formatCurrency(payload[1].value)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[300px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Comparativo de Alocação</h3>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.4 }} />
          <Bar dataKey="Alocado" radius={[6, 6, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#34d399" />
            ))}
          </Bar>
          <Bar dataKey="Meta" radius={[6, 6, 0, 0]} barSize={40} fill="#1e293b opacity-20" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
