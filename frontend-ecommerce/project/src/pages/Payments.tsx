import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { CreditCard, Search, DollarSign, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface Payment {
  id: string;
  orderId: string;
  clientName: string;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'processing';
  paymentMethod: string;
  date: string;
  transactionId?: string;
  failureReason?: string;
}

const Payments: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [simulationLoading, setSimulationLoading] = useState<string | null>(null);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 'PAY-001',
      orderId: 'ORD-001',
      clientName: 'Supermercado Central',
      amount: 1234.50,
      status: 'success',
      paymentMethod: 'Tarjeta de Crédito',
      date: '2024-01-15',
      transactionId: 'TXN-2024-001'
    },
    {
      id: 'PAY-002',
      orderId: 'ORD-002',
      clientName: 'Tienda La Esquina',
      amount: 567.80,
      status: 'pending',
      paymentMethod: 'Transferencia Bancaria',
      date: '2024-01-14'
    },
    {
      id: 'PAY-003',
      orderId: 'ORD-003',
      clientName: 'Minimarket Express',
      amount: 890.25,
      status: 'failed',
      paymentMethod: 'Tarjeta de Débito',
      date: '2024-01-14',
      failureReason: 'Fondos insuficientes'
    },
    {
      id: 'PAY-004',
      orderId: 'ORD-004',
      clientName: 'Bodega San Juan',
      amount: 2345.75,
      status: 'processing',
      paymentMethod: 'Efectivo',
      date: '2024-01-13'
    }
  ]);

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'processing', label: 'Procesando' },
    { value: 'success', label: 'Exitoso' },
    { value: 'failed', label: 'Fallido' }
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const simulatePayment = async (paymentId: string) => {
    setSimulationLoading(paymentId);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Random success/failure simulation
    const isSuccess = Math.random() > 0.3; // 70% success rate
    
    setPayments(payments.map(payment => 
      payment.id === paymentId 
        ? { 
            ...payment, 
            status: isSuccess ? 'success' : 'failed',
            transactionId: isSuccess ? `TXN-${Date.now()}` : undefined,
            failureReason: !isSuccess ? 'Error en la simulación de pago' : undefined
          }
        : payment
    ));
    
    setSimulationLoading(null);
    
    // Show result
    if (isSuccess) {
      alert('¡Pago procesado exitosamente!');
    } else {
      alert('Error en el procesamiento del pago');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="warning">Pendiente</Badge>;
      case 'processing': return <Badge variant="info">Procesando</Badge>;
      case 'success': return <Badge variant="success">Exitoso</Badge>;
      case 'failed': return <Badge variant="danger">Fallido</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-500" size={20} />;
      case 'processing': return <AlertTriangle className="text-blue-500" size={20} />;
      case 'success': return <CheckCircle className="text-green-500" size={20} />;
      case 'failed': return <XCircle className="text-red-500" size={20} />;
      default: return <DollarSign className="text-gray-400" size={20} />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTotalAmount = (status?: string) => {
    const filteredByStatus = status ? payments.filter(p => p.status === status) : payments;
    return filteredByStatus.reduce((sum, payment) => sum + payment.amount, 0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mb-4">
          <CreditCard className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Gestión de Cobros
        </h1>
        <p className="text-gray-600 text-lg">
          Monitoree y procese los pagos de las órdenes
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <Clock className="mx-auto text-yellow-500 mb-2" size={32} />
          <div className="text-2xl font-bold text-yellow-600">
            {payments.filter(p => p.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Pendientes</div>
          <div className="text-xs text-gray-500 mt-1">
            {formatCurrency(getTotalAmount('pending'))}
          </div>
        </Card>
        
        <Card className="text-center">
          <AlertTriangle className="mx-auto text-blue-500 mb-2" size={32} />
          <div className="text-2xl font-bold text-blue-600">
            {payments.filter(p => p.status === 'processing').length}
          </div>
          <div className="text-sm text-gray-600">Procesando</div>
          <div className="text-xs text-gray-500 mt-1">
            {formatCurrency(getTotalAmount('processing'))}
          </div>
        </Card>
        
        <Card className="text-center">
          <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
          <div className="text-2xl font-bold text-green-600">
            {payments.filter(p => p.status === 'success').length}
          </div>
          <div className="text-sm text-gray-600">Exitosos</div>
          <div className="text-xs text-gray-500 mt-1">
            {formatCurrency(getTotalAmount('success'))}
          </div>
        </Card>
        
        <Card className="text-center">
          <XCircle className="mx-auto text-red-500 mb-2" size={32} />
          <div className="text-2xl font-bold text-red-600">
            {payments.filter(p => p.status === 'failed').length}
          </div>
          <div className="text-sm text-gray-600">Fallidos</div>
          <div className="text-xs text-gray-500 mt-1">
            {formatCurrency(getTotalAmount('failed'))}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por cliente, orden o ID de pago..."
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

      {/* Payments Table */}
      <Card title="Lista de Cobros" subtitle={`${filteredPayments.length} pagos encontrados`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(payment.status)}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                        <div className="text-sm text-gray-500">{payment.orderId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.clientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(payment.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.date).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      Ver Detalles
                    </Button>
                    
                    {(payment.status === 'pending' || payment.status === 'failed') && (
                      <Button
                        variant="primary"
                        size="sm"
                        loading={simulationLoading === payment.id}
                        onClick={() => simulatePayment(payment.id)}
                      >
                        {simulationLoading === payment.id ? 'Procesando...' : 'Simular Cobro'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Detalles del Pago</h3>
                <p className="text-gray-600">{selectedPayment.id}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPayment(null)}
              >
                Cerrar
              </Button>
            </div>

            <div className="space-y-6">
              {/* Payment Status */}
              <div className="text-center p-6 bg-gray-50/50 rounded-xl">
                <div className="mb-4">
                  {getStatusIcon(selectedPayment.status)}
                </div>
                <div className="mb-2">
                  {getStatusBadge(selectedPayment.status)}
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency(selectedPayment.amount)}
                </div>
                <p className="text-gray-600">{selectedPayment.paymentMethod}</p>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cliente</label>
                  <p className="text-gray-900">{selectedPayment.clientName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Orden</label>
                  <p className="text-gray-900">{selectedPayment.orderId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha</label>
                  <p className="text-gray-900">{new Date(selectedPayment.date).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Método</label>
                  <p className="text-gray-900">{selectedPayment.paymentMethod}</p>
                </div>
              </div>

              {/* Transaction ID */}
              {selectedPayment.transactionId && (
                <div className="bg-green-50 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-green-700">ID de Transacción</label>
                  <p className="text-green-900 font-mono">{selectedPayment.transactionId}</p>
                </div>
              )}

              {/* Failure Reason */}
              {selectedPayment.failureReason && (
                <div className="bg-red-50 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-red-700">Motivo del Fallo</label>
                  <p className="text-red-900">{selectedPayment.failureReason}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                {(selectedPayment.status === 'pending' || selectedPayment.status === 'failed') && (
                  <Button
                    variant="primary"
                    className="flex-1"
                    loading={simulationLoading === selectedPayment.id}
                    onClick={() => {
                      simulatePayment(selectedPayment.id);
                      setSelectedPayment(null);
                    }}
                  >
                    {simulationLoading === selectedPayment.id ? 'Procesando...' : 'Simular Cobro'}
                  </Button>
                )}
                
                {selectedPayment.status === 'success' && (
                  <Button
                    variant="outline"
                    className="flex-1"
                  >
                    Generar Recibo
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Stats */}
      <Card title="Resumen Financiero" gradient>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(getTotalAmount())}
            </div>
            <div className="text-sm text-gray-600">Total Procesado</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(getTotalAmount('success'))}
            </div>
            <div className="text-sm text-gray-600">Cobros Exitosos</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(getTotalAmount('pending') + getTotalAmount('processing'))}
            </div>
            <div className="text-sm text-gray-600">Pendiente de Cobro</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Payments;