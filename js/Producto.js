class Producto {
    static deckProductosWrapper = document.querySelector(".productosDisplay");

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