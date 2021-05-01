<?php
require_once 'vtayar.php';



  $ad = $_POST["ad"];
  $tel = $_POST["tel"];
  $mail = $_POST["mail"];
  $sehir = $_POST["sehir"];
  $model = $_POST["model"];
  $paket = $_POST["paket"];
  
  if (!$ad) {
    echo "bos";
  } elseif (!$tel) {
    echo "bos1";
  } else if (!$mail) {
    echo "bos2";
  }  else if ($sehir=="Şehir Seçiniz") {
    echo "bos3";
  } else if ($model=="Araç Modelini Seçiniz") {
    echo "bos4";
  }else if ($paket=="Donanım Seviyesi Seçiniz") {
    echo "bos5";
  }else {
    $kayit = $vt->prepare("INSERT INTO yeniarac SET ad=?,tel=?,mail=?,sehir=?,model=?,paket=?");
    $insert = $kayit->execute(array("$ad", "$tel", "$mail", "$sehir", "$model", "$paket"));
    if ($kayit->rowCount()) {
      echo "kayit";
      
    } else {
      echo "hata";
    }
  }



