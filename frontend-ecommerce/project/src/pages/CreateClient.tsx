import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, Mail, MapPin, Save, UserPlus } from 'lucide-react';

interface Cliente {
  id_cliente: number;
  nombre: string;
  direccion: string;
  contacto: string;
}

const CreateClient: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    contacto: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);

  // Fetch clientes al montar el componente
  useEffect(() => {
    const fetchClientes = async () => {
      setLoadingClientes(true);
      try {
        const response = await fetch('http://localhost:8080/api/clientes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los clientes');
        }

        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error('Error fetching clientes:', error);
      } finally {
        setLoadingClientes(false);
      }
    };

    fetchClientes();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es obligatoria';
    }

    if (!formData.contacto.trim()) {
      newErrors.contacto = 'El contacto es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contacto)) {
      newErrors.contacto = 'Formato de correo inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el cliente');
      }

      // Resetear el formulario
      setFormData({
        nombre: '',
        direccion: '',
        contacto: ''
      });
      
      setSuccessMessage('Cliente creado exitosamente');

      // Refrescar la lista de clientes
      const refreshedResponse = await fetch('http://localhost:8080/api/clientes');
      if (refreshedResponse.ok) {
        const data = await refreshedResponse.json();
        setClientes(data);
      }
    } catch (error) {
      alert('Error al crear el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
          <UserPlus className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Crear Nuevo Cliente
        </h1>
        <p className="text-gray-600 text-lg">
          Registre un nuevo cliente en el sistema
        </p>
      </div>

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
          {successMessage}
        </div>
      )}

      <Card title="Información del Cliente" subtitle="Complete todos los campos obligatorios">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <div className="space-y-4">
            <Input
              label="Nombre Completo *"
              placeholder="Ej: David Rodriguez"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              error={errors.nombre}
              icon={<User size={18} />}
            />
            
            <Input
              label="Dirección *"
              placeholder="Ej: Solanda O4-150"
              value={formData.direccion}
              onChange={(e) => handleInputChange('direccion', e.target.value)}
              error={errors.direccion}
              icon={<MapPin size={18} />}
            />
            
            <Input
              label="Contacto (Correo) *"
              placeholder="Ej: andres.example@email.com"
              value={formData.contacto}
              onChange={(e) => handleInputChange('contacto', e.target.value)}
              error={errors.contacto}
              icon={<Mail size={18} />}
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => {
                setFormData({
                  nombre: '',
                  direccion: '',
                  contacto: ''
                });
                setErrors({});
                setSuccessMessage('');
              }}
            >
              Limpiar Formulario
            </Button>
            
            <Button
              type="submit"
              variant="success"
              size="lg"
              className="flex-1"
              icon={<Save size={18} />}
              loading={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cliente'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Clients List Section */}
      <Card title="Nuestros Clientes" gradient>
        {loadingClientes ? (
          <p className="text-gray-600">Cargando clientes...</p>
        ) : clientes.length === 0 ? (
          <p className="text-gray-600">No hay clientes registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-600">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left font-semibold">Nombre</th>
                  <th className="px-4 py-2 text-left font-semibold">Dirección</th>
                  <th className="px-4 py-2 text-left font-semibold">Contacto</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map(cliente => (
                  <tr key={cliente.id_cliente} className="border-t">
                    <td className="px-4 py-2">{cliente.nombre}</td>
                    <td className="px-4 py-2">{cliente.direccion}</td>
                    <td className="px-4 py-2">{cliente.contacto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CreateClient;