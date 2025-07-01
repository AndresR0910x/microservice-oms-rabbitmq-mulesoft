import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import { Search, Eye, Calendar, Filter, ClipboardList, User, Package, Plus } from 'lucide-react';

// Interfaz para las órdenes
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Formulario para crear orden
  const [newOrder, setNewOrder] = useState<Partial<Order>>({
    clientName: '',
    clientId: '',
    date: '',
    status: 'pending',
    total: 0,
    items: 1,
    paymentStatus: 'pending',
  });

  const API_BASE = 'http://localhost:8080/api/ordenes';

  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_BASE);
      setOrders(response.data);
    } catch (error) {
      console.error('Error al cargar las órdenes', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async () => {
    try {
      const response = await axios.post(API_BASE, newOrder);
      setOrders(prev => [...prev, response.data]);
      setNewOrder({
        clientName: '',
        clientId: '',
        date: '',
        status: 'pending',
        total: 0,
        items: 1,
        paymentStatus: 'pending',
      });
      alert('Orden creada con éxito');
    } catch (error) {
      console.error('Error al crear la orden', error);
      alert('Error al crear la orden');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'processing', label: 'En Proceso' },
    { value: 'shipped', label: 'Enviado' },
    { value: 'delivered', label: 'Entregado' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  return (
    <div className="space-y-10">

      {/* Título */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
          <ClipboardList className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Revisión de Órdenes
        </h1>
        <p className="text-gray-600 text-lg">Gestione y monitoree todas las órdenes del sistema</p>
      </div>

      {/* Formulario para crear orden */}
      <Card title="Crear Nueva Orden">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="Nombre del Cliente"
            value={newOrder.clientName || ''}
            onChange={(e) => setNewOrder({ ...newOrder, clientName: e.target.value })}
          />
          <Input
            placeholder="ID del Cliente"
            value={newOrder.clientId || ''}
            onChange={(e) => setNewOrder({ ...newOrder, clientId: e.target.value })}
          />
          <Input
            type="date"
            value={newOrder.date || ''}
            onChange={(e) => setNewOrder({ ...newOrder, date: e.target.value })}
          />
          <Input
            placeholder="Total"
            type="number"
            value={newOrder.total?.toString() || ''}
            onChange={(e) => setNewOrder({ ...newOrder, total: parseFloat(e.target.value) })}
          />
          <Input
            placeholder="Items"
            type="number"
            value={newOrder.items?.toString() || ''}
            onChange={(e) => setNewOrder({ ...newOrder, items: parseInt(e.target.value) })}
          />
          <Select
            options={[
              { value: 'pending', label: 'Pendiente' },
              { value: 'processing', label: 'En Proceso' },
              { value: 'shipped', label: 'Enviado' },
              { value: 'delivered', label: 'Entregado' },
              { value: 'cancelled', label: 'Cancelado' },
            ]}
            value={newOrder.status || ''}
            onChange={(val) => setNewOrder({ ...newOrder, status: val })}
            placeholder="Estado de orden"
          />
        </div>
        <Button icon={<Plus size={18} />} onClick={createOrder}>
          Crear Orden
        </Button>
      </Card>

      {/* Filtros */}
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

      {/* Tabla de órdenes */}
      <Card title="Lista de Órdenes" subtitle={`${filteredOrders.length} órdenes encontradas`}>
        {loading ? (
          <p className="text-center py-8">Cargando órdenes...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No se encontraron órdenes.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pago</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-gray-500">{order.items} productos</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="text-white" size={16} />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{order.clientName}</div>
                          <div className="text-sm text-gray-500">{order.clientId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{new Date(order.date).toLocaleDateString('es-ES')}</td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4">{getPaymentBadge(order.paymentStatus)}</td>
                    <td className="px-6 py-4 font-medium">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
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
        )}
      </Card>

      {/* Modal de detalles */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Detalles de la Orden</h3>
                <p className="text-gray-600">{selectedOrder.id}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>Cerrar</Button>
            </div>
            <div className="space-y-6">
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
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-green-600">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OrderReview;
