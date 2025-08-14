import { Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const addToCart = (product) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const cartKey = `cart_${user.email}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    
    const existingItem = existingCart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
      toast.info('Item quantity updated in cart');
    } else {
      existingCart.push({ ...product, quantity: 1 });
      toast.success('Item added to cart');
    }
    
    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    
    // Trigger cart count update
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-105">
        <div className="aspect-w-16 aspect-h-12 bg-gray-200 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {product.category}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">
                {product.rating}
              </span>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.price}
            </span>
            
            <button
              onClick={handleAddToCart}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;