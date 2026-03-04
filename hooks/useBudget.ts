'use client';

import { useLocalStorage } from './useLocalStorage';
import type { Expense } from '@/types';

export function useBudget() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('yatra_expenses', []);
  const [totalBudget, setTotalBudget] = useLocalStorage<number>('yatra_budget', 0);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses(prev => [...prev, { ...expense, id: Date.now() }]);
  };

  const deleteExpense = (id: number) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - spent;
  const progressPct = totalBudget ? Math.min(100, (spent / totalBudget) * 100) : 0;

  return { expenses, totalBudget, setTotalBudget, addExpense, deleteExpense, spent, remaining, progressPct };
}
