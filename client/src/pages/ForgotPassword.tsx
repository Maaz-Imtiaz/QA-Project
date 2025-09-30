import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../constants/api';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    const loadingToast = toast.loading('Sending reset link...');

    try {
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
      setMessage('Password reset link sent to your email!');
      toast.dismiss(loadingToast);
      toast.success('Password reset link sent to your email!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset email';
      setError(errorMessage);
      toast.dismiss(loadingToast);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Enter your email to receive a reset link</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Sending Reset Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            Remember your password?{' '}
            <button
              onClick={() => navigate('/login')}
              className="auth-switch-btn"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
