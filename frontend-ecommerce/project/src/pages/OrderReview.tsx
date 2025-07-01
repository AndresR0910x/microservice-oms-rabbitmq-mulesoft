import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import { Search, Eye, Calendar, Filter, ClipboardList, User, Package } from 'lucide-react';

interface Order {
  id: string;
  clientName: string;
  clientId: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
}

const OrderReview: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orders: Order[] = [
    {
      id: 'ORD-001',
      clientName: 'Tech Store Central',
      clientId: 'CLI-001',
      date: '2024-01-15',
      status: 'processing',
      total: 899.87,
      items: 3,
      paymentStatus: 'paid'
    },
    {
      id: 'ORD-002',
      clientName: 'Gadgets y Más',
      clientId: 'CLI-002',
      date: '2024-01-14',
      status: 'shipped',
      total: 149.89,
      items: 2,
      paymentStatus: 'paid'
    },
    {
      id: 'ORD-003',
      clientName: 'Oficina Express',
      clientId: 'CLI-003',
      date: '2024-01-14',
      status: 'delivered',
      total: 59.90,
      items: 1,
      paymentStatus: 'paid'
    },
    {
      id: 'ORD-004',
      clientName: 'Computodo',
      clientId: 'CLI-004',
      date: '2024-01-13',
      status: 'pending',
      total: 699.00,
      items: 1,
      paymentStatus: 'pending'
    },
    {
      id: 'ORD-005',
      clientName: 'Audio Pro',
      clientId: 'CLI-005',
      date: '2024-01-12',
      status: 'cancelled',
      total: 34.50,
      items: 1,
      paymentStatus: 'failed'
    }
  ];

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'processing', label: 'En Proceso' },
    { value: 'shipped', label: 'Enviado' },
    { value: 'delivered', label: 'Entregado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.clientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesDate = !dateFilter || order.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="warning">Pendiente</Badge>;
      case 'processing': return <Badge variant="info">En Proceso</Badge>;
      case 'shipped': return <Badge variant="info">Enviado</Badge>;
      case 'delivered': return <Badge variant="success">Entregado</Badge>;
      case 'cancelled': return <Badge variant="danger">Cancelado</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge variant="success">Pagado</Badge>;
      case 'pending': return <Badge variant="warning">Pendiente</Badge>;
      case 'failed': return <Badge variant="danger">Fallido</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const orderDetails = {
    'ORD-001': {
      products: [
        { name: 'Teclado Mecánico RGB', quantity: 1, price: 45.99 },
        { name: 'Monitor LED 24"', quantity: 2, price: 129.99 },
        { name: 'Laptop Ultrabook 14"', quantity: 1, price: 699.00 }
      ],
      notes: 'Entrega urgente solicitada para mañana temprano'
    },
    'ORD-002': {
      products: [
        { name: 'Mouse Inalámbrico', quantity: 1, price: 19.90 },
        { name: 'Auriculares Bluetooth', quantity: 2, price: 59.90 }
      ],
      notes: 'Enviar con factura electrónica'
    },
    'ORD-003': {
      products: [
        { name: 'Auriculares Bluetooth', quantity: 1, price: 59.90 }
      ],
      notes: ''
    },
    'ORD-004': {
      products: [
        { name: 'Laptop Ultrabook 14"', quantity: 1, price: 699.00 }
      ],
      notes: 'Requiere configuración inicial'
    },
    'ORD-005': {
      products: [
        { name: 'Webcam HD 1080p', quantity: 1, price: 34.50 }
      ],
      notes: 'Cliente canceló la orden'
    }
  };

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      <div className="text-sm text-gray-500">{order.items} productos</div>
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
                        <div className="text-sm font-medium text-gray-900">{order.clientName}</div>
                        <div className="text-sm text-gray-500">{order.clientId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.date).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentBadge(order.paymentStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye size={16} />}
                      onClick={() => setSelectedOrder(order)}
                    >
                      Ver Detalles
                    </Button>
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
                <p className="text-gray-600">{selectedOrder.id}</p>
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
                    <p className="font-medium">{selectedOrder.clientName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">ID Cliente:</span>
                    <p className="font-medium">{selectedOrder.clientId}</p>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Estado de la Orden</h4>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Estado del Pago</h4>
                  {getPaymentBadge(selectedOrder.paymentStatus)}
                </div>
              </div>

              {/* Products */}
              {orderDetails[selectedOrder.id as keyof typeof orderDetails] && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Productos</h4>
                  <div className="space-y-2">
                    {orderDetails[selectedOrder.id as keyof typeof orderDetails].products.map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Package className="text-gray-400" size={16} />
                          <span className="font-medium">{product.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(product.quantity * product.price).toFixed(2)}</p>
                          <p className="text-sm text-gray-600">{product.quantity} x ${product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Órdenes', value: orders.length, color: 'blue' },
          { label: 'Pendientes', value: orders.filter(o => o.status === 'pending').length, color: 'yellow' },
          { label: 'En Proceso', value: orders.filter(o => o.status === 'processing').length, color: 'indigo' },
          { label: 'Entregadas', value: orders.filter(o => o.status === 'delivered').length, color: 'green' },
          { label: 'Canceladas', value: orders.filter(o => o.status === 'cancelled').length, color: 'red' }
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