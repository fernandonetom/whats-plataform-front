import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuth from "./hook/useAuth";
import ChatList from "./pages/Chat";
import Login from "./pages/Login";

const Private = ({ Page }: any) => {
  const auth = useAuth();
  console.log(auth);
  if (auth?.signed) {
    return <Page />;
  }

  return <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chats" element={<Private Page={ChatList} />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
