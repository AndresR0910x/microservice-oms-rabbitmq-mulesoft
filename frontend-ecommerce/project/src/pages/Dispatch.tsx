import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { Truck, Package, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';

interface DispatchOrder {
  id: string;
  clientName: string;
  products: { name: string; quantity: number }[];
  priority: 'high' | 'medium' | 'low';
  status: 'ready-to-pack' | 'packing' | 'ready-to-ship' | 'shipped';
  orderDate: string;
  notes?: string;
}

const Dispatch: React.FC = () => {
  const [orders, setOrders] = useState<DispatchOrder[]>([
    {
      id: 'ORD-001',
      clientName: 'Supermercado Central',
      products: [
        { name: 'Coca Cola 2L', quantity: 5 },
        { name: 'Pan Integral', quantity: 10 },
        { name: 'Arroz Premium 1kg', quantity: 20 }
      ],
      priority: 'high',
      status: 'ready-to-pack',
      orderDate: '2024-01-15',
      notes: 'Entrega urgente solicitada'
    },
    {
      id: 'ORD-002',
      clientName: 'Tienda La Esquina',
      products: [
        { name: 'Leche Entera 1L', quantity: 12 },
        { name: 'Aceite de Girasol 1L', quantity: 6 }
      ],
      priority: 'medium',
      status: 'packing',
      orderDate: '2024-01-14'
    },
    {
      id: 'ORD-003',
      clientName: 'Minimarket Express',
      products: [
        { name: 'Detergente Líquido 2L', quantity: 8 },
        { name: 'Arroz Premium 1kg', quantity: 15 }
      ],
      priority: 'low',
      status: 'ready-to-ship',
      orderDate: '2024-01-14'
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<DispatchOrder | null>(null);
  const [shippingNotes, setShippingNotes] = useState('');

  const updateOrderStatus = (orderId: string, newStatus: DispatchOrder['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const markAsReadyForShipping = (orderId: string, notes: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'ready-to-ship', notes: notes || order.notes }
        : order
    ));
    setSelectedOrder(null);
    setShippingNotes('');
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="danger">Alta</Badge>;
      case 'medium': return <Badge variant="warning">Media</Badge>;
      case 'low': return <Badge variant="info">Baja</Badge>;
      default: return <Badge variant="default">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready-to-pack': return <Badge variant="warning">Listo para Empacar</Badge>;
      case 'packing': return <Badge variant="info">Empacando</Badge>;
      case 'ready-to-ship': return <Badge variant="success">Listo para Envío</Badge>;
      case 'shipped': return <Badge variant="default">Enviado</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready-to-pack': return <Clock className="text-yellow-500" size={20} />;
      case 'packing': return <Package className="text-blue-500" size={20} />;
      case 'ready-to-ship': return <CheckCircle className="text-green-500" size={20} />;
      case 'shipped': return <Truck className="text-gray-500" size={20} />;
      default: return <AlertCircle className="text-gray-400" size={20} />;
    }
  };

  const readyToPackOrders = orders.filter(order => order.status === 'ready-to-pack');
  const packingOrders = orders.filter(order => order.status === 'packing');
  const readyToShipOrders = orders.filter(order => order.status === 'ready-to-ship');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mb-4">
          <Truck className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
          Centro de Despacho
        </h1>
        <p className="text-gray-600 text-lg">
          Gestione el empaque y preparación de órdenes para envío
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <Clock className="mx-auto text-yellow-500 mb-2" size={32} />
          <div className="text-2xl font-bold text-yellow-600">{readyToPackOrders.length}</div>
          <div className="text-sm text-gray-600">Listo para Empacar</div>
        </Card>
        
        <Card className="text-center">
          <Package className="mx-auto text-blue-500 mb-2" size={32} />
          <div className="text-2xl font-bold text-blue-600">{packingOrders.length}</div>
          <div className="text-sm text-gray-600">En Empaque</div>
        </Card>
        
        <Card className="text-center">
          <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
          <div className="text-2xl font-bold text-green-600">{readyToShipOrders.length}</div>
          <div className="text-sm text-gray-600">Listo para Envío</div>
        </Card>
        
        <Card className="text-center">
          <Truck className="mx-auto text-purple-500 mb-2" size={32} />
          <div className="text-2xl font-bold text-purple-600">{orders.length}</div>
          <div className="text-sm text-gray-600">Total Órdenes</div>
        </Card>
      </div>

      {/* Orders by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ready to Pack */}
        <Card title="Listo para Empacar" subtitle={`${readyToPackOrders.length} órdenes`}>
          <div className="space-y-4">
            {readyToPackOrders.map((order) => (
              <div key={order.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{order.id}</h4>
                    <p className="text-sm text-gray-600">{order.clientName}</p>
                  </div>
                  {getPriorityBadge(order.priority)}
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  {order.products.length} productos
                </div>
                
                <Button
                  variant="warning"
                  size="sm"
                  className="w-full"
                  onClick={() => updateOrderStatus(order.id, 'packing')}
                >
                  Iniciar Empaque
                </Button>
              </div>
            ))}
            
            {readyToPackOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="mx-auto mb-2" size={32} />
                <p>No hay órdenes listas para empacar</p>
              </div>
            )}
          </div>
        </Card>

        {/* Packing */}
        <Card title="En Empaque" subtitle={`${packingOrders.length} órdenes`}>
          <div className="space-y-4">
            {packingOrders.map((order) => (
              <div key={order.id} className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{order.id}</h4>
                    <p className="text-sm text-gray-600">{order.clientName}</p>
                  </div>
                  {getPriorityBadge(order.priority)}
                </div>
                
                <div className="space-y-2 mb-3">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{product.name}</span>
                      <span className="font-medium">{product.quantity}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  variant="success"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedOrder(order)}
                >
                  Marcar como Listo
                </Button>
              </div>
            ))}
            
            {packingOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="mx-auto mb-2" size={32} />
                <p>No hay órdenes en empaque</p>
              </div>
            )}
          </div>
        </Card>

        {/* Ready to Ship */}
        <Card title="Listo para Envío" subtitle={`${readyToShipOrders.length} órdenes`}>
          <div className="space-y-4">
            {readyToShipOrders.map((order) => (
              <div key={order.id} className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{order.id}</h4>
                    <p className="text-sm text-gray-600">{order.clientName}</p>
                  </div>
                  <CheckCircle className="text-green-500" size={20} />
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  {order.products.length} productos empacados
                </div>
                
                {order.notes && (
                  <div className="bg-white p-2 rounded text-xs text-gray-600 mb-3">
                    <strong>Notas:</strong> {order.notes}
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  icon={<FileText size={16} />}
                >
                  Ver Detalles
                </Button>
              </div>
            ))}
            
            {readyToShipOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="mx-auto mb-2" size={32} />
                <p>No hay órdenes listas para envío</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Mark as Ready Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <div className="text-center mb-6">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-900">Marcar como Listo para Envío</h3>
              <p className="text-gray-600">Orden: {selectedOrder.id}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Productos Empacados:</h4>
                <div className="space-y-1">
                  {selectedOrder.products.map((product, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{product.name}</span>
                      <span className="font-medium">{product.quantity} unidades</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones de Envío (Opcional)
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Agregue cualquier nota especial para el envío..."
                  value={shippingNotes}
                  onChange={(e) => setShippingNotes(e.target.value)}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedOrder(null);
                    setShippingNotes('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="success"
                  className="flex-1"
                  onClick={() => markAsReadyForShipping(selectedOrder.id, shippingNotes)}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dispatch;