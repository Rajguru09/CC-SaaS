import { useState } from 'react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.access_token);
      alert('Signup successful!');
      window.location.href = "/dashboard";
    } else {
      alert(data.detail || 'Signup failed');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Signup</h1>
      <form onSubmit={handleSignup} className="mt-4 space-y-2">
        <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border p-2 w-full" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2" type="submit">Sign Up</button>
      </form>
    </div>
  );
}
