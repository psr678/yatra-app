'use client';

import { useState } from 'react';
import { useBudget } from '@/hooks/useBudget';

interface BudgetPageProps {
  showToast: (msg: string, type?: 'success' | '') => void;
}

const CATS: Record<string, { label: string; emoji: string; css: string }> = {
  transport: { label: 'Transport',  emoji: '🚆', css: 'cat-transport' },
  hotel:     { label: 'Hotel',      emoji: '🏨', css: 'cat-hotel' },
  food:      { label: 'Food',       emoji: '🍛', css: 'cat-food' },
  activity:  { label: 'Activities', emoji: '🎡', css: 'cat-activity' },
  shopping:  { label: 'Shopping',   emoji: '🛍️', css: 'cat-shopping' },
  other:     { label: 'Other',      emoji: '📦', css: 'cat-other' },
};

export default function BudgetPage({ showToast }: BudgetPageProps) {
  const { expenses, totalBudget, setTotalBudget, addExpense, deleteExpense, spent, remaining, progressPct } = useBudget();
  const [budgetInput, setBudgetInput] = useState(totalBudget > 0 ? String(totalBudget) : '');
  const [cat, setCat] = useState('transport');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  const overspent = remaining < 0;

  const handleAdd = () => {
    if (!desc || !amount) { showToast('⚠️ Enter description and amount'); return; }
    addExpense({ cat, desc, amount: parseFloat(amount) });
    setDesc(''); setAmount('');
    showToast('Expense added!', 'success');
  };

  return (
    <div>
      {/* Budget setup */}
      <div className="budget-setup" style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', marginBottom: '28px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', color: 'var(--muted)', marginBottom: '6px' }}>
            Total Trip Budget (₹)
          </label>
          <input
            type="number"
            placeholder="e.g. 50000"
            value={budgetInput}
            onChange={e => setBudgetInput(e.target.value)}
            onBlur={() => setTotalBudget(parseFloat(budgetInput) || 0)}
            style={{ maxWidth: '220px', fontSize: '1rem', padding: '11px 14px' }}
          />
        </div>
        {totalBudget > 0 && (
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)', paddingBottom: '11px' }}>
            Budget set: <strong style={{ color: 'var(--navy)' }}>₹{totalBudget.toLocaleString('en-IN')}</strong>
          </span>
        )}
      </div>

      {/* Stat cards */}
      <div className="budget-stats">
        <div className="bstat total">
          <div className="bstat-label">Total Budget</div>
          <div className="bstat-amount">₹{totalBudget.toLocaleString('en-IN')}</div>
          <div className="bstat-sub">Set your total trip budget above</div>
        </div>
        <div className="bstat spent">
          <div className="bstat-label">Total Spent</div>
          <div className="bstat-amount">₹{spent.toLocaleString('en-IN')}</div>
          <div className="bstat-sub">{expenses.length} expense{expenses.length !== 1 ? 's' : ''} logged</div>
        </div>
        <div className={`bstat ${overspent ? 'over' : 'remaining'}`}>
          <div className="bstat-label">{overspent ? 'Over Budget' : 'Remaining'}</div>
          <div className={`bstat-amount ${overspent ? 'over' : ''}`}>
            {overspent ? '-' : ''}₹{Math.abs(remaining).toLocaleString('en-IN')}
          </div>
          <div className="bstat-sub">
            {overspent ? `⚠️ ${progressPct.toFixed(0)}% of budget used` : `${progressPct.toFixed(0)}% of budget used`}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-track" style={{ marginBottom: '28px' }}>
        <div className={`progress-fill ${overspent ? 'over' : ''}`} style={{ width: `${Math.min(progressPct, 100)}%` }} />
      </div>

      {/* Add expense */}
      <div className="add-expense-card">
        <div className="card-header">➕ Add Expense</div>
        <div className="add-expense-row">
          <div className="field">
            <label>Category</label>
            <select value={cat} onChange={e => setCat(e.target.value)}>
              {Object.entries(CATS).map(([val, { emoji, label }]) => (
                <option key={val} value={val}>{emoji} {label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Description</label>
            <input
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="e.g. Overnight train to Goa"
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div className="field">
            <label>Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 1500"
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div style={{ paddingTop: '26px' }}>
            <button className="btn" onClick={handleAdd} style={{ height: '43px', whiteSpace: 'nowrap' }}>
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Expense list */}
      {expenses.length > 0 ? (
        <div className="expense-table">
          <div className="expense-table-head">
            <span>Category</span>
            <span>Description</span>
            <span style={{ textAlign: 'right' }}>Amount</span>
            <span />
          </div>
          {expenses.map(exp => (
            <div key={exp.id} className="expense-row">
              <span>
                <span className={`cat-badge ${CATS[exp.cat]?.css || 'cat-other'}`}>
                  {CATS[exp.cat]?.emoji} {CATS[exp.cat]?.label || exp.cat}
                </span>
              </span>
              <span style={{ color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {exp.desc}
              </span>
              <span className="expense-amount">₹{exp.amount.toLocaleString('en-IN')}</span>
              <span>
                <button className="del-btn" onClick={() => deleteExpense(exp.id)} title="Delete">🗑️</button>
              </span>
            </div>
          ))}
          <div className="expense-total">
            Total Spent: ₹{spent.toLocaleString('en-IN')}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">💸</div>
          <div className="empty-title">No expenses logged yet</div>
          <div className="empty-sub">Add your first expense above to start tracking your trip budget</div>
        </div>
      )}
    </div>
  );
}
