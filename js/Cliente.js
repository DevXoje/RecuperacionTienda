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
        for (let i = 0; i < clientes.length; i++) {
            const cliente = clientes[i];
            this.deckClientesWrapper.innerHTML += `
			<div class="card" style="width: 18rem;">
  				<div class="card-header">${cliente.nombre} - ${cliente.id}</div>
  					<ul class="list-group list-group-flush">
                        <li class="list-group-item">${cliente.fechaNac}</li>
    					<li class="list-group-item">${cliente.dni}</li>
    					<li class="list-group-item">${cliente.email}</li>
 					</ul>
				
				<div class="card-footer btn-group">
					
					<button type="button" class="btn btn-warning">Modificar</button>
					<button type="button" class="btn btn-danger" onclick="Cliente.borrarCliente(${cliente.id})">Borrar</button>
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

        const data = JSON.stringify(cliente);
        var ajax = new XMLHttpRequest();

        ajax.onreadystatechange = () => {
            var clientes = ajax.responseText;
            if (ajax.readyState == 4 && ajax.status == "200") {
                console.log(data);
            }
        }
        ajax.open("POST", "../php/post-cliente.php?param=" + data, true);
        ajax.send();

    }

    //Borrar cliente
    static borrarCliente(id = 0) {
        //Cliente.borrarClienteUI(id);
        Cliente.borrarClienteLogic(id);
    }
    static borrarClienteUI(id = 0) {
        const cardHeaders = this.deckClientesWrapper.getElementsByClassName('card-header');
        for (let i = 0; i < cardHeaders.length; i++) {
            const cardHeader = cardHeaders[i];
            if (cardHeader.innerHTML.endsWith(id)) {
                cardHeader.parentElement.parentElement.remove();
            }
        }
    }
    static borrarClienteLogic(id = 0) {
        var ajax = new XMLHttpRequest();
        ajax.open("DELETE", "../json/clientes.json", false);
        ajax.onload = function() {
            var users = JSON.parse(ajax.responseText);
            if (ajax.readyState == 4 && ajax.status == "200") {
                console.table(users);
            } else {
                console.error(users);
            }
        }
        ajax.send(null);
    }
}