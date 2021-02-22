class Cliente {
    static numClientes = 0;
    static deckClientesWrapper = document.querySelector(".clientesDisplay");
    static formClientesWrapper = document.querySelector(".clientesForm");
    static cacheClientes = new Array();
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
    static configShowClientes() {
        const clientesData = loadJSON("clientes");
        Cliente.cacheClientes = Cliente.loadClientes(clientesData);
        Cliente.printClientes(Cliente.cacheClientes);
    }
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
			<div class="card mb-5" style="width: 18rem;">
  				<div class="card-header">${cliente.nombre} - ${cliente.id}</div>
  					<ul class="list-group list-group-flush">
                        <li class="list-group-item">${cliente.fechaNac}</li>
    					<li class="list-group-item">${cliente.dni}</li>
    					<li class="list-group-item">${cliente.email}</li>
 					</ul>
				
				<div class="card-footer btn-group">
					
					<button type="button" class="btn btn-warning" onclick="Cliente.editarCliente(${cliente.id})">Modificar</button>
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
        });
    }
    static uploadCliente(cliente = new Cliente()) {
        const clientesData = loadJSON("clientes");
        Cliente.cacheClientes = Cliente.loadClientes(clientesData);
        var ajax = new XMLHttpRequest();
        const outputData = new Array();
        //this.numClientes = 0;
        for (let i = 0; i < this.cacheClientes.length; i++) {
            const clienteAntiguo = this.cacheClientes[i];
            outputData.push(clienteAntiguo);
        }
        outputData.push(cliente);

        ajax.onreadystatechange = () => {
            if (ajax.readyState == 4 && ajax.status == "200") {
                console.log(outputData);
            }
        }
        ajax.open("POST", "../php/post-cliente.php?param=" + JSON.stringify(outputData), true);
        ajax.send();

    }

    //Editar cliente

    static configEditCliente() {
        const clienteToEdit = JSON.parse(localStorage.getItem('clientEdit'));

        if (clienteToEdit) {
            console.log(clienteToEdit);
            const formElements = Cliente.formClientesWrapper.elements;
            formElements[0].value = clienteToEdit.nombre;
            formElements[1].value = clienteToEdit.apellidos;
            formElements[2].value = clienteToEdit.dni;
            formElements[3].value = clienteToEdit.fechaNac;
            formElements[4].value = clienteToEdit.email;
            localStorage.clear();
        }

    }
    static editarCliente(id = 0) {
        let clienteSelect;

        for (let i = 0; i < this.cacheClientes.length; i++) {
            const cliente = this.cacheClientes[i];

            if (cliente.id == id) {
                clienteSelect = cliente;
            }
        }
        this.borrarCliente(clienteSelect.id);
        localStorage.setItem('clientEdit', JSON.stringify(clienteSelect));
        location.href = "./crearClientes.html";

    }

    //Borrar cliente
    static borrarCliente(id = 0) {
        Cliente.borrarClienteLogic(id);
        Cliente.borrarClienteUI(id);
    }
    static borrarClienteUI(id = 0) {
        const cardHeaders = this.deckClientesWrapper.getElementsByClassName('card-header');
        for (let i = 0; i < cardHeaders.length; i++) {
            const cardHeader = cardHeaders[i];
            if (cardHeader.innerHTML.endsWith(id)) {
                cardHeader.parentElement.remove();
            }
        }
    }
    static borrarClienteLogic(id = 0) {
        const clientesData = loadJSON("clientes");
        Cliente.numClientes = 0;
        Cliente.cacheClientes = Cliente.loadClientes(clientesData);
        var ajax = new XMLHttpRequest();
        const outputData = new Array();
        for (let i = 0; i < this.cacheClientes.length; i++) {
            const clienteAntiguo = this.cacheClientes[i];
            if (clienteAntiguo.id != id) {
                outputData.push(clienteAntiguo);
            }
        }

        ajax.onreadystatechange = () => {
            if (ajax.readyState == 4 && ajax.status == "200") {
                console.log(outputData);
            }
        }
        ajax.open("POST", "../php/post-cliente.php?param=" + JSON.stringify(outputData), true);
        ajax.send();
    }
}