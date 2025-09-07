import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData
      );
      console.log(res.data);
      // Set the user ID in a cookie to remember the user
      Cookies.set('userId', res.data.user.id, { expires: 7 }); 
      alert('Login Successful!');
      // Redirect to the dashboard after successful login
      window.location.href = '/dashboard'; 
    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.msg);
    }
  };

  return (
    <form onSubmit={e => onSubmit(e)}>
      <div>
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={e => onChange(e)}
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={e => onChange(e)}
          required
        />
      </div>
      <input type="submit" value="Login" />
    </form>
  );
};

export default Login;