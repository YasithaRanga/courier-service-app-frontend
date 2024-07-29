import { Button, Flex } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import Link from 'next/link';

const NotFound = () => {
  return (
    <Content
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Flex vertical align='center' justify='center'>
        <Title>Hmmm! Page Not Found</Title>
        <Link href={'/'}>
          <Button type='primary'>Go to Home</Button>
        </Link>
      </Flex>
    </Content>
  );
};

export default NotFound;
