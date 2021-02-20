const productosData = loadJSON("productos");
Producto.cacheProductos = Producto.loadProductos(productosData);
Producto.printProductos(Producto.cacheProductos);