class Venta {
    static deckVentasWrapper = document.querySelector(".ventasDisplay");
    static formVentaWrapper = document.querySelector(".ventasForm");

    productos = new Array();
    cliente = new Cliente({ nombre: "", apellidos: "", dni: "", fechaNac: "", email: "", contrasenya: "" })

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
                nombre: venta.cliente.nombre,
                apellidos: venta.cliente.apellidos,
                dni: venta.cliente.dni,
                fechaNac: venta.cliente.fechaNac,
                email: venta.cliente.email,
                contrasenya: venta.cliente.contrasenya
            }
            const cliente = new Cliente(dataCliente);
            outputventas.push(new Venta(cliente));
        }

        return outputventas;
    }
    static printVentas(ventas = [{
        cliente: {
            nombre: "",
            apellidos: "",
            dni: "",
            fechaNac: "",
            email: "",
            contrasenya: ""
        },
        productos: [{
            referencia: "",
            descripcion: "",
            familia: "",
            precio: 0
        }]

    }]) {
        for (let i = 0; i < ventas.length; i++) {
            const venta = ventas[i];
            this.deckVentasWrapper.innerHTML += `
			<div class="card" style="width: 18rem;">
  				<div class="card-header">${venta.cliente.nombre}</div>
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

    //Crear venta
    static configAddVenta() {
        Venta.setClientes();
        Venta.setProductos();
        Venta.configNumProductos();
        var newVentaData = {
            cliente: {},
            productos: [{}]
        }
        var newCliente;
        const formElements = Venta.formVentaWrapper.elements;
        Venta.formVentaWrapper.addEventListener("submit", (event) => {
            newClienteData = {
                nombre: formElements[0].value,
                apellidos: formElements[1].value,
                dni: formElements[2].value,
                fechaNac: formElements[3].value,
                email: formElements[4].value,
                contrasenya: formElements[5].value
            }
            newCliente = new Cliente(newClienteData);
            Cliente.uploadCliente(newCliente);
            event.preventDefault();
        })
    }
    static uploadCliente(cliente = new Cliente()) {

        console.log(cliente);
        var ajax = new XMLHttpRequest();
        //ajax.overrideMimeType("application/json");
        ajax.open('POST', `../json/clientes.json`, true);

        ajax.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        ajax.onreadystatechange = () => {
            var clientes = ajax.responseText;
            if (ajax.readyState == 4 && ajax.status == "200") {
                console.table(clientes);
            } else {
                console.error(ajax);
            }
        }
        ajax.send(JSON.stringify(cliente));

    }

    static setClientes() {
        const inputCliente = document.getElementById("venta_cliente");
        const clientesData = loadJSON("clientes");
        const clientes = Cliente.loadClientes(clientesData);
        for (let i = 0; i < clientes.length; i++) {
            const cliente = clientes[i];
            const option = document.createElement('option');
            option.innerHTML = cliente.nombre;
            inputCliente.appendChild(option);
        }
    }
    static setProductos() {
        const inputProducto = document.getElementById("venta_producto");
        const productosData = loadJSON("productos");
        const productos = Producto.loadProductos(productosData);
        for (let i = 0; i < productos.length; i++) {
            const producto = productos[i];
            const option = document.createElement('option');
            option.innerHTML = producto.referencia;
            inputProducto.appendChild(option);
        }
    }
    static configNumProductos() {
        const inputProducto = document.getElementById("venta_producto");
        inputProducto.addEventListener("change", () => {
            if (inputProducto.value != "None") {
                do {
                    var selection = parseInt(window.prompt("Please enter a number from 1 to 100", 1), 10);
                } while (isNaN(selection) || selection > 100 || selection < 1);
            }
        })

    }
}