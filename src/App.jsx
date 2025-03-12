
import Modal from "./components/utils/Modal"
import AppRouter from "./router"
import { ThemeProvider } from "@/components/theme/theme-provider"

function App() {
  return (
    <>
      <AppRouter />
      <Modal/>
    </>
  )
}

export default App

