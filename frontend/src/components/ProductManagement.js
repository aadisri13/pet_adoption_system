import { useState, useEffect } from 'react';
import { getProducts, restockProduct } from '../api';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restocking, setRestocking] = useState({});
  const [restockForm, setRestockForm] = useState({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (productId) => {
    const qty = parseInt(restockForm[productId]);
    if (!qty || qty <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    try {
      setRestocking({ ...restocking, [productId]: true });
      setError(null);
      await restockProduct(productId, qty);
      await loadProducts();
      setRestockForm({ ...restockForm, [productId]: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restock product');
    } finally {
      setRestocking({ ...restocking, [productId]: false });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Product Management</h1>
        <p className="text-gray-600">Manage inventory and restock products</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.product_id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {product.product_name}
                </h3>
                <div className="space-y-1 text-gray-600">
                  <p><span className="font-medium">Category:</span> {product.category || 'N/A'}</p>
                  <p><span className="font-medium">Price:</span> ${parseFloat(product.price).toFixed(2)}</p>
                  <p><span className="font-medium">Supplier:</span> {product.supplier || 'N/A'}</p>
                </div>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Stock Quantity</p>
                <p className={`text-2xl font-bold ${
                  product.stock_qty === 0
                    ? 'text-red-600'
                    : product.stock_qty < 10
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}>
                  {product.stock_qty}
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={restockForm[product.product_id] || ''}
                  onChange={(e) =>
                    setRestockForm({
                      ...restockForm,
                      [product.product_id]: e.target.value,
                    })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleRestock(product.product_id)}
                  disabled={restocking[product.product_id] || !restockForm[product.product_id]}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {restocking[product.product_id] ? '...' : 'Restock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;

