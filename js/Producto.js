class Producto {
    static deckProductosWrapper = document.querySelector(".productosDisplay");
    static formProductosWrapper = document.querySelector(".productosForm");
    referencia = "";
    descripcion = "";
    familia = "";
    precio = 0;
    constructor({ referencia = "", descripcion = "", familia = "", precio = 0 }) {
        this.referencia = referencia;
        this.descripcion = descripcion;
        this.familia = familia;
        this.precio = precio;
    }

    //Ver producto
    static loadProductos(productosData = [{ referencia: "", descripcion: "", familia: "", precio: 0 }]) {
        const outputProductos = new Array();
        const productos = productosData[0];
        for (let i = 0; i < productos.length; i++) {
            const producto = productos[i];
            outputProductos.push(new Producto(producto));
        }
        return outputProductos;
    }
    static printProductos(productos = [{
            referencia: "",
            descripcion: "",
            familia: "",
            precio: 0
        }]) {
            for (let i = 0; i < productos.length; i++) {
                const producto = productos[i];
                this.deckProductosWrapper.innerHTML += `
			<div class="card" style="width: 18rem;">
  				<div class="card-header">${producto.referencia}</div>
  					<ul class="list-group list-group-flush">
    					<li class="list-group-item">${producto.familia}</li>
    					<li class="list-group-item">${producto.descripcion}</li>
    					<li class="list-group-item">${producto.precio}</li>
 					</ul>
                    <div class="card-footer btn-group">
					    <button type="button" class="btn btn-warning">Modificar</button>
					    <button type="button" class="btn btn-danger" onclick="Producto.borrarProducto(${producto.referencia})">Borrar</button>
				    </div>
				</div>`;

            }
        }
        //Crear Producto
    static configAddProducto() {
        let newProductoData = { referencia: "", descripcion: "", familia: "", precio: 0 };
        let newProducto;
        const formElements = Producto.formProductosWrapper.elements;
        Producto.formProductosWrapper.addEventListener("submit", (event) => {
            newProductoData = {
                referencia: formElements[0].value,
                descripcion: formElements[1].value,
                familia: formElements[2].value,
                precio: parseInt(formElements[3].value)
            };

            newProducto = new Producto(newProductoData);
            Producto.uploadProducto(newProducto);
            event.preventDefault();
        })
    }
    static uploadProducto(Producto = new Producto()) {

        const data = JSON.stringify(Producto);
        let ajax = new XMLHttpRequest();

        ajax.onreadystatechange = () => {
            let Productos = ajax.responseText;
            if (ajax.readyState == 4 && ajax.status == "200") {
                console.log(data);
            }
        }
        ajax.open("POST", "../php/post-producto.php?param=" + data, true);
        ajax.send();

    }

    //Borrar cliente
    static borrarProducto(referencia = "") {
        //Producto.borrarProductoUI(referencia);
        Producto.borrarProductoLogic(referencia);
    }
    static borrarProductoUI(referencia = "") {
        const cardHeaders = this.deckProductosWrapper.getElementsByClassName('card-header');
        for (let i = 0; i < cardHeaders.length; i++) {
            const cardHeader = cardHeaders[i];
            console.log(referencia)
            if (cardHeader.innerHTML == referencia) {
                cardHeader.parentElement.remove();
            }
        }
    }
    static borrarProductoLogic(referencia = "") {
        let ajax = new XMLHttpRequest();
        ajax.open("DELETE", "../json/clientes.json", false);
        ajax.onload = function() {
            let users = JSON.parse(ajax.responseText);
            if (ajax.readyState == 4 && ajax.status == "200") {
                console.table(users);
            } else {
                console.error(users);
            }
        }
        ajax.send(null);
    }
}