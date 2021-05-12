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

  <title>Volkswagen Admin Giriş</title>

</head>

<body>


  <section>
    <div class="card " style="border:none;margin: 150px auto; width: 20rem;  ">
      <a href="../anasayfa.html"><img src="../../public/img/vwlogo.png" class="card-img-top" alt="..."></a>
      <div class="card-body">
        <h5 class="card-title ad1">Admin Giriş</h5>
        <p class="card-text"></p>
        <form action="kontrol.php" method="POST">
          <div class="form-floating mb-3 ">
            <input type="text" name="kul" class="form-control" required="" id="floatingInput" placeholder="text" autocomplete="off">
            <label for="floatingInput">Kullanıcı Adı</label>
          </div>
          <div class="form-floating">
            <input type="password" name="pass" class="form-control" required="" id="floatingPassword" placeholder="Password" autocomplete="off">
            <label for="floatingPassword">Şifre</label>
          </div>

          <button type="submit" name="grs" class="btn  ab color1 button " value="Log in">Giriş</button>
          <?php
          if (isset($_GET['danger'])) {
          ?>
            <div class="alert alert-danger">Kullanıcı adı veya Şifre yanlış</div>
          <?php } ?>
        </form>
      </div>

    </div>


  </section>
</body>

</html>