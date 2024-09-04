const sendEmail = require('./sendEmail');

const sendVerificationEmail = async ({ email, verificationCode }) => {
    const logoURL = `https://res.cloudinary.com/dpwtcr4cz/image/upload/t_cropped logo/v1725073729/FYs-Cats_logo_msv4qf.png`;
    const message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <div style="text-align: center;">
                <img src="${logoURL}" alt="Company Logo" style="max-width: 150px; margin-bottom: 20px;">
            </div>
            <h2 style="color: #333;">Email Verification</h2>
            <p style="color: #555;">
                We're pleased you're making an account with us. Please verify your email with the code below:
            </p>
            <div style="text-align: center; margin: 20px 0;">
                <h1 style="font-size: 48px; font-weight: bold; color: #333;">${verificationCode}</h1>
            </div>
            <p/>
            <p style="color: #555;">
                Thank you,<br>
                FYs Cats
            </p>
        </div>
    `;
    const subject = "Email Verification"
    return sendEmail(email, subject, message);
}

module.exports = sendVerificationEmail