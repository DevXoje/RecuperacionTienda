<?php 


$contenido = $_REQUEST["param"];
// read json file
$data = file_get_contents('../json/productos.json');

// decode json
$json_arr = json_decode($data, true);

// add data
$json_arr[] = $contenido;

// encode json and save to file
file_put_contents('../json/productos.json', json_encode($json_arr));
//file_put_contents("../json/productos.json",$contenido.PHP_EOL,FILE_APPEND );




?>