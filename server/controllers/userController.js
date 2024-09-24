import bcrypt from "bcryptjs/dist/bcrypt.js";
import User from "../model/User.js";
import "dotenv/config";
import nodemailer from 'nodemailer'
import Jwt from 'jsonwebtoken'
import ProfilePicture from "../model/ProfilePictures.js";

const clientURL = process.env.CLIENT_URL
const serverURL = process.env.SERVER_URL
const companyName = 'Devchat'

export async function Signup(req, res) {
  const { firstname, lastname, email, password, username } = req.body;
  if (!req.body) {
    return res.status(400).json({ error: "user required" });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: "User exists" })
    }
    const existingUsername = await User.findOne({ username: username })
    if (existingUsername) {
      return res.status(400).json({ error: "Username exists" })
    }
    const newUser = new User({
      email: email,
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: hash,
    });
    newUser.generateVerificationHash();
    await newUser.save();

    const verificationLink = `${serverURL}/api/v1/users/verify-email?hash=${newUser.verificationHash}`;
    sendEmailVerificationCode(
      newUser.email,
      newUser.firstname,
      verificationLink
    );

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export async function Login(req, res) {
  const { username, password } = req.body;
  if (!req.body) {
    return res.status(400).json({ error: "user required" })
  }
  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ error: "User not found " })
    } else {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ error: "Password is incorrect" });
      } else {
        const verificationCode = generateVerificationCode();
        user.loginVereficationCode = verificationCode;
        await user.save();

        sendEmailLoginCode(user.email, verificationCode);

        res
          .json({ message: "Verification code sent to your email" })
          .status(200);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export async function GetUsers(req, res) {
  try {
    // Fetch all users
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    // Iterate over the users and get their profile pictures
    const usersWithProfilePictures = await Promise.all(users.map(async user => {
      // Fetch the profile picture associated with the current user
      const profilePicture = await ProfilePicture.findOne({ userId: user._id });

      // If a profile picture is found, convert the Buffer into an array of numbers
      const profilePictureArray = profilePicture ? Array.from(profilePicture.image) : null;

      // Return the user data along with the profile picture as an array of numbers
      return {
        ...user.toObject(),  // Convert Mongoose document to plain JavaScript object
        profilePicture: profilePictureArray,
      };
    }));

    // Send back the users with their profile pictures
    res.json({ users: usersWithProfilePictures });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export async function GetUser(req, res) {
  const id = req.params.id
  if (!id) {
    return res.status(400).json({ error: "User id not provided" })
  }
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: "User with the provided ID not found" })
    }

    res.json({ user: user })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export async function GetUserByUsername(req, res) {
  const username = req.params.username
  if (!username) {
    return res.json({ error: "username not provided" })
  }
  try {
    const user = await User.findOne({ username: username })
    if (!user) {
      return res.status(404).json({ error: "Username not found" })
    }

    const profilePicture = await ProfilePicture.findOne({ userId: user.id })

    res.status(200).json({ user, profilePicture })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export async function UpdateUser(req, res) {
  const id = req.params.id;
  const { updatedData } = req.body;

  if (!id) {
    return res.status(400).json({ error: "USER ID IS REQUIRED" });
  }

  if (!updatedData) {
    return res.status(400).json({ error: "MISSING UPDATED DATA" });
  }

  // Filter to only allow updates to firstname, lastname, and email
  const allowedUpdates = ['firstname', 'lastname', 'email', 'title', 'about'];
  const filteredData = {};
  Object.keys(updatedData).forEach(key => {
    if (allowedUpdates.includes(key)) {
      filteredData[key] = updatedData[key];
    }
  });

  if (Object.keys(filteredData).length === 0) {
    return res.status(400).json({ error: "NO VALID FIELDS TO UPDATE" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "USER NOT FOUND" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, filteredData, { new: true });
    res.status(200).json({ updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export async function updatePassword(req, res) {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!id || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "User ID, current password, and new password are required" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect", user: user });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export async function requestPasswordReset(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.generateResetPasswordToken();
    await user.save();

    const resetLink = `${clientURL}/new-password?token=${user.resetPasswordToken}`;
    sendPasswordResetEmail(user.email, user.firstname, resetLink);

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required" });
  }

  try {
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


export async function DeleteUser(req, res) {
  const id = req.params.id
  if (!id) {
    res.status(400).json({ error: "USER ID IS REQUIRED" })
  }

  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: "USER NOT FOUND" })
    }

    await user.deleteOne({ _id: id })
    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export async function verifyLoginCode(req, res) {
  const { code } = req.body
  try {
    const user = await User.findOne({ loginVereficationCode: code })
    if (!user) {
      return res.status(400).json({ error: "CODE INVALID OR EXPIRED" })
    }

    const token = Jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(200).json({ user: user, token: token })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export async function verifyEmailHash(req, res) {
  const hash = req.query.hash;
  if (!hash) {
    return res.status(400).json({ error: "Verification hash not provided" });
  }

  try {
    const user = await User.findOne({ verificationHash: hash });
    if (!user) {
      return res.status(400).json({ error: "Invalid verification hash" });
    } else {
      user.verified = true;
      user.verificationHash = '';
      await user.save();

      return res.redirect(303, `${clientURL}/login`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}


async function sendEmailVerificationCode(to, names, link) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const day = new Date().getDay().toString
  const dt = new Date().getDate().toString()
  const time = new Date().getTime().toString()
  const date = `${day} ${dt} ${time}`

  const options = {
    from: process.env.EMAIL,
    to,
    subject: `${companyName} - Email Verification Code`,
    html: emailVerificationHtml(link),
  };

  transporter.sendMail(options, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

async function sendPasswordResetEmail(to, names, link) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const day = new Date().getUTCDay().toString()
  const dt = new Date().getDate().toString()
  const hours = new Date().getHours().toString()
  const minutes = new Date().getMinutes().toString()
  const date = `${day}-${dt}-${hours}:${minutes}`

  const options = {
    from: process.env.EMAIL,
    to,
    subject: `${companyName} - Password Reset`,
    html: passwordHTML( link),
  };

  transporter.sendMail(options, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

async function sendEmailLoginCode(to, code) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const day = new Date().getUTCDay().toString()
  const dt = new Date().getDate().toString()
  const hours = new Date().getHours().toString()
  const minutes = new Date().getMinutes().toString()
  const date = `${day}-${dt}-${hours}:${minutes}`

  const options = {
    from: process.env.EMAIL,
    to,
    subject: `${companyName} - Email Verification Code`,
    html: loginHTML(code),
  };

  transporter.sendMail(options, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function loginHTML(code) {
  const html = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>One-Time Verification Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100%;
        }

        .container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
        }
        .email-container {
            background-color: white;
            width: 400px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
            text-align: center;
        }

        .email-container h1 {
            font-size: 20px;
            color: #333;
            margin-bottom: 20px;
        }

        .email-container p {
            font-size: 14px;
            color: #555;
            line-height: 1.5;
        }

        .verification-code {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin: 20px 0;
        }

        .warning-text {
            font-size: 12px;
            color: #888;
        }

        .footer {
            font-size: 12px;
            color: #999;
            margin-top: 30px;
            text-align: center;
        }

        .footer a {
            color: #007bff;
            text-decoration: none;
        }

        .highlight {
            background-color: #ffea8a;
            padding: 2px 4px;
            border-radius: 3px;
            font-weight: bold;
        }

        .icon {
            background-color: #f0f0f0;
            padding: 20px;
            border-radius: 50%;
            display: inline-block;
            margin-bottom: 20px;
        }
    </style>
</head>

<body>

    <div class="container">
        <div class="email-container">
            <!-- Placeholder for the icon -->
            <div class="icon">
                <img src="https://devchat.tanelt.com/assets/logo-DsjE9eHb.webp" height="20" alt="Help Icon">
            </div>

            <h1>Action Required: One-Time Verification Code</h1>
            <p>
                You are receiving this email because a request was made for a one-time code that can be used for
                authentication.
            </p>

            <div class="verification-code">
                ${code}
            </div>

            <p>
                If you did not request this change, please change your password
            </p>

            <div class="footer">
                <p>This message was sent from <span class="highlight">Tanelt, Inc.</span>, <a href="https://devchat.tanelt.com">Devchat</a></p>
            </div>
        </div>
    </div>

</body>

</html>
    `;

  return html;
}

function emailVerificationHtml( verificationLink) {
  const html = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #333;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .email-container {
            background-color: #1c1c1c;
            color: #ddd;
            width: 400px;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            text-align: left;
        }

        h1 {
            font-size: 20px;
            color: white;
            margin-bottom: 20px;
        }

        p {
            font-size: 14px;
            line-height: 1.6;
            color: #bfbfbf;
        }

        .verify-button {
            display: inline-block;
            background-color: #0498dd;
            color: white;
            padding: 10px 20px;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            border-radius: 5px;
            text-decoration: none;
            margin: 20px 0;
        }

        .verify-button:hover {
            background-color: #176a38;
        }

        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #888;
            text-align: center;
        }

        .footer a {
            color: #888;
            text-decoration: none;
        }

        .footer p {
            margin: 5px 0;
        }

        .icon {
            background-color: #f0f0f0;
            padding: 20px;
            border-radius: 50%;
            display: inline-block;
            margin-bottom: 20px;
        }
    </style>
</head>

<body>

    <div class="email-container">
        <div class="icon">
            <img src="https://devchat.tanelt.com/assets/logo-DsjE9eHb.webp" height="20" alt="Help Icon">
        </div>
        <h1>Account Verification</h1>
        <p>Howdy,</p>
        <p>Thank you for choosing Devchat! Please confirm your email address by clicking the link below. We'll
            communicate important updates with you from time to time via email, so it's essential that we have an
            up-to-date email address on file.</p>

        <a href="${verificationLink}" class="verify-button">Verify your email address</a>

        <p>If you did not sign up for a Devchat account, you can simply disregard this email.</p>

        <p>Happy Messaging!</p>

        <p>Luqman Shaban</p>

        <div class="footer">
            <p>Problems or questions?</p>
            <p><a href="mailto:luqmanshaban02@gmail.com">Contact Me</a></p>
            <p>This message was sent from <span class="highlight">Tanelt, Inc.</span>, <a
                    href="https://devchat.tanelt.com">Devchat</a></p>
        </div>
    </div>

</body>

</html>
    `;
  return html;
}


function passwordHTML( passwordLink) {
  const html = `
   <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>One-Time Verification Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100%;
        }

        .container {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .email-container {
            background-color: white;
            width: 400px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
            text-align: center;
        }

        .email-container h1 {
            font-size: 20px;
            color: #333;
            margin-bottom: 20px;
        }

        .email-container p {
            font-size: 14px;
            color: #555;
            line-height: 1.5;
        }

        .verification-code {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin: 20px 0;
        }

        .reset-button {
            display: inline-block;
            background-color: #0498dd;
            color: white;
            padding: 10px 20px;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            border-radius: 5px;
            text-decoration: none;
            margin: 20px 0;
        }

        .reset-button:hover {
            background-color: #1eb3f8;
        }

        .warning-text {
            font-size: 12px;
            color: #888;
        }

        .footer {
            font-size: 12px;
            color: #999;
            margin-top: 30px;
            text-align: center;
        }

        .footer a {
            color: #007bff;
            text-decoration: none;
        }

        .highlight {
            background-color: #ffea8a;
            padding: 2px 4px;
            border-radius: 3px;
            font-weight: bold;
        }

        .icon {
            background-color: #f0f0f0;
            padding: 20px;
            border-radius: 50%;
            display: inline-block;
            margin-bottom: 20px;
        }
    </style>
</head>

<body>

    <div class="container">
        <div class="email-container">
            <!-- Placeholder for the icon -->
            <div class="icon">
                <img src="https://devchat.tanelt.com/assets/logo-DsjE9eHb.webp" height="20" alt="Help Icon">
            </div>

            <h1>Action Required: Reset Your Password</h1>
            <p>
                You are receiving this email because a request was made for a password reset.
            </p>

            <a href="${passwordLink}" class="reset-button" style="color: white;">Reset your password</a>

            <p>
                If you did not request this change, you can disregard this email
            </p>

            <div class="footer">
                <p>This message was sent from <span class="highlight">Tanelt, Inc.</span>, <a
                        href="https://devchat.tanelt.com">Devchat</a></p>
            </div>
        </div>
    </div>

</body>

</html>
    `;
  return html;
}
