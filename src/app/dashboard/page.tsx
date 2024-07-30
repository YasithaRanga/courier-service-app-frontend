'use client';

import {
  createShipment,
  deleteShipment,
  getShipments,
  getShipmentsByUser,
  updateShipmentStatus,
} from '@/services/api/graphql';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Table,
  TableColumnsType,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useToastApi } from '@/hooks/useToastApi';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';

type FieldType = {
  key: number;
  id: number;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  packageWeight: string;
  packageDescription: string;
  packageDimensions: string;
  expectedDeliveryDate: string;
  shipmentStatus: string;
  trackingNumber: string;
  shippingMethod: string;
  insuranceValue: string;
  specialInstructions: string;
  shipmentCost: string;
  paymentMethod: string;
};

export type CreateShipmentType = {
  recipientName: string;
  recipientAddress: string;
  packageWeight: number;
  packageDescription: string;
  packageDimensions: string;
  expectedDeliveryDate: string;
  shipmentStatus: string;
  trackingNumber: string;
  shippingMethod: string;
  insuranceValue: number;
  specialInstructions?: string;
  shipmentCost: number;
  paymentMethod: string;
};

type FormData = {
  shipmentStatus: string;
};

const Dashboard = () => {
  const toast = useToastApi();
  const router = useRouter();
  const { user } = useAuth();

  if (!user) router.push('/login');
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isCreateOpenModal, setIsCreateOpenModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<number>();

  const [form] = useForm();
  const [createform] = useForm();

  const fetchData = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      setIsLoading(true);
      const response =
        user && parseInt(user.role) === 1
          ? await getShipmentsByUser(parseInt(user.userId))
          : await getShipments();
      setShipments(
        user && parseInt(user.role) === 1
          ? response.data.getShipmentsByUser
          : response.data.getShipments
      );
    } catch (error) {
      console.error('Failed to fetch shipments', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, router]);

  const deleteRow = async (value: number) => {
    try {
      const result = await deleteShipment(value);
      if (result) {
        toast.open({
          key: 'deleteShipment',
          type: 'success',
          content: 'Shipment deleted successfully',
          duration: 2,
        });
        window.location.reload();
      }
    } catch (error) {
      if (error instanceof Error)
        toast.open({
          key: 'deleteShipment',
          type: 'error',
          content: error.message,
          duration: 2,
        });
    }
  };

  const updateStatus = async (formData: FormData) => {
    if (formData && selectedRecord) {
      try {
        const result = await updateShipmentStatus({
          id: selectedRecord,
          status: formData.shipmentStatus,
        });
        if (result)
          toast.open({
            key: 'updateShipment',
            type: 'success',
            content: 'Shipment status updated successfully',
            duration: 2,
          });
        form.resetFields();
        window.location.reload();
      } catch (error) {
        if (error instanceof Error)
          toast.open({
            key: 'updateShipment',
            type: 'error',
            content: 'Shipment update failed',
            duration: 2,
          });
      }
    }
  };

  const createShipmentSubmit = async (formData: CreateShipmentType) => {
    if (formData) {
      try {
        const result = await createShipment(formData);
        if (result)
          toast.open({
            key: 'createShipment',
            type: 'success',
            content: 'Shipment status created successfully',
            duration: 2,
          });
        createform.resetFields();
        window.location.reload();
      } catch (error) {
        if (error instanceof Error)
          toast.open({
            key: 'createShipment',
            type: 'error',
            content: 'Shipment creation failed',
            duration: 2,
          });
      }
    }
  };

  const dataSource = shipments.map((shipment: FieldType, index) => ({
    key: index,
    id: shipment.id,
    senderName: shipment.senderName,
    senderAddress: shipment.senderAddress,
    recipientName: shipment.recipientName,
    recipientAddress: shipment.recipientAddress,
    packageWeight: shipment.packageWeight,
    packageDescription: shipment.packageDescription,
    packageDimensions: shipment.packageDimensions,
    expectedDeliveryDate: shipment.expectedDeliveryDate,
    shipmentStatus: shipment.shipmentStatus,
    trackingNumber: shipment.trackingNumber,
    shippingMethod: shipment.shippingMethod,
    insuranceValue: shipment.insuranceValue,
    specialInstructions: shipment.specialInstructions,
    shipmentCost: shipment.shipmentCost,
    paymentMethod: shipment.paymentMethod,
    actions: shipment.id,
  }));

  const columns: TableColumnsType = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Sender Name',
      dataIndex: 'senderName',
      key: 'senderName',
      width: 150,
    },
    {
      title: 'Sender Address',
      dataIndex: 'senderAddress',
      key: 'senderAddress',
      width: 250,
    },
    {
      title: 'Recipient Name',
      dataIndex: 'recipientName',
      key: 'recipientName',
      width: 150,
    },
    {
      title: 'Recipient Address',
      dataIndex: 'recipientAddress',
      key: 'recipientAddress',
      width: 250,
    },
    {
      title: 'Package Weight(kg)',
      dataIndex: 'packageWeight',
      key: 'packageWeight',
      width: 150,
    },
    {
      title: 'Package Description',
      dataIndex: 'packageDescription',
      key: 'packageDescription',
      width: 150,
    },
    {
      title: 'Package Dimensions',
      dataIndex: 'packageDimensions',
      key: 'packageDimensions',
      width: 150,
    },
    {
      title: 'Expected Delivery Date',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      width: 150,
      render(value) {
        return dayjs(parseInt(value)).toString();
      },
    },
    {
      title: 'Shipment Status',
      dataIndex: 'shipmentStatus',
      key: 'shipmentStatus',
      width: 150,
    },
    {
      title: 'Tracking Number',
      dataIndex: 'trackingNumber',
      key: 'trackingNumber',
      width: 150,
    },
    {
      title: 'Shipping Method',
      dataIndex: 'shippingMethod',
      key: 'shippingMethod',
      width: 150,
    },
    {
      title: 'Insurance Value',
      dataIndex: 'insuranceValue',
      key: 'insuranceValue',
      width: 150,
    },
    {
      title: 'Special Instructions',
      dataIndex: 'specialInstructions',
      key: 'specialInstructions',
      width: 150,
    },
    {
      title: 'Shipment Cost',
      dataIndex: 'shipmentCost',
      key: 'shipmentCost',
      width: 150,
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 150,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render(value) {
        return (
          <Flex gap={10}>
            {user ? (
              parseInt(user?.role) === 1 ? (
                <Button
                  onClick={() => deleteRow(parseInt(value))}
                  icon={<DeleteOutlined />}
                ></Button>
              ) : (
                ''
              )
            ) : (
              ''
            )}
            <Button
              onClick={() => {
                setIsOpenModal(true);
                setSelectedRecord(parseInt(value));
              }}
              icon={<EditOutlined />}
            ></Button>
          </Flex>
        );
      },
    },
  ];

  return (
    <Content>
      <Flex justify='end' style={{ margin: 20 }} gap={10}>
        {user ? (
          parseInt(user?.role) === 1 ? (
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => setIsCreateOpenModal(true)}
            >
              Create Shipment
            </Button>
          ) : (
            ''
          )
        ) : (
          ''
        )}
        <Button
          icon={<ReloadOutlined />}
          onClick={() => window.location.reload()}
        ></Button>
      </Flex>
      <Table
        style={{ margin: '0 20px 20px 20px' }}
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: 1500, y: 300 }}
      />
      <Modal
        title={'Update Shipment'}
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        footer={false}
      >
        <Form form={form} layout='vertical' onFinish={updateStatus}>
          <FormItem
            label='Shipment Status'
            name={'shipmentStatus'}
            rules={[{ required: true, message: 'Shipment Status is required' }]}
          >
            <Input placeholder='Shipment Status' />
          </FormItem>
          <Flex gap={10} justify='end'>
            <FormItem style={{ margin: 0 }}>
              <Button htmlType='reset'>Cancel</Button>
            </FormItem>
            <FormItem style={{ margin: 0 }}>
              <Button type='primary' htmlType='submit'>
                Update
              </Button>
            </FormItem>
          </Flex>
        </Form>
      </Modal>
      <Modal
        title={'Create a Shipment'}
        open={isCreateOpenModal}
        onCancel={() => setIsCreateOpenModal(false)}
        footer={false}
      >
        <Form
          form={createform}
          layout='vertical'
          onFinish={createShipmentSubmit}
        >
          <FormItem
            label='Recipient Name'
            name={'recipientName'}
            rules={[{ required: true, message: 'Recipient Name is required' }]}
          >
            <Input placeholder='Recipient Name' />
          </FormItem>

          <FormItem
            label='Recipient Address'
            name={'recipientAddress'}
            rules={[
              { required: true, message: 'Recipient Address is required' },
            ]}
          >
            <Input placeholder='Recipient Address' />
          </FormItem>

          <FormItem
            label='Package Weight'
            name={'packageWeight'}
            rules={[
              { required: true, message: 'Package Weight is required' },
              { type: 'number', message: 'Package Weight should be numerical' },
            ]}
          >
            <InputNumber
              placeholder='Package Weight'
              style={{ width: '100%' }}
            />
          </FormItem>

          <FormItem
            label='Package Description'
            name={'packageDescription'}
            rules={[
              { required: true, message: 'Package Description is required' },
            ]}
          >
            <Input placeholder='Package Description' />
          </FormItem>

          <FormItem
            label='Package Dimensions'
            name={'packageDimensions'}
            rules={[
              { required: true, message: 'Package Dimensions is required' },
            ]}
          >
            <Input placeholder='Package Dimensions' />
          </FormItem>

          <FormItem
            label='Expected Delivery Date'
            name={'expectedDeliveryDate'}
            rules={[
              { required: true, message: 'Expected Delivery Date is required' },
            ]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder='Expected Delivery Date'
            />
          </FormItem>

          <FormItem
            label='Shipment Status'
            name={'shipmentStatus'}
            rules={[{ required: true, message: 'Shipment Status is required' }]}
          >
            <Input placeholder='Shipment Status' />
          </FormItem>

          <FormItem
            label='Tracking Number'
            name={'trackingNumber'}
            rules={[{ required: true, message: 'Tracking Number is required' }]}
          >
            <Input placeholder='Tracking Number' />
          </FormItem>

          <FormItem
            label='Shipping Method'
            name={'shippingMethod'}
            rules={[{ required: true, message: 'Shipping Method is required' }]}
          >
            <Input placeholder='Shipping Method' />
          </FormItem>

          <FormItem
            label='Insurance Value'
            name={'insuranceValue'}
            rules={[
              { required: true, message: 'Insurance Value is required' },
              {
                type: 'number',
                message: 'Insurance Value should be numerical',
              },
            ]}
          >
            <InputNumber
              placeholder='Insurance Value'
              style={{ width: '100%' }}
            />
          </FormItem>

          <FormItem label='Special Instructions' name={'specialInstructions'}>
            <Input placeholder='Special Instructions' />
          </FormItem>

          <FormItem
            label='Shipment Cost'
            name={'shipmentCost'}
            rules={[
              { required: true, message: 'Shipment Cost is required' },
              { type: 'number', message: 'Shipment Cost should be numerical' },
            ]}
          >
            <InputNumber
              placeholder='Shipment Cost'
              style={{ width: '100%' }}
            />
          </FormItem>

          <FormItem
            label='Payment Method'
            name={'paymentMethod'}
            rules={[{ required: true, message: 'Payment Method is required' }]}
          >
            <Input placeholder='Payment Method' />
          </FormItem>

          <Flex gap={10} justify='end'>
            <FormItem style={{ margin: 0 }}>
              <Button htmlType='reset'>Cancel</Button>
            </FormItem>
            <FormItem style={{ margin: 0 }}>
              <Button type='primary' htmlType='submit'>
                Create
              </Button>
            </FormItem>
          </Flex>
        </Form>
      </Modal>
    </Content>
  );
};

export default Dashboard;
