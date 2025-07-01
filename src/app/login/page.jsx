'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../styles/login.module.css';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, User, Lock, Mail, Shield, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [fieldValidation, setFieldValidation] = useState({
    email: false,
    password: false,
    role: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    setFieldValidation(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));

    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'password':
        return value.length >= 6;
      case 'role':
        return value !== '';
      default:
        return false;
    }
  };

  const validateForm = () => {
    const { email, password, role } = formData;
    
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!validateField('email', email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (!role) {
      setError('Please select your role');
      return false;
    }
    
    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const { email, password, role } = formData;

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email.trim(),
        password: password.trim(),
        role: role.toUpperCase(),
      });

      if (result.error) {
        setError(result.error);
      } else {
        // Show success state briefly before redirect
        const roleStored = localStorage.getItem('role');
        
        // Add a brief delay for better UX
        setTimeout(() => {
          if (roleStored === 'admin') router.push('/dashboard');
          else if (roleStored === 'project manager') router.push('/dashboard/manager');
          else router.push('/dashboard/user');
        }, 500);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  }

  // Auto-focus first input on mount
  useEffect(() => {
    const emailInput = document.querySelector('input[name="email"]');
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.backgroundAnimation}></div>
      <div className={styles.loginCard}>
        <div className={styles.logoSection}>
          <div className={styles.logoContainer}>
            <img
              src="/accent.png"
              alt="Accent Logo"
              className={styles.logo}
              width={60}
              height={60}
            />
          </div>
          <h1 className={styles.title}>Welcome Back</h1>
        </div>

        {error && (
          <div className={styles.errorAlert} role="alert">
            <Shield className={styles.errorIcon} size={20} />
            <span className={styles.errorText}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">
              <Mail className={styles.inputIcon} size={18} />
              Email Address
              {fieldValidation.email && <CheckCircle size={16} color="#10b981" />}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className={styles.input}
              autoComplete="email"
              aria-describedby={error && error.toLowerCase().includes('email') ? 'email-error' : undefined}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">
              <Lock className={styles.inputIcon} size={18} />
              Password
              {fieldValidation.password && <CheckCircle size={16} color="#10b981" />}
            </label>
            <div className={styles.passwordContainer}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={styles.input}
                autoComplete="current-password"
                aria-describedby={error && error.toLowerCase().includes('password') ? 'password-error' : undefined}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="role">
              <User className={styles.inputIcon} size={18} />
              Role
              {fieldValidation.role && <CheckCircle size={16} color="#10b981" />}
            </label>
            <select
              id="role"
              name="role"
              required
              value={formData.role}
              onChange={handleInputChange}
              className={styles.select}
              aria-describedby={error && error.toLowerCase().includes('role') ? 'role-error' : undefined}
            >
              <option value="" disabled>Select your role</option>
              <option value="ADMIN">Administrator</option>
              <option value="PROJECT MANAGER">Project Manager</option>
              <option value="USER">User</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading || !formData.email || !formData.password || !formData.role} 
            className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
            aria-describedby="submit-description"
          >
            {loading ? (
              <>
                <div className={styles.spinner} aria-hidden="true"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
          
          <div id="submit-description" className="sr-only">
            {loading ? 'Please wait while we sign you in' : 'Sign in to access your account'}
          </div>
        </form>

        <div className={styles.footer}>
        </div>
      </div>
    </div>
  );
}