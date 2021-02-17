const ventasData = loadJSON("ventas");
const ventas = Venta.loadVentas(ventasData);
Venta.printVentas(ventas);