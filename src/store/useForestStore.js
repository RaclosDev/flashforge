import { create } from 'zustand';
import { forestApi } from '../services/api';

const useForestStore = create((set, get) => ({
  forest: null,
  availableSpecies: [],
  loading: false,
  error: null,

  fetchForest: async () => {
    set({ loading: true, error: null });
    try {
      const data = await forestApi.getForest();
      set({ forest: data, loading: false });
    } catch (err) {
      console.error('Error fetching forest:', err);
      set({ error: err.message, loading: false });
    }
  },

  fetchAvailableSpecies: async () => {
    try {
      const data = await forestApi.getAvailableSpecies();
      set({ availableSpecies: data });
    } catch (err) {
      console.error('Error fetching available species:', err);
    }
  },

  plantSeed: async (speciesId) => {
    try {
      await forestApi.plant(speciesId);
      // Refresh forest state to get new plant and reduced seeds
      await get().fetchForest();
    } catch (err) {
      console.error('Error planting seed:', err);
      throw err;
    }
  }
}));

export default useForestStore;
