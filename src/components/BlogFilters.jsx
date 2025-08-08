import React from 'react'
import { FiSearch, FiFilter, FiGrid, FiList, FiSortAsc } from 'react-icons/fi'

export default function BlogFilters({
  searchTerm,
  selectedCategory,
  sortBy,
  viewMode,
  categories,
  totalResults,
  onSearch,
  onCategoryChange,
  onSortChange,
  onViewModeChange,
  hideCategoryFilter = false
}) {
  
  function handleSearchChange(e) {
    onSearch(e.target.value)
  }

  function handleClearSearch() {
    onSearch('')
  }

  return (
    <div className="blog-filters">
      <div className="filters-section">
        {/* Barra de búsqueda */}
        <div className="search-bar">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar artículos..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={handleClearSearch}
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="filters-controls">
          {/* Filtro por categoría */}
          <div className="filter-group">
            <label className="filter-label">
              <FiFilter className="filter-icon" />
              Categoría
            </label>
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} {category.count > 0 && `(${category.count})`}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenamiento */}
          <div className="filter-group">
            <label className="filter-label">
              <FiSortAsc className="filter-icon" />
              Ordenar por
            </label>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="date">Fecha (más reciente)</option>
              <option value="title">Título (A-Z)</option>
              <option value="category">Categoría</option>
              <option value="readTime">Tiempo de lectura</option>
            </select>
          </div>

          {/* Modo de vista */}
          <div className="view-mode-toggle">
            <button
              className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              aria-label="Vista en grilla"
            >
              <FiGrid />
            </button>
            <button
              className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => onViewModeChange('list')}
              aria-label="Vista en lista"
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="filters-results">
        <span className="results-count">
          {totalResults} {totalResults === 1 ? 'artículo' : 'artículos'}
          {searchTerm && ` encontrados para "${searchTerm}"`}
        </span>
      </div>
    </div>
  )
}
