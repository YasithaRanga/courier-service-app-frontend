'use client';

import {
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
  Flex,
  Form,
  Input,
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
  const [selectedRecord, setSelectedRecord] = useState<number>();

  const [form] = useForm();

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

  const dataSource = shipments.map((shipment: FieldType, index) => ({
    key: index,
    id: shipment.id,
    senderName: shipment.senderName,
    senderAddress: shipment.senderAddress,
    recipientName: shipment.recipientName,
    recipientAddress: shipment.recipientAddress,
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
            <Button type='primary' icon={<PlusOutlined />}>
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
    </Content>
  );
};

export default Dashboard;
