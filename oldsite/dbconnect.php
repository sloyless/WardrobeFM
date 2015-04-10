<?php
include('connect.php');
$statement=$pdo->prepare("SELECT * FROM items");
$statement->execute();
$results=$statement->fetchAll(PDO::FETCH_ASSOC);

$items = array('items' => $results);

echo json_encode($items);
?>