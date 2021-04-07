<?php
    $baglan = mysqli_connect("localhost", "root", "0102030405", "proje");

    if (!$baglan) {
      die("bağlantı hatası" . mysqli_connect_error());
    }


    
    if (isset($_POST["btn"])) {

      $sql = "insert into yeniarac (ad,tel,mail,sehir,model,paket) values('" . $_POST["ad"] . "','" . $_POST["tel"] . "','" . $_POST["mail"] . "','" . $_POST["sehir"] . "','" . $_POST["model"] . "','" . $_POST["paket"] . "')";
      $ekle = mysqli_query($baglan, $sql);
      if($ekle){
        header("location:yeniarac.php?success=1");
    }

    }
  

   



    if (isset($_POST["btn1"])) {
    
        $db = "insert into iletisim (ad,tel,mail,mesaj) values('" . $_POST["ad"] . "','" . $_POST["tel"] . "','" . $_POST["mail"] . "','" . $_POST["mesaj"] . "')";
        $kayıt = mysqli_query($baglan, $db);
        if($kayıt){
            header("location:iletisimformu.php?success=1");
        }
      }
    
  
    ?>
