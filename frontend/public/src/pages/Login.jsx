import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.access_token);
      alert('Login successful!');
      window.location.href = "/dashboard";
    } else {
      alert(data.detail || 'Login failed');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Login</h1>
      <form onSubmit={handleLogin} className="mt-4 space-y-2">
        <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border p-2 w-full" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-green-600 text-white px-4 py-2" type="submit">Login</button>
      </form>
    </div>
  );
}
