import React, { useState } from 'react';
import { Button, Input, Form, Typography, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (username === 'admin' && password === 'password') {
      setIsLoggedIn(true);
      navigate('/event-list');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          width: '50%',
          backgroundImage: `url('https://firesystems.net/wp-content/uploads/2021/11/AdobeStock_139973098-scaled.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      <div
        style={{
          width: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <div
          style={{
            width: '400px',
            textAlign: 'left',
          }}
        >
          <Title level={2} style={{ color: '#191919', marginBottom: '10px' }}>
            Welcome Back!
          </Title>
          <Text style={{ color: '#7a7a7c', marginBottom: '20px', display: 'block', fontSize: '16px' }}>
            Enter your credentials to sign in
          </Text>
          <Form onFinish={handleSubmit}>
            <Form.Item style={{ textAlign: 'left' }}>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  backgroundColor: '#efefef',
                  color: '#191919',
                  borderRadius: '8px',
                  height: '40px'
                }}
              />
            </Form.Item>
            <Form.Item style={{ textAlign: 'left' }}>
              <Input.Password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  backgroundColor: '#efefef',
                  color: '#191919',
                  borderRadius: '8px',
                  height: '40px'
                }}
              />
            </Form.Item>
            <Form.Item style={{ textAlign: 'left' }}>
              <Checkbox style={{ color: '#7a7a7c' }}>Remember Me</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: '#ff7600',
                  border: 'none',
                  width: '100%',
                  height: '40px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                }}
              >
                Sign In
              </Button>
            </Form.Item>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <Text style={{ color: '#191919', display: 'block', fontSize: '14px' }}>
                  Don't have an account ?
              </Text>
              <Button
                htmlType="submit"
                onClick={handleSignUp}
                style={{
                  backgroundColor: '#fff',
                  color: '#ff7600',
                  border: 'none',
                  width: '80px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  boxShadow: '0px 0px 0px 0px #fff'
                }}
              >
                Sign Up
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
