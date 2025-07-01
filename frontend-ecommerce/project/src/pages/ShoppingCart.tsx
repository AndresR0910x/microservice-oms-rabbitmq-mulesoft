import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

interface Producto {
  idProducto: number;
  nombre: string;
  precio: string;
  stock: number;
  imagenUrl: string | null;
  categoria: string;
}

interface Cliente {
  id_cliente: number;
  nombre: string;
  direccion: string;
  contacto: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

const ShoppingCartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerNotes, setCustomerNotes] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCartAndClients = async () => {
      setLoading(true);
      setError(null);

      try {
        // Cargar el carrito desde localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          const productosResponse = await fetch('http://localhost:8080/api/productos');
          if (!productosResponse.ok) {
            throw new Error(`Error al obtener productos: ${productosResponse.statusText}`);
          }
          const productos = await productosResponse.json();
          const items: CartItem[] = Object.entries(cartData)
            .map(([idProducto, quantity]) => {
              const product = productos.find((p: Producto) => p.idProducto.toString() === idProducto);
              if (product && quantity > 0) {
                return {
                  id: idProducto,
                  name: product.nombre,
                  price: parseFloat(product.precio) || 0,
                  quantity: Number(quantity) || 1,
                  image: product.imagenUrl || 'https://via.placeholder.com/150',
                  category: product.categoria || 'Sin categoría',
                };
              }
              return null;
            })
            .filter((item): item is CartItem => item !== null);
          setCartItems(items);
        }

        // Cargar clientes desde la API
        const clientesResponse = await fetch('http://localhost:8080/api/clientes');
        if (!clientesResponse.ok) {
          throw new Error(`Error al obtener clientes: ${clientesResponse.statusText}`);
        }
        const clientesData = await clientesResponse.json();
        if (Array.isArray(clientesData)) {
          setClientes(clientesData);
        } else {
          throw new Error('La respuesta de la API de clientes no es un array válido');
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadCartAndClients();
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);

    const newCart = updatedItems.reduce((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {} as { [key: string]: number });
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);

    const newCart = updatedItems.reduce((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {} as { [key: string]: number });
    localStorage.setItem('cart', JSON.stringify(newCart));
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

  const handleGenerateOrder = async () => {
    if (cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    if (!selectedClientId) {
      alert('Por favor, seleccione un cliente');
      return;
    }

    const orderData = {
      fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      estado: 'pendiente',
      idCliente: selectedClientId,
      productos: cartItems.map(item => ({
        idProducto: parseInt(item.id),
        cantidad: item.quantity,
      })),
    };

    try {
      const response = await fetch('http://localhost:8080/api/ordenes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`Error al generar la orden: ${response.statusText}`);
      }

      alert(`Orden generada exitosamente!\nTotal: $${getTotal().toFixed(2)}\nProductos: ${getTotalItems()}`);

      // Limpiar carrito después de generar la orden
      setCartItems([]);
      localStorage.removeItem('cart');
      setCustomerNotes('');
      setSelectedClientId(null);
    } catch (err) {
      console.error('Error generating order:', err);
      alert('Error al generar la orden. Verifique la consola para más detalles.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <ShoppingCart className="mx-auto mb-4 text-gray-400" size={64} />
        <p className="text-gray-600">Cargando carrito y clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-6xl mx-auto text-center py-12">
        <ShoppingCart className="mx-auto text-red-400 mb-4" size={64} />
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
        <p className="text-gray-600">{error}</p>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
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

            <Card title="Seleccionar Cliente" subtitle="Elija un cliente para la orden">
              <div className="space-y-4">
                <Select
                  label="Cliente"
                  options={[
                    { value: '', label: 'Seleccione un cliente' },
                    ...clientes.map(client => ({
                      value: client.id_cliente.toString(),
                      label: client.nombre,
                    })),
                  ]}
                  value={selectedClientId?.toString() || ''}
                  onChange={(value) => setSelectedClientId(value ? parseInt(value) : null)}
                  disabled={clientes.length === 0}
                />
                {selectedClientId && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Información del cliente seleccionado:</h4>
                    {clientes.find(c => c.id_cliente === selectedClientId) && (
                      <>
                        <p><span className="font-medium">Dirección:</span> {clientes.find(c => c.id_cliente === selectedClientId)?.direccion}</p>
                        <p><span className="font-medium">Contacto:</span> {clientes.find(c => c.id_cliente === selectedClientId)?.contacto}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>

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
                    disabled={!selectedClientId}
                  >
                    Generar Orden
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full"
                    onClick={() => {
                      setCartItems([]);
                      localStorage.removeItem('cart');
                    }}
                  >
                    Vaciar Carrito
                  </Button>
                </div>
              </div>
            </Card>

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