'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
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
  Divider,
  Grid,
} from '@mui/material';
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  ArrowForwardRounded,
  Calculate,
  Receipt,
  Inventory,
  AccountBalance,
  ShowChart,
  VerifiedUser,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import axios from '@/lib/axios';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/login', {
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
      };

      await fetch('/api/auth/cookies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          refreshToken,
          tenantId: user.tenantId,
          user: slimUser,
        }),
      });

      router.push('/menu');
    } catch (err: unknown) {
      const ax = err as { response?: { status?: number; data?: { message?: string } } };
      const status = ax.response?.status;
      const msg = ax.response?.data?.message;
      if (status === 503) {
        setError(msg || 'API sunucusuna bağlanılamadı. Backend çalışıyor mu?');
      } else {
        setError(msg || 'Giriş başarısız');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#0F172A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    );
  }

  const features = [
    { icon: <Calculate />, title: 'Otomatik Hesaplama', desc: 'KDV, stopaj ve mahsup otomatik hesaplanır' },
    { icon: <Receipt />, title: 'E-Fatura & E-İrsaliye', desc: 'GIB entegrasyonu ile anlık gönderim' },
    { icon: <Inventory />, title: 'Stok Takibi', desc: 'Lot,批次 ve birim dönüşümü ile tam kontrol' },
    { icon: <AccountBalance />, title: 'Cari Muhasebe', desc: 'Borç/alacak takibi ve vade yönetimi' },
  ];

  const stats = [
    { value: '50K+', label: 'Aktif Firma' },
    { value: '10M+', label: 'İşlem Hacmi' },
    { value: '99.9%', label: 'Çalışma Süresi' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: '#F8FAFC',
      }}
    >
      {/* Sol Panel - Yeni Tasarım */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flex: '0 0 48%',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#0F172A',
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              linear-gradient(180deg, #0F172A 0%, #1E293B 100%)
            `,
          }}
        />

        {/* Grid Pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            p: { lg: 5, xl: 6 },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Logo & Title */}
          <Box sx={{ mb: 5 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -4,
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899)',
                  opacity: 0.3,
                  filter: 'blur(8px)',
                  zIndex: -1,
                },
              }}
            >
              <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800 }}>
                Ö
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '2rem',
                mb: 1.5,
                letterSpacing: '-0.03em',
              }}
            >
              OtoMuhasebe
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600,
                fontSize: '1.1rem',
                letterSpacing: '-0.01em',
              }}
            >
              Akıllı Muhasebe Platformu
            </Typography>
          </Box>

          {/* Stats Row */}
          <Box
            sx={{
              display: 'flex',
              gap: 4,
              mb: 6,
              px: 3,
            }}
          >
            {stats.map((stat, index) => (
              <Box key={index} sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#3B82F6',
                    fontWeight: 800,
                    fontSize: '1.75rem',
                    lineHeight: 1,
                    mb: 0.5,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Feature Cards - Vertical Layout */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
              maxWidth: 340,
            }}
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(59, 130, 246, 0.3)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#3B82F6',
                    flexShrink: 0,
                  }}
                >
                  {feature.icon}
                </Box>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#FFFFFF',
                      fontWeight: 600,
                      mb: 0.25,
                      fontSize: '0.875rem',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '0.75rem',
                      lineHeight: 1.4,
                    }}
                  >
                    {feature.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Bottom Badge */}
          <Box
            sx={{
              mt: 5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2.5,
              py: 1,
              bgcolor: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '20px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <VerifiedUser sx={{ fontSize: 16, color: '#3B82F6' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
              KVKK Uyumlu · 256-bit SSL · Yedekli Altyapı
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Sağ Panel - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
        }}
      >
        {/* Mobile Logo */}
        <Box
          sx={{
            display: { lg: 'none' },
            position: 'absolute',
            top: 24,
            left: 24,
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#3B82F6',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
              Ö
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: '#1E293B',
              fontWeight: 700,
            }}
          >
            OtoMuhasebe
          </Typography>
        </Box>

        {/* Form Container */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 380,
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                color: '#1E293B',
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                mb: 1.5,
                letterSpacing: '-0.02em',
              }}
            >
              Hoş geldiniz
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#64748B',
                fontSize: '0.9rem',
              }}
            >
              Hesabınıza giriş yaparak yönetim paneline erişin
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                bgcolor: '#FEF2F2',
                color: '#991B1B',
                border: '1px solid #FECACA',
                '& .MuiAlert-icon': {
                  color: '#DC2626',
                },
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Username Field */}
              <Box>
                <Typography
                  component="label"
                  sx={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#334155',
                    mb: 1,
                  }}
                >
                  Kullanıcı Adı veya E-posta
                </Typography>
                <TextField
                  fullWidth
                  placeholder="ornek@firma.com"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="username"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#94A3B8', fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#FFFFFF',
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '& fieldset': {
                        borderColor: '#E2E8F0',
                        borderWidth: 1.5,
                      },
                      '&:hover': {
                        '& fieldset': {
                          borderColor: '#CBD5E1',
                        },
                      },
                      '&.Mui-focused': {
                        '& fieldset': {
                          borderColor: '#3B82F6',
                          borderWidth: 2,
                        },
                      },
                    },
                    '& .MuiInputBase-input': {
                      py: 1.25,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: '#1E293B',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#64748B',
                      fontWeight: 500,
                    },
                  }}
                />
              </Box>

              {/* Password Field */}
              <Box>
                <Typography
                  component="label"
                  sx={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#334155',
                    mb: 1,
                  }}
                >
                  Şifre
                </Typography>
                <TextField
                  fullWidth
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#94A3B8', fontSize: 18 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                          sx={{ color: '#94A3B8' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#FFFFFF',
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '& fieldset': {
                        borderColor: '#E2E8F0',
                        borderWidth: 1.5,
                      },
                      '&:hover': {
                        '& fieldset': {
                          borderColor: '#CBD5E1',
                        },
                      },
                      '&.Mui-focused': {
                        '& fieldset': {
                          borderColor: '#3B82F6',
                          borderWidth: 2,
                        },
                      },
                    },
                    '& .MuiInputBase-input': {
                      py: 1.25,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: '#1E293B',
                    },
                  }}
                />
              </Box>

              {/* Remember & Forgot */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: '#CBD5E1',
                        '&.Mui-checked': {
                          color: '#3B82F6',
                        },
                        '& .MuiSvgIcon-root': {
                          borderRadius: 1.5,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{ color: '#475569', fontWeight: 500, fontSize: '0.875rem' }}
                    >
                      Beni hatırla
                    </Typography>
                  }
                />
                <Link
                  href="/forgot-password"
                  sx={{
                    color: '#3B82F6',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: '#2563EB',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Şifremi unuttum?
                </Link>
              </Box>

              {/* Submit Button */}
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
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  bgcolor: '#3B82F6',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#2563EB',
                    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.5)',
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&:disabled': {
                    bgcolor: '#CBD5E1',
                    boxShadow: 'none',
                  },
                }}
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş yap'}
              </Button>
            </Box>
          </form>

          {/* Footer */}
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: '1px solid #E2E8F0',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#94A3B8',
                display: 'block',
                mb: 0.5,
                fontWeight: 500,
                fontSize: '0.75rem',
              }}
            >
              ERP Çözüm Ortağınız
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#CBD5E1', fontSize: '0.75rem' }}
            >
              Yardıma mı ihtiyacınız var?{' '}
              <Link
                href="#"
                sx={{
                  color: '#3B82F6',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
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
