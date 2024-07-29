'use client';
import { useToastApi } from '@/hooks/useToastApi';
import { Button, Flex, Form, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import Password from 'antd/es/input/Password';
import { Content } from 'antd/es/layout/layout';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/authContext';

type FieldType = {
  email?: string;
  password?: string;
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToastApi();
  const [form] = Form.useForm();

  const { login } = useAuth();

  const submitForm = async (formData: FieldType) => {
    try {
      setIsLoading(true);
      await login(formData.email as string, formData.password as string);
      toast.open({
        key: 'login',
        type: 'success',
        content: 'Logged in successfully',
        duration: 2,
      });
      setIsLoading(false);
      form.resetFields();
    } catch (error) {
      if (error instanceof Error)
        toast.open({
          key: 'login',
          type: 'error',
          content: error.message,
          duration: 2,
        });
      setIsLoading(false);
    }
  };
  return (
    <Content
      style={{
        padding: '0 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Flex
        vertical
        align='center'
        justify='center'
        style={{ minWidth: '30vw' }}
      >
        <Title>Login</Title>
        <Form
          layout='vertical'
          style={{ width: '100%' }}
          onFinish={submitForm}
          form={form}
        >
          <FormItem<FieldType>
            label='Email'
            name='email'
            rules={[{ required: true, message: 'Please input your email' }]}
          >
            <Input placeholder='Enter email' />
          </FormItem>

          <FormItem<FieldType>
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Please input your password' }]}
          >
            <Password placeholder='Enter password' />
          </FormItem>
          <FormItem style={{ textAlign: 'center' }}>
            <Button type='primary' htmlType='submit' loading={isLoading}>
              Submit
            </Button>
          </FormItem>
        </Form>

        <Paragraph>
          Don&apos;t have an account? <Link href='/register'>Register now</Link>
        </Paragraph>
      </Flex>
    </Content>
  );
};
export default Login;
