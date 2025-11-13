// src/components/ExpenseList.js
import React from 'react';

const ExpenseList = ({ expenses, onDeleteExpense }) => {
  if (expenses.length === 0) {
    return (
      <div className="expense-list">
        <h3>Recent Expenses</h3>
        <p className="no-expenses">No expenses found</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <h3>Recent Expenses</h3>
      <div className="expense-items">
        {expenses.map(expense => (
          <div key={expense.id} className="expense-item">
            <div className="expense-info">
              <div className="expense-description">{expense.description}</div>
              <div className="expense-category">{expense.category}</div>
              <div className="expense-date">
                {new Date(expense.date).toLocaleDateString()}
              </div>
            </div>
            <div className="expense-actions">
              <span className="expense-amount">
                ${parseFloat(expense.amount).toFixed(2)}
              </span>
              <button 
                className="delete-button"
                onClick={() => onDeleteExpense(expense.id)}
                aria-label="Delete expense"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;