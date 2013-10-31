<?php

//get variables create URL
$URL = $_POST['encodedQueryURL'];

//returns file contents untouched
$datastream_bits = file_get_contents($URL);	
echo $datastream_bits;
return;

?>