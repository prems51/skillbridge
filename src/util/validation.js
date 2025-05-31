// validation.js
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  const minLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  
  return {
    isValid: minLength && hasNumber && hasSymbol && hasMixedCase,
    errors: {
      minLength: !minLength && "Password must be at least 6 characters",
      hasNumber: !hasNumber && "Password must contain at least 1 number",
      hasSymbol: !hasSymbol && "Password must contain at least 1 symbol",
      hasMixedCase: !hasMixedCase && "Password must contain both uppercase and lowercase letters",
    },
  };
};