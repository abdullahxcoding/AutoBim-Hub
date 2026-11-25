import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext.jsx'

/** Gate for pages that need a signed-in user. */
export default function RequireAuth({ children }) {
  const { user, loading, configured } = useAuth()
  const location = useLocation()

  if (!configured) {
    return (
      <section className="notfound">
        <span className="eyebrow mono">Accounts</span>
        <h1>Accounts aren&rsquo;t set up yet</h1>
        <p>This area needs Supabase to be configured.</p>
      </section>
    )
  }
  if (loading) return <div className="page-loading" />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}
