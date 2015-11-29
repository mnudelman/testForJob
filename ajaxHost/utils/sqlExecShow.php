<?php
/**
 *  Форма для sqlExecute.php
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>sql-Execute</title>
    <meta name="description" content="исполнитель sql - запросов">
    <meta name="author" content="mnudelman">
    <link rel="stylesheet" type="text/css" href="<?=$htmlDirTop;?>/styles/task.css">
</head>
<body>

<h2>Исполнитель sql - скриптов</h2>

<form action="<?=$urlSqlExecute;?>" method="post" enctype="multipart/form-data">
    <label>
Выберите файл-sqlscript &nbsp;&nbsp;
        <input type="file" name="sqlScript" id="script">
    </label>
    <button name="sqlExample">пример запроса</button>
    <br>


        <textarea name="sqlText" style="width:620px;height:200px;">
        <?php
        echo chr(10);
        if (!empty($stat)) {
            foreach ($sqlLines as $l) {
                echo $l['text'] . chr(10);
                echo 'ERROR:' . $l['error'] . chr(10);
                if (empty($l['error'])) {
                    echo 'Кол записей:' . $l['count'] . chr(10);
                }
                echo '===================================' . chr(10);

            }
        }
        ?>
</textarea><br>

<?php
if (empty($sqlScript)) {
    ?>
    <input type="submit" name="sqlPrepare" value="просмотр">
<?php
} else {
    ?>
    <input type="submit" name="sqlGo" value="исполнить">
<?php
}
?>
<button name="refuse">отказ</button>
<!---------------------------------------------->
<?php
if ($stat == $STAT_GO) {  // если есть оператор SELECT,SHOW  выводим таблицу

    foreach ($sqlLines as $key => $l) {
        $sqlName = $l['name'];
        $err = $l['error'];
        $sqlType = $l['name'] ;
        if (false === strpos(',SHOW,SELECT,', ',' . $sqlType . ',') || !empty($err)) {
            continue;
        }
        ?>
        <!-----только для SELECT ---------------------------->
        <br><strong>Запрос:</strong>
        <?php echo $l['text']; ?> <br>
        <strong>Результат-записей: <?php echo $l['count'] ; ?></strong><br>

        <table border="4"
               cellspacing="1"
               cellpadding=“1”>

            <?php
            $res = $l['result'];
            $n = $l['count'];
            $columnsCap = $l['cap'];
            //          Шапка
            echo '<tr>' . "\n";
            //          Таблица
            foreach ($columnsCap as $cap){
                echo '<th>' . $cap . '</th>'."\n" ;
            }
            echo '</tr>' . "\n" ;
            foreach ($res as $row) {
                echo '<tr>' . "\n" ;
                foreach ($row as $name => $mean) {
                    $mean = (empty($mean) ) ? '&nbsp;' : $mean ;
                    echo '<td>' . $mean . '</td>'."\n" ;
                }
                echo '</tr>' . "\n" ;
            }
            ?>

        </table>
    <?php
    }
}
?>
</form>
</body>
</html>