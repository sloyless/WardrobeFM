<?php
include('connect.php');
$statement=$pdo->prepare("SELECT * FROM items");
$statement->execute();
$results=$statement->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(array('items' => $results));
?>