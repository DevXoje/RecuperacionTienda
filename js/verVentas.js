const ventasData = loadJSON("ventas");
console.log(new Venta(new Cliente({ nombre: "", apellidos: "", dni: "", fechaNac: "", email: "", contrasenya: "" })));
const ventas = Venta.loadVentas(ventasData);
Venta.printVentas(ventas);