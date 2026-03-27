import { apiClient } from './client';
import type {
  CreateWorkOrderInput,
  UpdateWorkOrderInput,
  WorkOrderQuery,
} from '@gate-access/types/maintenance';

export const maintenanceApi = {
  /**
   * List work orders with filtering.
   */
  listWorkOrders: (query?: WorkOrderQuery) => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const queryString = params.toString();
    return apiClient.get(`/maintenance/work-orders${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get a single work order by ID.
   */
  getWorkOrder: (id: string) => {
    return apiClient.get(`/maintenance/work-orders/${id}`);
  },

  /**
   * Create a new work order.
   */
  createWorkOrder: (data: CreateWorkOrderInput) => {
    return apiClient.post('/maintenance/work-orders', data);
  },

  /**
   * Update an existing work order.
   */
  updateWorkOrder: (id: string, data: UpdateWorkOrderInput) => {
    return apiClient.patch(`/maintenance/work-orders/${id}`, data);
  },

  /**
   * Soft-delete a work order.
   */
  deleteWorkOrder: (id: string) => {
    return apiClient.delete(`/maintenance/work-orders/${id}`);
  },
};
