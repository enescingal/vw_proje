<?php
include("baglan.php");
include("guvenlik.php");


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

  <link rel="stylesheet" href="../../Public/css/anasayfa.css">

  <title>Volkswagen Admin Paneli</title>

</head>
<header>



  <div class="container">
    <div class="row">
      <div class="navbar navbar-expand-lg navbar-light">

        <a class="navbar-brand" style="padding-left: 16px;" href="../anasayfa.html">
          <img src="../../Public/img/vwlogo.png" style="width: 48px;"></a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">

          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav text-center" style="margin-left: auto">
            <li class="nav-item">
              <a class="nav-link color1" href="../admin/login.php">Çıkış</a>
            </li>
          </ul>
        </div>

      </div>

    </div>
  </div>
  </nav>
</header>

<body>


  <section>
    <div class="container" style="margin-top: 350px;">
      <div class="col-12">
        <div class="accordion" id="accordionPanelsStayOpenExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="panelsStayOpen-headingOne">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                Ön Siparişler
              </button>
            </h2>
            <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
              <div class="accordion-body">
              <div class="row justify-content-center">
                  <div class="col">
                    <?php
                    if (isset($_GET['success'])) {
                    ?>
                      <div class="alert alert-success">Başarıyla Silindi!</div>
                    <?php } ?>
                    <table class="table ">
                      <tr>
                        <td>Id</td>
                        <td>Ad</td>
                        <td>Tel</td>
                        <td>Mail</td>
                        <td>Şehir</td>
                        <td>Model</td>
                        <td>Paket</td>
                        <td>   </td>
                        <td>   </td>


                      </tr>
                      <?php
                      $say = 0;
                      $cek = $vt->query("select * from yeniarac");
                      $cek->execute();
                      while ($row = $cek->fetch(PDO::FETCH_ASSOC)) {
                        $say++
                      ?>
                        <tr>
                          <td><?= $say; ?></td>
                          <td><?= $row['ad'] ?></td>
                          <td><?= $row['tel'] ?></td>
                          <td><?= $row['mail'] ?></td>
                          <td><?= $row['sehir'] ?></td>
                          <td><?= $row['model'] ?></td>
                          <td><?= $row['paket'] ?></td>

                          <td><a href="../admin/kontrol.php?id=<?php echo $row['id'] ?>&yeniarac=sil"><button type="submit" name="btn" class="btn btn-danger ">Sil</button></a></td>
                          <td><a href="../admin/mail.php?mail=<?php echo $row['mail'] ?>&yeniarac=gonder"><button type="submit" name="bt1" class="btn btn-danger">Mail</button></a></td>


                        </tr>
                      <?php
                      } ?>

                    </table>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                Mesajlar
              </button>
            </h2>
            <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
              <div class="accordion-body">
              <div class="row justify-content-center">
                <div class="col">
                  <?php
                  if (isset($_GET['info'])) {
                  ?>
                    <div class="alert alert-info" role="alert">Başarıyla Silindi!</div>
                  <?php } ?>
                  <table class="table ">
                    <tr>
                      <td>Id</td>
                      <td>Ad</td>
                      <td>Tel</td>
                      <td>Mail</td>
                      <td>Mesaj</td>
                      <td>   </td>
                      <td>   </td>




                    </tr>
                    <?php
                    $say = 0;
                    $cek = $vt->query("select * from iletisim");
                    $cek->execute();
                    while ($row = $cek->fetch(PDO::FETCH_ASSOC)) {
                      $say++
                    ?>
                      <tr>
                        <td><?= $say; ?></td>
                        <td><?= $row['ad'] ?></td>
                        <td><?= $row['tel'] ?></td>
                        <td><?= $row['mail'] ?></td>
                        <td><textarea><?= $row['mesaj'] ?></textarea></td>

                        <td><a href="../admin/kontrol.php?id=<?php echo $row['id'] ?>&iletisim=sil"><button type="submit" name="btn" class="btn btn-danger ">Sil</button></a></td>
                        <td><a href="../admin/mail.php?mail=<?php echo $row['mail'] ?>&iletisim=gonder"><button type="submit" name="bt1" class="btn btn-danger">Mail</button></a></td>


                      </tr>
                    <?php } ?>

                  </table>
                </div>
              </div>
              </div>
            </div>
          </div>

        </div>
      </div>
  </section>

</body>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>

</html>