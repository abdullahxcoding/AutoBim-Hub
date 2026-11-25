import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="notfound">
      <span className="eyebrow mono">404</span>
      <h1>Page not found</h1>
      <p>The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
      <Link to="/" className="btn btn-primary">Back to home</Link>
    </section>
  )
}
