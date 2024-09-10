const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({ email, token }) => {
  const URL = `${process.env.FRONTEND}/admin/resetPassword?token=${token}&email=${email}`;
  const logoURL = `https://res.cloudinary.com/dpwtcr4cz/image/upload/t_cropped logo/v1725073729/FYs-Cats_logo_msv4qf.png`;
  const message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <div style="text-align: center;">
                <img src="${logoURL}" alt="Company Logo" style="max-width: 150px; margin-bottom: 20px;">
            </div>
            <h2 style="color: #333;">Reset Your Password</h2>
            <p style="color: #555;">
                We received a request to reset your password. Please click the button below to reset your password:
            </p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${URL}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 5px;">
                    Reset Password
                </a>
            </div>
            <p style="color: #555;">
                If you did not request this, please ignore this email.
            </p>
            <p style="color: #555;">
                Thank you,<br>
                FYs Cats
            </p>
        </div>
    `;
  const subject = "Reset Password";
  return sendEmail(email, subject, message);
};

module.exports = sendResetPasswordEmail;
