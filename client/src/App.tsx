import { ThemeProvider } from './components/theme-provider'
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom'
import Home from './pages/home/page'
import ChatRoom from './pages/chatroom/page'
import Auth from './pages/auth/page'
import axios from 'axios'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import useStore from './context/store'
import NoChatRoom from './pages/chatroom/NoChatRoom'


const login = async ({ request }: { request: Request }) => {
  if (request.method !== 'POST') return redirect('/');
  const formData = await request.formData();

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URI}/users/login`, {
      email: formData.get("email"),
      password: formData.get("password")
    });
    localStorage.setItem("userInfo", JSON.stringify(response.data));
    console.log(response.data);
    toast.success("Logged in successfully")
    return redirect("/chats");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message ?? "Something went wrong")
    } else {
      toast.error("Something went wrong")
    }
  }
  return null;
}
const signup = async ({ request }: { request: Request }) => {
  if (request.method !== 'POST') return redirect('/');
  const formData = await request.formData();
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URI}/users/`, {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password")
    });
    localStorage.setItem("userInfo", JSON.stringify(response.data));
    return redirect("/chats");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message ?? "Something went wrong")
    } else {
      toast.error("Something went wrong")
    }
  }
  return null;
}

const AuthLoader = async () => {
  useStore.setState({ userInfo: JSON.parse(localStorage.getItem("userInfo") ?? "null") })
  if (localStorage.getItem("userInfo")) {
    console.log("auth");
    return redirect("/chats")
  }
  return null;
}



const router = createBrowserRouter([
  {
    path: '/',
    element: <Auth />,
    loader: AuthLoader,
    children: [
      {
        path: 'login',
        action: login
      },
      {
        path: 'signup',
        action: signup
      }
    ]
  },
  {
    path: '/chats',
    element: <Home />,
    loader: async () => {
      useStore.setState({ userInfo: JSON.parse(localStorage.getItem("userInfo") ?? "null") })
      if (!localStorage.getItem("userInfo")) {
        return redirect("/")
      }
      return null;
    },
    children: [
      {
        index: true,
        element: <NoChatRoom />
      },
      {
        path: ':id',
        element: <ChatRoom />,
      }
    ]
  }
])


function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster closeButton={true} visibleToasts={5} richColors={true} position='top-right' />
    </ThemeProvider>
  )
}

export default App
