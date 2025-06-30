import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Send, Search, Truck, MapPin, Clock, Package, CheckCircle } from 'lucide-react';

interface Shipment {
  id: string;
  orderId: string;
  clientName: string;
  trackingNumber: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'failed';
  destination: string;
  estimatedDelivery: string;
  carrier: string;
  lastUpdate: string;
}

const Shipping: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: 'SHP-001',
      orderId: 'ORD-001',
      clientName: 'Supermercado Central',
      trackingNumber: 'TRK-2024-001',
      status: 'in-transit',
      destination: 'Av. Principal 123, Quito',
      estimatedDelivery: '2024-01-16',
      carrier: 'Express Delivery',
      lastUpdate: '2024-01-15 14:30'
    },
    {
      id: 'SHP-002',
      orderId: 'ORD-002',
      clientName: 'Tienda La Esquina',
      trackingNumber: 'TRK-2024-002',
      status: 'delivered',
      destination: 'Calle Secundaria 456, Guayaquil',
      estimatedDelivery: '2024-01-15',
      carrier: 'Fast Transport',
      lastUpdate: '2024-01-15 16:45'
    },
    {
      id: 'SHP-003',
      orderId: 'ORD-003',
      clientName: 'Minimarket Express',
      trackingNumber: 'TRK-2024-003',
      status: 'pending',
      destination: 'Plaza Central 789, Cuenca',
      estimatedDelivery: '2024-01-17',
      carrier: 'Regional Cargo',
      lastUpdate: '2024-01-15 09:15'
    },
    {
      id: 'SHP-004',
      orderId: 'ORD-004',
      clientName: 'Bodega San Juan',
      trackingNumber: 'TRK-2024-004',
      status: 'failed',
      destination: 'Sector Norte 321, Ambato',
      estimatedDelivery: '2024-01-16',
      carrier: 'Express Delivery',
      lastUpdate: '2024-01-15 11:20'
    }
  ]);

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'in-transit', label: 'En Tránsito' },
    { value: 'delivered', label: 'Entregado' },
    { value: 'failed', label: 'Fallido' }
  ];

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateShipmentStatus = (shipmentId: string, newStatus: Shipment['status']) => {
    setShipments(shipments.map(shipment => 
      shipment.id === shipmentId 
        ? { 
            ...shipment, 
            status: newStatus,
            lastUpdate: new Date().toLocaleString('es-ES')
          }
        : shipment
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="warning">Pendiente</Badge>;
      case 'in-transit': return <Badge variant="info">En Tránsito</Badge>;
      case 'delivered': return <Badge variant="success">Entregado</Badge>;
      case 'failed': return <Badge variant="danger">Fallido</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-500" size={20} />;
      case 'in-transit': return <Truck className="text-blue-500" size={20} />;
      case 'delivered': return <CheckCircle className="text-green-500" size={20} />;
      case 'failed': return <Package className="text-red-500" size={20} />;
      default: return <Package className="text-gray-400" size={20} />;
    }
  };

  const trackingHistory = {
    'TRK-2024-001': [
      { date: '2024-01-15 14:30', status: 'En tránsito', location: 'Centro de distribución Quito' },
      { date: '2024-01-15 10:00', status: 'Recogido', location: 'Almacén principal' },
      { date: '2024-01-15 08:30', status: 'Preparado', location: 'Centro de despacho' }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full mb-4">
          <Send className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Gestión de Envíos
        </h1>
        <p className="text-gray-600 text-lg">
          Monitoree y actualice el estado de todos los envíos
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pendientes', value: shipments.filter(s => s.status === 'pending').length, color: 'yellow', icon: Clock },
          { label: 'En Tránsito', value: shipments.filter(s => s.status === 'in-transit').length, color: 'blue', icon: Truck },
          { label: 'Entregados', value: shipments.filter(s => s.status === 'delivered').length, color: 'green', icon: CheckCircle },
          { label: 'Fallidos', value: shipments.filter(s => s.status === 'failed').length, color: 'red', icon: Package }
        ].map((stat, index) => (
          <Card key={index} className="text-center">
            <stat.icon className={`mx-auto text-${stat.color}-500 mb-2`} size={32} />
            <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por cliente, número de guía o ID de orden..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={18} />}
            />
          </div>
          
          <div className="w-full md:w-64">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filtrar por estado"
            />
          </div>
        </div>
      </Card>

      {/* Shipments Table */}
      <Card title="Lista de Envíos" subtitle={`${filteredShipments.length} envíos encontrados`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Envío
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destino
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entrega Estimada
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(shipment.status)}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{shipment.trackingNumber}</div>
                        <div className="text-sm text-gray-500">{shipment.orderId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{shipment.clientName}</div>
                    <div className="text-sm text-gray-500">{shipment.carrier}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <MapPin className="text-gray-400 mt-0.5 mr-2 flex-shrink-0" size={16} />
                      <div className="text-sm text-gray-900">{shipment.destination}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(shipment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(shipment.estimatedDelivery).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedShipment(shipment)}
                    >
                      Ver Detalles
                    </Button>
                    
                    {shipment.status === 'pending' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => updateShipmentStatus(shipment.id, 'in-transit')}
                      >
                        Marcar en Tránsito
                      </Button>
                    )}
                    
                    {shipment.status === 'in-transit' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => updateShipmentStatus(shipment.id, 'delivered')}
                      >
                        Marcar Entregado
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Shipment Details Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Detalles del Envío</h3>
                <p className="text-gray-600">{selectedShipment.trackingNumber}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedShipment(null)}
              >
                Cerrar
              </Button>
            </div>

            <div className="space-y-6">
              {/* Status and Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50/50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Estado Actual</h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedShipment.status)}
                    {getStatusBadge(selectedShipment.status)}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Última actualización: {selectedShipment.lastUpdate}
                  </p>
                </div>
                
                <div className="bg-gray-50/50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Información de Entrega</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Transportadora:</strong> {selectedShipment.carrier}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Entrega estimada:</strong> {new Date(selectedShipment.estimatedDelivery).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>

              {/* Destination */}
              <div className="bg-blue-50/50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Destino</h4>
                <div className="flex items-start">
                  <MapPin className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-medium text-gray-900">{selectedShipment.clientName}</p>
                    <p className="text-sm text-gray-600">{selectedShipment.destination}</p>
                  </div>
                </div>
              </div>

              {/* Tracking History */}
              {trackingHistory[selectedShipment.trackingNumber as keyof typeof trackingHistory] && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Historial de Seguimiento</h4>
                  <div className="space-y-3">
                    {trackingHistory[selectedShipment.trackingNumber as keyof typeof trackingHistory].map((event, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50/50 rounded-lg">
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{event.status}</p>
                          <p className="text-sm text-gray-600">{event.location}</p>
                          <p className="text-xs text-gray-500">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                {selectedShipment.status === 'pending' && (
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      updateShipmentStatus(selectedShipment.id, 'in-transit');
                      setSelectedShipment(null);
                    }}
                  >
                    Marcar en Tránsito
                  </Button>
                )}
                
                {selectedShipment.status === 'in-transit' && (
                  <Button
                    variant="success"
                    className="flex-1"
                    onClick={() => {
                      updateShipmentStatus(selectedShipment.id, 'delivered');
                      setSelectedShipment(null);
                    }}
                  >
                    Marcar como Entregado
                  </Button>
                )}
                
                {selectedShipment.status === 'failed' && (
                  <Button
                    variant="warning"
                    className="flex-1"
                    onClick={() => {
                      updateShipmentStatus(selectedShipment.id, 'pending');
                      setSelectedShipment(null);
                    }}
                  >
                    Reintentar Envío
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Shipping;