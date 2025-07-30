import { useAppSelector } from '../lib/hooks'
import { Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch } from '../lib/hooks'
import { fetchMe } from '../../features/auth/model/authSlice'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.auth)
  const location = useLocation()

  useEffect(() => {
    if (!user) {
      dispatch(fetchMe())
    }
  }, [])

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute