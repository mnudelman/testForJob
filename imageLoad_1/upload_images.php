<?php
if (is_uploaded_file($_FILES['upload_photo']['tmp_name']))
{
    var_dump($_FILES) ;
    // загружаем изображение на сервер, если оно соответствует требованиям (формат: gif/jpeg/png и размер файла ~ 500 kB)
    $currentDir = __DIR__ ;
// определяем верхний уровень
    $topDir = realpath($currentDir) ;
    $dirImg = $topDir .'/img' ;

// подключаем класс TaskStore - общие параметры

    if ( ($_FILES['upload_photo']['type'] == 'image/gif' || $_FILES['upload_photo']['type'] == 'image/jpeg' ||
            $_FILES['upload_photo']['type'] == 'image/jpg' || $_FILES['upload_photo']['type'] == 'image/png') && $_FILES['upload_photo']['size'] <= 512000 )
    {
        $upload_photo= $_FILES['upload_photo']['name'];
//        copy($_FILES['upload_photo']['tmp_name'],"img/".$upload_photo);
        copy($_FILES['upload_photo']['tmp_name'],$dirImg.'/'.$upload_photo);
        // уведомляем об успешной загрузке и обновляем ссылку на изображение
        echo "<script type=\"text/javascript\">parent.document.getElementById(\"imageId\").innerHTML = '<img src=\"img/{$upload_photo}\">';
              parent.document.getElementById(\"image_upload_status\").
              innerHTML = '<p class=\"image_success\">Изображение успешно загружено</p>';</script>";
    }

    // уведомление об ошибке
    else if (($_FILES['upload_photo']['type'] != 'image/gif' && $_FILES['upload_photo']['type'] != 'image/jpeg' && $_FILES['upload_photo']['type'] != 'image/png'))
    {
        echo "<script type=\"text/javascript\">parent.document.getElementById(\"image_upload_status\").innerHTML = '<p class=\"image_error\">Недопустимый тип файла</p>';</script>";
    }
    else if ($_FILES['upload_photo']['size'] > 512000)
    {
        echo "<script type=\"text/javascript\">parent.document.getElementById(\"image_upload_status\").innerHTML = '<p class=\"image_error\">Недопустимый размер файла</p>';</script>";
    }
    else
    {
        echo "<script type=\"text/javascript\">parent.document.getElementById(\"image_upload_status\").innerHTML = '<p class=\"image_error\">Произошла ошибка при загрузке файла</p>';</script>";
    }
}
?>