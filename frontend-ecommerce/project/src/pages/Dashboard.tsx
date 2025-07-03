import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  DollarSign,
  Truck,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface Cliente {
  id_cliente: number;
  nombre: string;
  direccion: string;
  contacto: string;
}

interface Orden {
  idOrden: number;
  idCliente: number;
  cliente?: Cliente;
}

interface Despacho {
  idDespacho: number;
  idOrden: number;
  fechaDespacho: string;
  estado: string;
  direccionEntrega: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState([
    {
      title: 'Clientes Activos',
      value: '1,234',
      change: '+12%',
      icon: <Users className="text-blue-600" size={24} />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Productos en Stock',
      value: '5,678',
      change: '+5%',
      icon: <Package className="text-green-600" size={24} />,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Órdenes Hoy',
      value: '89',
      change: '+23%',
      icon: <ShoppingCart className="text-purple-600" size={24} />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Ventas del Mes',
      value: '$45,678',
      change: '+18%',
      icon: <DollarSign className="text-yellow-600" size={24} />,
      color: 'from-yellow-500 to-yellow-600'
    }
  ]);

  const [recentOrders] = useState([
    { id: 'ORD-001', client: 'Supermercado Central', status: 'En proceso', amount: '$1,234' },
    { id: 'ORD-002', client: 'Tienda La Esquina', status: 'Enviado', amount: '$567' },
    { id: 'ORD-003', client: 'Minimarket Express', status: 'Entregado', amount: '$890' },
    { id: 'ORD-004', client: 'Bodega San Juan', status: 'Pendiente', amount: '$2,345' },
  ]);

  const [despachos, setDespachos] = useState<Despacho[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch despachos
        const despachosResponse = await fetch('http://localhost:8080/api/despachos');
        if (!despachosResponse.ok) {
          throw new Error(`Error al obtener despachos: ${despachosResponse.statusText}`);
        }
        const despachosData = await despachosResponse.json();
        setDespachos(despachosData);

        // Fetch órdenes para cruzar datos
        const ordenesResponse = await fetch('http://localhost:8080/api/ordenes');
        if (!ordenesResponse.ok) {
          throw new Error(`Error al obtener órdenes: ${ordenesResponse.statusText}`);
        }
        const ordenesData = await ordenesResponse.json();
        setOrdenes(ordenesData);

        // Fetch clientes para cruzar datos
        const clientesResponse = await fetch('http://localhost:8080/api/clientes');
        if (!clientesResponse.ok) {
          throw new Error(`Error al obtener clientes: ${clientesResponse.statusText}`);
        }
        const clientesData = await clientesResponse.json();
        setClientes(clientesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'entregado': return 'success';
      case 'enviado': return 'info';
      case 'en proceso':
      case 'en preparación': return 'warning';
      case 'pendiente': return 'danger';
      default: return 'default';
    }
  };

  const getClientName = (idOrden: number) => {
    const orden = ordenes.find(o => o.idOrden === idOrden);
    if (!orden || !orden.cliente) {
      const cliente = clientes.find(c => c.id_cliente === orden?.idCliente);
      return cliente ? cliente.nombre : 'Cliente desconocido';
    }
    return orden.cliente.nombre;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <Truck className="mx-auto mb-4 text-gray-400" size={64} />
        <p className="text-gray-600">Cargando datos del dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-6xl mx-auto text-center py-12">
        <AlertCircle className="mx-auto text-red-400 mb-4" size={64} />
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
        <p className="text-gray-600">{error}</p>
      </Card>
    );
  }

  // Clasificar despachos por estado
  const despachosPorEstado = despachos.reduce((acc, despacho) => {
    const estado = despacho.estado || 'Sin estado';
    if (!acc[estado]) acc[estado] = [];
    acc[estado].push(despacho);
    return acc;
  }, {} as { [key: string]: Despacho[] });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Dashboard Principal
        </h1>
        <p className="text-gray-600 text-lg">
          Resumen general del sistema de distribución
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} gradient className="text-center">
            <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${stat.color} mb-4`}>
              {stat.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
            <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Órdenes Recientes" subtitle="Últimas transacciones del sistema">
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.client}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{order.amount}</p>
                  <span className={`
                    inline-flex px-2 py-1 text-xs font-semibold rounded-full
                    ${order.status === 'Entregado' ? 'bg-green-100 text-green-800' :
                      order.status === 'Enviado' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'En proceso' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}
                  `}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Despachos por Estado */}
        <Card title="Despachos por Estado" subtitle="Estado actual de los envíos">
          <div className="space-y-4">
            {Object.entries(despachosPorEstado).map(([estado, despachosEstado]) => (
              <div key={estado}>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{estado} ({despachosEstado.length})</h4>
                {despachosEstado.map((despacho) => (
                  <div key={despacho.idDespacho} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">Despacho #{despacho.idDespacho}</p>
                      <p className="text-sm text-gray-600">{getClientName(despacho.idOrden)}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(despacho.fechaDespacho).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`
                        inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${getStatusColor(despacho.estado) === 'success' ? 'bg-green-100 text-green-800' :
                          getStatusColor(despacho.estado) === 'info' ? 'bg-blue-100 text-blue-800' :
                          getStatusColor(despacho.estado) === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}
                      `}>
                        {despacho.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Acciones Rápidas" subtitle="Funciones más utilizadas">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Users size={24} />, label: 'Nuevo Cliente', color: 'from-blue-500 to-blue-600' },
            { icon: <Package size={24} />, label: 'Ver Inventario', color: 'from-green-500 to-green-600' },
            { icon: <ShoppingCart size={24} />, label: 'Nueva Orden', color: 'from-purple-500 to-purple-600' },
            { icon: <Truck size={24} />, label: 'Gestionar Envíos', color: 'from-orange-500 to-orange-600' },
          ].map((action, index) => (
            <button
              key={index}
              className={`
                p-6 rounded-xl bg-gradient-to-r ${action.color} text-white
                hover:shadow-lg transform hover:scale-105 transition-all duration-200
                flex flex-col items-center space-y-2
              `}
            >
              {action.icon}
              <span className="text-sm font-semibold">{action.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Estado del Sistema */}
      <Card title="Estado del Sistema" subtitle="Monitoreo de microservicios">
        <div className="space-y-4">
          {[
            { service: 'Servicio de Órdenes', status: 'Activo', uptime: '99.9%' },
            { service: 'Servicio de Inventario', status: 'Activo', uptime: '99.8%' },
            { service: 'Servicio de Pagos', status: 'Activo', uptime: '99.7%' },
            { service: 'Servicio de Envíos', status: 'Mantenimiento', uptime: '95.2%' },
          ].map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
              <div className="flex items-center space-x-3">
                {service.status === 'Activo' ? 
                  <CheckCircle className="text-green-500" size={20} /> :
                  <AlertCircle className="text-yellow-500" size={20} />
                }
                <div>
                  <p className="font-semibold text-gray-900">{service.service}</p>
                  <p className="text-sm text-gray-600">Uptime: {service.uptime}</p>
                </div>
              </div>
              <span className={`
                px-3 py-1 text-xs font-semibold rounded-full
                ${service.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
              `}>
                {service.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;