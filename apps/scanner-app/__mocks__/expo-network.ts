export const getNetworkStateAsync = jest.fn(() => 
  Promise.resolve({ isConnected: true, isInternetReachable: true })
);

export default { getNetworkStateAsync };
