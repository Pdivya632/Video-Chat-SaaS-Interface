<?php
function checkLoginCredentials($email, $password)
{
    // Create a new MySQLi connection
    $con = new mysqli("localhost", "root", "","mydb","3308");

    // Check the connection
    if ($con->connect_error) {
        die("Connection failed: " . $con->connect_error);
        echo "Connected successfully";
    }

    // Prepare the SQL statement to retrieve the user with the provided username and password
    $stmt = $con->prepare("SELECT * FROM users WHERE email = ? AND password = ?");
    $stmt->bind_param("ss", $email, $password);

    // Execute the statement
    $stmt->execute();

    // Fetch the result
    $result = $stmt->get_result();

    // Check if a matching user was found
    if ($result->num_rows === 1) {
        // Valid credentials
        return true;
    } else {
        // Invalid credentials
        return false;
    }

    // Close the statement and database connection
    $stmt->close();
    $con->close();
}

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Retrieve the submitted form data
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Perform your validation and verification against the database
    if (checkLoginCredentials($email, $password)) {
        // Redirect to the home page
        header('Location: http://localhost/dvcproject/chat.html');
        exit();
    } else {
        // Handle incorrect credentials
        header('Location: http://localhost/dvcproject/login.html');
        exit();
    }
}
