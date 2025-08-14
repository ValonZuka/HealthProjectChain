import apiClient from "./apiClient";

// Get TAR by receiptID
export async function getTARByReceipt(receiptID: string) {
  const baseUrl = "https://registryapi-dev.azurewebsites.net/api/v1/TAR";

  // Step 1: get TAR reference from receipt
  const receiptRes = await fetch(`${baseUrl}/receipt/${receiptID}`, {
    headers: {
      "Content-Type": "application/json",
      "x-session-key": "hXL5iocF99"
    }
  });

  if (!receiptRes.ok) {
    throw new Error(`Failed to fetch TAR for receipt ${receiptID}`);
  }

  const receiptData = await receiptRes.json();

  // The backend might call it id or tarID
  const tarID = receiptData?.tarID || receiptData?.id;
  if (!tarID) {
    throw new Error(`No TAR ID found for receipt ${receiptID}`);
  }

  // Step 2: fetch the full TAR object
  const tarRes = await fetch(`${baseUrl}/${tarID}`, {
    headers: {
      "Content-Type": "application/json",
      "x-session-key": "hXL5iocF99"
    }
  });

  if (!tarRes.ok) {
    throw new Error(`Failed to fetch TAR by ID ${tarID}`);
  }

  return await tarRes.json();
}


// Update TAR by ID
export const updateTAR = async (id: string, payload: any) => {
  const { data } = await apiClient.put(`/TAR/${id}`, payload); // add /receipt/
  return { data };
};


// Delete TAR by ID
export async function deleteTAR(id: string) {
  const { data } = await apiClient.delete(`/TAR/${id}`);
  return data;
}
