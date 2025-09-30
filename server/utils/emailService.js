const nodemailer = require('nodemailer');

// Create transporter for Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD // Your Gmail App Password (not regular password)
    }
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, firstName) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: {
        name: 'QA Test Management',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Password Reset Request - QA Test Management',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">QA Test Management</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1a1a2e; margin-top: 0;">Hello ${firstName}!</h2>
            
            <p style="color: #4a5568; line-height: 1.6;">
              We received a request to reset your password for your QA Test Management account.
            </p>
            
            <p style="color: #4a5568; line-height: 1.6;">
              Click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #0066cc 0%, #004499 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: 600; 
                        display: inline-block;
                        box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);">
                Reset Password
              </a>
            </div>
            
            <p style="color: #718096; font-size: 14px; line-height: 1.5;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #0066cc; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0066cc;">
              <p style="margin: 0; color: #4a5568; font-size: 14px;">
                <strong>Important:</strong> This link will expire in 10 minutes for security reasons.
                If you didn't request this password reset, please ignore this email.
              </p>
            </div>
            
            <p style="color: #718096; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              QA Test Management Team
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send password reset confirmation email
const sendPasswordResetConfirmation = async (email, firstName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'QA Test Management',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Password Reset Successful - QA Test Management',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">QA Test Management</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset Successful</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1a1a2e; margin-top: 0;">Hello ${firstName}!</h2>
            
            <p style="color: #4a5568; line-height: 1.6;">
              Your password has been successfully reset for your QA Test Management account.
            </p>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                <strong>Security Notice:</strong> If you didn't make this change, please contact our support team immediately.
              </p>
            </div>
            
            <p style="color: #718096; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              QA Test Management Team
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset confirmation email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending password reset confirmation email:', error);
    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordResetConfirmation
};
