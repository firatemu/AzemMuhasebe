import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControlLabel,
  alpha,
  useTheme,
} from "@mui/material";
import { Permission } from "@/types/role";

interface PermissionMatrixProps {
  permissions: Permission[];
  selectedPermissions: string[];
  onChange: (ids: string[]) => void;
  readOnly?: boolean;
}

const COMMON_ACTIONS = [
  "view",
  "list",
  "create",
  "update",
  "delete",
  "export",
  "import",
  "approve",
  "cancel",
  "print",
];

const ACTION_LABELS: Record<string, string> = {
  view: "Gör",
  list: "Listele",
  create: "Ekle",
  update: "Düzenle",
  delete: "Sil",
  export: "Excel",
  import: "İçe Aktar",
  approve: "Onay",
  cancel: "İptal",
  print: "Yazdır",
};

const MODULE_LABELS: Record<string, string> = {
  invoice: "Faturalar",
  account: "Cari Yönetimi",
  collection: "Tahsilat",
  product: "Stok Yönetimi",
  warehouse: "Depo Yönetimi",
  order: "Siparişler",
  quote: "Teklifler",
  "check-bill": "Çek / Senet",
  cashbox: "Kasa",
  bank: "Banka",
  pos: "POS",
  subscription: "Abonelikler",
  license: "Lisanslar",
  payment: "Ödemeler",
  analytics: "Analitik",
  reporting: "Raporlama",
  expense: "Masraf",
  hr: "İnsan Kaynakları",
  "sales-agent": "Satış Elemanları",
  vehicle: "Araçlar",
  "unit-set": "Birim Setleri",
  users: "Kullanıcılar",
  roles: "Roller & İzinler",
  permissions: "Sistem İzinleri",
  invoices: "Faturalar",
  cariye: "Cari Yönetimi",
  products: "Stok Yönetimi",
  expenses: "Masraf / Giderler",
  reports: "Raporlama",
  settings: "Ayarlar",
  work_orders: "İş Emirleri",
  vehicles: "Araçlar",
  technicians: "Teknisyenler",
  procurement: "Satın Alma",
  finance: "Finans Yönetimi",
  collecting: "Tahsilat",
  payments: "Ödeme",
};

export default function PermissionMatrix({
  permissions,
  selectedPermissions,
  onChange,
  readOnly = false,
}: PermissionMatrixProps) {
  const theme = useTheme();

  // Group permissions by module
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Record<string, Permission>> = {};
    permissions.forEach((perm) => {
      const moduleKey = perm.module;
      if (!groups[moduleKey]) {
        groups[moduleKey] = {};
      }
      groups[moduleKey][perm.action] = perm;
    });
    return groups;
  }, [permissions]);

  const modules = Object.keys(groupedPermissions).sort();

  const handleToggle = (permId: string) => {
    if (readOnly) return;
    const newSelected = selectedPermissions.includes(permId)
      ? selectedPermissions.filter((id) => id !== permId)
      : [...selectedPermissions, permId];
    onChange(newSelected);
  };

  const handleModuleToggle = (module: string) => {
    if (readOnly) return;
    const modulePerms = Object.values(groupedPermissions[module]);
    const modulePermIds = modulePerms.map((p) => p.id);
    const allSelected =
      modulePermIds.length > 0 &&
      modulePermIds.every((id) => selectedPermissions.includes(id));

    let newSelected = [...selectedPermissions];
    if (allSelected) {
      newSelected = newSelected.filter((id) => !modulePermIds.includes(id));
    } else {
      modulePermIds.forEach((id) => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });
    }
    onChange(newSelected);
  };

  return (
    <TableContainer component={Box} sx={{ maxHeight: 600, overflow: "auto" }}>
      <Table stickyHeader size="small" sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 800,
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                color: "text.secondary",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                py: 2,
              }}
            >
              Modül Adı
            </TableCell>
            {COMMON_ACTIONS.map((action) => (
              <TableCell
                key={action}
                align="center"
                sx={{
                  fontWeight: 800,
                  bgcolor: alpha(theme.palette.background.paper, 0.9),
                  color: "text.secondary",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  py: 2,
                }}
              >
                {ACTION_LABELS[action] || action}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {modules.map((module) => {
            const modulePerms = groupedPermissions[module];
            const modulePermIds = Object.values(modulePerms).map((p) => p.id);
            const allSelected =
              modulePermIds.length > 0 &&
              modulePermIds.every((id) => selectedPermissions.includes(id));
            const someSelected = modulePermIds.some((id) =>
              selectedPermissions.includes(id),
            );

            return (
              <TableRow
                key={module}
                hover
                sx={{
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                  },
                }}
              >
                <TableCell component="th" scope="row" sx={{ py: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected && !allSelected}
                        onChange={() => handleModuleToggle(module)}
                        disabled={readOnly}
                        size="small"
                        sx={{
                          color:
                            allSelected || someSelected
                              ? "primary.main"
                              : "text.disabled",
                        }}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 800,
                          color:
                            allSelected || someSelected
                              ? "primary.main"
                              : "text.primary",
                        }}
                      >
                        {MODULE_LABELS[module] ||
                          module.charAt(0).toUpperCase() + module.slice(1)}
                      </Typography>
                    }
                  />
                </TableCell>
                {COMMON_ACTIONS.map((action) => {
                  const perm = modulePerms[action];
                  if (!perm) {
                    return (
                      <TableCell
                        key={action}
                        align="center"
                        sx={{
                          bgcolor: alpha(
                            theme.palette.action.disabledBackground,
                            0.1,
                          ),
                        }}
                      />
                    );
                  }
                  const isSelected = selectedPermissions.includes(perm.id);
                  return (
                    <TableCell key={action} align="center" sx={{ py: 1 }}>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleToggle(perm.id)}
                        disabled={readOnly}
                        size="small"
                        color={action === "delete" ? "error" : "primary"}
                        sx={{
                          transition: "all 0.2s",
                          transform: isSelected ? "scale(1.1)" : "scale(1)",
                          "&.Mui-checked": {
                            color:
                              action === "delete"
                                ? theme.palette.error.main
                                : theme.palette.primary.main,
                          },
                        }}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
