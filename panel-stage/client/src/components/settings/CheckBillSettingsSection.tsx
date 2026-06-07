'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Grid,
  alpha,
  useTheme,
  Stack,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import Link from 'next/link';
import { useSnackbar } from 'notistack';
import BankAccountSelect from '@/components/common/BankAccountSelect';
import CashboxSelect from '@/components/common/CashboxSelect';
import SaveIcon from '@mui/icons-material/Save';
import InfoIcon from '@mui/icons-material/Info';
import NotificationsIcon from '@mui/icons-material/NotificationsActive';
import PaymentIcon from '@mui/icons-material/Payments';
import { getParameter, updateParameter } from '@/services/systemParameterService';

export const CHECK_BILL_SETTINGS_KEY = 'CHECK_BILL_SETTINGS';
export const CHECK_BILL_SETTINGS_CATEGORY = 'ÇEK_SENET';

export interface CheckBillSettingsValue {
  autoUnpaid: boolean;
  sendReminder: boolean;
  reminderDays: number;
  defaultBankId: string | null;
  defaultCashboxId: string | null;
}

export const DEFAULT_CHECK_BILL_SETTINGS: CheckBillSettingsValue = {
  autoUnpaid: true,
  sendReminder: false,
  reminderDays: 3,
  defaultBankId: null,
  defaultCashboxId: null,
};

function normalizeCheckBillSettings(raw: unknown): CheckBillSettingsValue {
  const d = DEFAULT_CHECK_BILL_SETTINGS;
  if (raw == null || typeof raw !== 'object') {
    return { ...d };
  }
  const o = raw as Record<string, unknown>;
  const rd = o.reminderDays;
  let reminderDays = d.reminderDays;
  if (typeof rd === 'number' && !Number.isNaN(rd)) {
    reminderDays = rd;
  } else if (rd != null) {
    const n = Number(rd);
    if (!Number.isNaN(n)) reminderDays = n;
  }
  const bankRaw = o.defaultBankId ?? o.defaultBank;
  const cashRaw = o.defaultCashboxId ?? o.defaultCashbox;
  return {
    autoUnpaid: typeof o.autoUnpaid === 'boolean' ? o.autoUnpaid : d.autoUnpaid,
    sendReminder: typeof o.sendReminder === 'boolean' ? o.sendReminder : d.sendReminder,
    reminderDays,
    defaultBankId: bankRaw === null || typeof bankRaw === 'string' ? (bankRaw as string | null) : d.defaultBankId,
    defaultCashboxId: cashRaw === null || typeof cashRaw === 'string' ? (cashRaw as string | null) : d.defaultCashboxId,
  };
}

export interface CheckBillSettingsSectionProps {
  /** Üstteki açıklama paragrafını gösterir (ayrı çek/senet ayarları sayfası için) */
  showIntro?: boolean;
  /** Parametreler sayfasındaki bölüm başlığı + divider (embed modu) */
  embedInParametersPage?: boolean;
}

export default function CheckBillSettingsSection({
  showIntro = true,
  embedInParametersPage = false,
}: CheckBillSettingsSectionProps) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [state, setState] = useState<CheckBillSettingsValue>(DEFAULT_CHECK_BILL_SETTINGS);

  const patch = useCallback((p: Partial<CheckBillSettingsValue>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const raw = await getParameter(CHECK_BILL_SETTINGS_KEY);
      setState(normalizeCheckBillSettings(raw));
    } catch {
      setState({ ...DEFAULT_CHECK_BILL_SETTINGS });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const persist = async (sectionLabel: string) => {
    try {
      setSavingSection(sectionLabel);
      await updateParameter(CHECK_BILL_SETTINGS_KEY, {
        value: state,
        description: 'Çek ve senet vade, bildirim ve varsayılan tahsilat ayarları',
        category: CHECK_BILL_SETTINGS_CATEGORY,
      });
      enqueueSnackbar(`${sectionLabel} ayarları kaydedildi.`, { variant: 'success' });
    } catch (e: unknown) {
      const msg =
        typeof e === 'object' && e !== null && 'response' in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      enqueueSnackbar(msg || 'Kayıt sırasında hata oluştu.', { variant: 'error' });
    } finally {
      setSavingSection(null);
    }
  };

  const busy = savingSection !== null;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      {embedInParametersPage && (
        <>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0 }}>
            <Box sx={{ width: 8, height: 24, bgcolor: 'primary.main', borderRadius: 1 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: 'text.primary',
                fontSize: '1rem',
              }}
            >
              ÇEK & SENET AYARLARI
            </Typography>
          </Stack>
          <Divider sx={{ mb: 0 }} />
          <Alert severity="info" sx={{ borderRadius: 2, mt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Bordro numaralandırma (ön ek, hane, sayaç){' '}
              <Link href="/settings/number-templates" style={{ fontWeight: 800, color: 'inherit' }}>
                Numara Şablonları
              </Link>{' '}
              sayfasında <strong>Bordro Numaralandırma</strong> modülünden yönetilir.
            </Typography>
          </Alert>
        </>
      )}

      {showIntro && (
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 800 }}>
            Vade hatırlatmaları ve varsayılan tahsilat noktalarını buradan yapılandırabilirsiniz. Bordro numara şablonu için{' '}
            <Link href="/settings/number-templates" style={{ fontWeight: 700, color: theme.palette.primary.main }}>
              Numara Şablonları
            </Link>{' '}
            sayfasına gidin.
          </Typography>
        </Box>
      )}

      <Card variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.04), borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <NotificationsIcon color="warning" fontSize="small" />
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              VADE VE BİLDİRİM AYARLARI
            </Typography>
          </Stack>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.autoUnpaid}
                    onChange={(e) => patch({ autoUnpaid: e.target.checked })}
                    color="warning"
                  />
                }
                label={<Typography variant="body2" sx={{ fontWeight: 700 }}>Vadesi Geçenleri Otomatik &quot;Ödenmedi&quot; Yap</Typography>}
              />
              <Stack direction="row" spacing={1} sx={{ mt: 1, ml: 4 }}>
                <InfoIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Her gece 01:00&apos;de çalışan CRON görevi ile vadesi geçen borç evrakları güncellenir.
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 'auto' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={state.sendReminder}
                        onChange={(e) => patch({ sendReminder: e.target.checked })}
                        color="warning"
                      />
                    }
                    label={<Typography variant="body2" sx={{ fontWeight: 700 }}>E-posta Hatırlatması Gönder</Typography>}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    id="check-bill-settings-reminder-days"
                    select
                    fullWidth
                    label="Kaç Gün Önce?"
                    size="small"
                    value={state.reminderDays}
                    onChange={(e) => patch({ reminderDays: Number(e.target.value) })}
                    disabled={!state.sendReminder}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    <MenuItem value={1}>1 Gün Önce</MenuItem>
                    <MenuItem value={3}>3 Gün Önce</MenuItem>
                    <MenuItem value={7}>7 Gün Önce</MenuItem>
                    <MenuItem value={15}>15 Gün Önce</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          </Stack>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => persist('Durum/Bildirim')}
              disabled={busy}
              sx={{ fontWeight: 800, borderRadius: 2 }}
            >
              Kuralları Güncelle
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.04), borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <PaymentIcon color="success" fontSize="small" />
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              VARSAYILAN TAHSİLAT NOKTALARI
            </Typography>
          </Stack>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <BankAccountSelect value={state.defaultBankId} onChange={(id) => patch({ defaultBankId: id })} />
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                Banka üzerinden yapılan çek/senet işlemlerinde otomatik önerilir.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CashboxSelect value={state.defaultCashboxId} onChange={(id) => patch({ defaultCashboxId: id })} />
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                Nakit tahsilat ve ödemelerde varsayılan olarak seçili gelir.
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => persist('Varsayılan değerler')}
              disabled={busy}
              sx={{ fontWeight: 800, borderRadius: 2 }}
            >
              Varsayılanları Kaydet
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
