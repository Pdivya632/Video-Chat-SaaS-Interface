<?php
// error_reporting(E_ALL);
// ini_set('display_errors', 1);
// Retrieve form data

$email = $_POST["email"];
$password = $_POST["password"];
$firstName = $_POST["firstName"];
$lastName = $_POST["lastName"];
$role = $_POST["role"];
$language = $_POST["language"];

// Establish a connection to the database
$con = new mysqli("localhost", "root", "","mydb","3308");

// Check connection
if ($con->connect_error) {
  die("Connection failed: " . $con->connect_error);
  echo "Connected successfully";
}else {
  $stmt=$con->prepare("INSERT INTO users(email,password,firstName,lastName,role,language) values(?,?,?,?,?,?)");
  $stmt->bind_param("ssssss",$email,$password,$firstName,$lastName,$role,$language);
  $stmt->execute();
  echo"registration Succesfully..";
  $stmt->close();
  mysqli_close($con);
}

//  BELOW THIS IS JUST TRIAL CODE 
// require_once "database.php";


// //TRIAL CODE
// if (isset($_POST["submit"])) {
//   $firstName = $_POST["firstName"];
//   $email = $_POST["email"];
//   $password = $_POST["password"];
//   $lastName = $_POST["lastName"];
//   $role = $_POST["role"];
//   $language = $_POST["language"];


//   $passwordHash = password_hash($password, PASSWORD_DEFAULT);

//   $errors = array();

//   if (empty($firstName) or empty($email) or empty($password) or empty($language)) {
//     array_push($errors, "All fields are required");
//   }
//   if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
//     array_push($errors, "Email is not valid");
//   }
//   if (strlen($password) < 8) {
//     array_push($errors, "Password must be at least 8 charactes long");
//   }
 
//   $sql = "SELECT * FROM users WHERE email = '$email'";
//   $result = mysqli_query($con, $sql);
//   $rowCount = mysqli_num_rows($result);
//   if ($rowCount > 0) {
//     array_push($errors, "Email already exists!");
//   }
//   if (count($errors) > 0) {
//     foreach ($errors as  $error) {
//       echo "<div class='alert alert-danger'>$error</div>";
//     }
//   } else {

//     $sql = "INSERT INTO users (firstName, email, password,lastNmae,role,language) VALUES ( ?, ?, ?,?,?,? )";
//     $stmt = mysqli_stmt_init($con);
//     $prepareStmt = mysqli_stmt_prepare($stmt, $sql);
//     if ($prepareStmt) {
//       mysqli_stmt_bind_param($stmt, "sss", $firstName, $email, $passwordHash);
//       mysqli_stmt_execute($stmt);
//       echo "<div class='alert alert-success'>You are registered successfully.</div>";
//     } else {
//       die("Something went wrong");
//     }
//   }
// }

// // Insert user information into database table
// $sql = "INSERT INTO users (email, password, first_name, last_name, role, language)
// VALUES ('$email', '$hashedPassword', '$firstName', '$lastName', '$role', '$language')";

// // Hash password
// $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// if ($conn->query($sql) === TRUE) {
//   echo "New record created successfully";
// } else {
//   echo "Error: " . $sql . "<br>" . $conn->error;
// }

// $conn->close();
