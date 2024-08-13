import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Custom types for theme
interface State {
  defaultLocale: string;
  locales: string[];
  setDefaultLocale: (newVal: string) => void;
}

const useStore = create<State>()(
  persist(
    (set, get) => ({
      defaultLocale: get()?.defaultLocale ? get()?.defaultLocale : 'en',
      locales: ['en', 'zh', 'zh-Hant'],
      setDefaultLocale: (newVal) =>
        set((state: State) => ({
          defaultLocale: (state.defaultLocale = newVal),
        })),
    }),
    {
      name: 'storage',
      storage: createJSONStorage(() => sessionStorage), // default localstorage
    },
  ),
);

export default useStore;
