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

export const getAuth = async ({
  token,
  userId,
}: {
  token: string;
  userId: number;
}) => {
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
      token,
    },
  });
};
