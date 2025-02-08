import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom"
import { Recommend } from "./pages/Recommend"
import { Playlist } from "./pages/Playlist"
import { StrictMode } from "react"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Recommend />} />
      <Route path="playlist/:id" element={<Playlist />} />
    </Route>
  )
)
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <RouterProvider router={router} />
  // </StrictMode>
)
