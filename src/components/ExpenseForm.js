// src/components/ExpenseForm.js
import React, { useState } from 'react';

const ExpenseForm = ({ categories, onAddExpense }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: categories[0],
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description.trim() || !formData.amount || formData.amount <= 0) {
      alert('Please fill in all fields with valid values');
      return;
    }

    onAddExpense(formData);
    
    // Reset form
    setFormData({
      description: '',
      amount: '',
      category: categories[0],
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="expense-form-card">
      <h3>Add New Expense</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter expense description"
            required
          />
        </div>

        <div className="form-group">
          <label>Amount ($)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="add-button">
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;