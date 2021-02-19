function loadJSON(nameDoc = new String()) {
    const output = new Array();
    var ajax = new XMLHttpRequest();
    ajax.overrideMimeType("application/json");
    ajax.open('GET', `../json/${nameDoc}.json`, false);
    ajax.onreadystatechange = () => {
        if (ajax.readyState == 4 && ajax.status == "200") {
            output.push(JSON.parse(ajax.responseText));
        }
        if (ajax.status == "404") {
            console.log(`Error loadJSON file ${nameDoc} Not Found`);
        }
    };
    ajax.send(null);

    return output;

}