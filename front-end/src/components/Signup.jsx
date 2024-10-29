import React, { useState } from 'react';
import { Button, Input, Form, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

const { Title, Text } = Typography;
const navigate = useNavigate();

const handleSignIn = () => {
    navigate('/');
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
          <Title level={2} style={{ color: '#191919', marginBottom: '10px', fontWeight: 'bold' }}>
            Hello User!
          </Title>
          <Text style={{ color: '#3a3a3c', marginBottom: '20px', display: 'block', fontSize: '16px' }}>
            Enter below details to Sign Up
          </Text>
          <Form>
            <Form.Item>
              <Input
                placeholder="Enter your company name"
                style={{
                  backgroundColor: '#efefef',
                  color: '#191919',
                  borderRadius: '8px',
                  height: '40px'
                }}
              />
            </Form.Item>
            <Form.Item style={{ textAlign: 'left' }}>
              <Input
                placeholder="Enter your email"
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
                placeholder="Enter your password"
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
                placeholder="Confirm your password"
                style={{
                  backgroundColor: '#efefef',
                  color: '#191919',
                  borderRadius: '8px',
                  height: '40px'
                }}
              />
            </Form.Item>
            <Form.Item>
                <Text style={{ color: '#777', fontSize: '14px', marginBottom: '20px' }}>
                    By signing up, you agree to our Privacy Policy and Terms & Conditions
                </Text>
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
                Sign Up
              </Button>
            </Form.Item>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <Text style={{ color: '#191919', fontSize: '14px' }}>
                  Already have an account ? Back to
              </Text>
              <Button
                htmlType="submit"
                onClick={handleSignIn}
                style={{
                  backgroundColor: '#fff',
                  color: '#ff7600',
                  border: 'none',
                  width: '70px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  boxShadow: '0px 0px 0px 0px #fff'
                }}
              >
                Sign In
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
