export default function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Delete', 
  cancelText = 'Cancel', 
  isSubmitting = false,
  confirmColor = '#EF4444' // default red
}) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#050508', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, margin: 0, marginBottom: '1rem', color: '#fff' }}>{title}</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '2rem' }} dangerouslySetInnerHTML={{ __html: message }}></p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button 
            onClick={onCancel} 
            disabled={isSubmitting}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '0.6rem 1.5rem', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: isSubmitting ? 'not-allowed' : 'pointer', borderRadius: '2px', opacity: isSubmitting ? 0.7 : 1 }}>
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            disabled={isSubmitting} 
            style={{ background: 'transparent', border: `1px solid ${confirmColor}`, color: confirmColor, padding: '0.6rem 1.5rem', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: isSubmitting ? 'not-allowed' : 'pointer', borderRadius: '2px', opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
