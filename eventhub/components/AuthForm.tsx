import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { setToken } from '../utils/auth';

type Props = {
  type: 'login' | 'register';
};

const AuthForm: React.FC<Props> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = type === 'login' ? '/api/login' : '/api/register';
      const res = await axios.post(endpoint, { email, password });
      const { token, role } = res.data;
      setToken(token, role);
      router.push('/dashboard');
    } catch (err) {
      alert('Authentication failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>{type === 'login' ? 'Login' : 'Register'}</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
      <button type="submit">{type === 'login' ? 'Login' : 'Register'}</button>
    </form>
  );
};

export default AuthForm;
