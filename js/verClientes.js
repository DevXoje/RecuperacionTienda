const clientesData = loadJSON("clientes");
Cliente.cacheClientes = Cliente.loadClientes(clientesData);
Cliente.printClientes(Cliente.cacheClientes);

/*
const btn_addCliente = document.getElementById('btn_addClient');
btn_addCliente.addEventListener("click", () => { alert("1") });
(response) => {
    var actual_JSON = JSON.parse(response);
    console.log(actual_JSON);
} */