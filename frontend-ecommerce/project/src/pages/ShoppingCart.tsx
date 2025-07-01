import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
//import Input from '../components/ui/Input';
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

const ShoppingCartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Teclado Mecánico RGB',
      price: 45.99,
      quantity: 2,
      image: 'https://http2.mlstatic.com/D_NQ_NP_820938-MLA80563766270_112024-O.webp',
      category: 'Periféricos'
    },
    {
      id: '2',
      name: 'Mouse Inalámbrico',
      price: 19.90,
      quantity: 1,
      image: 'https://images-na.ssl-images-amazon.com/images/I/61LtuGzXeaL._AC_SL1500_.jpg',
      category: 'Periféricos'
    },
    {
      id: '4',
      name: 'Monitor LED 24"',
      price: 129.99,
      quantity: 1,
      image: 'https://images-na.ssl-images-amazon.com/images/I/81QpkIctqPL._AC_SL1500_.jpg',
      category: 'Monitores'
    }
  ]);

  const [customerNotes, setCustomerNotes] = useState('');

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.12; // 12% IVA
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleGenerateOrder = () => {
    if (cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    // Simulate order generation
    alert(`Orden generada exitosamente!\nTotal: $${getTotal().toFixed(2)}\nProductos: ${getTotalItems()}`);
    
    // Clear cart after order
    setCartItems([]);
    setCustomerNotes('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-4">
          <ShoppingCart className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
          Carrito de Compras
        </h1>
        <p className="text-gray-600 text-lg">
          Revise y confirme su pedido antes de generar la orden
        </p>
      </div>

      {cartItems.length === 0 ? (
        <Card className="text-center py-16">
          <ShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Su carrito está vacío
          </h3>
          <p className="text-gray-600 mb-6">
            Agregue productos desde el inventario para comenzar
          </p>
          <Button variant="primary" size="lg">
            Ir al Inventario
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card title="Productos en el Carrito" subtitle={`${getTotalItems()} productos seleccionados`}>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.category}</p>
                      <p className="text-lg font-bold text-green-600">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        icon={<Minus size={16} />}
                      />
                      
                      <span className="w-12 text-center font-semibold">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        icon={<Plus size={16} />}
                      />
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        icon={<Trash2 size={16} />}
                        className="mt-2"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Customer Notes */}
            <Card title="Notas del Pedido" subtitle="Información adicional (opcional)">
              <div className="space-y-4">
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Agregue cualquier nota especial para este pedido..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                />
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card title="Resumen del Pedido" gradient>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (12%):</span>
                  <span className="font-semibold">${getTax().toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-green-600">
                      ${getTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 space-y-3">
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <p><strong>Productos:</strong> {getTotalItems()} unidades</p>
                    <p><strong>Categorías:</strong> {new Set(cartItems.map(item => item.category)).size}</p>
                  </div>
                  
                  <Button
                    variant="success"
                    size="lg"
                    className="w-full"
                    onClick={handleGenerateOrder}
                    icon={<ArrowRight size={18} />}
                  >
                    Generar Orden
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full"
                    onClick={() => setCartItems([])}
                  >
                    Vaciar Carrito
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card title="Acciones Rápidas">
              <div className="space-y-3">
                <Button variant="outline" size="md" className="w-full">
                  Guardar para Después
                </Button>
                
                <Button variant="outline" size="md" className="w-full">
                  Duplicar Pedido
                </Button>
                
                <Button variant="outline" size="md" className="w-full">
                  Solicitar Cotización
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCartPage;