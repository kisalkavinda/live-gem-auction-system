import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import ConfirmModal from '../../components/ConfirmModal'
import { useAlert } from '../../context/AlertContext'
import {
  uploadImage,
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle
} from '../../services/adminService'

const CATEGORIES = [
  'Gem History',
  'Buying Guide',
  'Certification & Grading',
  'Mining & Origin'
]

export default function AdminArticlesPage() {
  const { showAlert } = useAlert()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Filtering & search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [featuredOnly, setFeaturedOnly] = useState(false)

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  // Confirm delete modal
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    id: null,
    title: '',
    message: '',
    confirmText: 'Delete',
    confirmColor: '#EF4444'
  })

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Gem History',
    author: 'GemHaven Editorial',
    readTime: '5 min read',
    excerpt: '',
    coverImage: '',
    featured: false,
    rawContent: ''
  })

  // Load articles
  const loadArticles = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getArticles()
      if (!Array.isArray(data)) {
        throw new Error('The articles API returned an invalid response.')
      }
      setArticles(data)
      setLoadError('')
    } catch (err) {
      console.error('Failed to load articles:', err)
      setLoadError('Articles could not be loaded. Check the backend connection and try again.')
      showAlert('Failed to load articles from backend', 'error')
    } finally {
      setLoading(false)
    }
  }, [showAlert])

  useEffect(() => {
    loadArticles()
  }, [loadArticles])

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingArticle(null)
    setSelectedFile(null)
    setFormData({
      title: '',
      slug: '',
      category: 'Gem History',
      author: 'GemHaven Editorial',
      readTime: '5 min read',
      excerpt: '',
      coverImage: '/images/knowledge/ruby.png',
      featured: false,
      rawContent: 'Write your article introduction here...\n\n### Heading 1\n\nAdd more content paragraphs here.\n\n> "A gem represents timeless beauty and earth\'s purest alchemy."'
    })
    setIsEditModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEditModal = (art) => {
    setEditingArticle(art)
    setSelectedFile(null)

    // Convert block structure to readable text for editing if present
    let rawText = ''
    if (Array.isArray(art.content) && art.content.length > 0) {
      rawText = art.content.map(b => {
        if (b.type === 'heading') return `### ${b.value}`
        if (b.type === 'quote') return `> ${b.value}`
        if (b.type === 'image') return `![${b.caption || 'image'}](${b.url})`
        return b.value || ''
      }).filter(Boolean).join('\n\n')
    } else {
      rawText = art.excerpt || ''
    }

    setFormData({
      title: art.title || '',
      slug: art.slug || '',
      category: art.category || 'Gem History',
      author: art.author || 'GemHaven Editorial',
      readTime: art.readTime || '5 min read',
      excerpt: art.excerpt || '',
      coverImage: art.coverImage || '',
      featured: !!art.featured,
      rawContent: rawText
    })
    setIsEditModalOpen(true)
  }

  // Handle Form Submission
  const handleSubmitForm = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      showAlert('Article title is required', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      let finalCover = formData.coverImage
      if (selectedFile) {
        const uploadRes = await uploadImage(selectedFile)
        if (!uploadRes?.url) {
          throw new Error('Image upload completed without returning an image URL.')
        }
        finalCover = uploadRes.url
      }

      // Convert raw text into structured blocks
      const paragraphs = formData.rawContent.split(/\n\n+/).filter(Boolean)
      const contentBlocks = paragraphs.map(p => {
        const trimmed = p.trim()
        if (trimmed.startsWith('### ')) {
          return { type: 'heading', value: trimmed.replace(/^###\s+/, '') }
        }
        if (trimmed.startsWith('> ')) {
          return { type: 'quote', value: trimmed.replace(/^>\s+/, '') }
        }
        const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/)
        if (imgMatch) {
          return { type: 'image', caption: imgMatch[1], url: imgMatch[2] }
        }
        return { type: 'paragraph', value: trimmed }
      })

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || undefined,
        category: formData.category,
        author: formData.author.trim(),
        readTime: formData.readTime.trim(),
        excerpt: formData.excerpt.trim() || formData.title,
        coverImage: finalCover,
        featured: formData.featured,
        content: contentBlocks,
        contentBlocks: JSON.stringify(contentBlocks)
      }

      if (editingArticle && editingArticle.id) {
        await updateArticle(editingArticle.id, payload)
        showAlert('Article updated successfully!', 'success')
      } else {
        await createArticle(payload)
        showAlert('New article published to Knowledge Hub!', 'success')
      }

      setIsEditModalOpen(false)
      loadArticles()
    } catch (err) {
      console.error('Failed to save article:', err)
      showAlert(err.response?.data?.message || err.message || 'Error saving article', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Quick Toggle Featured
  const handleToggleFeatured = async (art) => {
    try {
      const updated = await updateArticle(art.id, {
        ...art,
        featured: !art.featured
      })
      setArticles(prev => prev.map(a => a.id === art.id ? updated : a))
      showAlert(`Article "${art.title}" ${!art.featured ? 'marked as Featured' : 'unmarked from Featured'}`, 'info')
    } catch (err) {
      console.error('Failed to toggle featured status:', err)
      showAlert('Could not update featured status', 'error')
    }
  }

  // Handle Delete Confirmation
  const promptDelete = (art) => {
    setConfirmConfig({
      isOpen: true,
      id: art.id,
      title: 'Delete Article',
      message: `Are you sure you want to permanently delete <strong>"${art.title}"</strong>? This will remove it from the Knowledge Hub.`,
      confirmText: 'Delete Article',
      confirmColor: '#EF4444'
    })
  }

  const handleConfirmDelete = async () => {
    setIsSubmitting(true)
    try {
      await deleteArticle(confirmConfig.id)
      setArticles(prev => prev.filter(a => a.id !== confirmConfig.id))
      showAlert('Article deleted successfully', 'success')
      setConfirmConfig({ isOpen: false, id: null, title: '', message: '', confirmText: 'Delete', confirmColor: '#EF4444' })
    } catch (err) {
      console.error('Failed to delete article:', err)
      showAlert('Could not delete article', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filtered Articles
  const filteredArticles = articles.filter(art => {
    if (selectedCategory !== 'All' && art.category !== selectedCategory) return false
    if (featuredOnly && !art.featured) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const titleMatch = art.title?.toLowerCase().includes(q)
      const authorMatch = art.author?.toLowerCase().includes(q)
      const excerptMatch = art.excerpt?.toLowerCase().includes(q)
      const slugMatch = art.slug?.toLowerCase().includes(q)
      return titleMatch || authorMatch || excerptMatch || slugMatch
    }
    return true
  })

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '4rem' }}>

        {/* Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#C9A84C', marginBottom: '0.35rem' }}>
              Editorial & Content Management
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.4rem', fontWeight: 300, margin: 0, color: '#fff' }}>
              Knowledge Hub Articles
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Manage educational guides, origin histories, and certification resources for gemstone buyers.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link
              to="/knowledge-hub"
              target="_blank"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.8)',
                padding: '0.75rem 1.25rem',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                borderRadius: '2px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>↗</span> View Public Hub
            </Link>

            <button
              onClick={handleOpenCreateModal}
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #A78834)',
                border: 'none',
                color: '#050508',
                padding: '0.75rem 1.5rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(201,168,76,0.25)'
              }}
            >
              <span>+</span> Publish New Article
            </button>
          </div>
        </div>

        {/* Filters and Stats Bar */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '4px',
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
            {/* Search */}
            <div style={{ position: 'relative', minWidth: '260px' }}>
              <input
                type="text"
                placeholder="Search articles by title, author..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0a0a0f',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '0.6rem 1rem',
                  fontSize: '0.75rem',
                  color: '#fff',
                  borderRadius: '2px',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.4)',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              style={{
                background: '#0a0a0f',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '0.6rem 1rem',
                fontSize: '0.75rem',
                color: '#fff',
                borderRadius: '2px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Featured Only Checkbox */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={e => setFeaturedOnly(e.target.checked)}
                style={{ accentColor: '#C9A84C', cursor: 'pointer' }}
              />
              Featured Articles Only
            </label>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
            Showing <strong style={{ color: '#C9A84C' }}>{filteredArticles.length}</strong> of {articles.length} articles
          </div>
        </div>

        {/* Articles Table */}
        <div style={{
          background: 'rgba(255,255,255,0.015)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
              Loading articles database...
            </div>
          ) : loadError ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
              <p>{loadError}</p>
              <button
                type="button"
                onClick={loadArticles}
                style={{ background: 'transparent', border: '1px solid #C9A84C', color: '#C9A84C', padding: '0.65rem 1rem', cursor: 'pointer' }}
              >
                Retry
              </button>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
              <div style={{ fontSize: '2rem', color: '#C9A84C', marginBottom: '0.5rem', opacity: 0.5 }}>◆</div>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No articles found matching the current filters.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '1rem', color: '#C9A84C', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cover</th>
                    <th style={{ padding: '1rem', color: '#C9A84C', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Article Title & Slug</th>
                    <th style={{ padding: '1rem', color: '#C9A84C', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Category</th>
                    <th style={{ padding: '1rem', color: '#C9A84C', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Author</th>
                    <th style={{ padding: '1rem', color: '#C9A84C', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Read Time</th>
                    <th style={{ padding: '1rem', color: '#C9A84C', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Featured</th>
                    <th style={{ padding: '1rem', color: '#C9A84C', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((art, idx) => (
                    <tr
                      key={art.id || idx}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Cover Thumbnail */}
                      <td style={{ padding: '0.85rem 1rem', width: '70px' }}>
                        <img
                          src={art.coverImage || '/images/knowledge/ruby.png'}
                          alt={art.title}
                          style={{
                            width: '48px',
                            height: '48px',
                            objectFit: 'cover',
                            borderRadius: '3px',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}
                          onError={e => { e.currentTarget.src = '/images/knowledge/ruby.png' }}
                        />
                      </td>

                      {/* Title & Slug */}
                      <td style={{ padding: '0.85rem 1rem', maxWidth: '340px' }}>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                          {art.title}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                          /knowledge-hub/{art.slug}
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.55rem',
                          background: 'rgba(201,168,76,0.1)',
                          border: '1px solid rgba(201,168,76,0.3)',
                          borderRadius: '2px',
                          color: '#C9A84C',
                          fontSize: '0.6rem',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase'
                        }}>
                          {art.category || 'General'}
                        </span>
                      </td>

                      {/* Author */}
                      <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.8)' }}>
                        {art.author || 'Editorial'}
                      </td>

                      {/* Read Time */}
                      <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>
                        {art.readTime || '5 min'}
                      </td>

                      {/* Featured Toggle */}
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleToggleFeatured(art)}
                          style={{
                            background: art.featured ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.03)',
                            border: art.featured ? '1px solid #C9A84C' : '1px solid rgba(255,255,255,0.1)',
                            color: art.featured ? '#C9A84C' : 'rgba(255,255,255,0.3)',
                            padding: '0.25rem 0.6rem',
                            fontSize: '0.6rem',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            transition: 'all 0.2s'
                          }}
                        >
                          {art.featured ? '★ Featured' : 'Standard'}
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <Link
                            to={`/knowledge-hub/${art.slug}`}
                            target="_blank"
                            style={{
                              background: 'transparent',
                              border: '1px solid rgba(255,255,255,0.15)',
                              color: 'rgba(255,255,255,0.6)',
                              padding: '0.35rem 0.6rem',
                              fontSize: '0.65rem',
                              borderRadius: '2px',
                              textDecoration: 'none'
                            }}
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleOpenEditModal(art)}
                            style={{
                              background: 'rgba(201,168,76,0.15)',
                              border: '1px solid rgba(201,168,76,0.4)',
                              color: '#C9A84C',
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.65rem',
                              borderRadius: '2px',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => promptDelete(art)}
                            style={{
                              background: 'rgba(239,68,68,0.1)',
                              border: '1px solid rgba(239,68,68,0.3)',
                              color: '#EF4444',
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.65rem',
                              borderRadius: '2px',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Create / Edit Article Modal */}
      {isEditModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(5px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#09090e',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '4px',
            maxWidth: '750px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '2rem',
            color: '#fff',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsEditModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, margin: '0 0 1.5rem', color: '#fff' }}>
              {editingArticle ? 'Edit Article' : 'Publish New Article'}
            </h2>

            <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Title & Slug */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C9A84C', marginBottom: '0.4rem' }}>
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Navigating Ceylon Blue Sapphires"
                    value={formData.title}
                    onChange={e => {
                      const newTitle = e.target.value
                      const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      setFormData(prev => ({
                        ...prev,
                        title: newTitle,
                        slug: !editingArticle ? autoSlug : prev.slug
                      }))
                    }}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      padding: '0.65rem 0.9rem',
                      fontSize: '0.8rem',
                      color: '#fff',
                      borderRadius: '2px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem' }}>
                    URL Slug
                  </label>
                  <input
                    type="text"
                    placeholder="custom-slug"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      padding: '0.65rem 0.9rem',
                      fontSize: '0.8rem',
                      color: '#fff',
                      borderRadius: '2px',
                      outline: 'none',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
              </div>

              {/* Category, Author, ReadTime */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C9A84C', marginBottom: '0.4rem' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0a0a0f',
                      border: '1px solid rgba(255,255,255,0.15)',
                      padding: '0.65rem 0.9rem',
                      fontSize: '0.8rem',
                      color: '#fff',
                      borderRadius: '2px',
                      outline: 'none'
                    }}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem' }}>
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      padding: '0.65rem 0.9rem',
                      fontSize: '0.8rem',
                      color: '#fff',
                      borderRadius: '2px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem' }}>
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={e => setFormData({ ...formData, readTime: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      padding: '0.65rem 0.9rem',
                      fontSize: '0.8rem',
                      color: '#fff',
                      borderRadius: '2px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C9A84C', marginBottom: '0.4rem' }}>
                  Brief Excerpt / Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="A concise summary of the article that appears in catalog cards..."
                  value={formData.excerpt}
                  onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    padding: '0.65rem 0.9rem',
                    fontSize: '0.8rem',
                    color: '#fff',
                    borderRadius: '2px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Cover Image Upload & URL */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'flex-start' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C9A84C', marginBottom: '0.4rem' }}>
                    Upload Cover Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setSelectedFile(e.target.files[0])}
                    style={{
                      width: '100%',
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.7)',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px dashed rgba(255,255,255,0.2)',
                      padding: '0.6rem',
                      borderRadius: '2px',
                      cursor: 'pointer'
                    }}
                  />
                  {selectedFile && (
                    <div style={{ fontSize: '0.65rem', color: '#C9A84C', marginTop: '0.25rem' }}>
                      Selected: {selectedFile.name}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem' }}>
                    Or Cover Image Path / URL
                  </label>
                  <input
                    type="text"
                    placeholder="/images/knowledge/ruby.png"
                    value={formData.coverImage}
                    onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      padding: '0.65rem 0.9rem',
                      fontSize: '0.8rem',
                      color: '#fff',
                      borderRadius: '2px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Featured toggle */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.85)',
                cursor: 'pointer',
                padding: '0.5rem 0'
              }}>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                  style={{ accentColor: '#C9A84C', width: '16px', height: '16px', cursor: 'pointer' }}
                />
                Feature as hero card on the Knowledge Hub home page
              </label>

              {/* Article Content Markdown/Blocks Editor */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C9A84C' }}>
                    Article Content (Supports Paragraphs, Headings, Quotes)
                  </label>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                    Use <code>### Heading</code>, <code>&gt; Quote</code>, or double enter for paragraphs
                  </span>
                </div>
                <textarea
                  rows={8}
                  required
                  placeholder="Write your article content here..."
                  value={formData.rawContent}
                  onChange={e => setFormData({ ...formData, rawContent: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    padding: '0.85rem',
                    fontSize: '0.82rem',
                    lineHeight: '1.6',
                    color: '#fff',
                    borderRadius: '2px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    padding: '0.65rem 1.5rem',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    borderRadius: '2px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: 'linear-gradient(135deg, #C9A84C, #A78834)',
                    border: 'none',
                    color: '#050508',
                    padding: '0.65rem 2rem',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    borderRadius: '2px',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? 'Saving...' : editingArticle ? 'Update Article' : 'Publish Article'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmConfig({ isOpen: false, id: null, title: '', message: '', confirmText: 'Delete', confirmColor: '#EF4444' })}
        confirmText={confirmConfig.confirmText}
        confirmColor={confirmConfig.confirmColor}
        isSubmitting={isSubmitting}
      />
    </DashboardLayout>
  )
}
