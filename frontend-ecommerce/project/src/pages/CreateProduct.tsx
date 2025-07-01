import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { PlusCircle, UploadCloud } from 'lucide-react';

const CreateProduct: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenUrl, setImagenUrl] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUploadImage = async () => {
    if (!imagenFile) {
      setMensaje('❌ Selecciona una imagen primero');
      return;
    }

    const formData = new FormData();
    formData.append('file', imagenFile);

    setLoading(true);
    setMensaje('');

    try {
      const response = await fetch('http://localhost:8080/api/productos/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al subir la imagen');
      const data = await response.json();
      setImagenUrl(data.url); // Usa la URL devuelta por el backend
      setMensaje('✅ Imagen subida correctamente');
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al subir la imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !precio || !stock || !categoria || !imagenUrl) {
      setMensaje('❌ Todos los campos, incluido la URL de la imagen, son obligatorios');
      return;
    }

    const data = {
      nombre,
      precio,
      stock: parseInt(stock),
      imagenUrl,
      categoria,
    };

    setLoading(true);
    setMensaje('');

    try {
      const response = await fetch('http://localhost:8080/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Error al crear el producto');
      setMensaje('✅ Producto creado correctamente');
      setNombre('');
      setPrecio('');
      setStock('');
      setCategoria('');
      setImagenFile(null);
      setImagenUrl('');
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto p-6 space-y-4">
      <div className="text-center mb-4">
        <div className="inline-flex p-3 bg-green-500 rounded-full mb-2">
          <PlusCircle className="text-white" size={28} />
        </div>
        <h2 className="text-2xl font-bold">Crear Producto con Imagen</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
        <Input label="Precio" type="number" value={precio} onChange={e => setPrecio(e.target.value)} required step="0.01" />
        <Input label="Stock Inicial" type="number" value={stock} onChange={e => setStock(e.target.value)} required />
        <Input label="Categoría" value={categoria} onChange={e => setCategoria(e.target.value)} required />

        <div>
          <label className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagenFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm"
            required
          />
          <Button
            type="button"
            variant="secondary"
            icon={<UploadCloud size={16} />}
            className="mt-2"
            onClick={handleUploadImage}
            disabled={!imagenFile || loading}
          >
            {loading ? 'Subiendo...' : 'Subir Imagen'}
          </Button>
          {imagenUrl && (
            <img src={imagenUrl} alt="Vista previa" className="mt-4 w-48 rounded-lg shadow" />
          )}
        </div>

        <Button type="submit" variant="primary" className="w-full" disabled={!imagenUrl || loading}>
          {loading ? 'Guardando...' : 'Crear Producto'}
        </Button>
        {mensaje && <p className="text-center text-sm mt-2">{mensaje}</p>}
      </form>
    </Card>
  );
};

export default CreateProduct;