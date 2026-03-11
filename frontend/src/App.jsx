import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import PostItem from "./pages/PostItem";
import ItemDetails from "./pages/ItemDetails";
import SuccessStories from "./pages/SuccessStories";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import "./index.css";

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — must be logged in */}
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
        <Route path="/post-item" element={<PrivateRoute><PostItem /></PrivateRoute>} />
        <Route path="/item/:id" element={<PrivateRoute><ItemDetails /></PrivateRoute>} />
        <Route path="/success-stories" element={<PrivateRoute><SuccessStories /></PrivateRoute>} />
      </Routes>
    </Layout>
  );
}

export default App;