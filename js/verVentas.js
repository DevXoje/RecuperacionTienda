const ventasData = loadJSON("ventas");
console.log(new Venta(new Cliente({ nombre: "", apellidos: "", dni: "", fechaNac: "", email: "", contrasenya: "" })));
alert("A");
const ventas = Venta.loadVentas(ventasData);
Venta.printClientes(ventas);