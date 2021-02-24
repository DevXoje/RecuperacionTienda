class Producto {
    static numProductos = 0;
    static deckProductosWrapper = document.querySelector(".productosDisplay");
    static formProductosWrapper = document.querySelector(".productosForm");
    static cacheProductos = new Array();
    referencia = "";
    descripcion = "";
    familia = "";
    precio = 0;
    constructor({ descripcion = "", familia = "", precio = 0 }) {
        this.referencia = ++Producto.numProductos;
        this.descripcion = descripcion;
        this.familia = familia;
        this.precio = precio;
    }

    //Ver producto
    static configShowProductos() {
        const productosData = loadJSON("productos");
        Producto.cacheProductos = Producto.loadProductos(productosData);
        Producto.printProductos(Producto.cacheProductos);
    }
    static loadProductos(productosData = [{ referencia: 0, descripcion: "", familia: "", precio: 0 }]) {
        const outputProductos = new Array();
        const productos = productosData[0];
        for (let i = 0; i < productos.length; i++) {
            const productoBruto = productos[i];
            const producto = new Producto(productoBruto);
            producto.referencia = productoBruto.referencia;
            outputProductos.push(producto);
        }
        return outputProductos;
    }
    static printProductos(productos = [{
        referencia: 0,
        descripcion: "",
        familia: "",
        precio: 0
    }]) {
        for (let i = 0; i < productos.length; i++) {
            const producto = productos[i];
            this.deckProductosWrapper.innerHTML += `
			<div class="card mb-5" style="width: 18rem;">
  				<div class="card-header">${producto.referencia} -- ${producto.familia}</div>
  					<ul class="list-group list-group-flush">			
    					<li class="list-group-item">${producto.descripcion}</li>
    					<li class="list-group-item">${producto.precio} €</li>
 					</ul>
                    <div class="card-footer btn-group">
					    <button type="button" class="btn btn-warning" onclick="Producto.editarProducto(${producto.referencia})">Modificar</button>
					    <button type="button" class="btn btn-danger" onclick="Producto.borrarProducto(${producto.referencia})">Borrar</button>
				    </div>
				</div>`;

        }
    }

    //Crear Producto
    static configAddProducto() {
        let newProductoData = { descripcion: "", familia: "", precio: 0 };
        let newProducto;
        const formElements = Producto.formProductosWrapper.elements;
        Producto.formProductosWrapper.addEventListener("submit", (event) => {
            newProductoData = {
                descripcion: formElements[0].value,
                familia: formElements[1].value,
                precio: parseInt(formElements[2].value)
            };
            newProducto = new Producto(newProductoData);
            Producto.uploadProducto(newProducto);
            event.preventDefault();
        })
    }
    static uploadProducto(producto = new Producto()) {

        const productosData = loadJSON("productos");

        this.cacheProductos = this.loadProductos(productosData);
        var ajax = new XMLHttpRequest();
        const outputData = new Array();
        for (let i = 0; i < this.cacheProductos.length; i++) {
            const productoAntiguo = this.cacheProductos[i];
            outputData.push(productoAntiguo);
        }
        outputData.push(producto);

        ajax.onreadystatechange = () => {
            if (ajax.readyState == 4 && ajax.status == "200") {
                console.log(outputData);
            }
        }

        ajax.open("POST", "../php/post-producto.php?param=" + JSON.stringify(outputData), true);
        ajax.send();

    }

    //Editar producto
    static configEditProducto() {
        const productoToEdit = JSON.parse(localStorage.getItem('productEdit'));
        if (productoToEdit) {
            const formElements = this.formProductosWrapper.elements;
            formElements[0].value = productoToEdit.descripcion;
            formElements[1].value = productoToEdit.familia.toLowerCase();
            formElements[2].value = productoToEdit.precio;
            localStorage.clear();
        }

    }
    static editarProducto(referencia = "") {
        let productoSelect;

        for (let i = 0; i < this.cacheProductos.length; i++) {
            const producto = this.cacheProductos[i];
            if (producto.referencia == referencia) {
                productoSelect = producto;
            }
        }
        this.borrarProducto(productoSelect.referencia);
        localStorage.setItem('productEdit', JSON.stringify(productoSelect));
        location.href = "./crearProducto.html";

    }



    //Borrar producto
    static borrarProducto(referencia = "") {
        Producto.borrarProductoLogic(referencia);
        Producto.borrarProductoUI(referencia);
    }
    static borrarProductoUI(referencia = "") {
        const cardHeaders = this.deckProductosWrapper.getElementsByClassName('card-header');
        for (let i = 0; i < cardHeaders.length; i++) {
            const cardHeader = cardHeaders[i];

            if (cardHeader.innerHTML.startsWith(referencia)) {
                cardHeader.parentElement.remove();
            }
        }
    }
    static borrarProductoLogic(referencia = "") {
        const productosData = loadJSON("productos");
        this.numProductos = 0;
        this.cacheProductos = this.loadProductos(productosData);
        var ajax = new XMLHttpRequest();
        const outputData = new Array();
        for (let i = 0; i < this.cacheProductos.length; i++) {
            const productoAntiguo = this.cacheProductos[i];
            if (productoAntiguo.referencia != referencia) {
                outputData.push(productoAntiguo);
            }
        }

        ajax.onreadystatechange = () => {
            if (ajax.readyState == 4 && ajax.status == "200") {
                console.log(outputData);
            }
        }
        ajax.open("POST", "../php/post-producto.php?param=" + JSON.stringify(outputData), true);
        ajax.send();

    }
}