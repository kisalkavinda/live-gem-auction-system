import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import AlertModal from '../components/AlertModal'

const AlertContext = createContext(null)

export function AlertProvider({ children }) {
  const [alertState, setAlertState] = useState({
    open: false,
    type: 'info',
    title: '',
    message: '',
    actions: [],
  })

  const openAlert = useCallback((config) => {
    setAlertState({
      open: true,
      type: config.type || 'info',
      title: config.title || '',
      message: config.message || '',
      actions: config.actions || [],
      canClose: config.canClose !== false,
    })
  }, [])

  const closeAlert = useCallback(() => {
    setAlertState((prev) => ({
      ...prev,
      open: false,
    }))
  }, [])

  const value = useMemo(
    () => ({
      showAlert: openAlert,
      closeAlert,
    }),
    [openAlert, closeAlert]
  )

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertModal
        open={alertState.open}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        actions={alertState.actions}
        onClose={closeAlert}
        canClose={alertState.canClose}
      />
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)

  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }

  return context
}
