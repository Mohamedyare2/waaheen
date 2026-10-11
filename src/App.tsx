import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import AdminDashboard from './pages/AdminDashboard';
import Shop from './pages/Shop';
import LandingPage from './pages/LandingPage';
import './index.css';

const AppRoutes = () => {
  const { currentMerchant, isAdmin } = useAppContext();

  return (
    <Routes>
      {/* ── Landing Page Website (Full-width responsive) ── */}
      <Route path="/" element={<LandingPage />} />

      {/* ── Mobile Application & Shop Routes (wrapped in app-container) ── */}
      <Route
        path="/shop"
        element={<div className="app-container"><Shop /></div>}
      />
      <Route
        path="/app"
        element={<div className="app-container"><Shop /></div>}
      />
      <Route
        path="/login"
        element={
          <div className="app-container">
            {!currentMerchant && !isAdmin ? <Login /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />}
          </div>
        }
      />
      <Route
        path="/registration"
        element={
          <div className="app-container">
            {!currentMerchant ? <Registration /> : <Navigate to="/dashboard" />}
          </div>
        }
      />
      <Route
        path="/dashboard"
        element={
          <div className="app-container">
            {currentMerchant ? <Dashboard /> : <Navigate to="/login" />}
          </div>
        }
      />
      <Route
        path="/products"
        element={
          <div className="app-container">
            {currentMerchant ? <ProductManagement /> : <Navigate to="/login" />}
          </div>
        }
      />
      <Route
        path="/admin"
        element={
          <div className="app-container">
            {isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
          </div>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
