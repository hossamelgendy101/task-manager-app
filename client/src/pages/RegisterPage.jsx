import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import { registerUser } from '../lib/api';
import { validateRegisterForm } from '../lib/validators';

const initialValues = {
  name: '',
  email: '',
  password: '',
};

function RegisterPage({ onAuthSuccess, onNotify }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setServerError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateRegisterForm(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setServerError('');
    setIsSubmitting(true);

    try {
      const data = await registerUser(values);
      onAuthSuccess(data);
      onNotify({
        title: 'Account created',
        message: 'Your workspace is ready.',
        type: 'success',
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrors(error.errors || {});
      setServerError(error.message);
      onNotify({
        title: 'Registration failed',
        message: error.message || 'Please review the form details and try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      subtitle="Create a new account with validated credentials and instant access after signup."
      title="Create your account"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField
          autoComplete="name"
          error={errors.name}
          label="Full name"
          name="name"
          onChange={handleChange}
          placeholder="Hossam Ahmed"
          value={values.name}
        />
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
          autoComplete="new-password"
          error={errors.password}
          label="Password"
          name="password"
          onChange={handleChange}
          placeholder="At least 8 characters"
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
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="mt-6 text-sm leading-6 text-slate-400">
        Already have an account?{' '}
        <Link className="font-semibold text-emerald-300 transition hover:text-emerald-200" to="/login">
          Sign in
        </Link>
        .
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;
