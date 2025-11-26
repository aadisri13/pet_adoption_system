import { useState, useEffect } from 'react';
import { createTransaction, getProducts, getAdopters } from '../api';

const TransactionForm = () => {
  const [products, setProducts] = useState([]);
  const [adopters, setAdopters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    adopter_id: '',
    product_id: '',
    status: 'completed',
    mode: 'card',
    amount: '',
    provider_ref: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsResponse, adoptersResponse] = await Promise.all([
        getProducts(),
        getAdopters(),
      ]);
      setProducts(productsResponse.data);
      setAdopters(adoptersResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });

    // Auto-update amount when product is selected
    if (e.target.name === 'product_id' && value) {
      const product = products.find((p) => p.product_id === parseInt(value));
      if (product) {
        setFormData((prev) => ({
          ...prev,
          amount: product.price,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await createTransaction({
        adopter_id: parseInt(formData.adopter_id),
        product_id: formData.product_id ? parseInt(formData.product_id) : null,
        status: formData.status,
        mode: formData.mode,
        amount: parseFloat(formData.amount),
        provider_ref: formData.provider_ref || null,
      });

      setSuccess(true);
      setFormData({
        adopter_id: '',
        product_id: '',
        status: 'completed',
        mode: 'card',
        amount: '',
        provider_ref: '',
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create transaction');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Create Transaction</h1>
        <p className="text-gray-600">Process a new transaction (triggers stock reduction)</p>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Transaction created successfully! Product stock has been reduced.
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Adopter *
            </label>
            <select
              name="adopter_id"
              value={formData.adopter_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select an adopter</option>
              {adopters.map((adopter) => (
                <option key={adopter.adopter_id} value={adopter.adopter_id}>
                  {adopter.fullname} ({adopter.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Product (Optional)
            </label>
            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">No product</option>
              {products.map((product) => (
                <option key={product.product_id} value={product.product_id}>
                  {product.product_name} - ${parseFloat(product.price).toFixed(2)} (Stock: {product.stock_qty})
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Selecting a product will automatically update the amount and reduce stock by 1
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Payment Mode *
            </label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="card">Card</option>
              <option value="cash">Cash</option>
              <option value="online">Online</option>
              <option value="check">Check</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Amount ($) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Provider Reference
            </label>
            <input
              type="text"
              name="provider_ref"
              value={formData.provider_ref}
              onChange={handleChange}
              placeholder="e.g., transaction ID from payment provider"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Processing...' : 'Create Transaction'}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData({
                adopter_id: '',
                product_id: '',
                status: 'completed',
                mode: 'card',
                amount: '',
                provider_ref: '',
              });
              setError(null);
            }}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;

