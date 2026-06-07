"use client";

import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowBack, Lock } from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { getRoutePermission, hasPermission } from "@/lib/menuPermissions";

interface RoutePermissionGuardProps {
  children: React.ReactNode;
}

export default function RoutePermissionGuard({
  children,
}: RoutePermissionGuardProps) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { accessToken, permissions, user } = useAuthStore();
  const requirement = getRoutePermission(pathname);

  React.useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    }
  }, [accessToken, router]);

  if (!accessToken) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 160px)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (!requirement || hasPermission(permissions, requirement)) {
    return <>{children}</>;
  }

  const isHydrating = !user && permissions.length === 0;
  if (isHydrating) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 160px)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "min(480px, 100%)",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 4,
        }}
      >
        <Stack spacing={2.5} alignItems="flex-start">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1.5,
              display: "grid",
              placeItems: "center",
              color: "error.main",
              bgcolor: "error.lighter",
            }}
          >
            <Lock fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
              Bu sayfa için yetkiniz yok
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gerekli izin: {requirement.module}.{requirement.action}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => router.push("/menu")}
          >
            Menüye Dön
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
