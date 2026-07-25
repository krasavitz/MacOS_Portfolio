import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { locations } from "#constants/index.js";

const DEFAULT_LOCATION = locations.work;

const useLocationStore = create(immer((set) => ({
    activeLocation: DEFAULT_LOCATION,
    // Breadcrumb trail from the current root down to activeLocation.
    path: [DEFAULT_LOCATION],

    // Jump to a location from the sidebar — starts a fresh breadcrumb.
    setActiveLocation: (location = null) =>
        set((state) => {
            if (!location) return;
            state.activeLocation = location;
            state.path = [location];
        }),

    // Drill into a subfolder from the content area — extends the breadcrumb.
    openFolder: (folder) =>
        set((state) => {
            if (!folder) return;
            state.activeLocation = folder;
            state.path.push(folder);
        }),

    // Up one level.
    goBack: () =>
        set((state) => {
            if (state.path.length <= 1) return;
            state.path.pop();
            state.activeLocation = state.path[state.path.length - 1];
        }),

    // Jump to a specific crumb.
    goToCrumb: (index) =>
        set((state) => {
            if (index < 0 || index >= state.path.length) return;
            state.path = state.path.slice(0, index + 1);
            state.activeLocation = state.path[index];
        }),

    resetActiveLocation: () =>
        set((state) => {
            state.activeLocation = DEFAULT_LOCATION;
            state.path = [DEFAULT_LOCATION];
        }),
    })),
);

export default useLocationStore;
