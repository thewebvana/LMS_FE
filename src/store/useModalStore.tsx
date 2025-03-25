import React from "react";
import { create } from "zustand";

const useModalStore = create((set) => ({
	isOpen: false,
	title: "",
	description: "",
	props: {},
	Content: "",

	openModal: ({ Component, props = {}, title = "", description = "" }) =>
		set({
			isOpen: true,
			Content: () => <Component {...props}/>, 
			title,
			description,
		}),

	closeModal: () =>
		set({ isOpen: false, title: "", description: "", props: {} }),
}));

export default useModalStore;
