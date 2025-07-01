import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Truck, CheckCircle, Clock, AlertCircle, Package } from 'lucide-react';

interface OrderProduct {
  idOrdenProducto: number;
  idProducto: number;
  cantidad: number;
}

interface Cliente {
  nombre: string;
  direccion: string;
  contacto: string;
  id_cliente: number;
}

interface Orden {
  idOrden: number;
  fecha: string;
  estado: string;
  idCliente: number;
  cliente: Cliente;
  orderProducts: OrderProduct[];
}

interface Despacho {
  idDespacho: number;
  idOrden: number;
  fechaDespacho: string | null;
  estado: 'pendiente de pago' | 'Orden pagada - lista para enviar' | 'enviada';
  direccionEntrega: string | null;
  idEnvio?: number;
}

interface EnvioResponse {
  idEnvio: number;
  idDespacho: number;
  idOrden: number;
  fechaDespacho: string;
  estado: string;
  direccionEntrega: string;
  correoUsuario: string;
}

const Dispatch: React.FC = () => {
  const [despachos, setDespachos] = useState<Despacho[]>([]);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loadingDespachos, setLoadingDespachos] = useState(false);
  const [selectedDespacho, setSelectedDespacho] = useState<Despacho | null>(null);
  const [shippingNotes, setShippingNotes] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoadingDespachos(true);
      try {
        const despachosResponse = await fetch('http://localhost:8080/api/despachos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!despachosResponse.ok) {
          throw new Error('Error al obtener los despachos');
        }
        const despachosData = await despachosResponse.json();
        setDespachos(despachosData);

        const ordenesResponse = await fetch('http://localhost:8080/api/ordenes');
        if (!ordenesResponse.ok) {
          throw new Error('Error al obtener las órdenes');
        }
        const ordenesData = await ordenesResponse.json();
        setOrdenes(ordenesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error al cargar los despachos u órdenes');
      } finally {
        setLoadingDespachos(false);
      }
    };

    fetchData();
  }, []);

  const sendOrder = async (idOrden: number, notes: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/envios?idOrden=${idOrden}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al enviar la orden');
      }

      const envioData: EnvioResponse = await response.json();
      setDespachos(prevDespachos =>
        prevDespachos.map(despacho =>
          despacho.idOrden === idOrden
            ? {
                ...despacho,
                estado: envioData.estado as Despacho['estado'],
                fechaDespacho: envioData.fechaDespacho,
                idEnvio: envioData.idEnvio,
                direccionEntrega: envioData.direccionEntrega,
              }
            : despacho
        )
      );
    } catch (error) {
      console.error('Error sending order:', error);
      alert('Error al enviar la orden');
    }
  };

  const markAsEnviada = (despacho: Despacho, notes: string) => {
    sendOrder(despacho.idOrden, notes);
    setSelectedDespacho(null);
    setShippingNotes('');
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente de pago':
        return <Badge variant="warning">Pendiente de Pago</Badge>;
      case 'Orden pagada - lista para enviar':
        return <Badge variant="success">Orden Pagada - Lista para Enviar</Badge>;
      case 'enviada':
        return <Badge variant="default">Enviada</Badge>;
      default:
        return <Badge variant="default">{estado}</Badge>;
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente de pago':
        return <Clock className="text-yellow-500" size={20} />;
      case 'Orden pagada - Lista para enviar':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'enviada':
        return <Truck className="text-gray-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-400" size={20} />;
    }
  };

  const getOrderDetails = (idOrden: number) => {
    const orden = ordenes.find(o => o.idOrden === idOrden);
    if (!orden) return { clientName: 'Desconocido', itemCount: 0, total: 0, fecha: '' };

    const itemCount = orden.orderProducts.reduce((sum, item) => sum + item.cantidad, 0);
    const total = 0; // Placeholder, necesitarías precios para calcularlo
    return { clientName: orden.cliente.nombre, itemCount, total, fecha: orden.fecha };
  };

  // Ordenar despachos por fecha de orden (FIFO)
  const sortByDate = (despachos: Despacho[]) =>
    despachos.sort((a, b) => {
      const dateA = getOrderDetails(a.idOrden).fecha || a.idOrden.toString(); // Fallback a idOrden
      const dateB = getOrderDetails(b.idOrden).fecha || b.idOrden.toString();
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

  const pendientePagoDespachos = sortByDate(despachos.filter(d => d.estado === 'pendiente de pago'));
  const listaParaEnviarDespachos = sortByDate(despachos.filter(d => d.estado === 'Orden pagada - lista para enviar'));
  const enviadaDespachos = sortByDate(despachos.filter(d => d.estado === 'enviada'));

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <Clock className="mx-auto text-yellow-500 mb-2" size={32} />
          <div className="text-2xl font-bold text-yellow-600">{pendientePagoDespachos.length}</div>
          <div className="text-sm text-gray-600">Pendiente de Pago</div>
        </Card>
        
        <Card className="text-center">
          <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
          <div className="text-2xl font-bold text-green-600">{listaParaEnviarDespachos.length}</div>
          <div className="text-sm text-gray-600">Orden Pagada - Lista para Enviar</div>
        </Card>
        
        <Card className="text-center">
          <Truck className="mx-auto text-gray-500 mb-2" size={32} />
          <div className="text-2xl font-bold text-gray-600">{enviadaDespachos.length}</div>
          <div className="text-sm text-gray-600">Enviada</div>
        </Card>
      </div>

      {/* Despachos by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pendiente de Pago */}
        <Card title="Pendiente de Pago" subtitle={`${pendientePagoDespachos.length} órdenes`}>
          <div className="space-y-4">
            {pendientePagoDespachos.map((despacho) => {
              const { clientName, itemCount, fecha } = getOrderDetails(despacho.idOrden);
              return (
                <div key={despacho.idDespacho} className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">Orden #{despacho.idOrden}</h4>
                      <p className="text-sm text-gray-600">Cliente: {clientName}</p>
                      <p className="text-sm text-gray-600">{itemCount} productos</p>
                      {despacho.direccionEntrega && (
                        <p className="text-sm text-gray-600">Dirección: {despacho.direccionEntrega}</p>
                      )}
                      {fecha && (
                        <p className="text-sm text-gray-600">Fecha: {new Date(fecha).toLocaleDateString('es-ES')}</p>
                      )}
                    </div>
                    {getStatusBadge(despacho.estado)}
                  </div>
                </div>
              );
            })}
            {pendientePagoDespachos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="mx-auto mb-2" size={32} />
                <p>No hay órdenes pendientes de pago</p>
              </div>
            )}
          </div>
        </Card>

        {/* Orden Pagada - Lista para Enviar */}
        <Card title="Orden Pagada - Lista para Enviar" subtitle={`${listaParaEnviarDespachos.length} órdenes`}>
          <div className="space-y-4">
            {listaParaEnviarDespachos.map((despacho) => {
              const { clientName, itemCount, fecha } = getOrderDetails(despacho.idOrden);
              return (
                <div key={despacho.idDespacho} className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">Orden #{despacho.idOrden}</h4>
                      <p className="text-sm text-gray-600">Cliente: {clientName}</p>
                      <p className="text-sm text-gray-600">{itemCount} productos</p>
                      {despacho.direccionEntrega && (
                        <p className="text-sm text-gray-600">Dirección: {despacho.direccionEntrega}</p>
                      )}
                      {fecha && (
                        <p className="text-sm text-gray-600">Fecha: {new Date(fecha).toLocaleDateString('es-ES')}</p>
                      )}
                    </div>
                    {getStatusBadge(despacho.estado)}
                  </div>
                  <Button
                    variant="success"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedDespacho(despacho)}
                  >
                    Enviar
                  </Button>
                </div>
              );
            })}
            {listaParaEnviarDespachos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="mx-auto mb-2" size={32} />
                <p>No hay órdenes listas para enviar</p>
              </div>
            )}
          </div>
        </Card>

        {/* Enviada */}
        <Card title="Enviada" subtitle={`${enviadaDespachos.length} órdenes`}>
          <div className="space-y-4">
            {enviadaDespachos.map((despacho) => {
              const { clientName, itemCount, fecha } = getOrderDetails(despacho.idOrden);
              return (
                <div key={despacho.idDespacho} className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">Orden #{despacho.idOrden}</h4>
                      <p className="text-sm text-gray-600">Cliente: {clientName}</p>
                      <p className="text-sm text-gray-600">{itemCount} productos</p>
                      {despacho.direccionEntrega && (
                        <p className="text-sm text-gray-600">Dirección: {despacho.direccionEntrega}</p>
                      )}
                      {despacho.fechaDespacho && (
                        <p className="text-sm text-gray-600">Enviada el: {new Date(despacho.fechaDespacho).toLocaleString('es-ES')}</p>
                      )}
                      {despacho.idEnvio && (
                        <p className="text-sm text-gray-600">ID Envío: {despacho.idEnvio}</p>
                      )}
                      {fecha && (
                        <p className="text-sm text-gray-600">Fecha: {new Date(fecha).toLocaleDateString('es-ES')}</p>
                      )}
                    </div>
                    {getStatusBadge(despacho.estado)}
                  </div>
                </div>
              );
            })}
            {enviadaDespachos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Truck className="mx-auto mb-2" size={32} />
                <p>No hay órdenes enviadas</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Mark as Enviada Modal */}
      {selectedDespacho && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <div className="text-center mb-6">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-900">Marcar como Enviada</h3>
              <p className="text-gray-600">Orden: #{selectedDespacho.idOrden}</p>
            </div>

            <div className="space-y-4">
              {selectedDespacho.direccionEntrega && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Dirección de Entrega:</h4>
                  <p className="text-sm text-gray-600">{selectedDespacho.direccionEntrega}</p>
                </div>
              )}

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
                    setSelectedDespacho(null);
                    setShippingNotes('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="success"
                  className="flex-1"
                  onClick={() => markAsEnviada(selectedDespacho, shippingNotes)}
                >
                  Confirmar Envío
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