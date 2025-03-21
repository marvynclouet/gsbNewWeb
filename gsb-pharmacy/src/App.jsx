import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Medicaments from './pages/Medicaments'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import CreateAdmin from './pages/admin/CreateAdmin'
import MedicamentsAdmin from './pages/admin/Medicaments'
import Users from './pages/admin/Users'
import OrdersAdmin from './pages/admin/Orders'
import Stats from './pages/admin/Stats'
import Profile from './pages/Profile'
import Contact from './pages/Contact'
import { useAuth } from './contexts/AuthContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import './styles/App.css'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import AdminRoutes from './routes/AdminRoutes'

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app">
          <AppContent />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

const AppContent = () => {
  const { user } = useAuth()
  const location = useLocation()
  
  const noNavbarRoutes = ['/login', '/register', '/admin/login', '/admin/create']
  const shouldShowNavbar = user && !noNavbarRoutes.includes(location.pathname)

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main className={shouldShowNavbar ? "main-content" : "full-content"}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/create" element={<CreateAdmin />} />
          <Route path="/contact" element={<Contact />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/medicaments" element={<Medicaments />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Route>
        </Routes>
      </main>
    </>
  )
}

export default App
