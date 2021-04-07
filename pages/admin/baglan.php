<?php

try{
    $host='localhost';
    $vtadi='proje';
    $kullanici='root';
    $sifre='0102030405';
    $vt= new PDO("mysql:host=$host;dbname=$vtadi;","$kullanici","$sifre");
}
catch(PDOException $e){
    print $e->getMessage();
}




?>