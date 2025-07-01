import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import { Search, Package, Plus, Filter, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  stock: number;
  price: number;
  image: string;
  status: 'available' | 'low-stock' | 'out-of-stock';
}

const ProductInventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState<{[key: string]: number}>({});

  const products: Product[] = [
    {
      id: '1',
      name: 'Teclado Mecánico RGB',
      description: 'Teclado mecánico con retroiluminación RGB y switches azules',
      category: 'Periféricos',
      stock: 50,
      price: 45.99,
      image: 'https://http2.mlstatic.com/D_NQ_NP_820938-MLA80563766270_112024-O.webp',
      status: 'available'
    },
    {
      id: '2',
      name: 'Mouse Inalámbrico',
      description: 'Mouse ergonómico inalámbrico con sensor óptico de alta precisión',
      category: 'Periféricos',
      stock: 20,
      price: 19.90,
      image: 'https://images-na.ssl-images-amazon.com/images/I/61LtuGzXeaL._AC_SL1500_.jpg',
      status: 'low-stock'
    },
    {
      id: '3',
      name: 'Monitor LED 24"',
      description: 'Monitor LED Full HD de 24 pulgadas con tecnología antirreflejo',
      category: 'Monitores',
      stock: 0,
      price: 129.99,
      image: 'https://images-na.ssl-images-amazon.com/images/I/81QpkIctqPL._AC_SL1500_.jpg',
      status: 'out-of-stock'
    },
    {
      id: '4',
      name: 'Laptop Ultrabook 14"',
      description: 'Laptop ultradelgada con procesador Intel i5 y 8GB RAM',
      category: 'Computadoras',
      stock: 15,
      price: 699.00,
      image: 'https://images-na.ssl-images-amazon.com/images/I/71TPda7cwUL._AC_SL1500_.jpg',
      status: 'available'
    },
    {
      id: '5',
      name: 'Auriculares Bluetooth',
      description: 'Auriculares inalámbricos con cancelación de ruido',
      category: 'Audio',
      stock: 35,
      price: 59.90,
      image: 'https://images-na.ssl-images-amazon.com/images/I/61CGHv6kmWL._AC_SL1500_.jpg',
      status: 'available'
    },
    {
      id: '6',
      name: 'Webcam HD 1080p',
      description: 'Cámara web de alta definición para videollamadas',
      category: 'Accesorios',
      stock: 8,
      price: 34.50,
      image: 'https://http2.mlstatic.com/D_Q_NP_904772-MLA52854278571_122022-O.webp', // webcam HD 1080p corregida
      status: 'low-stock'
    }
  ];

  const categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'Periféricos', label: 'Periféricos' },
    { value: 'Monitores', label: 'Monitores' },
    { value: 'Computadoras', label: 'Computadoras' },
    { value: 'Audio', label: 'Audio' },
    { value: 'Accesorios', label: 'Accesorios' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string, stock: number) => {
    if (status === 'out-of-stock') return <Badge variant="danger">Sin Stock</Badge>;
    if (status === 'low-stock') return <Badge variant="warning">Stock Bajo ({stock})</Badge>;
    return <Badge variant="success">Disponible ({stock})</Badge>;
  };

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const getTotalCartItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mb-4">
          <Package className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Inventario de Productos
        </h1>
        <p className="text-gray-600 text-lg">
          Explore y gestione el catálogo de productos disponibles
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1">
            <Input
              label="Buscar Productos"
              placeholder="Buscar por nombre o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={18} />}
            />
          </div>
          
          <div className="w-full lg:w-64">
            <Select
              label="Categoría"
              options={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
          
          <Button
            variant="outline"
            icon={<Filter size={18} />}
            className="whitespace-nowrap"
          >
            Más Filtros
          </Button>
          
          <Button
            variant="primary"
            icon={<ShoppingCart size={18} />}
            className="whitespace-nowrap relative"
          >
            Carrito ({getTotalCartItems()})
          </Button>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                {getStatusBadge(product.status, product.stock)}
              </div>
              
              <p className="text-gray-600 text-sm">{product.description}</p>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-green-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                
                <Button
                  variant={product.status === 'out-of-stock' ? 'secondary' : 'primary'}
                  size="sm"
                  icon={<Plus size={16} />}
                  disabled={product.status === 'out-of-stock'}
                  onClick={() => addToCart(product.id)}
                >
                  {product.status === 'out-of-stock' ? 'Sin Stock' : 'Agregar'}
                </Button>
              </div>
              
              {cart[product.id] && (
                <div className="bg-green-50 p-2 rounded-lg text-center">
                  <span className="text-green-800 font-semibold">
                    {cart[product.id]} en carrito
                  </span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-600">
            Intente ajustar los filtros de búsqueda
          </p>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{products.length}</div>
          <div className="text-sm text-gray-600">Total Productos</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {products.filter(p => p.status === 'available').length}
          </div>
          <div className="text-sm text-gray-600">Disponibles</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {products.filter(p => p.status === 'low-stock').length}
          </div>
          <div className="text-sm text-gray-600">Stock Bajo</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {products.filter(p => p.status === 'out-of-stock').length}
          </div>
          <div className="text-sm text-gray-600">Sin Stock</div>
        </Card>
      </div>
    </div>
  );
};

export default ProductInventory;