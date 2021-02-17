class Venta {
    static deckVentasWrapper = document.querySelector(".ventasDisplay");
    static formVentaWrapper = document.querySelector(".ventasForm");
    static inputProducto = document.getElementById('venta_producto');
    static outputProducto = document.getElementById('output_producto');
    static inputCliente = document.getElementById('venta_cliente');
    static outputCliente = document.getElementById('output_cliente');
    static btn_submit = document.getElementById('btn_submit');
    static ventaOutput = document.getElementById('ventaOutput');

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
        //config
        Venta.setClientes();
        Venta.setProductos();
        //bind producto
        this.inputProducto.disabled = true;
        this.btn_submit.disabled = true;
        this.ventaOutput.style.display = 'none';
        this.inputCliente.addEventListener('change', () => {
            const cliente = this.inputCliente.value;
            if (cliente != 'None') {
                this.outputCliente.textContent = cliente;
                this.inputCliente.disabled = true;
                this.inputProducto.disabled = false;
                this.ventaOutput.style.display = 'flex';

            }
        });
        this.inputProducto.addEventListener('change', () => {
            if (this.inputProducto.value != 'None') {
                this.btn_submit.disabled = false;
            }
        });
        //form
        let newVentaData = {
            cliente: {},
            productos: [{}]
        }
        let newVenta;
        const formElements = Venta.formVentaWrapper.elements;
        Venta.formVentaWrapper.addEventListener("submit", (event) => {
            const producto = document.getElementById('venta_producto').value;
            let cantidad = 0;
            do {
                cantidad = parseInt(window.prompt("Please enter a number from 1 to 100", 1), 10);
            } while (isNaN(cantidad) || cantidad > 100 || cantidad < 1);
            Venta.addProductoCarrito(cantidad);
            event.preventDefault();
        })
    }
    static uploadCliente(cliente = new Cliente()) {

        console.log(cliente);
        let ajax = new XMLHttpRequest();
        //ajax.overrideMimeType("application/json");
        ajax.open('POST', `../json/clientes.json`, true);

        ajax.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        ajax.onreadystatechange = () => {
            let clientes = ajax.responseText;
            if (ajax.readyState == 4 && ajax.status == "200") {
                console.table(clientes);
            } else {
                console.error(ajax);
            }
        }
        ajax.send(JSON.stringify(cliente));

    }

    static setClientes() {
        const clientesData = loadJSON("clientes");
        const clientes = Cliente.loadClientes(clientesData);
        for (let i = 0; i < clientes.length; i++) {
            const cliente = clientes[i];
            const option = document.createElement('option');
            option.innerHTML = cliente.nombre;
            this.inputCliente.appendChild(option);
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

    static addProductoCarrito(cantidad = 0) {
        if (this.outputProducto.innerText == 'NONE') {
            this.outputProducto.innerText = '';
        }
        this.outputProducto.innerHTML += `${this.inputProducto.value} x ${cantidad}
                    <a class="btn btn-danger btn-sm " href="#" role="button">delete</a>
        
        `;
    }


}