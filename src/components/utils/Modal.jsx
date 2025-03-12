import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import useModalStore from "@/store/useModalStore";

function Modal() {
	const { isOpen, Content, closeModal, title, description } = useModalStore();

	return (
		<>
			<Dialog open={isOpen} onOpenChange={closeModal}>
				<DialogContent>
					{title && (
						<DialogHeader>
							<DialogTitle>{title}</DialogTitle>
						</DialogHeader>
					)}

					{description && <DialogDescription>{description}</DialogDescription>}
                    
					{/* Render dynamic content */}
					{<Content />}
				</DialogContent>
			</Dialog>
		</>
	);
}

export default Modal;
