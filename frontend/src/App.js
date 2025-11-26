import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import PetList from './components/PetList';
import ApplyForm from './components/ApplyForm';
import AdminDashboard from './components/AdminDashboard';
import ProductManagement from './components/ProductManagement';
import ShelterView from './components/ShelterView';
import TransactionForm from './components/TransactionForm';
import ServiceManagement from './components/ServiceManagement';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const employee = isLoggedIn ? JSON.parse(localStorage.getItem('employee') || '{}') : null;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('employee');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Pet Adoption System
          </Link>
          <div className="flex gap-6 items-center">
            <Link
              to="/pets"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/pets') || isActive('/')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Pets
            </Link>
            <Link
              to="/shelters"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/shelters')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Shelters
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive('/admin')
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Admin
                </Link>
                <Link
                  to="/products"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive('/products')
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Products
                </Link>
                <Link
                  to="/transactions"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive('/transactions')
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Transactions
                </Link>
                <Link
                  to="/services"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive('/services')
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Services
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {employee?.firstname} {employee?.lastname} ({employee?.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isActive('/login')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<PetList />} />
          <Route path="/pets" element={<PetList />} />
          <Route path="/apply/:petId" element={<ApplyForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/shelters" element={<ShelterView />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <ServiceManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
