import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LayoutState {
    sidebarOpen: boolean;
    sidebarPinned: boolean;
    setSidebarOpen: (open: boolean) => void;
    setSidebarPinned: (pinned: boolean) => void;
    toggleSidebar: () => void;
    toggleSidebarPin: () => void;
}

export const useLayoutStore = create<LayoutState>()(
    persist(
        (set) => ({
            sidebarOpen: false,
            sidebarPinned: false,
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            setSidebarPinned: (pinned) => set((state) => ({
                sidebarPinned: pinned,
                sidebarOpen: pinned ? true : state.sidebarOpen
            })),
            toggleSidebar: () => set((state) => {
                if (state.sidebarPinned) return state;
                return { sidebarOpen: !state.sidebarOpen };
            }),
            toggleSidebarPin: () => set((state) => {
                const nextPinned = !state.sidebarPinned;
                return {
                    sidebarPinned: nextPinned,
                    sidebarOpen: nextPinned ? true : state.sidebarOpen
                };
            }),
        }),
        {
            name: 'layout-storage',
        }
    )
);
