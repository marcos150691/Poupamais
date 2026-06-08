export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO string
  category: 'travel' | 'house' | 'car' | 'emergency' | 'other';
  createdAt: string;
}

export type GoalCategory = FinancialGoal['category'];
