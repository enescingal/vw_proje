<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';


$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->SMTPDebug = 0;                      //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'volkswagenodev@gmail.com';                     //SMTP username
    $mail->Password   = 'gupqvufpcycddtkq';                               //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         //Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
    $mail->Port       = 587;                                    //TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

    //Recipients
    $mail->setFrom('volkswagenodev@gmail.com', $_POST['kul']);
    $mail->addAddress($_POST['mail'], $_POST['ad'] );     //Add a recipient
   
   

    //Attachments
     //Optional name

    //Content
    $mail->isHTML(true); 
    $mail->CharSet = 'UTF-8';                                 //Set email format to HTML
    $mail->Subject =$_POST['konu'] ; 
    $mail->Body    = $_POST['mesaj'];
   

    $mail->send();
    if($mail){
        header("location:mail.php?success=1");
    }
    
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}