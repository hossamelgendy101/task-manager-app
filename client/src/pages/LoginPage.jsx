import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import { loginUser } from '../lib/api';
import { validateLoginForm } from '../lib/validators';

const initialValues = {
  email: '',
  password: '',
};

function LoginPage({ onAuthSuccess, onNotify }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const redirectTo = location.state?.from?.pathname || '/dashboard';

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setServerError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateLoginForm(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setServerError('');
    setIsSubmitting(true);

    try {
      const data = await loginUser(values);
      onAuthSuccess(data);
      onNotify({
        title: 'Welcome back',
        message: 'You have signed in successfully.',
        type: 'success',
      });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrors(error.errors || {});
      setServerError(error.message);
      onNotify({
        title: 'Login failed',
        message: error.message || 'Please review your credentials and try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      subtitle="Sign in with your account details to access the protected dashboard."
      title="Welcome back"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField
          autoComplete="email"
          error={errors.email}
          label="Email"
          name="email"
          onChange={handleChange}
          placeholder="you@example.com"
          type="email"
          value={values.email}
        />
        <FormField
          autoComplete="current-password"
          error={errors.password}
          label="Password"
          name="password"
          onChange={handleChange}
          placeholder="Enter your password"
          type="password"
          value={values.password}
        />

        {serverError ? (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {serverError}
          </div>
        ) : null}

        <button
          className="w-full rounded-2xl bg-emerald-400 px-4 py-3.5 font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p className="mt-6 text-sm leading-6 text-slate-400">
        Need an account?{' '}
        <Link className="font-semibold text-emerald-300 transition hover:text-emerald-200" to="/register">
          Create one here
        </Link>
        .
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
