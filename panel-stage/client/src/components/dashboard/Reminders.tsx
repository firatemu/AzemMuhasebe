'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Chip,
    List,
    ListItem,
    ListItemText,
    Badge,
    IconButton,
    Alert,
    Tooltip,
    Collapse,
    Button,
    ButtonGroup,
} from '@mui/material';
import {
    NotificationsActiveOutlined,
    TodayOutlined,
    EventOutlined,
    DateRangeOutlined,
    ExpandLess,
    PaymentOutlined,
    ArrowForward,
    CreditCardOutlined,
    ReceiptOutlined,
    DescriptionOutlined,
} from '@mui/icons-material';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

interface GunlukHatirlatici {
    personelOdemeleri: any[];
    vadesiGecenFaturalar: any[];
    krediTaksitleri: any[];
    krediKartiTarihleri: any[];
    cekSenetler: any[];
}

export default function Reminders() {
    const router = useRouter();
    const [hatirlaticilar, setHatirlaticilar] = useState<GunlukHatirlatici>({
        personelOdemeleri: [],
        vadesiGecenFaturalar: [],
        krediTaksitleri: [],
        krediKartiTarihleri: [],
        cekSenetler: [],
    });
    const [hatirlaticiOpen, setHatirlaticiOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [filtre, setFiltre] = useState<'bugun' | 'yarin' | 'bu-hafta'>('bugun');
    const [sesAktif, setSesAktif] = useState(false);

    const toplamHatirlatici =
        hatirlaticilar.personelOdemeleri.length +
        hatirlaticilar.vadesiGecenFaturalar.length +
        hatirlaticilar.krediTaksitleri.length +
        hatirlaticilar.krediKartiTarihleri.length +
        hatirlaticilar.cekSenetler.length;

    useEffect(() => {
        fetchGunlukHatirlaticilar();
    }, [filtre]);

    useEffect(() => {
        if (sesAktif && toplamHatirlatici > 0) {
            playNotificationSound();
        }
    }, [hatirlaticilar, sesAktif, toplamHatirlatici]);

    const playNotificationSound = () => {
        try {
            const audio = new Audio('/notification.mp3');
            audio.volume = 0.5;
            audio.play().catch((err) => console.log('Ses çalınamadı:', err));
        } catch (error) {
            console.log('Ses özelliği desteklenmiyor');
        }
    };

    const fetchGunlukHatirlaticilar = async () => {
        try {
            setLoading(true);

            // Authentication kontrolü - token yoksa isteği yapma
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.warn('Reminders: Authentication token bulunamadı, atlanıyor');
                    setLoading(false);
                    return;
                }
            }

            let baslangic = new Date();
            let bitis = new Date();
            baslangic.setHours(0, 0, 0, 0);
            bitis.setHours(23, 59, 59, 999);

            if (filtre === 'bugun') {
                // Bugün
            } else if (filtre === 'yarin') {
                baslangic.setDate(baslangic.getDate() + 1);
                bitis.setDate(bitis.getDate() + 1);
            } else if (filtre === 'bu-hafta') {
                bitis.setDate(bitis.getDate() + 7);
            }

            const formatDate = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const baslangicStr = formatDate(baslangic);
            const bitisStr = formatDate(bitis);

            // Fetch Personel
            const gun = new Date().getDate();
            const personelRes = await axios.get('/employees', { params: { aktif: true } });
            const personelData = Array.isArray(personelRes.data) ? personelRes.data : (personelRes.data?.data || []);

            let personelOdemeleri = [];
            if (filtre === 'bugun') {
                personelOdemeleri = personelData.filter((p: any) => {
                    if (!p.salaryDay) return false;
                    return p.salaryDay === gun;
                });
            }

            // Fetch Invoices
            let vadesiGecenFaturalar: any[] = [];
            try {
                const faturaRes = await axios.get('/invoices', { params: { limit: 100 } });
                const faturaData = Array.isArray(faturaRes.data) ? faturaRes.data : (faturaRes.data?.data || []);
                vadesiGecenFaturalar = faturaData.filter((f: any) =>
                    f.dueDate && new Date(f.dueDate) < new Date() && Number(f.remainingAmount) > 0
                ).slice(0, 5);
            } catch (faturaError) {
                console.warn('Faturalar yüklenirken hata oluştu (404 veya yetki hatası):', faturaError);
            }

            // Fetch Credit Cards
            let krediKartiTarihleri: any[] = [];
            try {
                const ccBitis = new Date();
                ccBitis.setDate(ccBitis.getDate() + 15);
                const ccRes = await axios.get('/banks/credit-cards/upcoming', {
                    params: { start: baslangicStr, end: ccBitis.toISOString() }
                });
                krediKartiTarihleri = Array.isArray(ccRes.data) ? ccRes.data : [];
            } catch (ccError) {
                console.warn('Kredi kartı tarihleri yüklenirken hata:', ccError);
            }

            // Fetch Installments
            let krediTaksitleri: any[] = [];
            try {
                const krediRes = await axios.get('/banks/installments/upcoming', {
                    params: { start: baslangicStr, end: bitisStr }
                });
                krediTaksitleri = Array.isArray(krediRes.data) ? krediRes.data : [];
            } catch (krediError) {
                console.warn('Kredi taksitleri yüklenirken hata:', krediError);
            }

            // Fetch Checks
            let cekSenetler: any[] = [];
            try {
                const cekRes = await axios.get('/checks-promissory-notes/upcoming', {
                    params: { startDate: baslangicStr, endDate: bitisStr }
                });
                cekSenetler = Array.isArray(cekRes.data) ? cekRes.data : [];
            } catch (cekError) {
                console.warn('Çek/Senet endpoint\'i çalışmıyor, atlanıyor:', cekError);
            }

            setHatirlaticilar({
                personelOdemeleri,
                vadesiGecenFaturalar,
                krediTaksitleri,
                krediKartiTarihleri,
                cekSenetler,
            });

        } catch (error) {
            console.error('Hatırlatıcılar yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    const ReminderSection = ({ title, icon: Icon, count, color, items, renderItem, link }: any) => {
        if (!items || items.length === 0) return null;

        return (
            <Card>
                <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Box sx={{
                            bgcolor: `color-mix(in srgb, ${color} 15%, transparent)`,
                            borderRadius: '8px',
                            p: 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Icon sx={{ color: color, fontSize: 20 }} />
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, flex: 1 }}>{title}</Typography>
                        <Chip label={count} size="small" sx={{ bgcolor: color, color: 'white', fontWeight: 600, height: 20, fontSize: '0.7rem' }} />
                    </Box>
                    <List dense sx={{ p: 0 }}>
                        {items.slice(0, 3).map(renderItem)}
                    </List>
                    {items.length > 3 && (
                        <Button
                            size="small"
                            fullWidth
                            onClick={() => router.push(link)}
                            sx={{ mt: 1, textTransform: 'none', color: 'text.secondary' }}
                        >
                            Tümünü Gör ({items.length})
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Badge
                    badgeContent={toplamHatirlatici}
                    color="error"
                    sx={{
                        '& .MuiBadge-badge': {
                            fontWeight: 700,
                            border: '2px solid var(--background)',
                        },
                    }}
                >
                    <IconButton
                        onClick={() => setHatirlaticiOpen(!hatirlaticiOpen)}
                        sx={{
                            width: 44,
                            height: 44,
                            bgcolor: hatirlaticiOpen ? 'var(--primary)' : 'var(--card)',
                            color: hatirlaticiOpen ? 'var(--primary-foreground)' : 'var(--foreground)',
                            border: '1px solid var(--border)',
                            boxShadow: 'var(--shadow-sm)',
                            '&:hover': {
                                bgcolor: hatirlaticiOpen ? 'var(--primary-hover)' : 'var(--muted)',
                            },
                        }}
                    >
                        <NotificationsActiveOutlined fontSize="small" />
                    </IconButton>
                </Badge>
            </Box>

            <Collapse in={hatirlaticiOpen}>
                {toplamHatirlatici > 0 && (
                    <Box sx={{ mb: 4, p: 2, border: '1px dashed var(--border)', borderRadius: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                            <Typography variant="h6" fontWeight="700">Hatırlatıcılar</Typography>
                            <ButtonGroup size="small" variant="outlined">
                                <Button onClick={() => setFiltre('bugun')} variant={filtre === 'bugun' ? 'contained' : 'outlined'}>Bugün</Button>
                                <Button onClick={() => setFiltre('yarin')} variant={filtre === 'yarin' ? 'contained' : 'outlined'}>Yarın</Button>
                                <Button onClick={() => setFiltre('bu-hafta')} variant={filtre === 'bu-hafta' ? 'contained' : 'outlined'}>Bu Hafta</Button>
                            </ButtonGroup>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>

                            {/* Personel */}
                            <ReminderSection
                                title="Maaş Ödemeleri"
                                icon={PaymentOutlined}
                                count={hatirlaticilar.personelOdemeleri.length}
                                color="var(--chart-2)"
                                items={hatirlaticilar.personelOdemeleri}
                                link="/hr/personel"
                                renderItem={(item: any) => (
                                    <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                                        <ListItemText
                                            primary={`👤 ${item.firstName} ${item.lastName || ''}`}
                                            secondary={`Maaş: ₺${item.salary} - Tarih: ${new Date().toLocaleDateString('tr-TR')}`}
                                            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
                                            secondaryTypographyProps={{ fontSize: '0.75rem' }}
                                        />
                                    </ListItem>
                                )}
                            />

                            {/* Banka */}
                            <ReminderSection
                                title="Kredi & Kartlar"
                                icon={CreditCardOutlined}
                                count={hatirlaticilar.krediTaksitleri.length + hatirlaticilar.krediKartiTarihleri.length}
                                color="var(--chart-4)"
                                items={[
                                    ...hatirlaticilar.krediTaksitleri.map(t => ({
                                        id: t.id,
                                        label: `${t.loan?.bankAccount?.bank?.name || 'Kredi'} - #${t.installmentNo}`,
                                        tutar: t.amount,
                                        tarih: t.dueDate
                                    })),
                                    ...hatirlaticilar.krediKartiTarihleri.map(k => ({
                                        id: k.id,
                                        label: `${k.bankName || k.name || 'KK'} (${k.lastFourDigits || '****'})`,
                                        tutar: null, // Ekstre tutarı bazen gelmeyebilir
                                        tarih: k.paymentDueDate
                                    }))
                                ]}
                                link="/bank"
                                renderItem={(item: any) => (
                                    <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                                        <ListItemText
                                            primary={`💳 ${item.label}`}
                                            secondary={`${item.tutar ? item.tutar + ' ₺ - ' : ''}Son Ödeme: ${item.tarih ? new Date(item.tarih).toLocaleDateString('tr-TR') : 'Tarih yok'}`}
                                            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
                                            secondaryTypographyProps={{ fontSize: '0.75rem' }}
                                        />
                                    </ListItem>
                                )}
                            />

                            {/* Faturalar */}
                            <ReminderSection
                                title="Vadesi Geçen Faturalar"
                                icon={ReceiptOutlined}
                                count={hatirlaticilar.vadesiGecenFaturalar.length}
                                color="var(--destructive)"
                                items={hatirlaticilar.vadesiGecenFaturalar}
                                link="/invoice"
                                renderItem={(item: any) => (
                                    <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                                        <ListItemText
                                            primary={`📄 ${item.account?.title || 'Cari'}`}
                                            secondary={`Tutar: ₺${item.remainingAmount || item.grandTotal} - Vade: ${new Date(item.dueDate || item.date).toLocaleDateString('tr-TR')}`}
                                            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
                                            secondaryTypographyProps={{ fontSize: '0.75rem', color: 'error.main' }}
                                        />
                                    </ListItem>
                                )}
                            />

                            {/* Çek/Senet */}
                            <ReminderSection
                                title="Çek & Senet"
                                icon={DescriptionOutlined}
                                count={hatirlaticilar.cekSenetler.length}
                                color="var(--chart-5)"
                                items={hatirlaticilar.cekSenetler}
                                link="/checks"
                                renderItem={(item: any) => (
                                    <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                                        <ListItemText
                                            primary={`📝 ${item.account?.title || 'Çek/Senet'}`}
                                            secondary={`Tutar: ₺${item.amount} - Vade: ${new Date(item.dueDate).toLocaleDateString('tr-TR')}`}
                                            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
                                            secondaryTypographyProps={{ fontSize: '0.75rem' }}
                                        />
                                    </ListItem>
                                )}
                            />
                        </Box>
                    </Box>
                )}
            </Collapse>
        </Box>
    );
}