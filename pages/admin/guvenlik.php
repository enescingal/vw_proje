<?php
session_start();
if(!$_SESSION['kullanic_adi']){
    header("location:login.php");
    exit;
  }
  
?>