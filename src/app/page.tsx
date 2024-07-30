'use client';
import { Layout } from 'antd';
import TrackShipment from './components/TrackShipment';

const { Content } = Layout;

const Home = () => {
  return (
    <Content
      style={{ padding: '0 48px', display: 'flex', alignItems: 'center' }}
    >
      <TrackShipment />
    </Content>
  );
};

export default Home;
