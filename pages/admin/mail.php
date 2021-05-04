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

  <title>Volkswagen Mail</title>

</head>

<body>


  <section>
    <div class="card " style="border:none;margin: 150px auto; width: 20rem;  ">
      <img src="../../public/img/mail.png" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title ad1">Mail </h5>
        <p class="card-text"></p>
        <form action="gonder.php" method="POST">
        <?php
          if (isset($_GET['success'])) {
          ?>
            <div class="alert alert-success">Başarıyla Silindi.</div>
          <?php } ?>
          <div class="form-floating mb-3 ">
            <input type="text" name="kul" class="form-control" id="floatingInput" placeholder="text">
            <label for="floatingInput">Volkswagen</label>
          </div>
          <div class="form-floating mb-3">
            <input type="text" name="ad" class="form-control" id="floatingInput" placeholder="text">
            <label for="floatingInput">Alıcı</label>
          </div>
          <div class="form-floating mb-3">
            <input type="text" name="konu" class="form-control" id="floatingInput" placeholder="text">
            <label for="floatingInput">Sipariş Talebi</label>
          </div>
          <div class="form-floating mb-3">
            <input type="email" class="form-control " name="mail" id="floatingInput" placeholder="name@example.com">
            <label for="floatingInput"><?php echo $_GET['mail'] ?> </label>
          </div>
          <div class="form-floating">
            <textarea class="form-control " name="mesaj" placeholder="Leave a comment here" id="floatingTextarea" style="margin-bottom: 16px;">Talebiniz alınmıştır. İyi Günler dileriz.</textarea>
            <label for="floatingTextarea">Mesajınız</label>
          </div>
         
          <button type="submit" name="gndr" class="btn  ab color1 button " value="Log in">Mail Gönder</button>

        </form>
      </div>

    </div>

  </section>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

</body>

</html>