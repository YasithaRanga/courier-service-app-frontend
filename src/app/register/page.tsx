'use client';
import { useToastApi } from '@/hooks/useToastApi';
import { registerUser } from '@/services/api/graphql';
import { Button, Flex, Form, Input, Typography } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import Password from 'antd/es/input/Password';
import { Content } from 'antd/es/layout/layout';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';
import Link from 'next/link';
import { useState } from 'react';

type FieldType = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToastApi();
  const [form] = Form.useForm();

  const submitForm = async (formData: FieldType) => {
    try {
      setIsLoading(true);
      if (formData.password !== formData.confirmPassword)
        throw new Error("Password doesn't match");
      await registerUser(
        formData.name as string,
        formData.email as string,
        formData.password as string,
        formData.address as string
      );
      toast.open({
        key: 'register',
        type: 'success',
        content: 'User registered successfully',
        duration: 2,
      });
      setIsLoading(false);
      form.resetFields();
    } catch (error) {
      if (error instanceof Error)
        toast.open({
          key: 'register',
          type: 'error',
          content: error.message,
          duration: 2,
        });

      setIsLoading(false);
    }
  };

  const validatePassword = (_: any, value: string) => {
    if (!value || form.getFieldValue('password') === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Password doesn't match"));
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
        <Title>Register</Title>
        <Form
          layout='vertical'
          style={{ width: '100%' }}
          onFinish={submitForm}
          form={form}
        >
          <FormItem<FieldType>
            label='Name'
            name='name'
            rules={[{ required: true, message: 'Please input your name' }]}
          >
            <Input placeholder='Enter name' />
          </FormItem>

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

          <FormItem<FieldType>
            label='Confirm Password'
            name='confirmPassword'
            rules={[
              { required: true, message: 'Please input your password again' },
              { validator: validatePassword },
            ]}
          >
            <Password placeholder='Enter password' />
          </FormItem>

          <FormItem<FieldType>
            label='Address'
            name='address'
            rules={[{ required: true, message: 'Please input your address' }]}
          >
            <Input placeholder='Enter address' />
          </FormItem>
          <FormItem style={{ textAlign: 'center' }}>
            <Button type='primary' htmlType='submit' loading={isLoading}>
              Submit
            </Button>
          </FormItem>
        </Form>

        <Paragraph>
          Already have an account? <Link href='/login'>Login now</Link>
        </Paragraph>
      </Flex>
    </Content>
  );
};
export default Login;
