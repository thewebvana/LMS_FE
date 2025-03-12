
import Modal from "./components/utils/Modal"
import AppRouter from "./router"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "@/components/ui/sonner"


function App() {
  return (
    <>
      <AppRouter />
      <Modal/>
      <Toaster/>
      
    </>
  )
}

export default App

