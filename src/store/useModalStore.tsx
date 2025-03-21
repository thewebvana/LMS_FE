import React from "react";
import { create } from "zustand";

const useModalStore = create((set) => ({
	isOpen: false,
	title: null,
	description: null,
	Content: "",

	openModal: ({ Component, title="", description=""}) =>
		set({ isOpen: true, Content: () => <Component />, title, description }),

	closeModal: () => set({ isOpen: false, content: null,  title : "", description: "" }),
}));

export default useModalStore;
