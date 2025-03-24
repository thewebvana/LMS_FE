import React from "react";
import { create } from "zustand";

const useModalStore = create((set) => ({
	isOpen: false,
	title: "",
	description: "",
	props: null,
	Content: null,

	openModal: ({ Component, props = {}, title = "", description = "" }) =>
		set({
			isOpen: true,
			Content: () => <Component {...props} />, 
			title,
			description,
		}),

	closeModal: () =>
		set({ isOpen: false, Content: null, title: "", description: "" }),
}));

export default useModalStore;
