'use client';

import { useState } from 'react';
import { useBudget } from '@/hooks/useBudget';

interface BudgetPageProps {
  showToast: (msg: string, type?: 'success' | '') => void;
}

const catLabels: Record<string, string> = {
  transport: '🚆 Transport',
  hotel: '🏨 Hotel',
  food: '🍛 Food',
  activity: '🎡 Activities',
  shopping: '🛍️ Shopping',
  other: '📦 Other',
};

export default function BudgetPage({ showToast }: BudgetPageProps) {
  const { expenses, totalBudget, setTotalBudget, addExpense, deleteExpense, spent, remaining, progressPct } = useBudget();
  const [budgetInput, setBudgetInput] = useState(totalBudget > 0 ? String(totalBudget) : '');
  const [cat, setCat] = useState('transport');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddExpense = () => {
    if (!desc || !amount) { showToast('⚠️ Enter description and amount'); return; }
    addExpense({ cat, desc, amount: parseFloat(amount) });
    setDesc('');
    setAmount('');
    showToast('Expense added!', 'success');
  };

  const handleBudgetBlur = () => {
    setTotalBudget(parseFloat(budgetInput) || 0);
  };

  return (
    <div>
      <div className="section-title">💰 Budget Tracker</div>
      <p className="section-sub">Track your travel expenses in ₹ INR</p>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label>💼 Total Budget (₹)</label>
          <input
            type="number"
            placeholder="e.g. 50000"
            value={budgetInput}
            onChange={e => setBudgetInput(e.target.value)}
            onBlur={handleBudgetBlur}
          />
        </div>

        <div className="budget-summary">
          <div className="budget-stat total">
            <div className="amount">₹{totalBudget.toLocaleString('en-IN')}</div>
            <div className="label">Total Budget</div>
          </div>
          <div className="budget-stat spent">
            <div className="amount">₹{spent.toLocaleString('en-IN')}</div>
            <div className="label">Spent</div>
          </div>
          <div className="budget-stat remaining">
            <div className="amount" style={{ color: remaining < 0 ? '#e53935' : undefined }}>
              ₹{remaining.toLocaleString('en-IN')}
            </div>
            <div className="label">Remaining</div>
          </div>
        </div>

        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{ width: `${progressPct}%` }} />
        </div>
        <p style={{ fontSize: '0.8rem', color: '#888' }}>{progressPct.toFixed(0)}% of budget used</p>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, marginBottom: '14px', color: 'var(--maroon)' }}>
          ➕ Add Expense
        </div>
        <div className="form-row three">
          <div className="form-group">
            <label>Category</label>
            <select value={cat} onChange={e => setCat(e.target.value)}>
              {Object.entries(catLabels).map(([val, lbl]) => (
                <option key={val} value={val}>{lbl}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. Train tickets" />
          </div>
          <div className="form-group">
            <label>Amount (₹)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 1500" />
          </div>
        </div>
        <button className="btn" onClick={handleAddExpense}>➕ Add Expense</button>
      </div>

      {expenses.length > 0 && (
        <div className="card">
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, marginBottom: '14px', color: 'var(--maroon)' }}>
            📋 Expenses
          </div>
          {expenses.map(exp => (
            <div key={exp.id} className="expense-row">
              <span className={`category-badge cat-${exp.cat}`}>{catLabels[exp.cat] || exp.cat}</span>
              <span>{exp.desc}</span>
              <span style={{ fontWeight: 700, color: 'var(--saffron)' }}>₹{exp.amount.toLocaleString('en-IN')}</span>
              <button className="del-btn" onClick={() => deleteExpense(exp.id)}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
