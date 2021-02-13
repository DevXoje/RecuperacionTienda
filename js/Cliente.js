class Cliente {
    static numClientes = 0;
    static deckClientesWrapper = document.querySelector(".clientesDisplay");
    static formClientesWrapper = document.querySelector(".clientesForm");
    nombre = "";
    apellidos = "";
    dni = "";
    fechaNac = "";
    email = "";
    contrasenya = "";
    id = 0;
    constructor({ nombre = "", apellidos = "", dni = "", fechaNac = "", email = "", contrasenya = "" }) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.dni = dni;
        this.fechaNac = fechaNac;
        this.email = email;
        this.contrasenya = contrasenya;
        this.id = ++Cliente.numClientes;
    }

    //Ver cliente
    static loadClientes(clientesData = [{ nombre: "", apellidos: "", dni: "", fechaNac: "", email: "", contrasenya: "" }]) {
        const outputClientes = new Array();
        const clientes = clientesData[0];
        for (let i = 0; i < clientes.length; i++) {
            const cliente = clientes[i];
            outputClientes.push(new Cliente(cliente));
        }
        return outputClientes;
    }
    static printClientes(clientes = [{ nombre: "", apellidos: "", dni: "", fechaNac: "", email: "", contrasenya: "" }]) {
        console.log(clientes[0].nombre)
        for (let i = 0; i < clientes.length; i++) {
            const cliente = clientes[i];
            this.deckClientesWrapper.innerHTML += `
			<div class="card" style="width: 18rem;">
  				<div class="card-header">${cliente.nombre}</div>
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

    //Crear cliente
    static configAddCliente() {
        var newClienteData = {
            nombre: "",
            apellidos: "",
            dni: "",
            fechaNac: "",
            email: "",
            contrasenya: ""
        }
        var newCliente;
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
}