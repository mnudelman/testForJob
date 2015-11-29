<?php

$currentDir = __DIR__ ;
// определяем верхний уровень
$topDir = realpath($currentDir) ;
$uploaddir = $topDir .'/uploads/';
if (isset($_POST['imgName'])) {
    $imgName = $_POST['imgName'] ;
    $pInfo = pathinfo($_FILES['uploadfile']['name']) ;
    $file = $uploaddir .$imgName.'.'.$pInfo['extension'];
}else {
    $file = $uploaddir . basename($_FILES['uploadfile']['name']);
}
//var_dump($_FILES) ;
//$uploaddir = './uploads/';

 echo 'file:'.$file.'<br>' ;
$ext = substr($_FILES['uploadfile']['name'],strpos($_FILES['uploadfile']['name'],'.'),strlen($_FILES['uploadfile']['name'])-1); 
$filetypes = array('.jpg','.gif','.bmp','.png','.JPG','.BMP','.GIF','.PNG','.jpeg','.JPEG');
 
if(!in_array($ext,$filetypes)){
	echo "<p>-----не допустимое расширение файла----</p>";}
else{ 
	if (move_uploaded_file($_FILES['uploadfile']['tmp_name'], $file)) { 
	  echo "success"; 
	} else {
		echo "error";
	}
}
 

?>