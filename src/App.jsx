import Modal from "./components/utils/Modal";
import { Toaster } from "@/components/shadcn/ui/sonner";
import AppRouter from "./router";
import { ThemeProvider } from "@/components/shadcn/theme/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<AppRouter />
			</QueryClientProvider>
		</>
	);
}

export default App;
