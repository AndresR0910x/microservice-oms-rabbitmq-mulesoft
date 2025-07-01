import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import { Search, Package, Plus, Filter, ShoppingCart } from 'lucide-react';

interface Producto {
  idProducto: number;
  nombre: string;
  precio: string;
  stock: number;
  imagenUrl: string | null;
  categoria: string;
}

const ProductInventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:8080/api/productos');
        if (!response.ok) {
          throw new Error(`Error al obtener productos: ${response.statusText}`);
        }

        const data = await response.json();
        setProductos(data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    // Cargar carrito desde localStorage al iniciar
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Guardar carrito en localStorage cada vez que cambia
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = productos.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="danger">Sin Stock</Badge>;
    if (stock <= 5) return <Badge variant="warning">Stock Bajo ({stock})</Badge>;
    return <Badge variant="success">Disponible ({stock})</Badge>;
  };

  const addToCart = (idProducto: string) => {
    const product = productos.find(p => p.idProducto.toString() === idProducto);
    if (product && (cart[idProducto] || 0) < product.stock) {
      setCart(prev => ({
        ...prev,
        [idProducto]: (prev[idProducto] || 0) + 1
      }));
    } else {
      alert('No hay suficiente stock disponible');
    }
  };

  const getTotalCartItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mb-4">
          <Package className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Inventario de Productos
        </h1>
        <p className="text-gray-600 text-lg">Explore y gestione el catálogo de productos disponibles</p>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1">
            <Input
              label="Buscar Productos"
              placeholder="Buscar por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={18} />}
            />
          </div>

          <div className="w-full lg:w-64">
            <Select
              label="Categoría"
              options={[
                { value: '', label: 'Todas las categorías' },
                ...Array.from(new Set(productos.map(p => p.categoria)))
                  .filter((cat): cat is string => Boolean(cat))
                  .map((cat: string) => ({ value: cat, label: cat })),
              ]}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>

          <Button variant="outline" icon={<Filter size={18} />}>Más Filtros</Button>
          <Button variant="primary" icon={<ShoppingCart size={18} />} className="relative">
            Carrito ({getTotalCartItems()})
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Package className="mx-auto mb-2" size={48} />
            <p>Cargando productos...</p>
          </div>
        ) : error ? (
          <Card className="col-span-full text-center py-12">
            <Package className="mx-auto text-red-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
            <p className="text-gray-600">{error}</p>
          </Card>
        ) : filteredProducts.length === 0 ? (
          <Card className="col-span-full text-center py-12">
            <Package className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-600">Intente ajustar los filtros de búsqueda</p>
          </Card>
        ) : (
          filteredProducts.map(product => (
            <Card key={product.idProducto} className="overflow-hidden h-full">
              <div className="aspect-w-16 aspect-h-9 mb-4 flex items-center justify-center">
                <img
                  src={product.imagenUrl || 'https://via.placeholder.com/150'}
                  alt={product.nombre}
                  className="max-h-48 max-w-full object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150';
                  }}
                />
              </div>

              <div className="space-y-3 flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900">{product.nombre}</h3>
                  {getStatusBadge(product.stock)}
                </div>

                <p className="text-gray-600 text-sm">Precio: ${parseFloat(product.precio).toFixed(2)}</p>

                <div className="flex justify-between items-center">
                  <div></div>
                  <Button
                    variant={product.stock === 0 ? 'secondary' : 'primary'}
                    size="sm"
                    icon={<Plus size={16} />}
                    disabled={product.stock === 0}
                    onClick={() => addToCart(product.idProducto.toString())}
                  >
                    {product.stock === 0 ? 'Sin Stock' : 'Agregar'}
                  </Button>
                </div>

                {cart[product.idProducto.toString()] && (
                  <div className="bg-green-50 p-2 rounded-lg text-center">
                    <span className="text-green-800 font-semibold">{cart[product.idProducto.toString()]} en carrito</span>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{productos.length}</div>
          <div className="text-sm text-gray-600">Total Productos</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">{productos.filter(p => p.stock > 5).length}</div>
          <div className="text-sm text-gray-600">Disponibles</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{productos.filter(p => p.stock > 0 && p.stock <= 5).length}</div>
          <div className="text-sm text-gray-600">Stock Bajo</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600">{productos.filter(p => p.stock === 0).length}</div>
          <div className="text-sm text-gray-600">Sin Stock</div>
        </Card>
      </div>
    </div>
  );
};

export default ProductInventory;