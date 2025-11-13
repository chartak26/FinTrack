// src/components/ExpenseChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ExpenseChart = ({ expenses, timeRange }) => {
  const processChartData = () => {
    if (timeRange === 'weekly') {
      return processWeeklyData();
    } else {
      return processMonthlyData();
    }
  };

  const processWeeklyData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayExpenses = expenses.filter(exp => exp.date.startsWith(date));
      const total = dayExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      
      return {
        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        amount: total
      };
    });
  };

  const processMonthlyData = () => {
    const monthlyData = expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short' });
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += parseFloat(expense.amount);
      return acc;
    }, {});

    return Object.entries(monthlyData).map(([month, amount]) => ({
      name: month,
      amount: amount
    }));
  };

  const processCategoryData = () => {
    const categoryData = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += parseFloat(expense.amount);
      return acc;
    }, {});

    return Object.entries(categoryData).map(([name, value]) => ({
      name,
      value
    }));
  };

  const chartData = processChartData();
  const categoryData = processCategoryData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  return (
    <div className="chart-container">
      <div className="chart-section">
        <h4>{timeRange === 'weekly' ? 'Weekly' : 'Monthly'} Expenses</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h4>Expenses by Category</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;