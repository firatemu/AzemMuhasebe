'use client';

import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Tabs, Tab, CircularProgress, Chip, TextField, useTheme, alpha, Divider } from '@mui/material';
import { usePosStore } from '@/stores/posStore';
import axios from '@/lib/axios';

interface Product {
  id: string;
  name: string;
  salePrice?: number;
  satisFiyati?: number;
  vatRate?: number;
  mainCategory?: string;
  hasVariants?: boolean;
}

export default function ProductGrid() {
  const theme = useTheme();
  const { addToCart, setVariantDialogOpen, setSelectedProductForVariant } = usePosStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  // Kategorileri çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        const kategoriData = response.data || [];
        const kategoriMap: Record<string, string[]> = {};
        kategoriData.forEach((k: { mainCategory: string; subCategories: string[] }) => {
          kategoriMap[k.mainCategory] = k.subCategories || [];
        });
        setCategories(kategoriMap);
      } catch (error) {
        console.error('Kategori listesi alınamadı:', error);
      }
    };
    fetchCategories();
  }, []);

  // Ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/products', {
          params: {
            search: searchQuery || undefined,
            limit: 100,
            page: 1,
          },
        });
        const rawData = response.data.data || [];
        setProducts(rawData);
      } catch (error) {
        console.error('Ürün listesi alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  // Kategori filtreleme
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter((product) => product.mainCategory === selectedCategory);
  }, [products, selectedCategory]);

  const handleProductClick = (product: Product) => {
    const vatRate = product.vatRate || 20;
    const netPrice = parseFloat(String(product.salePrice || product.satisFiyati || 0));
    const inclusivePrice = netPrice * (1 + vatRate / 100);

    if (product.hasVariants) {
      setSelectedProductForVariant({
        productId: product.id,
        name: product.name,
        unitPrice: inclusivePrice,
        vatRate: vatRate,
      });
      setVariantDialogOpen(true);
    } else {
      addToCart({
        productId: product.id,
        name: product.name,
        quantity: 1,
        unitPrice: inclusivePrice,
        vatRate: vatRate,
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', bgcolor: 'background.default' }}>
      {/* Category Tabs */}
      <Box sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <Tabs
          value={selectedCategory}
          onChange={(e, newValue) => setSelectedCategory(newValue as string)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 56,
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              bgcolor: 'primary.main',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
              minWidth: 100,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
          }}
        >
          <Tab label="Tümü" value="all" />
          {Object.keys(categories).map((kategori) => (
            <Tab key={kategori} label={kategori} value={kategori} />
          ))}
        </Tabs>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3, overflow: 'hidden' }}>
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            size="medium"
            placeholder="Ürün ara veya barkod gir..."
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            id="pos-search-input"
            slotProps={{
              input: {
                startAdornment: (
                  <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center', color: 'text.disabled' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </Box>
                ),
                sx: {
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { borderColor: 'primary.main' },
                  '&.Mui-focused': { borderColor: 'primary.main', boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}` },
                  '& fieldset': { display: 'none' },
                  height: 54,
                  fontWeight: 600
                }
              }
            }}
          />
        </Box>

        {/* Product List */}
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5 }}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 2.5,
            }}>
              {filteredProducts.map((product) => (
                <Box
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  sx={{
                    position: 'relative',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    p: 2.5,
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    minHeight: '210px',
                    justifyContent: 'space-between',
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                      borderColor: 'primary.main',
                      transform: 'translateY(-4px)',
                      '& .product-price-tag': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        transform: 'scale(1.05)'
                      },
                      '& .category-accent': {
                        width: '60%',
                        opacity: 1
                      }
                    },
                    '&:active': {
                      transform: 'translateY(0) scale(0.98)'
                    }
                  }}
                >
                  {/* Category Accent Selection */}
                  <Box
                    className="category-accent"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '30%',
                      height: '4px',
                      bgcolor: 'primary.main',
                      borderRadius: '0 0 4px 4px',
                      opacity: 0.3,
                      transition: 'all 0.3s ease'
                    }}
                  />

                  {/* Product Name */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.3,
                      fontSize: '0.9rem'
                    }}
                  >
                    {product.name}
                  </Typography>

                  <Box sx={{ width: '100%', mt: 'auto' }}>
                    {/* Price Tag */}
                    <Box
                      className="product-price-tag"
                      sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.75,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.text.primary, 0.04),
                        color: 'text.primary',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        transition: 'all 0.2s ease',
                        mb: 1.5,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      {formatCurrency(
                        parseFloat(String(product.salePrice || product.satisFiyati || 0)) * (1 + (product.vatRate || 20) / 100)
                      )}
                    </Box>

                    {/* Variant / Info Chip */}
                    <Box sx={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {product.hasVariants ? (
                        <Chip
                          label="VARYANT SEÇ"
                          size="small"
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            fontWeight: 800,
                            borderRadius: 1,
                            fontSize: '0.6rem',
                            letterSpacing: '0.05em',
                            height: 20
                          }}
                        />
                      ) : (
                        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          Hızlı Ekle +
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Empty State */}
            {filteredProducts.length === 0 && !loading && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 256, textAlign: 'center', py: 8 }}>
                <Box component="span" sx={{ fontSize: '4rem', mb: 2 }}>📦</Box>
                <Typography variant="h6" sx={{ color: 'var(--muted)', mb: 1 }}>
                  Ürün bulunamadı
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>
                  Farklı bir arama terimi deneyin veya kategori değiştirin
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}