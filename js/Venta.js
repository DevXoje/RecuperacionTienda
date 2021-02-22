class Venta {
    static deckVentasWrapper = document.querySelector(".ventasDisplay");
    static formVentaWrapper = document.querySelector(".ventasForm");
    static inputProducto = document.getElementById('venta_producto');
    static outputProducto = document.getElementById('output_producto');
    static inputCliente = document.getElementById('venta_cliente');
    static outputCliente = document.getElementById('output_cliente');
    static btn_submit = document.getElementById('btn_submit');
    static ventaOutput = document.getElementById('ventaOutput');
    static numVentas = 0;
    productos = new Array();
    cliente;

    constructor(cliente = new Cliente()) {
        this.cliente = cliente;
        this.id = ++Venta.numVentas;
    }

    addProducto(producto = new Producto()) {
        this.productos.push(producto);
    }

    static writeCookie() {
        console.log("writing cookie");
        const now = new Date();
        const minutes = 1;
        now.setTime(now.getTime() + (minutes * 60 * 1000));
        //cookievalue = escape(document.myform.customer.value) + ";"
        const cookievalue = Venta.outputCliente.textContent + ";"

        document.cookie = `name = ${cookievalue} expires=${now.toUTCString()};`;
        setTimeout(() => {}, 1000);
        console.log("Setting Cookies : " + "name=" + cookievalue);
    }

    //Ver venta
    static loadVentas(ventasData = [{ cliente: new Cliente(), productos: new Array() }]) {
        const outputventas = new Array();
        const ventas = ventasData[0];
        for (let i = 0; i < ventas.length; i++) {
            const ventaBruta = ventas[i];
            const dataCliente = {
                nombre: ventaBruta.cliente.nombre,
                apellidos: ventaBruta.cliente.apellidos,
                dni: ventaBruta.cliente.dni,
                fechaNac: ventaBruta.cliente.fechaNac,
                email: ventaBruta.cliente.email,
                contrasenya: ventaBruta.cliente.contrasenya
            }

            const cliente = new Cliente(dataCliente);
            const venta = new Venta(cliente);
            //const producto = new Producto({ referencia: "", descripcion: "", familia: "", precio: 0 });

            for (let z = 0; z < ventaBruta.productos.length; z++) {
                const producto = ventaBruta.productos[z];

                venta.addProducto(new Producto(producto));
            }
            outputventas.push(venta);
        }

        return outputventas;
    }
    static printVentas(ventas = [{
        id: 0,
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
			<div class="card mb-5" style="width: 18rem;">
  				<div class="card-header">${venta.cliente.nombre} -- ${venta.cliente.email} -- ${venta.id}</div>
  					<ul class="list-group list-group-flush">
 					</ul>
				
				<div class="card-footer btn-group">					
					<button type="button" class="btn btn-warning">Modificar</button>
					<button type="button" class="btn btn-danger" onclick="Venta.borrarVenta(${venta.id})">Borrar</button>
				</div>
			</div>`;
        }
        Venta.insertProductosUI(ventas);



    }
    static insertProductosUI(ventas = [new Venta()]) {
        let carrito;
        let listOuput = document.querySelectorAll(".list-group");
        for (let i = 0; i < listOuput.length; i++) {
            const output = listOuput[i];
            for (let j = 0; j < ventas[i].productos.length; j++) {
                const producto = ventas[i].productos[j];
                output.innerHTML += `
                <div class="list-group-item">
                    ${producto.descripcion}
                </div>
                `;
            }


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
                //Venta.writeCookie();
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
            option.innerHTML = `${producto.familia} -- ${producto.referencia}`;
            inputProducto.appendChild(option);
        }
    }


    static addProductoCarrito(cantidad = 0) {
        const inputProducto = document.getElementById("venta_producto");
        const productosData = loadJSON("productos");
        const productos = Producto.loadProductos(productosData);
        if (this.outputProducto.innerText == 'NONE') {
            this.outputProducto.innerText = '';
        }
        this.outputProducto.innerHTML += `
            <div class="item">
                <div class="item_carrito d-inline">${this.inputProducto.value}</div> x 
                <div class="cantidad_item_carrito d-inline">${cantidad}</div>
                <a class="btn btn-danger btn-sm " href="#" role="button" onclick="event.target.parentElement.remove();">delete</a>
            </div>`;
        let precio;
        for (let i = 0; i < productos.length; i++) {
            const producto = productos[i];
            if (this.inputProducto.value.endsWith(producto.referencia)) {
                console.log(producto.precio);
                this.insertPrecio(producto.precio, cantidad);

            }

        }

    }
    static insertPrecio(precio = 0, cantidad = 0) {
        document.querySelector(".precioTotal").innerHTML = `Total: ${precio * cantidad} €`;

        console.log("insernado precio");
        console.log(precio);
    }

    static cancelCarrito() {
        if (confirm("¿Seguro que desea borrar el carrito?")) {
            location.reload();
        }
    }
    static uploadVenta() {
        const listaProducto = new Array();
        let productosBruto = Venta.ventaOutput.getElementsByClassName('item');
        for (let i = 0; i < productosBruto.length; i++) {
            const productoBruto = productosBruto[i];
            listaProducto.push({
                producto: productoBruto.querySelector('.item_carrito').textContent,
                cantidad: parseInt(productoBruto.querySelector('.cantidad_item_carrito').textContent)
            });
        }
        console.log(listaProducto);

        /*var newCliente;
        const formElements = Cliente.formClientesWrapper.elements;
        Cliente.formClientesWrapper.addEventListener("submit", (event) => {
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
        }); */
    }

    // Borrar Venta
    static borrarVenta(id = 0) {
        //Venta.borrarVentaUI(id);
        Venta.borrarVentaLogic(id);
    }
    static borrarVentaUI(id = 0) {
        const cardHeaders = this.deckVentasWrapper.getElementsByClassName('card-header');
        for (let i = 0; i < cardHeaders.length; i++) {
            const cardHeader = cardHeaders[i];
            console.log(cardHeader.innerHTML.endsWith(id));
            if (cardHeader.innerHTML.endsWith(id)) {
                cardHeader.parentElement.remove();
            }
        }
    }
    static borrarVentaLogic(id = 0) {
            let ajax = new XMLHttpRequest();
            ajax.open("DELETE", "../json/clientes.json", false);
            ajax.onload = function() {
                let ventas = JSON.parse(ajax.responseText);
                if (ajax.readyState == 4 && ajax.status == "200") {
                    console.table(ventas);
                } else {
                    console.error(ventas);
                }
            }
            ajax.send(null);
        }
        // Modificar Venta

}