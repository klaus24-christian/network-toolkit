
import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Network, Mail, Lock, User } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('🔵 Register attempt:', { email, name });

    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔵 Calling authService.register...');
      const response = await authService.register({ email, password, name });
      console.log('✅ Registration successful:', response);
      
      login(response.user, response.token);
      console.log('✅ User logged in, navigating to dashboard...');
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 dark:from-dark-bg dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-dark-card rounded-2xl shadow-lg mb-4"
          >
            <Network className="w-10 h-10 text-primary-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Network Toolkit</h1>
          <p className="text-primary-100 dark:text-gray-400">Professional network management tools</p>
        </div>

        <Card>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create Account</h2>
            <p className="text-gray-600 dark:text-gray-400">Sign up to get started with network tools</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Name"
              placeholder="John Doe"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              icon={<User className="w-5 h-5" />}
              autoComplete="name"
            />

            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              autoComplete="email"
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              autoComplete="new-password"
              helperText="Minimum 6 characters"
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            <Button type="submit" fullWidth isLoading={isLoading} variant="primary">
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-primary-100 dark:text-gray-500">
            © 2025 Network Toolkit. Built with React, TypeScript & Tailwind CSS
          </p>
        </div>
      </motion.div>
    </div>
  );
};
