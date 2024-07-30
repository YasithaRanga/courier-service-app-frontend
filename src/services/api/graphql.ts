import { getToken } from '@/app/context/AuthContext';
import { initializeApollo } from '@/lib/apollo';
import { gql } from '@apollo/client';
const client = initializeApollo();

export const getShipmentInfo = async (trackingNumber: string) => {
  return await client.query({
    query: gql`
      query ShipmentInfo($trackingNumber: String!) {
        getShipment(trackingNumber: $trackingNumber) {
          senderName
          senderAddress
          recipientName
          recipientAddress
          shipmentDate
          expectedDeliveryDate
          shipmentStatus
          shippingMethod
          statusHistory {
            status
            updatedAt
          }
        }
      }
    `,
    variables: {
      trackingNumber,
    },
  });
};

export const loginUser = async (email: string, password: string) => {
  return await client.query({
    query: gql`
      query Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          userId
          token
          tokenExpiration
          role
        }
      }
    `,
    variables: {
      email,
      password,
    },
  });
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  address: string
) => {
  return await client.mutate({
    mutation: gql`
      mutation CreateUser(
        $name: String!
        $email: String!
        $password: String!
        $address: String!
      ) {
        createUser(
          userInput: {
            name: $name
            email: $email
            password: $password
            address: $address
          }
        ) {
          id
          name
          email
          address
          createdAt
          role {
            name
          }
        }
      }
    `,
    variables: {
      name: name,
      email: email,
      password: password,
      address: address,
    },
  });
};

export const getAuth = async (userId: number) => {
  return await client.query({
    query: gql`
      query GetAuth($userId: Int!) {
        getAuth(userId: $userId) {
          name
          email
          role {
            id
          }
        }
      }
    `,
    variables: {
      userId,
      token: getToken(),
    },
  });
};

export const getShipmentsByUser = async (userId: number | undefined) => {
  return await client.query({
    query: gql`
      query GetShipmentsByUser($userId: Int!) {
        getShipmentsByUser(userId: $userId) {
          id
          senderName
          senderAddress
          recipientName
          recipientAddress
          packageDescription
          packageDimensions
          expectedDeliveryDate
          shipmentStatus
          trackingNumber
          shippingMethod
          insuranceValue
          specialInstructions
          shipmentCost
          paymentMethod
        }
      }
    `,
    variables: {
      userId,
      token: getToken(),
    },
  });
};

export const getShipments = async () => {
  console.log('working');

  return await client.query({
    query: gql`
      query {
        getShipments {
          id
          senderName
          senderAddress
          recipientName
          recipientAddress
          packageDescription
          packageDimensions
          expectedDeliveryDate
          shipmentStatus
          trackingNumber
          shippingMethod
          insuranceValue
          specialInstructions
          shipmentCost
          paymentMethod
        }
      }
    `,
    variables: {
      token: getToken(),
    },
  });
};

export const deleteShipment = async (id: number) => {
  return await client.mutate({
    mutation: gql`
      mutation DeleteShipment($id: Int!) {
        deleteShipment(id: $id) {
          id
          shipmentStatus
          trackingNumber
        }
      }
    `,
    variables: {
      id,
      token: getToken(),
    },
  });
};

export const updateShipmentStatus = async ({
  id,
  status,
}: {
  id: number;
  status: string;
}) => {
  return await client.mutate({
    mutation: gql`
      mutation UpdateShipmentStatus($id: ID!, $status: String!) {
        updateShipmentStatus(
          statusUpdateInput: { shipmentId: $id, status: $status }
        ) {
          id
          shipmentStatus
          statusHistory {
            id
            status
            updatedAt
          }
        }
      }
    `,
    variables: {
      id,
      status,
      token: getToken(),
    },
  });
};
