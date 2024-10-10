import { Frame, Navigation } from "@shopify/polaris";
import React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Products from "../components/Products";
import Settings from "../components/Settings";
import { menu } from "../routes/menu";

const Admin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Frame>
      <div className="flex flex-row h-screen w-full">
        <Navigation location={location.pathname}>
          <Navigation.Section
            items={menu.map(({ title, path, icon }) => ({
              label: title,
              onClick: () => navigate(path),
              selected: location.pathname === path,
              icon: icon,
            }))}
          />
        </Navigation>
        <div className="flex-1 p-5 bg-white overflow-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Frame>
  );
};

export default Admin;
