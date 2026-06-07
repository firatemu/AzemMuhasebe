'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from '@/lib/axios';
import { getDistricts } from '@/lib/cities';
import CariFormDialog from './CariFormDialog';
import { prepareCariPayload } from './prepareCariPayload';
import { CariFormData, initialCariFormData } from './types';

interface NewCariDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  showSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function NewCariDialog({ open, onClose, onSuccess, showSnackbar }: NewCariDialogProps) {
  const [formData, setFormData] = useState<CariFormData>(initialCariFormData);
  const [selectedCity, setSelectedCity] = useState('İstanbul');
  const [satisElemanlari, setSatisElemanlari] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const availableDistricts = useMemo(() => getDistricts(selectedCity), [selectedCity]);

  useEffect(() => {
    const fetchSatisElemanlari = async () => {
      try {
        const response = await axios.get('/sales-agent');
        setSatisElemanlari(response.data || []);
      } catch (error) {
        console.error('Satış elemanları yüklenirken hata:', error);
      }
    };
    fetchSatisElemanlari();
  }, []);

  useEffect(() => {
    if (open) {
      const initForm = async () => {
        let nextCode = '';
        try {
          const response = await axios.get('/code-templates/preview-code/CUSTOMER');
          nextCode = response.data.nextCode || '';
        } catch (error) {
          console.log('Otomatik kod alınamadı, boş bırakılacak');
        }

        setFormData({
          ...initialCariFormData,
          cariKodu: nextCode || '',
        });
        setSelectedCity('İstanbul');
      };
      initForm();
    }
  }, [open]);

  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city);
    const districts = getDistricts(city);
    setFormData((prev) => ({ ...prev, il: city, ilce: districts[0] || 'Merkez' }));
  }, []);

  const handleFormChange = useCallback((field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAdd = async () => {
    if (!formData.unvan?.trim()) {
      showSnackbar('Ünvan boş olamaz', 'error');
      return;
    }

    const dataToSend = prepareCariPayload(formData);
    if (!dataToSend) {
      showSnackbar('Ünvan boş olamaz', 'error');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/account', dataToSend);
      showSnackbar('Cari başarıyla eklendi', 'success');
      onSuccess();
      onClose();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Cari eklenemedi', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CariFormDialog
      open={open}
      mode="create"
      formData={formData}
      availableDistricts={availableDistricts}
      satisElemanlari={satisElemanlari}
      isSaving={loading}
      onClose={onClose}
      onSubmit={handleAdd}
      onChange={handleFormChange}
      onCityChange={handleCityChange}
    />
  );
}
