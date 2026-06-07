"use client";

import React from "react";
import { Box, Toolbar } from "@mui/material";
import Sidebar, { SIDEBAR_WIDTH } from "./Sidebar";
import Header from "./Header";
import TabBar from "./TabBar";
import RoutePermissionGuard from "./RoutePermissionGuard";
import { useLayoutStore } from "@/stores/layoutStore";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
  menuItems: any[];
}

export default function ClientMainLayout({
  children,
  menuItems,
}: MainLayoutProps) {
  const {
    sidebarOpen,
    sidebarPinned,
    toggleSidebar,
    toggleSidebarPin,
    setSidebarOpen,
  } = useLayoutStore();

  const pathname = usePathname();
  const isPosPage = pathname?.startsWith("/pos");

  const handleToggleSidebar = () => {
    toggleSidebar();
  };

  const handleTogglePin = () => {
    toggleSidebarPin();
  };

  const handleCloseSidebar = () => {
    if (sidebarPinned) return;
    setSidebarOpen(false);
  };

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", bgcolor: "var(--background)" }}
    >
      <Sidebar
        open={sidebarPinned ? true : sidebarOpen}
        pinned={sidebarPinned}
        onClose={handleCloseSidebar}
        onTogglePin={handleTogglePin}
        menuItems={menuItems}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          bgcolor: "var(--background)",
        }}
      >
        <Header
          onToggleSidebar={handleToggleSidebar}
          onToggleSidebarPin={handleTogglePin}
          sidebarPinned={sidebarPinned}
        />
        <Toolbar />
        <TabBar />
        <Box
          sx={{
            p: isPosPage ? 0 : 3,
            bgcolor: "var(--background)",
            // POS ekranında yatay kaymayı azaltıyoruz (özellikle mobilde).
            overflowX: isPosPage ? "hidden" : "auto",
          }}
        >
          <RoutePermissionGuard>{children}</RoutePermissionGuard>
        </Box>
      </Box>
    </Box>
  );
}
