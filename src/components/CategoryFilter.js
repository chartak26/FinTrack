// src/components/CategoryFilter.js
import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="category-filter">
      <label>Filter by Category:</label>
      <select 
        value={selectedCategory} 
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;