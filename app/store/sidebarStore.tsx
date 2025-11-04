// store/sidebarStore.ts
import { create } from 'zustand';

interface SidebarState {
  showLeftSidebar: boolean;
  setShowLeftSidebar: (value: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  showLeftSidebar: false,
  setShowLeftSidebar: (value) => set({ showLeftSidebar: value }),
}));