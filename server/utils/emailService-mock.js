// Mock email service for testing
const sendPasswordResetEmail = async (email, token, firstName) => {
  console.log(`📧 MOCK EMAIL: Password reset link sent to ${email}`);
  console.log(`🔗 Reset token: ${token}`);
  console.log(`👤 User: ${firstName}`);
  console.log(`🌐 Reset URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`);
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Always succeed for testing
  return true;
};

const sendPasswordResetConfirmation = async (email, firstName) => {
  console.log(`📧 MOCK EMAIL: Password reset confirmation sent to ${email}`);
  console.log(`👤 User: ${firstName}`);
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Always succeed for testing
  return true;
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordResetConfirmation,
};
