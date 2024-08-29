export const activationTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Activation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            max-width: 150px;
        }
        .content {
            line-height: 1.6;
            color: #333333;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #888888;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
        }

        .logo{
        color:#2a2e7c;
        font-size:20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
           <h3 class="logo">KUHESMEDLAB</h3>
        </div>
        <div class="content">
            <p>Dear {{name}},</p>
            <p>We are pleased to inform you that you have been added as an admin for the Kuhesmedlab platform. Below are your account details:</p>
            <p><strong>Activation URL:</strong> <a href="{{url}}" class="button">Activate Your Account</a></p>
            <p><strong>Password:</strong> {{password}}</p>
            <p>Please use the above link to activate your account and change your password upon first login. If you have any questions or need assistance, feel free to contact our support team.</p>
            <p>Thank you,</p>
            <p>The Kuhesmedlab Team</p>
        </div>
        <div class="footer">
            <p>If you did not request this account, please ignore this email. For support, visit <a href="https://support.kuhesmedlab.com">our support page</a>.</p>
        </div>
    </div>
</body>
</html>

`