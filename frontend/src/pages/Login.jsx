import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-chakra-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-chakra-dark-light rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-chakra-accent">Chakras</h1>
          <p className="text-chakra-subtext mt-2">Sign in to continue</p>
        </div>

        {(formError || error) && (
          <div className="bg-red-900/30 text-red-200 p-3 rounded-md mb-4">
            {formError || error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-chakra-text mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full p-3 rounded bg-black/20 border border-gray-700 text-white focus:border-chakra-accent focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-chakra-text mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full p-3 rounded bg-black/20 border border-gray-700 text-white focus:border-chakra-accent focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-chakra-accent hover:bg-green-600 text-white font-medium p-3 rounded-full transition duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-chakra-subtext">
            Don't have an account?{' '}
            <Link to="/register" className="text-chakra-accent hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
