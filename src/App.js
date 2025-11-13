 // src/App.js (Enhanced Version)
import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseChart from './components/ExpenseChart';
import ThemeToggle from './components/ThemeToggle';
import CategoryFilter from './components/CategoryFilter';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { formatCurrency, getWeekRange } from './utils/helpers';
import './styles/App.css';

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Other'
];

const SAMPLE_EXPENSES = [
  {
    id: '1',
    description: 'Groceries',
    amount: '85.50',
    category: 'Food & Dining',
    date: new Date().toISOString()
  },
  {
    id: '2',
    description: 'Gas',
    amount: '45.00',
    category: 'Transportation',
    date: new Date(Date.now() - 86400000).toISOString()
  }
];

function App() {
  const [expenses, setExpenses] = useLocalStorage('expenses', SAMPLE_EXPENSES);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [timeRange, setTimeRange] = useState('monthly');
  const [searchTerm, setSearchTerm] = useState('');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    let filtered = expenses;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredExpenses(filtered);
  }, [expenses, selectedCategory, searchTerm]);

  const addExpense = (expense) => {
    const newExpense = {
      id: Date.now().toString(),
      ...expense,
      date: new Date(expense.date).toISOString()
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const clearAllExpenses = () => {
    if (window.confirm('Are you sure you want to delete all expenses? This action cannot be undone.')) {
      setExpenses([]);
    }
  };

  const getTotalExpenses = () => {
    return filteredExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  };

  const getWeeklyTotal = () => {
    const weekDates = getWeekRange();
    const weeklyExpenses = expenses.filter(expense =>
      weekDates.includes(expense.date.split('T')[0])
    );
    return weeklyExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  };

  return (
    <div className={`app ${theme}`}>
      <div className="container">
        <header className="header">
          <div className="header-content">
            <div className="header-title">
              <h1>💰 FinTrack</h1>
              <p>Track and visualize your spending</p>
            </div>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </header>

        <div className="dashboard">
          <div className="sidebar">
            <ExpenseForm 
              categories={CATEGORIES} 
              onAddExpense={addExpense} 
            />
            
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Total Expenses</h3>
                <p className="total-amount">{formatCurrency(getTotalExpenses())}</p>
                <p>{filteredExpenses.length} transactions</p>
              </div>
              
              <div className="summary-card">
                <h3>This Week</h3>
                <p className="total-amount">{formatCurrency(getWeeklyTotal())}</p>
                <p>Last 7 days</p>
              </div>
            </div>
          </div>

          <div className="main-content">
            <div className="controls">
              <div className="search-filter">
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <CategoryFilter
                categories={['All', ...CATEGORIES]}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              
              <div className="time-filter">
                <button 
                  className={timeRange === 'weekly' ? 'active' : ''}
                  onClick={() => setTimeRange('weekly')}
                >
                  📅 Weekly
                </button>
                <button 
                  className={timeRange === 'monthly' ? 'active' : ''}
                  onClick={() => setTimeRange('monthly')}
                >
                  📊 Monthly
                </button>
              </div>

              <button 
                className="clear-button"
                onClick={clearAllExpenses}
                disabled={expenses.length === 0}
              >
                🗑️ Clear All
              </button>
            </div>

            <ExpenseChart 
              expenses={filteredExpenses} 
              timeRange={timeRange}
            />

            <ExpenseList 
              expenses={filteredExpenses}
              onDeleteExpense={deleteExpense}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;