import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import WriteBlogPage from "./pages/Blog/WriteBlogPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthorDashboard from "./pages/AuthorDashboard";
import AuthPage from "./pages/auth/AuthPage";
import { Role } from "./types/authtype";
import { useEffect } from "react";
import { socket } from "./socket/socket";
import BloglistPage from "./pages/Blog/BloglistPage";
import BlogPage from "./pages/Blog/BlogPage";

export default function App() {

  useEffect(() => {
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [])
  
  return (
    <div>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole={[Role.AUTHOR]}>
                <AuthorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/blogs" element={<BloglistPage />} />
          <Route path="/blog/:id" element={<BlogPage />} />
          <Route
            path="/blog/publish"
            element={
              <ProtectedRoute allowedRole={[Role.AUTHOR]}>
                <WriteBlogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog/publish/:id"
            element={
              <ProtectedRoute allowedRole={[Role.AUTHOR]}>
                <WriteBlogPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
