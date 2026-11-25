import { Link } from 'react-router-dom'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '../lib/CartContext.jsx'

/** "Add to cart" for a paid tool. Once added, it becomes "In cart · View". */
export default function AddToCartButton({ product, className = 'btn btn-primary' }) {
  const cart = useCart()
  if (cart.has(product.slug)) {
    return (
      <Link to="/cart" className={`${className} in-cart`}>
        <Check size={16} /> In cart · View
      </Link>
    )
  }
  return (
    <button className={className} onClick={() => cart.add(product.slug)}>
      <ShoppingCart size={16} /> Add to cart
    </button>
  )
}
