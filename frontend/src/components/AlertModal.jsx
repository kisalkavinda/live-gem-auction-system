import { useEffect, useState } from 'react'

const colors = {
  success: {
    background: 'rgba(16, 185, 129, 0.14)',
    border: 'rgba(16, 185, 129, 0.32)',
    accent: '#10B981',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.14)',
    border: 'rgba(239, 68, 68, 0.32)',
    accent: '#EF4444',
  },
  warning: {
    background: 'rgba(234, 179, 8, 0.14)',
    border: 'rgba(234, 179, 8, 0.32)',
    accent: '#EAB308',
  },
  info: {
    background: 'rgba(59, 130, 246, 0.14)',
    border: 'rgba(59, 130, 246, 0.32)',
    accent: '#3B82F6',
  },
  login: {
    background: 'rgba(201, 168, 76, 0.14)',
    border: 'rgba(201, 168, 76, 0.32)',
    accent: '#C9A84C',
  },
}

const iconMap = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ⓘ',
  login: '🔒',
}

export default function AlertModal({
  open,
  type = 'info',
  title,
  message,
  actions = [],
  onClose,
  canClose = true,
}) {
  const [visible, setVisible] = useState(open)

  useEffect(() => {
    if (open) {
      setVisible(true)
    }
  }, [open])

  const handleClose = () => {
    if (!canClose) return
    setVisible(false)
    setTimeout(() => {
      onClose()
    }, 220)
  }

  if (!open && !visible) {
    return null
  }

  const style = colors[type] || colors.info

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: open ? 'rgba(8, 8, 10, 0.68)' : 'transparent',
        backdropFilter: open ? 'blur(14px)' : 'none',
        opacity: open ? 1 : 0,
        transition: 'opacity 220ms ease',
      }}
      onClick={handleClose}
    >
      <div
        role="alert"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#0B0B0E',
          border: `1px solid ${style.border}`,
          boxShadow: '0 32px 90px rgba(0,0,0,0.45)',
          transform: open ? 'translateY(0)' : 'translateY(-16px)',
          opacity: open ? 1 : 0,
          transition: 'opacity 220ms ease, transform 220ms ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1.5rem 1.5rem 1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '999px',
                display: 'grid',
                placeItems: 'center',
                background: style.background,
                color: style.accent,
                fontSize: '1.3rem',
                fontWeight: 700,
              }}
            >
              {iconMap[type] || iconMap.info}
            </div>
            <div>
              <div
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  color: '#FFFFFF',
                }}
              >
                {title || (type === 'login' ? 'Login Required' : type.charAt(0).toUpperCase() + type.slice(1))}
              </div>
              <p
                style={{
                  marginTop: '0.35rem',
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.75)',
                }}
              >
                {message}
              </p>
            </div>
          </div>
          {canClose && (
            <button
              onClick={handleClose}
              aria-label="Close alert"
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              ×
            </button>
          )}
        </div>

        {actions.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              padding: '1rem 1.5rem 1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  if (action.onClick) action.onClick()
                  if (action.closeOnClick !== false) handleClose()
                }}
                style={{
                  minWidth: '120px',
                  padding: '0.85rem 1rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: action.primary ? style.accent : 'rgba(255,255,255,0.06)',
                  color: action.primary ? '#050508' : '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
