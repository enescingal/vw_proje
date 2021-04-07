<?php
include("vtayar.php");

?>

<!doctype html>
<html lang="tr">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.0/font/bootstrap-icons.css">

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">

  <link rel="stylesheet" href="../Public/css/anasayfa.css">
  <script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>

  <title>Volkswagen</title>

</head>

<!-- --------------HEADER--------  -->

<header>
  <nav class="fixed-top shadow-sm " style="background-color: white;">

    <div style="background-color: #001e50; height: 36px;">

      <div class="container-lg">

        <div class="row">
          <div class="col-8">
            <div class="text-white text-small ">
              <ul class="navbar-nav  list-group-horizontal justify-content-start">
                <li class="nav-item " style="margin-left:16px;">
                  <a class="nav-link text-white" href="yeniarac.html">Yeni Araç Al</a>
                </li>
                <li class="nav-item " style="margin-left:30px;">
                  <a class="nav-link text-white" href="fiyatliste.html">Fiyat Listesi</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-4">
            <div class="text-white text-small ">
              <ul class="navbar-nav list-group list-group-horizontal justify-content-end ">
                <li class="nav-item ">
                  <a class="nav-link text-white" href="iletisimformu.php">Bize Ulaşın</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="container-lg">
      <div class="row">
        <div class="navbar navbar-expand-lg navbar-light">

          <a class="navbar-brand" style="padding-left: 16px;" href="anasayfa.html">
            <img src="../Public/img/vwlogo.png" style="width: 48px;"></a>

          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">

            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarCollapse">
            <ul class="navbar-nav text-center" style="margin-left: auto">
              <li class="nav-item ">
                <a class="nav-link color1" href="anasayfa.html">Anasayfa</a>
              </li>
              <li class="nav-item">
                <a class="nav-link color1" href="modeller.html">Modeller</a>
              </li>
              <li class="nav-item">
                <a class="nav-link color1" href="kampanya.html">Kampanyalar</a>
              </li>
              <li class="nav-item">
                <a class="nav-link color1" href="iletisim.html">İletişim ve Destek</a>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  </nav>
</header>


<!-- --------------SLIDER--------  -->

<section>
  <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img style="margin-top: 110px;" src="../public/img/ya.jpg" class="d-block  w-100" alt="...">
      </div>

    </div>

  </div>
</section>

<body>
  <!--açıklama-->
  <section>

    <!--main-->




    <div class="container col-12">
      <h4 class="text-center" style="margin:80px;"><strong>Ön Sipariş Fırsatları</strong> </h4>
      <form action="kaydet.php" class="form-control" method="POST" style="border: none;">

        <div class="col-12 card" style="padding: 16px 160px;">
          <h4 class="text-center p-4">Hemen Şipariş Verin</h4>
          <div class="form-floating mb-3">
          
            <input type="text" name="ad" class="form-control" id="floatingInput" placeholder="text">
            <label for="floatingInput">Ad Soyad</label>
          </div>
          <div class="form-floating mb-3">
            <input type="text" name="tel" class="form-control" id="floatingInput" placeholder="text">
            <label for="floatingInput">Telefon</label>
          </div>
          <div class="form-floating mb-3">
            <input type="email" name="mail" class="form-control" id="floatingInput" placeholder="name@example.com">
            <label for="floatingInput">Mail</label>
          </div>


          <select class="form-select" name="sehir" aria-label="Default select example" style="margin-bottom :16px;">
            <option selected>Şehir Seçiniz</option>
            <option value="İstanbul">İstanbul </option>
            <option value="Ankara">Ankara</option>
            <option value="Bursa">Bursa</option>
            <option value="Sakarya">Sakarya </option>
            <option value="Balıkesir">Balıkesir</option>
            <option value="Kocaeli">Kocaeli</option>
          </select>

          <select class="form-select" name="model" aria-label="Default select example" style="margin-bottom :16px;">
            <option selected>Araç Modelini Seçiniz</option>
            <option value="Golf">Golf</option>
            <option value="T-rog">T-rog</option>
            <option value="Tiguan">Tiguan</option>
            <option value="Polo">Polo</option>
            <option value="Passat">Passat</option>
            <option value="Touareg">Touareg</option>
          </select>


          <select class="form-select" name="paket" aria-label="Default select example" style="margin-bottom :16px;">
            <option selected>Donanım Seviyesi Seçiniz</option>

            <?php

            $cek = $vt->query("select * from paket");
            $cek->execute();





            while ($row = $cek->fetch(PDO::FETCH_ASSOC)) {
            ?>
              <option value="<?= $row['pkt'] ?>"><?= $row['pkt'] ?></option>

            <?php
            }
            ?>





          </select>
          <?php
            if (isset($_GET['success'])) {
            ?>
              <div class="alert alert-success">Siparişiniz Alındı.</div>
            <?php } ?>

          <input type="submit" name="btn" class="btn btn-outline-primary button " onsubmit="return false" placeholder="Gönder"></input>
         
      </form>

    </div>

    </div>



    </div>


  </section>

</body>








<footer>
  <div class="container col-12" style="margin-top: 80px;">
    <hr width="100%" size="4">
    <div class="row align-items-start" style="margin-top: 60px;">
      <div class="col-4 text-center">

        <h6>Modeller ve Fiyatlar</h6>
        <br>

        <a class="a1 color1" href="modeller.html">
          <p><small>Tüm Modeller</small></p>
        </a>
        <a class="a1 color1" href="modeller.html">
          <p><small>SUV Modeller</small> </p>
        </a>
        <a class="a1 color1" href="fiyatliste.html">
          <p><small>Araç Fiyatları</small></p>
        </a>

      </div>


      <div class="col-4 text-center">

        <h6>İletişim</h6>
        <br>
        <a class="a1 color1" href="iletisim.html">
          <p><small>Bilgi Formu</small></p>
        </a>
        <a class="a1 color1" href="iletisimformu.html">
          <p><small>İletişim Formu</small> </p>
        </a>
        <a class="a1 color1" href="kampanya.html">
          <p><small>Yetkili Satıcı ve
              Servisler </small></p>
        </a>
      </div>
      <div class="col-4 text-center">

        <h6>Sosyal Medya</h6>
        <br>
        <a class="a1 color1" href="https://www.facebook.com/vwturkiye/">
          <p><small>Facebook</small></p>
        </a>
        <a class="a1 color1" href="https://www.instagram.com/vwturkiye/?hl=tr">
          <p><small>Instagram</small></p>
        </a>
        <a class="a1 color1" href="https://www.youtube.com/channel/UCjdY7pOZwLeceJNIAfUh97w">
          <p><small>Youtube</small></p>
        </a>

      </div>
    </div>
  </div>
  <hr width="100%" size="4" style="margin-top: 60px;">
  <p class="card-text fs-6 text-center"><small>Volkswagen 2021 Tüm Hakları Saklıdır.</small></p>
  <hr width="100%" size="4">

  </div>
</footer>




<!-- Optional JavaScript; choose one of the two! -->

<!-- Option 1: Bootstrap Bundle with Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>

<!-- Option 2: Separate Popper and Bootstrap JS -->
<!--
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.6.0/dist/umd/popper.min.js" integrity="sha384-KsvD1yqQ1/1+IA7gi3P0tyJcT3vR+NdBTt13hSJ2lnve8agRGXTTyNaBYmCR/Nwi" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.min.js" integrity="sha384-nsg8ua9HAw1y0W1btsyWgBklPnCUAFLuTMS2G72MMONqmOymq585AcH49TLBQObG" crossorigin="anonymous"></script>
    -->


</html>