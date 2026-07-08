import { useState, useMemo } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { useDashboard } from '../../context/DashboardContext'
import { addGem, updateGem, deleteGem } from '../../services/adminService'

export default function AdminInventoryPage() {
  const { gems, sellers, addGemState, updateGemState, deleteGemState } = useDashboard()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const [activeGem, setActiveGem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '', type: 'Sapphire', carat: '', price: '', 
    clarity: '', origin: '', certNumber: '', 
    description: '', sellerId: '', status: 'Draft'
  })

  const filteredGems = useMemo(() => {
    return gems.filter(gem => {
      const matchesSearch = gem.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'All' || gem.type === filterType
      return matchesSearch && matchesType
    })
  }, [gems, searchTerm, filterType])

  const openAddModal = () => {
    setActiveGem(null)
    setFormData({
      name: '', type: 'Sapphire', carat: '', price: '', 
      clarity: '', origin: '', certNumber: '', 
      description: '', sellerId: sellers[0]?.id || '', status: 'Draft'
    })
    setIsModalOpen(true)
  }

  const openEditModal = (gem) => {
    setActiveGem(gem)
    setFormData({ ...gem })
    setIsModalOpen(true)
  }

  const openDeleteModal = (gem) => {
    setActiveGem(gem)
    setIsDeleteModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (activeGem) {
        const res = await updateGem(activeGem.id, formData)
        updateGemState(activeGem.id, res.gem)
      } else {
        const res = await addGem(formData)
        addGemState(res.gem)
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsSubmitting(true)
    try {
      await deleteGem(activeGem.id)
      deleteGemState(activeGem.id)
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status) => {
    const isLive = status === 'Published' || status === 'Active'
    const isSold = status === 'Sold'
    
    let bg = 'rgba(201,168,76,0.15)'
    let border = 'rgba(201,168,76,0.4)'
    let color = '#C9A84C'

    if (isLive) {
      bg = 'rgba(185,28,28,0.2)'
      border = '#B91C1C60'
      color = '#EF4444'
    } else if (isSold) {
      bg = 'rgba(74, 222, 128, 0.1)'
      border = 'rgba(74, 222, 128, 0.3)'
      color = '#4ADE80'
    }

    return (
      <span style={{ 
        display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '2px', 
        background: bg, border: `1px solid ${border}`, color: color, 
        fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' 
      }}>
        {status}
      </span>
    )
  }

  return (
    <DashboardLayout role="admin">
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 300, margin: 0, letterSpacing: '-0.02em' }}>
            Inventory Management
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Manage gemstones, update details, and publish to the public catalog.
          </p>
        </div>
        <button
          onClick={openAddModal}
          style={{
            background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', border: 'none', borderRadius: '2px', color: '#0A0A0D',
            padding: '0.75rem 2rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
            transition: 'opacity 0.2s, transform 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1' }}
        >
          Add New Gem
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="Search gems..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '2px', padding: '0.6rem 1rem', color: '#fff', fontSize: '0.85rem',
            width: '300px', outline: 'none'
          }}
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '2px', padding: '0.6rem 1rem', color: '#fff', fontSize: '0.85rem',
            outline: 'none', cursor: 'pointer'
          }}
        >
          <option value="All" style={{ background: '#050508' }}>All Types</option>
          <option value="Sapphire" style={{ background: '#050508' }}>Sapphire</option>
          <option value="Ruby" style={{ background: '#050508' }}>Ruby</option>
          <option value="Emerald" style={{ background: '#050508' }}>Emerald</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>
          <div>Gemstone</div>
          <div>Type</div>
          <div>Carat</div>
          <div>Price</div>
          <div>Status</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>

        {filteredGems.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            No gems found matching your criteria.
          </div>
        ) : (
          filteredGems.map(gem => (
            <div key={gem.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', alignItems: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 500 }}>{gem.name}</div>
              <div>{gem.type}</div>
              <div>{gem.carat} ct</div>
              <div>${gem.price?.toLocaleString()}</div>
              <div>{getStatusBadge(gem.status || 'Draft')}</div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => openEditModal(gem)}
                  style={{
                    background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '2px', color: '#C9A84C',
                    padding: '0.4rem 1rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(gem)}
                  style={{
                    background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '2px', color: '#EF4444',
                    padding: '0.4rem 1rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '560px', background: '#050508', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, margin: 0 }}>
                {activeGem ? 'Edit Gemstone' : 'Add New Gemstone'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px' }}>
                    <option style={{ background: '#050508' }}>Sapphire</option>
                    <option style={{ background: '#050508' }}>Ruby</option>
                    <option style={{ background: '#050508' }}>Emerald</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Carat</label>
                  <input required type="number" step="0.01" value={formData.carat} onChange={e => setFormData({...formData, carat: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Price ($)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Seller</label>
                <select value={formData.sellerId} onChange={e => setFormData({...formData, sellerId: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px' }}>
                  {sellers.map(s => <option key={s.id} value={s.id} style={{ background: '#050508' }}>{s.businessName}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px' }}>
                  <option style={{ background: '#050508' }}>Draft</option>
                  <option style={{ background: '#050508' }}>Published</option>
                </select>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '0.75rem 2rem', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '2px' }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{ background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', border: 'none', color: '#0A0A0D', padding: '0.75rem 2rem', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: isSubmitting ? 'not-allowed' : 'pointer', borderRadius: '2px', opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? 'Saving...' : 'Save Gemstone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '400px', background: '#050508', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, margin: 0, marginBottom: '1rem' }}>Confirm Deletion</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '2rem' }}>Are you sure you want to delete <strong>{activeGem?.name}</strong>? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button onClick={() => setIsDeleteModalOpen(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '0.6rem 1.5rem', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '2px' }}>Cancel</button>
              <button onClick={handleDelete} disabled={isSubmitting} style={{ background: 'transparent', border: '1px solid #EF4444', color: '#EF4444', padding: '0.6rem 1.5rem', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: isSubmitting ? 'not-allowed' : 'pointer', borderRadius: '2px', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  )
}
