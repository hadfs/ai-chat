import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ChatPage from "./views/ChatPage"

const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <ChatPage />
    </QueryClientProvider>
  )
}

export default App
