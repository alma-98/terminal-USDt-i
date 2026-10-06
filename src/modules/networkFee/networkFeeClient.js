export async function getAdminNetworkFee(transactionId) {
  const response = await fetch(
    `/api/network-fee/${encodeURIComponent(transactionId)}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Tidak dapat mengambil Fee Jaringan.');
  }

  /*
   * Expected Admin response:
   *
   * {
   *   label: "Fee Jaringan",
   *   value: "80%"
   * }
   *
   * Recipient tidak boleh ada di response Admin.
   */
  return response.json();
}
