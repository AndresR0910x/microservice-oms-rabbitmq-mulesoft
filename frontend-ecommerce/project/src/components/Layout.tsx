import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  UserPlus, 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  Truck, 
  Menu,
  X,
  Building2
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard', color: 'text-blue-600' },
    { path: '/create-client', icon: <UserPlus size={20} />, label: 'Crear Cliente', color: 'text-green-600' },
    { path: '/crear-producto', icon: <UserPlus size={20} />, label: 'Agregar productos', color: 'text-green-600' }, 
    { path: '/inventory', icon: <Package size={20} />, label: 'Inventario', color: 'text-purple-600' },
    { path: '/cart', icon: <ShoppingCart size={20} />, label: 'Carrito', color: 'text-orange-600' },
    { path: '/orders', icon: <ClipboardList size={20} />, label: 'Órdenes', color: 'text-indigo-600' },
    { path: '/dispatch', icon: <Truck size={20} />, label: 'Despacho', color: 'text-yellow-600' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Building2 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Distribuidora Pro
              </h1>
              <p className="text-xs text-gray-500">Sistema de Microservicios</p>
            </div>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex md:w-72 flex-col bg-white/60 backdrop-blur-md shadow-xl border-r border-white/20 min-h-screen">
          <nav className="mt-6 px-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-white/70 hover:shadow-md hover:transform hover:scale-105'
                }`}
              >
                <span className={`mr-3 ${location.pathname === item.path ? 'text-white' : item.color}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
            <div className="fixed inset-y-0 left-0 w-72 bg-white/90 backdrop-blur-md shadow-2xl z-50">
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Menú</h2>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="mt-6 px-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white/70 hover:shadow-md'
                    }`}
                    onClick={toggleMobileMenu}
                  >
                    <span className={`mr-3 ${location.pathname === item.path ? 'text-white' : item.color}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;