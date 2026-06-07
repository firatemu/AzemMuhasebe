"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Business as CompanyIcon,
  PinOutlined as NumberIcon,
  Tune as ParameterIcon,
  Menu as MenuIcon,
  People as StaffIcon,
  Payments as CheckIcon,
  ArrowForward as ArrowForwardIcon,
  Security as SecurityIcon,
  CloudQueue as CloudIcon,
  Translate as LanguageIcon,
  History as LogIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import StandardPage from "@/components/common/StandardPage";

export default function SettingsOverviewPage() {
  const theme = useTheme();
  const router = useRouter();

  const settingGroups = [
    {
      title: "Genel Yapılandırma",
      icon: <SettingsIcon />,
      color: theme.palette.primary.main,
      description:
        "Sistemin temel çalışma kurallarını ve firma kimliğini düzenleyin.",
      items: [
        {
          title: "Firma Bilgileri",
          description: "İletişim, adres ve vergi kayıtları",
          path: "/settings/company-settings",
          icon: <CompanyIcon />,
        },
        {
          title: "Sistem Parametreleri",
          description: "Varsayılan değerler ve çalışma limitleri",
          path: "/settings/parameters",
          icon: <ParameterIcon />,
        },
        {
          title: "Numara Şablonları",
          description: "Fatura, irsaliye ve çek serileri",
          path: "/settings/number-templates",
          icon: <NumberIcon />,
        },
        {
          title: "Dil ve Bölge",
          description: "Tarih, saat ve yerel ayarlar",
          path: "/settings/localization",
          icon: <LanguageIcon />,
        },
      ],
    },
    {
      title: "Kullanıcı & Güvenlik",
      icon: <SecurityIcon />,
      color: theme.palette.error.main,
      description:
        "Erişim izinlerini yönetin ve sistem güvenliğini denetleyin.",
      items: [
        {
          title: "Yetkilendirme",
          description: "Rol bazlı erişim kontrol listeleri (ACL)",
          path: "/authorization",
          icon: <SecurityIcon />,
        },
        {
          title: "Satış Elemanları",
          description: "Plasiyer ve saha personeli profilleri",
          path: "/settings/sales-staff",
          icon: <StaffIcon />,
        },
        {
          title: "Hızlı Menü",
          description: "Kişisel navigasyon kısayolları",
          path: "/settings/quick-menu",
          icon: <MenuIcon />,
        },
        {
          title: "İşlem Günlükleri",
          description: "Audit log ve sistem hareketleri",
          path: "/settings/logs",
          icon: <LogIcon />,
        },
      ],
    },
    {
      title: "Modül Ayarları",
      icon: <CloudIcon />,
      color: theme.palette.warning.main,
      description: "Özel modüller için detaylı konfigürasyon seçenekleri.",
      items: [
        {
          title: "Çek & Senet",
          description:
            "Vade ve tahsilat: Parametreler · Bordro no: Numara Şablonları",
          path: "/settings/parameters#cek-senet",
          icon: <CheckIcon />,
        },
      ],
    },
  ];

  return (
    <StandardPage
      title="Sistem ve Organizasyon Ayarları"
      breadcrumbs={[{ label: "Ayarlar" }]}
    >
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: 800,
            fontWeight: 500,
            lineHeight: 1.6,
          }}
        >
          Muhasebe platformunun tüm yapılandırma alanlarına buradan
          erişebilirsiniz. Değişiklikler tüm kullanıcıları ve tenant
          operasyonlarını etkileyebilir.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {settingGroups.map((group, groupIdx) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={groupIdx}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 6,
                height: "100%",
                overflow: "hidden",
                bgcolor: "background.paper",
                border: "1.5px solid",
                borderColor: "divider",
                boxShadow: `0 4px 24px ${alpha(theme.palette.common.black, 0.02)}`,
              }}
            >
              <Box
                sx={{
                  px: 4,
                  py: 3,
                  bgcolor: alpha(group.color, 0.04),
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: alpha(group.color, 0.1),
                      color: group.color,
                      display: "flex",
                    }}
                  >
                    {React.cloneElement(group.icon as any, {
                      sx: { fontSize: 24 },
                    })}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                      color: "text.primary",
                      letterSpacing: -0.5,
                    }}
                  >
                    {group.title}
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", fontWeight: 600 }}
                >
                  {group.description}
                </Typography>
              </Box>
              <CardContent sx={{ p: 0 }}>
                <Stack divider={<Divider sx={{ mx: 4 }} />}>
                  {group.items.map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        px: 4,
                        py: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          bgcolor: alpha(group.color, 0.04),
                          "& .arrow-icon": {
                            transform: "translateX(6px)",
                            color: group.color,
                          },
                          "& .item-title": { color: group.color },
                          "& .item-icon-box": {
                            bgcolor: alpha(group.color, 0.15),
                          },
                        },
                      }}
                      onClick={() => router.push(item.path)}
                    >
                      <Stack direction="row" spacing={2.5} alignItems="center">
                        <Box
                          className="item-icon-box"
                          sx={{
                            p: 1.5,
                            borderRadius: 3,
                            bgcolor: alpha(group.color, 0.08),
                            color: group.color,
                            display: "flex",
                            transition: "all 0.25s",
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            className="item-title"
                            sx={{
                              fontWeight: 800,
                              transition: "color 0.2s",
                              fontSize: "0.925rem",
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary", fontWeight: 500 }}
                          >
                            {item.description}
                          </Typography>
                        </Box>
                      </Stack>
                      <ArrowForwardIcon
                        className="arrow-icon"
                        sx={{
                          fontSize: 20,
                          color: "text.disabled",
                          transition: "all 0.3s",
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 6,
          bgcolor: alpha(theme.palette.info.main, 0.03),
          border: "1px solid",
          borderColor: alpha(theme.palette.info.main, 0.1),
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 4,
            bgcolor: alpha(theme.palette.info.main, 0.1),
            color: "info.main",
            display: "flex",
          }}
        >
          <SecurityIcon sx={{ fontSize: 32 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
            Veri Güvenliği ve Politikalar
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            Hesap ayarlarınız ve verileriniz KVKK uyumlu sunucularda 256-bit SSL
            sertifikası ile korunmaktadır. Tüm sistem erişimleri loglanır.
          </Typography>
        </Box>
      </Box>
    </StandardPage>
  );
}
