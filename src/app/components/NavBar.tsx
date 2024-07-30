import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { Header } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';

const NavBar = () => {
  const { user, logout } = useAuth();
  const path = usePathname();
  let items: MenuProps['items'] = [];
  if (user) {
    items = [
      {
        key: '/',
        label: <Link href='/'>Home</Link>,
      },
      {
        key: '/dashboard',
        label: user ? <Link href='/dashboard'>Dashboard</Link> : null,
      },
      {
        key: '/login',
        label: (
          <Link
            onClick={() => (user ? logout() : '')}
            href={user ? '' : '/login'}
          >
            {user ? 'Logout' : 'Login'}
          </Link>
        ),
      },
    ];
  } else {
    items = [
      {
        key: '/',
        label: <Link href='/'>Home</Link>,
      },
      {
        key: '/login',
        label: (
          <Link
            onClick={() => (user ? logout() : '')}
            href={user ? '' : '/login'}
          >
            {user ? 'Logout' : 'Login'}
          </Link>
        ),
      },
    ];
  }

  return (
    <Header style={{ display: 'flex', alignItems: 'center' }}>
      <Title style={{ margin: 0, color: 'white' }}>Courier Service App</Title>
      <Menu
        theme='dark'
        mode='horizontal'
        defaultSelectedKeys={[path]}
        items={items}
        style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }}
      />
    </Header>
  );
};
export default NavBar;
