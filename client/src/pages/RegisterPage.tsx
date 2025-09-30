import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../services/authContext';

const RegisterPage: React.FC = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Password requirements checker - only essential requirements
  const passwordRequirements = {
    length: formData.password.length >= 6, // Minimum 6 characters (as per backend validation)
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password)
  };

  const passwordStrength = Object.values(passwordRequirements).filter(Boolean).length;

  useEffect(() => {
    clearError();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating your account...');
    try {
      await register(formData);
      toast.dismiss(loadingToast);
      navigate('/dashboard');
    } catch (err: any) {
      toast.dismiss(loadingToast);
      console.error('Registration error:', err.message);
    }
  };

  return (
    <div className="auth-container-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us today</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements Indicator */}
          {formData.password && (
            <div className="password-requirements">
              <div className="password-strength-bar">
                <div 
                  className={`strength-fill strength-${passwordStrength}`}
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                ></div>
              </div>
              <div className="requirements-list">
                <div className={`requirement ${passwordRequirements.length ? 'met' : ''}`}>
                  <span className="requirement-icon">
                    {passwordRequirements.length ? '✓' : '○'}
                  </span>
                  At least 6 characters
                </div>
                <div className={`requirement ${passwordRequirements.uppercase ? 'met' : ''}`}>
                  <span className="requirement-icon">
                    {passwordRequirements.uppercase ? '✓' : '○'}
                  </span>
                  One uppercase letter
                </div>
                <div className={`requirement ${passwordRequirements.lowercase ? 'met' : ''}`}>
                  <span className="requirement-icon">
                    {passwordRequirements.lowercase ? '✓' : '○'}
                  </span>
                  One lowercase letter
                </div>
                <div className={`requirement ${passwordRequirements.number ? 'met' : ''}`}>
                  <span className="requirement-icon">
                    {passwordRequirements.number ? '✓' : '○'}
                  </span>
                  One number
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
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
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="auth-switch-btn"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
