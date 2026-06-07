"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Link,
} from "@mui/material";
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  ArrowForwardRounded,
  Agriculture,
  AccountBalance,
  Inventory2,
  Assessment,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import axios from "@/lib/axios";

const LOGIN_BG = "/images/azem-muhasebe-login-bg.png";

const features = [
  {
    icon: <AccountBalance />,
    title: "Ön Muhasebe",
    desc: "Cari hesaplar, faturalar ve nakit akışı yönetimi",
  },
  {
    icon: <Assessment />,
    title: "Finansal Raporlar",
    desc: "Gelir-gider tabloları, karlılık ve KDV analizleri",
  },
  {
    icon: <Inventory2 />,
    title: "Stok & Depo",
    desc: "Çoklu depo, varyantlı ürün ve stok hareket takibi",
  },
  {
    icon: <Person />,
    title: "Müşteri & Tedarikçi",
    desc: "Detaylı cari kartlar ve bakiye yaşlandırma",
  },
];

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    setMounted(true);
    document.title = "Azem Muhasebe";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/auth/login", {
        username,
        password,
      });

      const { user, accessToken, refreshToken } = response.data;
      setAuth(user, accessToken, refreshToken);

      const slimUser = {
        id: user?.id,
        email: user?.email,
        username: user?.username,
        fullName: user?.fullName,
        role: user?.role != null ? String(user.role) : undefined,
        tenantId: user?.tenantId ?? null,
        permissions: user?.permissions ?? [],
      };

      await fetch("/api/auth/cookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken,
          refreshToken,
          tenantId: user.tenantId,
          user: slimUser,
        }),
      });

      router.push("/menu");
    } catch (err: unknown) {
      const ax = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      const status = ax.response?.status;
      const msg = ax.response?.data?.message;
      if (status === 503) {
        setError(msg || "API sunucusuna bağlanılamadı. Backend çalışıyor mu?");
      } else {
        setError(msg || "Giriş başarısız");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "var(--background, #0F172A)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "var(--background, #F8FAFC)",
      }}
    >
      {/* Sol Panel — Tarım görseli & mesajlar */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          flex: "0 0 48%",
          position: "relative",
          overflow: "hidden",
          backgroundImage: `url(${LOGIN_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.4) 100%)",
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            p: { lg: 5, xl: 6 },
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  background:
                    "linear-gradient(135deg, var(--primary, #22c55e), var(--secondary, #16a34a))",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "0 8px 24px color-mix(in srgb, var(--primary, #22c55e) 35%, transparent)",
                }}
              >
                <AccountBalance
                  sx={{
                    color: "var(--primary-foreground, #fff)",
                    fontSize: 26,
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: "var(--card, #fff)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                Azem Muhasebe
              </Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                color: "var(--card, #fff)",
                fontWeight: 700,
                fontSize: "1.75rem",
                lineHeight: 1.2,
                mb: 2,
                letterSpacing: "-0.02em",
              }}
            >
              İşletmenizin
              <br />
              <Box component="span" sx={{ color: "var(--primary, #4ade80)" }}>
                Finansal
              </Box>
              <br />
              Yönetim Merkezi
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "color-mix(in srgb, var(--card, #fff) 75%, transparent)",
                fontSize: "0.875rem",
                lineHeight: 1.6,
                maxWidth: 360,
              }}
            >
              Faturalardan stoklara, cari hesaplardan finansal raporlara kadar
              tüm işletme verilerinizi entegre bir şekilde, tek platformda
              güvenle yönetin.
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 5,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
            }}
          >
            {features.map((feature) => (
              <Box
                key={feature.title}
                sx={{
                  p: 2,
                  bgcolor:
                    "color-mix(in srgb, var(--card, #fff) 8%, transparent)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 2,
                  border:
                    "1px solid color-mix(in srgb, var(--card, #fff) 15%, transparent)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor:
                      "color-mix(in srgb, var(--card, #fff) 12%, transparent)",
                    transform: "translateY(-2px)",
                    borderColor:
                      "color-mix(in srgb, var(--primary, #4ade80) 40%, transparent)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor:
                      "color-mix(in srgb, var(--primary, #22c55e) 25%, transparent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1.5,
                    color: "var(--primary, #4ade80)",
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--card, #fff)",
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: "0.8rem",
                    display: "block",
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      "color-mix(in srgb, var(--card, #fff) 55%, transparent)",
                    lineHeight: 1.4,
                    display: "block",
                    fontSize: "0.7rem",
                  }}
                >
                  {feature.desc}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              pt: 3,
              borderTop:
                "1px solid color-mix(in srgb, var(--card, #fff) 12%, transparent)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "color-mix(in srgb, var(--card, #fff) 45%, transparent)",
                display: "block",
                mb: 0.5,
                fontSize: "0.7rem",
              }}
            >
              Güvenli bağlantı · Tarımsal verileriniz şifreli saklanır
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "color-mix(in srgb, var(--card, #fff) 45%, transparent)",
                fontSize: "0.7rem",
              }}
            >
              © {new Date().getFullYear()} Azem Muhasebe · Finans & Ön Muhasebe
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Sağ Panel — Giriş formu */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3, md: 4 },
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(160deg, color-mix(in srgb, var(--primary, #22c55e) 6%, var(--background, #f8fafc)) 0%, var(--background, #f8fafc) 40%, color-mix(in srgb, var(--secondary, #16a34a) 4%, var(--card, #fff)) 100%)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -120,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--primary, #22c55e) 18%, transparent) 0%, transparent 70%)",
            pointerEvents: "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -100,
            left: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--secondary, #16a34a) 12%, transparent) 0%, transparent 70%)",
            pointerEvents: "none",
          },
        }}
      >
        <Box
          sx={{
            display: { xs: "flex", lg: "none" },
            position: "absolute",
            top: 24,
            left: 24,
            alignItems: "center",
            gap: 2,
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              background:
                "linear-gradient(135deg, var(--primary, #22c55e), var(--secondary, #16a34a))",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AccountBalance sx={{ color: "#fff", fontSize: 22 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{ color: "var(--foreground, #1E293B)", fontWeight: 700 }}
          >
            Azem Muhasebe
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            position: "relative",
            zIndex: 1,
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            bgcolor: "color-mix(in srgb, var(--card, #fff) 92%, transparent)",
            border:
              "1px solid color-mix(in srgb, var(--primary, #22c55e) 12%, var(--border, #e2e8f0))",
            boxShadow:
              "0 4px 24px color-mix(in srgb, var(--primary, #22c55e) 8%, transparent), 0 1px 3px color-mix(in srgb, var(--foreground, #0f172a) 4%, transparent)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Box
            sx={{
              mb: 3.5,
              pb: 2.5,
              borderBottom:
                "1px solid color-mix(in srgb, var(--primary, #22c55e) 15%, var(--border, #e2e8f0))",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.5,
                py: 0.5,
                mb: 2,
                borderRadius: 2,
                bgcolor:
                  "color-mix(in srgb, var(--primary, #22c55e) 12%, transparent)",
                border:
                  "1px solid color-mix(in srgb, var(--primary, #22c55e) 20%, transparent)",
              }}
            >
              <AccountBalance
                sx={{ fontSize: 16, color: "var(--primary, #16a34a)" }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "var(--primary, #15803d)",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                Yönetim Paneli
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{
                color: "var(--foreground, #1E293B)",
                fontWeight: 700,
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
                mb: 1,
                letterSpacing: "-0.02em",
              }}
            >
              Hoş{" "}
              <Box component="span" sx={{ color: "var(--primary, #16a34a)" }}>
                geldiniz
              </Box>
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "var(--muted-foreground, #64748B)",
                fontSize: "0.9rem",
                lineHeight: 1.5,
              }}
            >
              Finans ve muhasebe panelinize giriş yapın
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                bgcolor:
                  "color-mix(in srgb, var(--destructive, #dc2626) 8%, transparent)",
                color: "var(--destructive, #991B1B)",
                border:
                  "1px solid color-mix(in srgb, var(--destructive, #dc2626) 25%, transparent)",
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Box>
                <Typography
                  component="label"
                  sx={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--foreground, #334155)",
                    mb: 1,
                  }}
                >
                  Kullanıcı Adı veya E-posta
                </Typography>
                <TextField
                  fullWidth
                  placeholder="ornek@firmatarim.com"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="username"
                  className="form-control-textfield"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person
                          sx={{
                            color: "var(--muted-foreground, #94A3B8)",
                            fontSize: 18,
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor:
                        "color-mix(in srgb, var(--primary, #22c55e) 4%, var(--card, #fff))",
                      borderRadius: 2,
                      transition: "all 0.2s ease-in-out",
                      "& fieldset": {
                        borderColor:
                          "color-mix(in srgb, var(--primary, #22c55e) 18%, var(--border, #E2E8F0))",
                        borderWidth: 1.5,
                      },
                      "&:hover fieldset": {
                        borderColor:
                          "color-mix(in srgb, var(--primary, #22c55e) 35%, var(--border, #E2E8F0))",
                      },
                      "&.Mui-focused": {
                        bgcolor: "var(--card, #fff)",
                        boxShadow:
                          "0 0 0 3px color-mix(in srgb, var(--primary, #22c55e) 15%, transparent)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--primary, #22c55e)",
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography
                  component="label"
                  sx={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--foreground, #334155)",
                    mb: 1,
                  }}
                >
                  Şifre
                </Typography>
                <TextField
                  fullWidth
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  className="form-control-textfield"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock
                          sx={{
                            color: "var(--muted-foreground, #94A3B8)",
                            fontSize: 18,
                          }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label={
                            showPassword ? "Şifreyi gizle" : "Şifreyi göster"
                          }
                          sx={{ color: "var(--muted-foreground, #94A3B8)" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor:
                        "color-mix(in srgb, var(--primary, #22c55e) 4%, var(--card, #fff))",
                      borderRadius: 2,
                      transition: "all 0.2s ease-in-out",
                      "& fieldset": {
                        borderColor:
                          "color-mix(in srgb, var(--primary, #22c55e) 18%, var(--border, #E2E8F0))",
                        borderWidth: 1.5,
                      },
                      "&:hover fieldset": {
                        borderColor:
                          "color-mix(in srgb, var(--primary, #22c55e) 35%, var(--border, #E2E8F0))",
                      },
                      "&.Mui-focused": {
                        bgcolor: "var(--card, #fff)",
                        boxShadow:
                          "0 0 0 3px color-mix(in srgb, var(--primary, #22c55e) 15%, transparent)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--primary, #22c55e)",
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: "var(--border, #CBD5E1)",
                        "&.Mui-checked": { color: "var(--primary, #22c55e)" },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        color: "var(--muted-foreground, #475569)",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                    >
                      Beni hatırla
                    </Typography>
                  }
                />
                <Link
                  href="/forgot-password"
                  sx={{
                    color: "var(--primary, #16a34a)",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    transition: "color 0.2s ease-in-out",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Şifremi unuttum?
                </Link>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="medium"
                type="submit"
                disabled={loading || !username || !password}
                endIcon={
                  loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <ArrowForwardRounded />
                  )
                }
                sx={{
                  py: 1.5,
                  mt: 0.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  background:
                    "linear-gradient(135deg, var(--primary, #22c55e) 0%, var(--secondary, #16a34a) 100%)",
                  boxShadow:
                    "0 4px 16px color-mix(in srgb, var(--primary, #22c55e) 45%, transparent)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, color-mix(in srgb, var(--primary, #22c55e) 90%, #fff) 0%, var(--secondary, #15803d) 100%)",
                    boxShadow:
                      "0 6px 20px color-mix(in srgb, var(--primary, #22c55e) 50%, transparent)",
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": {
                    background: "var(--muted, #CBD5E1)",
                    boxShadow: "none",
                  },
                }}
              >
                {loading ? "Giriş yapılıyor..." : "Giriş yap"}
              </Button>
            </Box>
          </form>

          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop:
                "1px solid color-mix(in srgb, var(--primary, #22c55e) 12%, var(--border, #E2E8F0))",
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "var(--muted-foreground, #64748B)",
                display: "block",
                mb: 0.5,
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            >
              Finans & Ön Muhasebe Çözümünüz
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "var(--muted-foreground, #CBD5E1)",
                fontSize: "0.75rem",
              }}
            >
              Yardıma mı ihtiyacınız var?{" "}
              <Link
                href="#"
                sx={{
                  color: "var(--primary, #16a34a)",
                  textDecoration: "none",
                  fontWeight: 600,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Destek ekibiyle iletişime geçin
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
