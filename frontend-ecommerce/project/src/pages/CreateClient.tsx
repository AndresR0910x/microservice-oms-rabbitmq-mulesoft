import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, Mail, Phone, MapPin, CreditCard, Save, UserPlus } from 'lucide-react';

const CreateClient: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'La cédula/RUC es obligatoria';
    } else if (formData.idNumber.length < 8) {
      newErrors.idNumber = 'La cédula/RUC debe tener al menos 8 caracteres';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de correo inválido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es obligatoria';
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
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setFormData({
        name: '',
        idNumber: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        postalCode: ''
      });
      
      alert('Cliente creado exitosamente');
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

      <Card title="Información del Cliente" subtitle="Complete todos los campos obligatorios">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre Completo *"
              placeholder="Ej: Juan Pérez Distribuciones"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              icon={<User size={18} />}
            />
            
            <Input
              label="Cédula / RUC *"
              placeholder="Ej: 1234567890"
              value={formData.idNumber}
              onChange={(e) => handleInputChange('idNumber', e.target.value)}
              error={errors.idNumber}
              icon={<CreditCard size={18} />}
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Teléfono *"
              placeholder="Ej: +593 99 123 4567"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={errors.phone}
              icon={<Phone size={18} />}
            />
            
            <Input
              label="Correo Electrónico *"
              type="email"
              placeholder="Ej: cliente@empresa.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              icon={<Mail size={18} />}
            />
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <Input
              label="Dirección *"
              placeholder="Ej: Av. Principal 123, Sector Norte"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={errors.address}
              icon={<MapPin size={18} />}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Ciudad"
                placeholder="Ej: Quito"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                icon={<MapPin size={18} />}
              />
              
              <Input
                label="Código Postal"
                placeholder="Ej: 170101"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                icon={<MapPin size={18} />}
              />
            </div>
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
                  name: '',
                  idNumber: '',
                  phone: '',
                  email: '',
                  address: '',
                  city: '',
                  postalCode: ''
                });
                setErrors({});
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

      {/* Help Section */}
      <Card title="Información Adicional" gradient>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Campos Obligatorios</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Nombre completo del cliente</li>
              <li>• Cédula o RUC válido</li>
              <li>• Número de teléfono</li>
              <li>• Correo electrónico</li>
              <li>• Dirección completa</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Consejos</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Verifique los datos antes de guardar</li>
              <li>• Use el formato correcto para teléfono</li>
              <li>• La dirección debe ser completa y clara</li>
              <li>• El correo será usado para notificaciones</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateClient;