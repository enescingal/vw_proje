<?php
include("baglan.php");

session_start();

if ($_GET['yeniarac'] == "sil") {
  $sil = $vt->prepare("DELETE from yeniarac where id=:id");
  $kontrol = $sil->execute(array(
    'id' => $_GET['id']
  ));
  if ($kontrol) {
    header("location:../admin/admin.php?success=1");
  }
  else{
    header("location:../admin/admin.php?danger=1");
  }
}







if ($_GET['iletisim'] == "sil") {
  $sil = $vt->prepare("DELETE from iletisim where id=:id");
  $kontrol = $sil->execute(array(
    'id' => $_GET['id']
  ));
  if ($kontrol) {
    header("location:../admin/admin.php?success=1");
  }
  else{
    header("location:../admin/admin.php?danger=1");
  }
}

if (isset($_POST['grs'])) {
  $kul = $_POST['kul'];
  $sifre = $_POST['pass'];
  $adminsor = $vt->prepare("SELECT * from admin where kullanici_adi=:kullanici and sifre=:sifre");
  $adminsor->execute(array(
    'kullanici' => $_POST['kul'],
    'sifre' => $_POST['pass']
  ));
   $say=$adminsor->rowCount();
   if($say==1){
     $_SESSION['kullanic_adi']=$kul;
        header("location:admin.php");
        exit;
   }else{
    header("location:login.php?danger=1");
    exit;
   }
  
}
