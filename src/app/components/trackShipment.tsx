'use client';
import { useToastApi } from '@/hooks/useToastApi';
import { getShipmentInfo } from '@/services/api/graphql';
import {
  Badge,
  Button,
  Descriptions,
  DescriptionsProps,
  Flex,
  Form,
  Input,
  Modal,
  Space,
  Typography,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import dayjs from 'dayjs';
import { useState } from 'react';

const TrackShipment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState<string>();
  const [trackingData, setTrackingData] = useState<any>();

  const toast = useToastApi();

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'SenderName',
      children: trackingData?.senderName,
      span: 24,
    },
    {
      key: '2',
      label: 'Sender Address',
      children: trackingData?.senderAddress,
      span: 24,
    },
    {
      key: '3',
      label: 'Recipient Name',
      children: trackingData?.recipientName,
      span: 24,
    },
    {
      key: '4',
      label: 'Recipient Address',
      children: trackingData?.recipientAddress,
      span: 24,
    },
    {
      key: '5',
      label: 'Shipment Date',
      children: dayjs(parseInt(trackingData?.shipmentDate)).toString(),
      span: 24,
    },
    {
      key: '6',
      label: 'Expected Delivery Date',
      children: dayjs(parseInt(trackingData?.expectedDeliveryDate)).toString(),
      span: 24,
    },
    {
      key: '7',
      label: 'Shipment Status',
      children: (
        <Badge status='processing' text={trackingData?.shipmentStatus} />
      ),
      span: 24,
    },
    {
      key: '8',
      label: 'Shipping Method',
      children: trackingData?.shippingMethod,
      span: 24,
    },
    {
      key: '9',
      label: 'Status History',
      children: (
        <>
          {trackingData?.statusHistory.map((history: any) => (
            <>
              {dayjs(parseInt(history.updatedAt)).toString()}: {history.status}
              <br />
            </>
          ))}
        </>
      ),
      span: 24,
    },
  ];

  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const result = await getShipmentInfo(trackingNumber as string);
      setIsLoading(false);
      setTrackingData(result.data?.getShipment);
      toast.open({
        key: 'shipmentData',
        type: 'success',
        content: 'Shipment Info fetched successfully',
        duration: 2,
      });
      setIsModalOpen(true);
      form.resetFields();
    } catch (error) {
      if (error instanceof Error) {
        toast.open({
          key: 'shipmentData',
          type: 'error',
          content: error.message,
          duration: 2,
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <Flex
      style={{
        backgroundColor: 'lightblue',
        padding: '20px',
        borderRadius: '10px',
        width: '100%',
        minHeight: '80vh',
      }}
      align='center'
      justify='center'
      vertical
      gap={10}
    >
      <Typography.Title>Welcome to Courier Service App</Typography.Title>
      <Typography.Text>
        You can track your shipment by entering tracking code in the following
        field
      </Typography.Text>
      <Flex style={{ maxWidth: '30vw' }}>
        <Form
          form={form}
          style={{ width: '100%' }}
          layout='horizontal'
          onFinish={handleSubmit}
        >
          <Space.Compact style={{ width: '100%' }}>
            <FormItem
              name='trackingNumber'
              rules={[
                { required: true, message: 'Tracking Number is required' },
              ]}
            >
              <Input
                placeholder='Enter tracking number'
                allowClear
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </FormItem>
            <FormItem>
              <Button loading={isLoading} type='primary' htmlType='submit'>
                Check
              </Button>
            </FormItem>
          </Space.Compact>
        </Form>
        <Modal
          title={
            trackingNumber
              ? trackingNumber + ' | Shipment Details'
              : 'Shipment Details'
          }
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setTrackingData(undefined);
          }}
          footer={false}
        >
          <Descriptions bordered items={items} />
        </Modal>
      </Flex>
    </Flex>
  );
};

export default TrackShipment;
