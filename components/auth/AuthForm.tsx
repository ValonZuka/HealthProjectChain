'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { openDb } from '@/lib/db';
import bcrypt from 'bcryptjs';

export default function AuthForm({ role }: { role: 'patient' | 'doctor' | 'nurse' }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    token: '',
    age: '',
    gender: '',
    description: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const db = await openDb();
      
      if (isLogin) {
        // Login logic
        const user = await db.get(
          'SELECT * FROM accounts WHERE email = ? AND role = ?',
          [formData.email, role]
        );

        if (!user) {
          throw new Error('User not found');
        }

        const validPassword = await bcrypt.compare(formData.password, user.password);
        if (!validPassword) {
          throw new Error('Invalid credentials');
        }

        // Store user session (simplified)
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email
        }));

        // Redirect based on role
        redirectUser(user.role);
      } else {
        // Signup logic
        if (['doctor', 'nurse'].includes(role) && formData.token !== 'hXL5iocF99') {
          throw new Error('Invalid verification token');
        }

        const hashedPassword = await bcrypt.hash(formData.password, 10);
        
        await db.run(
          `INSERT INTO accounts (
            role, name, email, age, gender, description, password, token
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            role,
            formData.name,
            formData.email,
            formData.age || null,
            formData.gender || null,
            formData.description || null,
            hashedPassword,
            ['doctor', 'nurse'].includes(role) ? 'hXL5iocF99' : null
          ]
        );

        // Redirect after successful signup
        router.push(`/auth/${role}-login`);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Auth error:', err);
    }
  };

  const redirectUser = (userRole: string) => {
    switch (userRole) {
      case 'patient':
        router.push('/patient/dashboard');
        break;
      case 'doctor':
      case 'nurse':
        router.push('/');
        break;
      default:
        router.push('/role-selection');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? `${role.charAt(0).toUpperCase() + role.slice(1)} Login` : 'Create Account'}
      </h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required={!isLogin}
              />
            </div>

            {role === 'patient' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Gender</label>
                    <input
                      type="text"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Medical Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    rows={3}
                    placeholder="Any existing conditions (optional)"
                  />
                </div>
              </>
            )}

            {(role === 'doctor' || role === 'nurse') && !isLogin && (
              <div>
                <label className="block mb-1">Verification Token</label>
                <input
                  type="password"
                  name="token"
                  value={formData.token}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="Enter system token"
                />
              </div>
            )}
          </>
        )}

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          {isLogin ? 'Login' : 'Create Account'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 hover:underline"
        >
          {isLogin 
            ? "Don't have an account? Sign up" 
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}