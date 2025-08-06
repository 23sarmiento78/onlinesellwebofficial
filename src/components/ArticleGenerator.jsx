import React, { useState } from 'react'
import { generateArticle, generateArticleIdeas, ARTICLE_CATEGORIES } from '@utils/articleGenerator'

export default function ArticleGenerator({ onArticleGenerated, defaultCategory = 'desarrollo' }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedIdeas, setGeneratedIdeas] = useState([])
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [customTopic, setCustomTopic] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory)
  const [articleType, setArticleType] = useState('tutorial')
  const [difficulty, setDifficulty] = useState('intermediate')
  const [error, setError] = useState(null)

  const handleGenerateIdeas = async () => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const ideas = await generateArticleIdeas(selectedCategory, 5)
      setGeneratedIdeas(ideas)
    } catch (err) {
      setError(err.message)
      console.error('Error generating ideas:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateArticle = async (topic, isCustom = false) => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const articleData = await generateArticle({
        topic: isCustom ? customTopic : topic,
        category: selectedCategory,
        type: articleType,
        difficulty
      })
      
      // Save article and call parent function
      if (onArticleGenerated) {
        await onArticleGenerated(articleData)
      }
      
      // Clear form
      setCustomTopic('')
      setSelectedIdea(null)
      
    } catch (err) {
      setError(err.message)
      console.error('Error generating article:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const saveArticleToFile = async (article) => {
    try {
      // Create article file content
      const articleContent = `---
title: "${article.title}"
excerpt: "${article.excerpt}"
slug: "${article.slug}"
category: "${article.category}"
date: "${article.date}"
readTime: "${article.readTime}"
author: "${article.author}"
tags: [${article.tags.map(tag => `"${tag}"`).join(', ')}]
image: "${article.image}"
---

${article.content}
`

      // Create and download file
      const blob = new Blob([articleContent], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${article.slug}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
    } catch (err) {
      console.error('Error saving article:', err)
      setError('Error al guardar el artículo')
    }
  }

  return (
    <div className="article-generator bg-secondary rounded-2xl p-6 border border-light">
      <div className="section-header text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          <i className="fas fa-robot mr-2 text-primary"></i>
          Generador de Artículos IA
        </h2>
        <p className="text-secondary">
          Crea artículos de calidad con inteligencia artificial
        </p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <i className="fas fa-exclamation-triangle text-error"></i>
            <div>
              <h4 className="font-semibold text-error">Error</h4>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Form */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="form-group">
          <label className="form-label">Categoría</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
          >
            {Object.entries(ARTICLE_CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Tipo de Artículo</label>
          <select
            value={articleType}
            onChange={(e) => setArticleType(e.target.value)}
            className="form-select"
          >
            <option value="tutorial">Tutorial</option>
            <option value="news">Noticia</option>
            <option value="guide">Guía</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Dificultad</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="form-select"
          >
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>

        <div className="form-group">
          <button
            onClick={handleGenerateIdeas}
            disabled={isGenerating}
            className={`btn btn-outline w-full ${isGenerating ? 'btn-loading' : ''}`}
          >
            {!isGenerating && <i className="fas fa-lightbulb mr-2"></i>}
            {isGenerating ? 'Generando Ideas...' : 'Generar Ideas'}
          </button>
        </div>
      </div>

      {/* Custom Topic Input */}
      <div className="form-group mb-6">
        <label className="form-label">O escribe tu propio tema</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="Ej: React Server Components en Next.js 14"
            className="form-input flex-1"
          />
          <button
            onClick={() => handleGenerateArticle(customTopic, true)}
            disabled={isGenerating || !customTopic.trim()}
            className={`btn btn-primary ${isGenerating ? 'btn-loading' : ''}`}
          >
            {!isGenerating && <i className="fas fa-magic mr-2"></i>}
            {isGenerating ? 'Generando...' : 'Generar'}
          </button>
        </div>
      </div>

      {/* Generated Ideas */}
      {generatedIdeas.length > 0 && (
        <div className="generated-ideas">
          <h3 className="text-lg font-semibold mb-4">
            <i className="fas fa-lightbulb mr-2 text-warning"></i>
            Ideas Generadas
          </h3>
          <div className="space-y-3">
            {generatedIdeas.map((idea, index) => (
              <div
                key={index}
                className={`idea-card p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedIdea === index
                    ? 'border-primary bg-primary/5'
                    : 'border-light bg-primary/0 hover:border-primary/50'
                }`}
                onClick={() => setSelectedIdea(selectedIdea === index ? null : index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{idea.title}</h4>
                    <p className="text-sm text-secondary mb-2">{idea.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span>
                        <i className="fas fa-layer-group mr-1"></i>
                        {idea.type}
                      </span>
                      <span>
                        <i className="fas fa-signal mr-1"></i>
                        {idea.difficulty}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleGenerateArticle(idea.title)
                    }}
                    disabled={isGenerating}
                    className="btn btn-sm btn-primary ml-3"
                  >
                    <i className="fas fa-magic mr-1"></i>
                    Crear
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


    </div>
  )
}
