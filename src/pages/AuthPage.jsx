import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, browserLocalPersistence, setPersistence } from "firebase/auth";
import { auth, db } from '../firebase/firebase.config';
import toast from 'react-hot-toast';
import { validateEmail, validatePassword } from '../util/validation';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";



export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: '',
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasNumber: false,
    hasSymbol: false,
    hasMixedCase: false,
  });

  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation
    if (name === 'email') {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(value) ? '' : 'Please enter a valid email address'
      }));
    }

    if (name === 'password') {
      const validation = validatePassword(value);
      setPasswordRequirements({
        minLength: value.length >= 6,
        hasNumber: /\d/.test(value),
        hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        hasMixedCase: /[a-z]/.test(value) && /[A-Z]/.test(value),
      });
      setErrors(prev => ({
        ...prev,
        password: validation.isValid ? '' : 'Password does not meet requirements'
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!passwordValidation.isValid) {
      newErrors.password = 'Password does not meet requirements';
      isValid = false;
    }

    // Name validation (for signup)
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Login function with firebase
  const loginFB = async (email, password) => {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  // Signup function with firebase
  const signup = async (email, password, name) => {
    await setPersistence(auth, browserLocalPersistence);
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCred.user, { displayName: name });

    await setDoc(doc(db, "users", userCred.user.uid), {
      uid: userCred.user.uid,
      email,
      name,
      createdAt: serverTimestamp(),
      // role: "user",
    });
    return userCred.user;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      // Determine which auth function to use based on isLogin
      const authAction = isLogin
        ? () => loginFB(formData.email, formData.password)
        : () => signup(formData.email, formData.password, formData.name);

      // Execute authentication
      const user = await authAction();
      if (!user || !user.uid) {
        toast.error("error loging in")
        throw new Error("Authentication failed - no user returned");
      }

      const userData = {
        id: user.uid,
        name: user.displayName || formData.name,
        email: user.email,
        // emailVerified: user.emailVerified,
      };

      // Update auth state and redirect
      login(userData);
      navigate('/dashboard');

    } catch (error) {
      let errorMessage = isLogin
        ? "Login failed"
        : "Error signing up";

      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "Email already in use";
            toast.error("email already in use")
            break;
          case 'auth/invalid-email':
            errorMessage = "Invalid email address";
            toast.error("invalid email id")
            break;
          case 'auth/weak-password':
            errorMessage = "Password is too weak";
            toast.error("password too weak")
            break;
          // Add more cases as needed
        }
      }
      // setAuthError(errorMessage);
      console.error(`${errorMessage}:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="sr-only">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>
              )}

              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <span className="error text-red-500 text-sm">{errors.password}</span>}
                {!isLogin && (
                  <div className="password-requirements">
                    <p className='text-gray-700'>Password must contain:</p>
                    <ul>
                      <li className={passwordRequirements.minLength ? 'text-green-500 text-sm italic' : 'text-gray-400 italic text-sm'}>
                        At least 6 characters
                      </li>
                      <li className={passwordRequirements.hasNumber ? 'text-green-500 text-sm italic' : 'text-gray-400 italic text-sm'}>
                        At least 1 number
                      </li>
                      <li className={passwordRequirements.hasSymbol ? 'text-green-500 text-sm italic' : 'text-gray-400 italic text-sm'}>
                        At least 1 symbol (!@#$%^&* etc.)
                      </li>
                      <li className={passwordRequirements.hasMixedCase ? 'text-green-500 text-sm italic' : 'text-gray-400 italic text-sm'}>
                        Both uppercase and lowercase letters
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-center">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {isLogin ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}