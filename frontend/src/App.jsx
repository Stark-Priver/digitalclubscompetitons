import React, { useState, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import getTheme from "./theme";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MapView from "./pages/MapView";
import Analytics from "./pages/Analytics";
import ChatbotPage from "./pages/ChatbotPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SenderDashboard from "./pages/SenderDashboard";
import ReceiverDashboard from "./pages/ReceiverDashboard";
import CourierDashboard from "./pages/CourierDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

function App() {
  const [mode, setMode] = useState("light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  const AppLayout = () => (
    <Layout toggleColorMode={colorMode.toggleColorMode}>
      <Outlet />
    </Layout>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
          </Route>
          <Route path="/dashboard/sender" element={<SenderDashboard />} />
          <Route path="/dashboard/receiver" element={<ReceiverDashboard />} />
          <Route path="/dashboard/courier" element={<CourierDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;