function loadJSON(nameDoc = new String()) {
    const output = new Array();
    var ajax = new XMLHttpRequest();
    ajax.overrideMimeType("application/json");
    ajax.open('GET', `../json/${nameDoc}.json`, false);
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == "200") {
            output.push(JSON.parse(ajax.responseText));
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            //callback(ajax.responseText);
        }
        if (ajax.status == "404") {
            console.log(`Error loadJSON file ${nameDoc} Not Found`);
        }
    };
    ajax.send(null);

    return output;

}