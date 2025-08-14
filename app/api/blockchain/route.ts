import axios from 'axios';

const blockchainApi = axios.create({
  baseURL: 'https://registryapi-dev.azurewebsites.net',
  headers: {
    'Authorization': 'Bearer hXL5iocF99',
    'Content-Type': 'application/json'
  }
});

export const fetchRecords = async (userId: string, role: string) => {
  try {
    const response = await blockchainApi.get('/records', {
      params: { userId, role }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch records:', error);
    throw error;
  }
};

export const createRecord = async (recordData: any, creatorRole: string) => {
  try {
    const response = await blockchainApi.post('/records', {
      ...recordData,
      creatorRole,
      timestamp: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create record:', error);
    throw error;
  }
};

export const searchRecords = async (recordId: string) => {
  try {
    const response = await blockchainApi.get(`/records/${recordId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to search records:', error);
    throw error;
  }
};