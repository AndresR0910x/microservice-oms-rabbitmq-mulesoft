import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import { Search, Eye, Calendar, Filter, ClipboardList, User, Package } from 'lucide-react';

interface Producto {
  idProducto: number;
  nombre: string;
  precio: string;
  stock: number;
  imagenUrl: string | null;
  categoria: string;
}

interface Cliente {
  nombre: string;
  direccion: string;
  contacto: string;
  id_cliente: number;
}

interface OrderProduct {
  idOrdenProducto: number;
  idProducto: number;
  cantidad: number;
}

interface Order {
  idOrden: number;
  fecha: string;
  estado: 'Pendiente' | 'Pagada' | 'Pagado y enviado';
  idCliente: number;
  cliente: Cliente;
  orderProducts: OrderProduct[];
}

const OrderReview: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const ordersResponse = await fetch('http://localhost:8080/api/ordenes');
        if (!ordersResponse.ok) {
          throw new Error(`Error al obtener órdenes: ${ordersResponse.statusText}`);
        }
        const ordersData = await ordersResponse.json();
        // Ajustar los estados si vienen de la API con nombres diferentes
        const adjustedOrders = ordersData.map((order: any) => ({
          ...order,
          estado: mapApiStateToDisplayState(order.estado),
        }));
        setOrders(adjustedOrders);

        const productosResponse = await fetch('http://localhost:8080/api/productos');
        if (!productosResponse.ok) {
          throw new Error(`Error al obtener productos: ${productosResponse.statusText}`);
        }
        const productosData = await productosResponse.json();
        setProductos(productosData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para mapear estados de la API a los estados de visualización
  const mapApiStateToDisplayState = (apiState: string) => {
    switch (apiState.toLowerCase()) {
      case 'pendiente':
      case 'pendiente de pago':
        return 'Pendiente';
      case 'pagada':
        return 'Pagada';
      case 'processing':
      case 'shipped':
        return 'Pagado y enviado';
      default:
        return apiState;
    }
  };

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Pagada', label: 'Pagada' },
    { value: 'Pagado y enviado', label: 'Pagado y enviado' },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.idOrden.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.idCliente.toString().toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || order.estado === statusFilter;
    const matchesDate = !dateFilter || order.fecha === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return <Badge variant="warning">Pendiente</Badge>;
      case 'Pagada':
        return <Badge variant="info">Pagada</Badge>;
      case 'Pagado y enviado':
        return <Badge variant="success">Pagado y enviado</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getTotal = (order: Order) => {
    return order.orderProducts.reduce((sum, item) => {
      const product = productos.find(p => p.idProducto === item.idProducto);
      const price = product ? parseFloat(product.precio) : 0;
      return sum + (price * item.cantidad);
    }, 0);
  };

  const getItemsCount = (order: Order) => {
    return order.orderProducts.reduce((sum, item) => sum + item.cantidad, 0);
  };

  const handlePayment = async (order: Order) => {
    const paymentData = {
      idOrden: order.idOrden,
      monto: getTotal(order),
      metodoPago: 'tarjeta',
    };

    try {
      const response = await fetch('http://localhost:8080/api/cobros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`Error al procesar el pago: ${response.statusText}`);
      }

      alert('Pago realizado con éxito');
      const updatedOrders = orders.map(o =>
        o.idOrden === order.idOrden ? { ...o, estado: 'Pagada' } : o
      );
      setOrders(updatedOrders);
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error processing payment:', err);
      alert('Error al procesar el pago. Verifique la consola para más detalles.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <ClipboardList className="mx-auto mb-4 text-gray-400" size={64} />
        <p className="text-gray-600">Cargando órdenes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-6xl mx-auto text-center py-12">
        <ClipboardList className="mx-auto text-red-400 mb-4" size={64} />
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
        <p className="text-gray-600">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
          <ClipboardList className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Revisión de Órdenes
        </h1>
        <p className="text-gray-600 text-lg">
          Gestione y monitoree todas las órdenes del sistema
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Buscar por cliente, ID de orden..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />
          
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filtrar por estado"
          />
          
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            icon={<Calendar size={18} />}
          />
          
          <Button
            variant="outline"
            icon={<Filter size={18} />}
            className="h-12"
          >
            Más Filtros
          </Button>
        </div>
      </Card>

      {/* Orders Table */}
      <Card title="Lista de Órdenes" subtitle={`${filteredOrders.length} órdenes encontradas`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orden
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.idOrden} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.idOrden}</div>
                      <div className="text-sm text-gray-500">{getItemsCount(order)} productos</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="text-white" size={16} />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{order.cliente.nombre}</div>
                        <div className="text-sm text-gray-500">ID: {order.idCliente}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.fecha).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    ${getTotal(order).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {order.estado === 'Pendiente' ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handlePayment(order)}
                      >
                        Pagar
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye size={16} />}
                        onClick={() => setSelectedOrder(order)}
                      >
                        Ver Detalles
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Detalles de la Orden</h3>
                <p className="text-gray-600">Orden #{selectedOrder.idOrden}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                Cerrar
              </Button>
            </div>

            <div className="space-y-6">
              {/* Client Info */}
              <div className="bg-gray-50/50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Información del Cliente</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nombre:</span>
                    <p className="font-medium">{selectedOrder.cliente.nombre}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">ID Cliente:</span>
                    <p className="font-medium">{selectedOrder.idCliente}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Dirección:</span>
                    <p className="font-medium">{selectedOrder.cliente.direccion}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Contacto:</span>
                    <p className="font-medium">{selectedOrder.cliente.contacto}</p>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Estado de la Orden</h4>
                  {getStatusBadge(selectedOrder.estado)}
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Productos</h4>
                <div className="space-y-2">
                  {selectedOrder.orderProducts.map((product, index) => {
                    const matchedProduct = productos.find(p => p.idProducto === product.idProducto);
                    const price = matchedProduct ? parseFloat(matchedProduct.precio) : 0;
                    return (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Package className="text-gray-400" size={16} />
                          <span className="font-medium">{matchedProduct ? matchedProduct.nombre : `Producto ID ${product.idProducto}`}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(price * product.cantidad).toFixed(2)}</p>
                          <p className="text-sm text-gray-600">{product.cantidad} x ${price.toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total y Botón de Pago */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${getTotal(selectedOrder).toFixed(2)}
                    </span>
                  </div>
                </div>
                {selectedOrder.estado === 'Pendiente' && (
                  <Button
                    variant="success"
                    size="lg"
                    className="w-full"
                    onClick={() => handlePayment(selectedOrder)}
                  >
                    Pagar
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Órdenes', value: orders.length, color: 'blue' },
          { label: 'Pendientes', value: orders.filter(o => o.estado === 'Pendiente').length, color: 'yellow' },
          { label: 'Pagadas', value: orders.filter(o => o.estado === 'Pagada').length, color: 'indigo' },
          { label: 'Pagado y enviado', value: orders.filter(o => o.estado === 'Pagado y enviado').length, color: 'green' },
        ].map((stat, index) => (
          <Card key={index} className="text-center">
            <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderReview;