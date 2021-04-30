<?php
require_once 'vtayar.php';



 

  $ad1 = $_POST["ad"];
  $tel1 = $_POST["tel"];
  $mail1 = $_POST["mail"];
  $mesaj=$_POST["mesaj"];
  if (!$ad1) {
    echo "bos";
  } elseif (!$tel1) {
    echo "bos1";
  } else if (!$mail1) {
    echo "bos2";
  }
  else if (!$mesaj) {
    echo "bos3";
  }  else {
    $kaydet = $vt->prepare("INSERT INTO iletisim SET ad=?,tel=?,mail=?,mesaj=?");
    $insert = $kaydet->execute(array("$ad1", "$tel1", "$mail1", "$mesaj"));
    if ($kaydet->rowCount()) {
      echo "kayit";
    } else {
      echo "hata";
    }
  }


