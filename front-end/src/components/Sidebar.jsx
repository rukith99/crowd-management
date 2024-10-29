import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  UnorderedListOutlined,
  AppstoreOutlined,
  SettingOutlined, 
  LogoutOutlined
} from '@ant-design/icons';
import '../App.css';

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();

  return (
    <Sider
      width={240}
      style={{
        position: 'fixed',
        backgroundColor: '#2e2e2e',
        height: '100%',
        padding: '12px',
      }}
    >
      <div style={{ padding: '20px', textAlign: 'left', color: '#fff' }}>
        <h2>Event Safety</h2>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ 
          height: '75%',
          borderRight: 0,
          backgroundColor: '#2e2e2e',
        }}
        theme="dark"
      >
        <Menu.Item
          key="/event-list"
          icon={<UnorderedListOutlined style={{ color: '#fff', fontSize: '20px'}} />}
        >
          <Link to="/event-list" style={{ color: '#fff', fontSize: '16px' }}>Event List</Link>
        </Menu.Item>
        <Menu.Item
          key="/other-option"
          icon={<AppstoreOutlined style={{ color: '#fff', fontSize: '20px' }} />}
        >
          <Link to="/other-option" style={{ color: '#fff', fontSize: '16px' }}>Other Option</Link>
        </Menu.Item>
        <Menu.Item
          key="" 
          icon={<SettingOutlined style={{ color: '#fff', fontSize: '20px' }} />}
        >
          <Link to="" style={{ color: '#fff', fontSize: '16px' }}>Settings</Link>
        </Menu.Item>
      </Menu>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ 
          height: '25%',
          borderRight: 0,
          backgroundColor: '#2e2e2e',
        }}
        theme="dark"
      >
        <Menu.Item
          key=""
          icon={<LogoutOutlined style={{ color: '#fff', fontSize: '20px' }} />}
        >
          <Link to="" style={{ color: '#fff', fontSize: '16px' }}>Sign Out</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
