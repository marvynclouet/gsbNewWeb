import { 
  Routes,
  Route,
} from 'react-router-dom'

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
import CreateAdmin from './pages/admin/CreateAdmin'
import Profile from './pages/Profile'
import Contact from './pages/Contact'


import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'

import './styles/App.css'

import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import AdminRoutes from './routes/AdminRoutes'
import Notification from './components/Notification'
import { useCart } from './contexts/CartContext'


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

  const { notification } = useCart()

  return (
    <div>
      <Navbar />
      <main className={ "main-content" /*shouldShowNavbar ? "main-content" : "full-content"*/}>
        <Notification message={notification} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/create" element={<CreateAdmin />} />
          <Route path="/contact" element={<Contact />} />
          <Route element={ <PrivateRoute />}>
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
    </div>
  )
}

export default App
