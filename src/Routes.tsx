import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuth from "./hook/useAuth";
import ChatList from "./pages/Chat";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

const Private = ({ Page }: any) => {
  const auth = useAuth();

  if (auth?.signed) {
    return <Page />;
  }

  return <Login />;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chats" element={<Private Page={ChatList} />} />
        <Route path="/settings" element={<Private Page={Settings} />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
