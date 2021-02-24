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
    static cacheVentas = new Array();
    productos = new Array();
    cliente;

    constructor(cliente = new Cliente()) {
        this.cliente = cliente;
        this.id = ++Venta.numVentas;
    }

    addProducto(producto = new Producto(), cantidad = 0) {
        const i = this.productos.push(producto);
        this.productos[i - 1].cantidad = cantidad;
    }

    static writeCookie() {
        const now = new Date();
        const minutes = 30;
        now.setTime(now.getTime() + (minutes * 60 * 1000));
        //cookievalue = escape(document.myform.customer.value) + ";"
        const cookievalue = Venta.outputCliente.textContent + ";"

        document.cookie = `name = ${cookievalue} expires=${now.toUTCString()};`;
        setTimeout(() => {
            alert("El carrito se vaciara automaticamente en 5 minutos");
        }, ((minutes - 5) * 60 * 1000));
    }

    //Ver venta
    static configShowVentas() {
        const ventasData = loadJSON("ventas");
        Venta.cacheVentas = Venta.loadVentas(ventasData);
        Venta.printVentas(Venta.cacheVenta);
    }
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

            for (let z = 0; z < ventaBruta.productos.length; z++) {
                const producto = ventaBruta.productos[z];

                venta.addProducto(new Producto(producto), producto.cantidad);
            }
            outputventas.push(venta);
        }
        console.log(outputventas);

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
            precio: 0,
            cantidad: 0
        }]

    }]) {
        for (let i = 0; i < this.cacheVentas.length; i++) {
            const venta = this.cacheVentas[i];
            this.deckVentasWrapper.innerHTML += `
			<div class="card mb-5" style="width: 18rem;">
  				<div class="card-header">${venta.cliente.nombre} -- ${venta.cliente.email} -- ${venta.id}</div>
  					<ul class="list-group list-group-flush">
 					</ul>
				
				<div class="card-footer btn-group">					
					<button type="button" class="btn btn-warning" onclick="Venta.editarVenta(${venta.id})">Modificar</button>
					<button type="button" class="btn btn-danger" onclick="Venta.borrarVenta(${venta.id})">Borrar</button>
				</div>
			</div>`;
        }
        Venta.insertProductosUI(this.cacheVentas);


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
                    <div>${producto.descripcion}</div>
                    <div>${producto.cantidad} X ${producto.precio}= $
                    <div class="resultado">{producto.precio * producto.cantidad}</div> €</div>                    
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
                Venta.writeCookie();
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
        Producto.numProductos = 0;
        let precio = 0;
        const productos = Producto.loadProductos(productosData);
        for (let i = 0; i < productos.length; i++) {
            const producto = productos[i];
            if (producto.referencia == this.inputProducto.value[this.inputProducto.value.length - 1]) {
                precio = producto.precio;
            }
        }
        if (this.outputProducto.innerText == 'NONE') {
            this.outputProducto.innerText = '';
        }
        this.outputProducto.innerHTML += `
            <div class="item">
                <div class="item_carrito d-inline">${this.inputProducto.value}</div> x 
                <div class="cantidad_item_carrito d-inline">${cantidad}</div>
                <div class="resultado">${precio}</div>
                <a class="btn btn-danger btn-sm " href="#" role="button" onclick="Venta.deleteProductoCarrito(event);">delete</a>
            </div>`;
        this.actualizaPrecioUI();

    }
    static deleteProductoCarrito(event = new Event()) {
        event.target.parentElement.remove();
        this.actualizaPrecioUI();
    }
    static actualizaPrecioUI() {
        const resultados = this.ventaOutput.querySelectorAll(".resultado");
        let total = 0;
        for (let i = 0; i < resultados.length; i++) {
            const resultado = resultados[i];
            total += parseInt(resultado.innerHTML);
        }

        this.ventaOutput.querySelector(".btn-primary").style.display = (total == 0) ? "none" : "inline-block";

        document.querySelector(".precioTotal").innerHTML = `${total} €`;

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