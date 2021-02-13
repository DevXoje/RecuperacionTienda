class Venta {
    static deckVentasWrapper = document.querySelector(".ventasDisplay");

    productos = new Array();
    cliente = new Cliente();
    constructor(cliente = new Cliente()) {
        this.cliente = cliente;
    }

    addProducto(producto = new Producto()) {
        this.productos.push(producto);
    }

    //Ver venta
    static loadVentas(ventasData = [{ cliente: new Cliente(), productos: new Array() }]) {
        const outputventas = new Array();
        const ventas = ventasData[0];

        for (let i = 0; i < ventas.length; i++) {
            const venta = ventas[i];
            const dataCliente = {
                nombre = venta.cliente.nombre,
                apellidos = venta.cliente.apellidos,
                dni = venta.cliente.dni,
                fechaNac = venta.cliente.fechaNac,
                email = venta.cliente.email,
                contrasenya = venta.cliente.contrasenya
            }
            const cliente = new Cliente(dataCliente);
            console.log(cliente);
            outputventas.push(new Venta(cliente));
        }
        console.log(ventasData);
        alert("Hola");
        return outputventas;
    }
    static printVentas(ventas = [{
        referencia: "",
        descripcion: "",
        familia: "",
        precio: 0
    }]) {
        for (let i = 0; i < ventas.length; i++) {
            const venta = ventas[i];
            this.deckventasWrapper.innerHTML += `
			<div class="card" style="width: 18rem;">
  				<div class="card-header">${venta.referencia}</div>
  					<ul class="list-group list-group-flush">
    					<li class="list-group-item">An item</li>
    					<li class="list-group-item">A second item</li>
    					<li class="list-group-item">A third item</li>
 					</ul>
				</div>
				<div class="card-footer btn-group">
					<button type="button" class="btn btn-primary">Left</button>
					<button type="button" class="btn btn-warning">Middle</button>
					<button type="button" class="btn btn-danger">Right</button>
				</div>
			</div>`;

        }
    }
}