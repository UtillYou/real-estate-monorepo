import axios from 'axios';

export interface Feature {
  id: number;
  name: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export const getFeatures = async (search = ''): Promise<Feature[]> => {
  const { data } = await axios.get('/api/features', { params: { search } });
  return data;
};

export const getFeature = async (id: number): Promise<Feature> => {
  const { data } = await axios.get(`/api/features/${id}`);
  return data;
};

export const createFeature = async (values: Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>): Promise<Feature> => {
  const { data } = await axios.post('/api/features', values);
  return data;
};

export const updateFeature = async (id: number, values: Partial<Feature>): Promise<Feature> => {
  const { data } = await axios.patch(`/api/features/${id}`, values);
  return data;
};

export const deleteFeature = async (id: number): Promise<void> => {
  await axios.delete(`/api/features/${id}`);
};
