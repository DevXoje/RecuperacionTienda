const productosData = loadJSON("productos");
const productos = Producto.loadProductos(productosData);
Producto.printProductos(productos);