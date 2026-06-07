"use client";

import React, { useMemo, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  ListItemIcon,
  Divider,
  Popover,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridPaginationModel,
  GridSortModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
  useChecks,
  useCheckStatsSummary,
  useDeleteCheck,
  useCheckAction,
  useBulkSoftDeleteChecks,
  exportChecksCsv,
  exportChecksPdf,
  useCheckUpcomingWindow,
  useCheckOverdue,
  useCheckAtRisk,
} from "@/hooks/use-checks";
import {
  CheckBill,
  CheckBillFilters,
  CheckBillStatus,
  CheckBillType,
  PortfolioType,
} from "@/types/check-bill";
import { STATUS_LABEL, STATUS_MUI_COLOR, PORTFOLIO_LABEL } from "@/lib/labels";
import { formatAmount, formatDate, isOverdue } from "@/lib/format";
import { getAllowedNextStatuses } from "@/lib/check-bill-transitions";
import {
  DeleteConfirmDialog,
  CheckStatusActionDialog,
  CheckStatusActionPayload,
} from "@/components/checks/CheckDialogs";
import AccountSelect from "@/components/common/AccountSelect";
import { useSnackbar } from "notistack";
import { usePermission } from "@/hooks/usePermission";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import PaymentsIcon from "@mui/icons-material/Payments";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import SecurityUpdateWarningIcon from "@mui/icons-material/SecurityUpdateWarning";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NotesIcon from "@mui/icons-material/Notes";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const emptySelection = (): GridRowSelectionModel => ({
  type: "include",
  ids: new Set<string>(),
});

function selectionIds(model: GridRowSelectionModel): string[] {
  if (model.type === "include") {
    return Array.from(model.ids) as string[];
  }
  return [];
}

function selectionCount(model: GridRowSelectionModel): number {
  return model.type === "include" ? model.ids.size : 0;
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function toIsoDate(d: Date) {
  return d.toISOString().split("T")[0];
}

export default function ChecksClient() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const printRef = useRef<HTMLDivElement>(null);
  const { can } = usePermission();

  const [search, setSearch] = useState("");
  const [portfolioType, setPortfolioType] = useState<PortfolioType | "">("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [accountId, setAccountId] = useState<string | null>(null);
  const [datePreset, setDatePreset] = useState<
    "none" | "today" | "week" | "month"
  >("none");
  const [dueFrom, setDueFrom] = useState("");
  const [dueTo, setDueTo] = useState("");

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "dueDate", sort: "asc" },
  ]);

  const [selectedCheck, setSelectedCheck] = useState<CheckBill | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    targetStatus: CheckBillStatus | null;
  }>({
    open: false,
    targetStatus: null,
  });
  const [selectionModel, setSelectionModel] =
    useState<GridRowSelectionModel>(emptySelection);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const applyDatePreset = (preset: typeof datePreset) => {
    setDatePreset(preset);
    const now = new Date();
    if (preset === "none") {
      setDueFrom("");
      setDueTo("");
      return;
    }
    if (preset === "today") {
      const s = startOfDay(now);
      setDueFrom(toIsoDate(s));
      setDueTo(toIsoDate(endOfDay(now)));
      return;
    }
    if (preset === "week") {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now);
      monday.setDate(diff);
      setDueFrom(toIsoDate(startOfDay(monday)));
      setDueTo(toIsoDate(endOfDay(now)));
      return;
    }
    if (preset === "month") {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setDueFrom(toIsoDate(startOfDay(first)));
      setDueTo(toIsoDate(endOfDay(last)));
    }
  };

  const sortField = sortModel[0]?.field;
  const sortOrder = sortModel[0]?.sort ?? "asc";
  const apiSortBy =
    sortField === "amount" ||
    sortField === "createdAt" ||
    sortField === "dueDate"
      ? (sortField as "dueDate" | "amount" | "createdAt")
      : "dueDate";

  const listFilters: CheckBillFilters = useMemo(() => {
    return {
      search: search.trim().length >= 2 ? search.trim() : undefined,
      portfolioType: portfolioType || undefined,
      status: statusFilter ? (statusFilter as CheckBillStatus) : undefined,
      type: typeFilter ? (typeFilter as CheckBillType) : undefined,
      accountId: accountId ?? undefined,
      dueDateFrom: dueFrom || undefined,
      dueDateTo: dueTo || undefined,
      skip: paginationModel.page * paginationModel.pageSize,
      take: paginationModel.pageSize,
      sortBy: apiSortBy,
      sortOrder: sortOrder === "desc" ? "desc" : "asc",
    };
  }, [
    search,
    portfolioType,
    statusFilter,
    typeFilter,
    accountId,
    dueFrom,
    dueTo,
    paginationModel.page,
    paginationModel.pageSize,
    apiSortBy,
    sortOrder,
  ]);

  const {
    data: listData,
    isLoading,
    isFetching,
    refetch,
  } = useChecks(listFilters);
  const { data: statsSummary } = useCheckStatsSummary();
  const { data: upcomingList } = useCheckUpcomingWindow(30);
  const { data: overdueList } = useCheckOverdue();
  const { data: atRiskList } = useCheckAtRisk(70);

  const [quickView, setQuickView] = useState<
    "upcoming" | "overdue" | "at-risk" | null
  >(null);

  const sumChecks = (arr: CheckBill[] | undefined) =>
    (arr ?? []).reduce((s, r) => {
      const amount =
        r.remainingAmount != null && r.remainingAmount > 0
          ? Number(r.remainingAmount)
          : Number(r.amount ?? 0);
      return s + amount;
    }, 0);

  const rows = listData?.items ?? [];
  const totalRows = listData?.total ?? 0;

  const deleteCheck = useDeleteCheck();
  const checkAction = useCheckAction();
  const bulkDelete = useBulkSoftDeleteChecks();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "cek-senet-listesi",
    onAfterPrint: () => {
      console.log("Print completed");
    },
    onError: (error) => {
      console.error("Print error:", error);
      enqueueSnackbar("Yazdırma hatası oluştu.", { variant: "error" });
    },
    suppressErrors: false,
  });

  const sumAmount = useMemo(
    () =>
      rows.reduce((s, r) => {
        const amount =
          r.remainingAmount != null && r.remainingAmount > 0
            ? Number(r.remainingAmount)
            : Number(r.amount ?? 0);
        return s + amount;
      }, 0),
    [rows],
  );

  const handleDeleteConfirm = async () => {
    if (!selectedCheck) return;
    try {
      await deleteCheck.mutateAsync(selectedCheck.id);
      enqueueSnackbar("Evrak silindi.", { variant: "success" });
    } catch {
      enqueueSnackbar("Silme başarısız.", { variant: "error" });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCheck(null);
    }
  };

  const handleActionConfirm = async (payload: CheckStatusActionPayload) => {
    if (!selectedCheck || !actionDialog.targetStatus) return;
    try {
      await checkAction.mutateAsync({
        checkBillId: selectedCheck.id,
        newStatus: actionDialog.targetStatus,
        date: payload.date,
        transactionAmount: payload.transactionAmount,
        paymentMethod: payload.paymentMethod,
        cashboxId: payload.cashboxId,
        bankAccountId: payload.bankAccountId,
        toAccountId: payload.toAccountId,
        notes: payload.notes || undefined,
      });
      enqueueSnackbar("Evrak durumu güncellendi.", { variant: "success" });
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message ?? "İşlem hatalı.", {
        variant: "error",
      });
    } finally {
      setActionDialog({ open: false, targetStatus: null });
      setSelectedCheck(null);
    }
  };

  const handleExport = async () => {
    try {
      await exportChecksCsv({
        search: listFilters.search,
        portfolioType: listFilters.portfolioType,
        status: listFilters.status,
        type: listFilters.type,
        accountId: listFilters.accountId,
        dueDateFrom: listFilters.dueDateFrom,
        dueDateTo: listFilters.dueDateTo,
        sortBy: listFilters.sortBy,
        sortOrder: listFilters.sortOrder,
        skip: 0,
        take: 50000,
      });
      enqueueSnackbar("CSV indirildi.", { variant: "success" });
    } catch (err) {
      console.error("Export error:", err);
      enqueueSnackbar("Dışa aktarma başarısız.", { variant: "error" });
    }
  };

  const handleExportPdf = async () => {
    try {
      await exportChecksPdf({
        search: listFilters.search,
        portfolioType: listFilters.portfolioType,
        status: listFilters.status,
        type: listFilters.type,
        accountId: listFilters.accountId,
        dueDateFrom: listFilters.dueDateFrom,
        dueDateTo: listFilters.dueDateTo,
        sortBy: listFilters.sortBy,
        sortOrder: listFilters.sortOrder,
        skip: 0,
        take: 50000,
      });
      enqueueSnackbar("PDF indirildi.", { variant: "success" });
    } catch (err) {
      console.error("PDF export error:", err);
      enqueueSnackbar("PDF dışa aktarma başarısız.", { variant: "error" });
    }
  };

  const handleBulkDelete = async () => {
    const ids = selectionIds(selectionModel);
    if (ids.length === 0) return;
    try {
      await bulkDelete.mutateAsync(ids);
      enqueueSnackbar(`${ids.length} kayıt silindi.`, { variant: "success" });
      setSelectionModel(emptySelection());
    } catch {
      enqueueSnackbar("Toplu silme başarısız.", { variant: "error" });
    } finally {
      setBulkDeleteOpen(false);
    }
  };

  const openRowMenu = useCallback(
    (e: React.MouseEvent<HTMLElement>, row: CheckBill) => {
      setMenuAnchor({ el: e.currentTarget, row });
    },
    [],
  );
  const [menuAnchor, setMenuAnchor] = useState<{
    el: HTMLElement | null;
    row: CheckBill | null;
  }>({ el: null, row: null });
  const handleCloseMenu = () => setMenuAnchor({ el: null, row: null });

  const columns: GridColDef<CheckBill>[] = useMemo(
    () => [
      {
        field: "checkNo",
        headerName: "No",
        flex: 0.8,
        minWidth: 120,
        renderCell: (params: GridRenderCellParams<CheckBill>) => (
          <Button
            variant="text"
            color="primary"
            onClick={() => router.push(`/checks/${params.row.id}`)}
            sx={{ fontWeight: 700, textTransform: "none" }}
          >
            {params.value || "—"}
          </Button>
        ),
      },
      {
        field: "accountCode",
        headerName: "Cari Kod",
        flex: 0.6,
        minWidth: 100,
        renderCell: (params) => (
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {params.row.account?.code || "—"}
          </Typography>
        ),
      },
      {
        field: "account",
        headerName: "Cari",
        flex: 1.2,
        minWidth: 180,
        renderCell: (params) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <Link
              href={`/accounts/${params.row.accountId}`}
              style={{
                color: "var(--primary)",
                fontWeight: 600,
                textDecoration: "none",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {params.row.account?.title ?? "—"}
            </Link>
          </Box>
        ),
      },
      {
        field: "bank",
        headerName: "Banka",
        flex: 0.8,
        minWidth: 120,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={600}>
            {params.row.bank || "—"}
          </Typography>
        ),
      },
      {
        field: "type",
        headerName: "Tip",
        width: 70,
        valueGetter: (value: CheckBillType) =>
          value === CheckBillType.CHECK ? "Çek" : "Senet",
      },
      {
        field: "portfolioType",
        headerName: "Giriş/Çıkış",
        width: 100,
        renderCell: (params: GridRenderCellParams<CheckBill>) => {
          const isCredit = params.row.portfolioType === PortfolioType.CREDIT;
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {isCredit ? (
                <ArrowDownwardIcon fontSize="small" sx={{ color: "#22c55e" }} />
              ) : (
                <ArrowUpwardIcon fontSize="small" sx={{ color: "#ef4444" }} />
              )}
              <Typography variant="caption" fontWeight={700}>
                {isCredit ? "Giriş" : "Çıkış"}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "dueDate",
        headerName: "Vade",
        width: 120,
        renderCell: (params) => {
          const overdue =
            isOverdue(params.value) &&
            params.row.status === CheckBillStatus.IN_PORTFOLIO;
          return (
            <Box display="flex" alignItems="center" gap={0.5}>
              {formatDate(params.value)}
              {overdue && (
                <WarningAmberIcon
                  color="error"
                  fontSize="small"
                  titleAccess="Vadesi geçmiş"
                />
              )}
            </Box>
          );
        },
      },
      {
        field: "amount",
        headerName: "Tutar",
        width: 140,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => {
          const hasRemaining =
            params.row.remainingAmount != null &&
            params.row.remainingAmount !== params.row.amount;
          const cell = (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ lineHeight: 1 }}
              >
                {formatAmount(params.value)}
              </Typography>
              {hasRemaining && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 0.5, lineHeight: 1 }}
                >
                  / {formatAmount(params.row.remainingAmount)}
                </Typography>
              )}
            </Box>
          );
          return hasRemaining ? (
            <Tooltip
              title={`Kalan: ${formatAmount(params.row.remainingAmount)}`}
              arrow
            >
              {cell}
            </Tooltip>
          ) : (
            cell
          );
        },
      },
      {
        field: "status",
        headerName: "Durum",
        width: 150,
        renderCell: (params) => (
          <Chip
            size="small"
            label={STATUS_LABEL[params.value as CheckBillStatus]}
            color={STATUS_MUI_COLOR[params.value as CheckBillStatus]}
            sx={{ fontWeight: 600 }}
          />
        ),
      },
      {
        field: "actions",
        headerName: "",
        width: 52,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <IconButton size="small" onClick={(e) => openRowMenu(e, params.row)}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    [router, openRowMenu],
  );

  const totalFace = statsSummary?.totalFaceAmount;
  const totalRem = statsSummary?.totalRemainingAmount;

  return (
    <Box sx={{ pb: 4 }}>
      <Stack
        direction="row"
        justifyContent="flex-end"
        flexWrap="wrap"
        gap={1}
        sx={{ mb: 2 }}
      >
        <Button
          component={Link}
          href="/checks/reports"
          size="small"
          variant="outlined"
          startIcon={<AssessmentIcon />}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
        >
          Raporlar
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => router.push("/checks/new")}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
          }}
          disabled={!can("check-bill", "create")}
        >
          Yeni evrak
        </Button>
      </Stack>

      <Paper
        variant="outlined"
        sx={{ mb: 2, p: 1.5, display: "flex", flexWrap: "wrap", gap: 0 }}
      >
        {[
          {
            label: "Toplam nominal",
            value: totalFace != null ? formatAmount(Number(totalFace)) : "—",
          },
          {
            label: "Kalan tutar (özet)",
            value: totalRem != null ? formatAmount(Number(totalRem)) : "—",
          },
          { label: "Liste satırı", value: `${totalRows}` },
          { label: "Sayfa tutarı", value: formatAmount(sumAmount) },
        ].map((m, i, arr) => (
          <Box
            key={m.label}
            sx={{
              flex: "1 1 120px",
              px: 1.5,
              borderRight:
                i < arr.length - 1
                  ? "1px solid var(--divider, var(--border))"
                  : "none",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {m.label}
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              color="var(--foreground)"
            >
              {m.value}
            </Typography>
          </Box>
        ))}
      </Paper>

      <Typography
        variant="subtitle2"
        fontWeight={800}
        sx={{ mb: 1, color: "var(--foreground)" }}
      >
        Kritik Durum Takibi
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <Paper
          variant="outlined"
          onClick={() => setQuickView("upcoming")}
          sx={{
            flex: 1,
            p: 1.5,
            cursor: "pointer",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              bgcolor: "color-mix(in srgb, var(--primary) 6%, transparent)",
            },
          }}
        >
          <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
            <EventAvailableIcon fontSize="small" color="primary" />
            <Typography
              variant="caption"
              fontWeight={800}
              color="text.secondary"
            >
              Yaklaşan vade (30 gün)
            </Typography>
          </Stack>
          <Typography variant="h6" fontWeight={900}>
            {upcomingList?.length ?? "—"} evrak
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Toplam: {formatAmount(sumChecks(upcomingList))}
          </Typography>
        </Paper>
        <Paper
          variant="outlined"
          onClick={() => setQuickView("overdue")}
          sx={{
            flex: 1,
            p: 1.5,
            cursor: "pointer",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              bgcolor: "color-mix(in srgb, var(--destructive) 8%, transparent)",
            },
          }}
        >
          <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
            <RunningWithErrorsIcon fontSize="small" color="error" />
            <Typography
              variant="caption"
              fontWeight={800}
              color="text.secondary"
            >
              Vadesi geçmiş
            </Typography>
          </Stack>
          <Typography variant="h6" fontWeight={900}>
            {overdueList?.length ?? "—"} evrak
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Toplam: {formatAmount(sumChecks(overdueList))}
          </Typography>
        </Paper>
        <Paper
          variant="outlined"
          onClick={() => setQuickView("at-risk")}
          sx={{
            flex: 1,
            p: 1.5,
            cursor: "pointer",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              bgcolor: "color-mix(in srgb, var(--chart-5) 12%, transparent)",
            },
          }}
        >
          <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
            <SecurityUpdateWarningIcon
              fontSize="small"
              sx={{ color: "var(--chart-5)" }}
            />
            <Typography
              variant="caption"
              fontWeight={800}
              color="text.secondary"
            >
              Risk (skor ≥ 70)
            </Typography>
          </Stack>
          <Typography variant="h6" fontWeight={900}>
            {atRiskList?.length ?? "—"} evrak
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Toplam: {formatAmount(sumChecks(atRiskList))}
          </Typography>
        </Paper>
      </Stack>

      <Paper variant="outlined" sx={{ mb: 2 }}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            placeholder="Ara (no, cari, not...)"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPaginationModel((p) => ({ ...p, page: 0 }));
            }}
            sx={{ minWidth: 220, flex: "1 1 200px" }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            className="form-control-textfield"
          />
          <TextField
            select
            size="small"
            label="Portföy"
            value={portfolioType}
            onChange={(e) => {
              setPortfolioType(e.target.value as PortfolioType | "");
              setPaginationModel((p) => ({ ...p, page: 0 }));
            }}
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="">Tümü</MenuItem>
            <MenuItem value={PortfolioType.CREDIT}>Alacak</MenuItem>
            <MenuItem value={PortfolioType.DEBIT}>Borç</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            label="Tip"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPaginationModel((p) => ({ ...p, page: 0 }));
            }}
            sx={{ minWidth: 110 }}
          >
            <MenuItem value="">Tümü</MenuItem>
            <MenuItem value={CheckBillType.CHECK}>Çek</MenuItem>
            <MenuItem value={CheckBillType.PROMISSORY}>Senet</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            label="Durum"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPaginationModel((p) => ({ ...p, page: 0 }));
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">Tümü</MenuItem>
            {Object.values(CheckBillStatus).map((s) => (
              <MenuItem key={s} value={s}>
                {STATUS_LABEL[s]}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ minWidth: 260, flex: "1 1 240px" }}>
            <AccountSelect
              value={accountId}
              onChange={(v) => {
                setAccountId(v);
                setPaginationModel((p) => ({ ...p, page: 0 }));
              }}
            />
          </Box>
          <Stack direction="row" flexWrap="wrap" gap={0.5} alignItems="center">
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mr: 0.5 }}
            >
              Vade:
            </Typography>
            {(["none", "today", "week", "month"] as const).map((p) => (
              <Chip
                key={p}
                size="small"
                label={
                  p === "none"
                    ? "Tümü"
                    : p === "today"
                      ? "Bugün"
                      : p === "week"
                        ? "Bu hafta"
                        : "Bu ay"
                }
                onClick={() => {
                  applyDatePreset(p);
                  setPaginationModel((x) => ({ ...x, page: 0 }));
                }}
                color={datePreset === p ? "primary" : "default"}
                variant={datePreset === p ? "filled" : "outlined"}
                sx={{ fontWeight: 600 }}
              />
            ))}
          </Stack>
          <TextField
            size="small"
            type="date"
            label="Vade başlangıç"
            value={dueFrom}
            onChange={(e) => {
              setDueFrom(e.target.value);
              setDatePreset("none");
              setPaginationModel((p) => ({ ...p, page: 0 }));
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size="small"
            type="date"
            label="Vade bitiş"
            value={dueTo}
            onChange={(e) => {
              setDueTo(e.target.value);
              setDatePreset("none");
              setPaginationModel((p) => ({ ...p, page: 0 }));
            }}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            disabled={isFetching}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Yenile
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Excel (CSV)
          </Button>
          <Tooltip title="Liste görünümünü yazdırır (PDF için tarayıcı Yazdır → PDF)">
            <Button
              size="small"
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={() => handlePrint()}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Yazdır
            </Button>
          </Tooltip>
          <Button
            size="small"
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleExportPdf}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            PDF
          </Button>
          <Tooltip title="API üzerinde toplu içe aktarma yakında">
            <span>
              <Button
                size="small"
                variant="outlined"
                disabled
                startIcon={<CloudOffIcon />}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
              >
                İçe aktar
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Paper>

      <Box
        sx={{
          py: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          {totalRows} kayıt · Sayfa {paginationModel.page + 1}
        </Typography>
        {selectionCount(selectionModel) > 0 && (
          <Stack direction="row" gap={1} alignItems="center">
            <Typography variant="body2" fontWeight={700}>
              {selectionCount(selectionModel)} seçili
            </Typography>
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={() => setBulkDeleteOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              Toplu sil
            </Button>
          </Stack>
        )}
      </Box>

      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading || isFetching}
          getRowId={(r) => r.id}
          paginationMode="server"
          rowCount={totalRows}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[25, 50, 100]}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          checkboxSelection
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={setSelectionModel}
          disableRowSelectionOnClick
          autoHeight
          rowHeight={44}
          columnHeaderHeight={40}
          density="compact"
          sx={{
            border: "none",
            fontSize: "0.8125rem",
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "color-mix(in srgb, var(--muted) 50%, transparent)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                bgcolor: "color-mix(in srgb, var(--primary) 4%, transparent)",
              },
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              py: 0,
              borderBottom:
                "1px solid color-mix(in srgb, var(--border) 60%, transparent)",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid var(--border)",
              minHeight: 40,
            },
          }}
          localeText={{ noRowsLabel: "Kayıt yok" }}
        />
      </Paper>

      <Box
        ref={printRef}
        sx={{
          position: "absolute",
          left: -9999,
          top: 0,
          width: "210mm",
          p: 2,
          bgcolor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          Çek / Senet listesi
        </Typography>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "11px",
          }}
        >
          <thead>
            <tr style={{ bgcolor: "#f5f5f5" }}>
              <th
                style={{
                  padding: "6px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                }}
              >
                No
              </th>
              <th
                style={{
                  padding: "6px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                }}
              >
                Cari Kod
              </th>
              <th
                style={{
                  padding: "6px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                }}
              >
                Cari
              </th>
              <th
                style={{
                  padding: "6px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                }}
              >
                Banka
              </th>
              <th
                style={{
                  padding: "6px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                }}
              >
                Tip
              </th>
              <th
                style={{
                  padding: "6px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                }}
              >
                Giriş/Çıkış
              </th>
              <th
                style={{
                  padding: "6px",
                  textAlign: "center",
                  border: "1px solid #ddd",
                }}
              >
                Vade
              </th>
              <th
                style={{
                  padding: "6px",
                  textAlign: "right",
                  border: "1px solid #ddd",
                }}
              >
                Tutar
              </th>
              <th
                style={{
                  padding: "6px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                }}
              >
                Durum
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: "6px", border: "1px solid #ddd" }}>
                  {r.checkNo || "—"}
                </td>
                <td style={{ padding: "6px", border: "1px solid #ddd" }}>
                  {r.account?.code || "—"}
                </td>
                <td style={{ padding: "6px", border: "1px solid #ddd" }}>
                  {r.account?.title || "—"}
                </td>
                <td style={{ padding: "6px", border: "1px solid #ddd" }}>
                  {r.bank || "—"}
                </td>
                <td style={{ padding: "6px", border: "1px solid #ddd" }}>
                  {r.type === CheckBillType.CHECK ? "Çek" : "Senet"}
                </td>
                <td style={{ padding: "6px", border: "1px solid #ddd" }}>
                  {r.portfolioType === PortfolioType.CREDIT ? "Giriş" : "Çıkış"}
                </td>
                <td
                  style={{
                    padding: "6px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                  }}
                >
                  {formatDate(r.dueDate)}
                </td>
                <td
                  style={{
                    padding: "6px",
                    textAlign: "right",
                    border: "1px solid #ddd",
                  }}
                >
                  {formatAmount(r.amount)}
                </td>
                <td style={{ padding: "6px", border: "1px solid #ddd" }}>
                  {STATUS_LABEL[r.status]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      <Menu
        anchorEl={menuAnchor.el}
        open={Boolean(menuAnchor.el)}
        onClose={handleCloseMenu}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          elevation: 8,
          sx: {
            minWidth: 280,
            mt: 1,
            borderRadius: 3,
            border: "1px solid var(--border)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            overflow: "visible",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
              borderTop: "1px solid var(--border)",
              borderLeft: "1px solid var(--border)",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {menuAnchor.row
          ? [
              <Box
                key="header"
                sx={{
                  px: 2,
                  py: 1.5,
                  bgcolor: "var(--muted)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Evrak İşlemleri
                </Typography>
                <Box
                  sx={{
                    mt: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {menuAnchor.row.checkNo || "Senet"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatAmount(menuAnchor.row.amount)}
                  </Typography>
                </Box>
              </Box>,

              <Box key="actions" sx={{ px: 1.5, py: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Hızlı İşlemler
                </Typography>
                <MenuItem
                  onClick={() => {
                    router.push(`/checks/${menuAnchor.row!.id}`);
                    handleCloseMenu();
                  }}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    my: 0.25,
                    color: "var(--foreground)",
                    "&:hover": { bgcolor: "var(--secondary)" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                    <VisibilityIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Detayları Görüntüle
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push(`/checks/${menuAnchor.row!.id}/collection`);
                    handleCloseMenu();
                  }}
                  disabled={
                    menuAnchor.row.status === CheckBillStatus.COLLECTED ||
                    menuAnchor.row.status === CheckBillStatus.PAID
                  }
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    my: 0.25,
                    color: "var(--chart-3)",
                    "&:hover": {
                      bgcolor:
                        "color-mix(in srgb, var(--chart-3) 10%, transparent)",
                    },
                    "&.Mui-disabled": { opacity: 0.5 },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                    <PaymentsIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Tahsilat / Ödeme
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push(`/checks/${menuAnchor.row!.id}`);
                    handleCloseMenu();
                  }}
                  disabled={
                    ![
                      CheckBillStatus.IN_PORTFOLIO,
                      CheckBillStatus.PARTIAL_PAID,
                    ].includes(menuAnchor.row.status)
                  }
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    my: 0.25,
                    color: "var(--primary)",
                    "&:hover": { bgcolor: "var(--secondary)" },
                    "&.Mui-disabled": { opacity: 0.5 },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Düzenle
                  </Typography>
                </MenuItem>
                <MenuItem
                  disabled
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    my: 0.25,
                    color: "text.secondary",
                    "&.Mui-disabled": { opacity: 1 },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                    <InfoOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Oluşturma: {formatDate(menuAnchor.row.createdAt)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Güncelleme: {formatDate(menuAnchor.row.updatedAt)}
                    </Typography>
                  </Box>
                </MenuItem>
              </Box>,

              <Divider key="d1" sx={{ mx: 2, my: 0.5 }} />,

              <Box key="transitions" sx={{ px: 1.5, py: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Durum Geçişleri
                </Typography>
                {getAllowedNextStatuses(
                  menuAnchor.row.status,
                  menuAnchor.row.portfolioType,
                )
                  .filter(
                    (st) =>
                      ![
                        CheckBillStatus.COLLECTED,
                        CheckBillStatus.PARTIAL_PAID,
                        CheckBillStatus.PAID,
                      ].includes(st),
                  )
                  .map((st) => {
                    const actionLabel: Partial<
                      Record<CheckBillStatus, string>
                    > = {
                      [CheckBillStatus.IN_BANK_COLLECTION]:
                        "Bankaya Tahsilata Ver",
                      [CheckBillStatus.IN_BANK_GUARANTEE]:
                        "Bankaya Teminata Ver",
                      [CheckBillStatus.ENDORSED]: "Ciro Et",
                      [CheckBillStatus.RETURNED]: "İade Et",
                      [CheckBillStatus.CANCELLED]: "İptal Et",
                      [CheckBillStatus.WITHOUT_COVERAGE]: "Karşılıksız İşle",
                      [CheckBillStatus.PROTESTED]: "Protesto Et",
                      [CheckBillStatus.LEGAL_FOLLOWUP]: "Hukuki Takibe Al",
                      [CheckBillStatus.IN_PORTFOLIO]: "Portföye Al",
                    };
                    return (
                      <MenuItem
                        key={st}
                        onClick={() => {
                          setSelectedCheck(menuAnchor.row);
                          setActionDialog({ open: true, targetStatus: st });
                          handleCloseMenu();
                        }}
                        sx={{
                          px: 1.5,
                          py: 1,
                          borderRadius: 2,
                          my: 0.25,
                          color: "var(--foreground)",
                          "&:hover": { bgcolor: "var(--secondary)" },
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          → {actionLabel[st] ?? STATUS_LABEL[st]}
                        </Typography>
                      </MenuItem>
                    );
                  })}
              </Box>,

              <Divider key="d2" sx={{ mx: 2, my: 0.5 }} />,

              <Box key="advanced" sx={{ px: 1.5, py: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Gelişmiş İşlemler
                </Typography>
                <MenuItem
                  onClick={() => {
                    setSelectedCheck(menuAnchor.row);
                    setDeleteDialogOpen(true);
                    handleCloseMenu();
                  }}
                  disabled={
                    menuAnchor.row.status !== CheckBillStatus.IN_PORTFOLIO ||
                    !can("check-bill", "delete")
                  }
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    my: 0.25,
                    color: "var(--destructive)",
                    "&:hover": {
                      bgcolor: "var(--destructive)",
                      color: "white",
                      "& .MuiListItemIcon-root": { color: "white" },
                    },
                    "&.Mui-disabled": { opacity: 0.5 },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                    <DeleteIcon fontSize="small" color="inherit" />
                  </ListItemIcon>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Sil
                  </Typography>
                </MenuItem>
              </Box>,
            ]
          : null}
      </Menu>

      <Dialog
        open={quickView !== null}
        onClose={() => setQuickView(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {quickView === "upcoming" && "Yaklaşan vadeler (30 gün)"}
          {quickView === "overdue" && "Vadesi geçmiş evraklar"}
          {quickView === "at-risk" && "Yüksek risk (skor ≥ 70)"}
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: "min(70vh, 520px)" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Cari Kod</TableCell>
                <TableCell>Cari</TableCell>
                <TableCell>Banka</TableCell>
                <TableCell>Tip</TableCell>
                <TableCell>Giriş/Çıkış</TableCell>
                <TableCell>Vade</TableCell>
                <TableCell align="right">Tutar</TableCell>
                {quickView === "at-risk" && (
                  <TableCell align="right">Risk</TableCell>
                )}
                <TableCell>Durum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(quickView === "upcoming"
                ? upcomingList
                : quickView === "overdue"
                  ? overdueList
                  : atRiskList
              )?.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>
                    <Link href={`/checks/${r.id}`} style={{ fontWeight: 700 }}>
                      {r.checkNo || r.id.slice(0, 8)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {r.account?.code || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>{r.account?.title ?? "—"}</TableCell>
                  <TableCell>{r.bank || "—"}</TableCell>
                  <TableCell>
                    <Typography variant="caption" fontWeight={600}>
                      {r.type === CheckBillType.CHECK ? "Çek" : "Senet"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.25,
                      }}
                    >
                      {r.portfolioType === PortfolioType.CREDIT ? (
                        <ArrowDownwardIcon
                          fontSize="small"
                          sx={{ fontSize: 14, color: "#22c55e" }}
                        />
                      ) : (
                        <ArrowUpwardIcon
                          fontSize="small"
                          sx={{ fontSize: 14, color: "#ef4444" }}
                        />
                      )}
                      <Typography variant="caption" fontWeight={600}>
                        {r.portfolioType === PortfolioType.CREDIT
                          ? "Giriş"
                          : "Çıkış"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(r.dueDate)}</TableCell>
                  <TableCell align="right">{formatAmount(r.amount)}</TableCell>
                  {quickView === "at-risk" && (
                    <TableCell align="right">{r.riskScore ?? "—"}</TableCell>
                  )}
                  <TableCell>
                    <Chip
                      size="small"
                      label={STATUS_LABEL[r.status]}
                      color={STATUS_MUI_COLOR[r.status]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {(
            (quickView === "upcoming"
              ? upcomingList
              : quickView === "overdue"
                ? overdueList
                : atRiskList) ?? []
          ).length === 0 && (
            <Typography color="text.secondary" sx={{ py: 2 }}>
              Kayıt yok.
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid var(--border)",
            bgcolor: "var(--muted)",
          }}
        >
          <Button onClick={() => setQuickView(null)} sx={{ borderRadius: 2 }}>
            Kapat
          </Button>
          {quickView === "upcoming" && (
            <Button
              variant="contained"
              onClick={() => {
                const t = new Date();
                t.setHours(0, 0, 0, 0);
                const end = new Date(t);
                end.setDate(end.getDate() + 30);
                setDueFrom(toIsoDate(t));
                setDueTo(toIsoDate(end));
                setDatePreset("none");
                setPaginationModel((p) => ({ ...p, page: 0 }));
                setQuickView(null);
              }}
              sx={{ borderRadius: 2 }}
            >
              Ana tabloda vade filtresini uygula
            </Button>
          )}
          {quickView === "overdue" && (
            <Button
              variant="contained"
              onClick={() => {
                const y = new Date();
                y.setDate(y.getDate() - 1);
                y.setHours(0, 0, 0, 0);
                setDueFrom("");
                setDueTo(toIsoDate(y));
                setDatePreset("none");
                setSortModel([{ field: "dueDate", sort: "asc" }]);
                setPaginationModel((p) => ({ ...p, page: 0 }));
                setQuickView(null);
              }}
              sx={{ borderRadius: 2 }}
            >
              Ana tabloda vade bitiş (dün) uygula
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="Evrak silinsin mi?"
        description={
          selectedCheck
            ? `"${selectedCheck.checkNo || selectedCheck.id}" kaydı silinecek.`
            : undefined
        }
        loading={deleteCheck.isPending}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedCheck(null);
        }}
        onConfirm={handleDeleteConfirm}
      />

      <DeleteConfirmDialog
        open={bulkDeleteOpen}
        title="Toplu silme"
        description={`${selectionCount(selectionModel)} evrak kalıcı olarak işaretlenecek (soft delete).`}
        loading={bulkDelete.isPending}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
      />

      <CheckStatusActionDialog
        open={actionDialog.open}
        check={selectedCheck}
        targetStatus={actionDialog.targetStatus}
        loading={checkAction.isPending}
        onCancel={() => {
          setActionDialog({ open: false, targetStatus: null });
          setSelectedCheck(null);
        }}
        onConfirm={handleActionConfirm}
        showCashBank
      />
    </Box>
  );
}
