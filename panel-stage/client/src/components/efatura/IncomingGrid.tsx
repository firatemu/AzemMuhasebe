'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
} from '@mui/x-data-grid';
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Receipt as ReceiptIcon,
  PictureAsPdf as PdfIcon,
  Code as CodeIcon,
  Business as BusinessIcon,
  Event as DateIcon
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import XmlModal from './XmlModal';
import InvoiceViewModal from './InvoiceViewModal';

interface IncomingDocument {
  id?: number;
  ettn: string;
  uuid?: string;
  senderVkn: string;
  senderTitle: string;
  invoiceNo?: string;
  invoiceDate?: string;
  rawXml?: string;
  createdAt?: string;
  payableAmount?: number;
  status?: string;
  statusExp?: string;
}

interface IncomingGridProps {
  onViewXml?: (xml: string, document: IncomingDocument) => void;
  startDate?: Date | null;
  endDate?: Date | null;
}

export default function IncomingGrid({ onViewXml, startDate, endDate }: IncomingGridProps) {
  const theme = useTheme();
  const [selectedDocument, setSelectedDocument] = useState<IncomingDocument | null>(null);
  const [xmlModalOpen, setXmlModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  const formatDateForApi = (date: Date | null): string | undefined => {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['hizli-incoming', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', formatDateForApi(startDate) || '');
      if (endDate) params.append('endDate', formatDateForApi(endDate) || '');

      const queryString = params.toString();
      const url = `/hizli/incoming${queryString ? `?${queryString}` : ''}`;
      const response = await axios.get(url);

      if (!response.data.success) {
        throw new Error(response.data.message || 'E-faturalar getirilemedi');
      }
      return response.data.documents || [];
    },
    refetchInterval: 30000,
    retry: 2,
    retryDelay: 1000,
  });

  useEffect(() => {
    const handleRefresh = (event: Event) => {
      refetch();
    };
    window.addEventListener('refresh-incoming-grid', handleRefresh);
    return () => window.removeEventListener('refresh-incoming-grid', handleRefresh);
  }, [refetch]);

  const documents: IncomingDocument[] = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.map((doc: any, index: number) => {
      const uuid = doc.UUID || doc.uuid || '';
      const documentId = doc.DocumentId || doc.documentId || '';
      const issueDate = doc.IssueDate || doc.issueDate || null;
      const createdDate = doc.CreatedDate || doc.createdDate || null;
      const targetTitle = doc.TargetTitle || doc.targetTitle || '';
      const targetIdentifier = doc.TargetIdentifier || doc.targetIdentifier || '';
      const payableAmount = doc.PayableAmount || doc.payableAmount || null;
      const status = doc.Status || doc.status || null;
      const statusExp = doc.StatusExp || doc.statusExp || null;

      return {
        id: doc.id || index,
        ettn: uuid,
        uuid: uuid,
        senderVkn: targetIdentifier,
        senderTitle: targetTitle,
        invoiceNo: documentId,
        invoiceDate: issueDate ? (typeof issueDate === 'string' ? issueDate : new Date(issueDate).toISOString()) : undefined,
        rawXml: doc.rawXml || doc.RawXml || doc.xml || doc.XML || null,
        createdAt: createdDate ? (typeof createdDate === 'string' ? createdDate : new Date(createdDate).toISOString()) : undefined,
        payableAmount: payableAmount ? parseFloat(String(payableAmount)) : undefined,
        status: status ? String(status) : undefined,
        statusExp: statusExp ? String(statusExp) : undefined,
      };
    });
  }, [data]);

  const handleDownloadXml = async (doc: IncomingDocument) => {
    if (!doc.rawXml) return;
    const blob = new Blob([doc.rawXml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.ettn || 'document'}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async (docInfo: IncomingDocument) => {
    if (!docInfo.uuid && !docInfo.ettn) return;
    try {
      const uuid = docInfo.uuid || docInfo.ettn;
      const response = await axios.get(`/hizli/document-content?uuid=${uuid}&type=PDF`);
      if (!response.data?.content) throw new Error('PDF bulunamadı');

      const binaryString = atob(response.data.content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);

      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${docInfo.invoiceNo || docInfo.ettn || 'invoice'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF error:', error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'invoiceNo',
      headerName: 'Fatura Bilgisi',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
            {params.value || 'Faturasız'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.65rem', fontFamily: 'monospace' }}>
            {params.row.ettn?.substring(0, 18)}...
          </Typography>
        </Box>
      ),
    },
    {
      field: 'senderTitle',
      headerName: 'Gönderen',
      width: 250,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{params.value}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>VKN: {params.row.senderVkn}</Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'invoiceDate',
      headerName: 'Tarih',
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{params.value ? new Date(params.value).toLocaleDateString('tr-TR') : '-'}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            Geliş: {params.row.createdAt ? new Date(params.row.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'payableAmount',
      headerName: 'Tutar',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 900, color: 'success.main' }}>
          {params.value ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(params.value) : '-'}
        </Typography>
      ),
    },
    {
      field: 'statusExp',
      headerName: 'Durum',
      width: 180,
      renderCell: (params: GridRenderCellParams) => {
        const status = params.value || params.row.statusExp;
        if (!status) return '-';

        let color: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';
        if (status.includes('Kabul') || status.includes('Onaylandı')) color = 'success';
        else if (status.includes('Bekliyor') || status.includes('Cevap')) color = 'warning';
        else if (status.includes('Reddedildi') || status.includes('Hatalı') || status.includes('İptal')) color = 'error';

        return (
          <Chip
            label={status}
            size="small"
            color={color}
            sx={{ fontWeight: 800, fontSize: '0.7rem', borderRadius: 1.5 }}
          />
        );
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'İşlemler',
      width: 150,
      getActions: (params: GridRowParams) => {
        const doc = params.row as IncomingDocument;
        return [
          <GridActionsCellItem
            key="view-invoice"
            icon={<Tooltip title="Görüntüle"><ReceiptIcon sx={{ color: 'primary.main' }} /></Tooltip>}
            label="Görüntüle"
            onClick={() => { setSelectedDocument(doc); setInvoiceModalOpen(true); }}
            disabled={!doc.uuid && !doc.ettn}
          />,
          <GridActionsCellItem
            key="view-xml"
            icon={<Tooltip title="XML"><CodeIcon sx={{ color: 'info.main' }} /></Tooltip>}
            label="XML"
            onClick={() => { setSelectedDocument(doc); setXmlModalOpen(true); }}
            disabled={!doc.rawXml}
          />,
          <GridActionsCellItem
            key="download-pdf"
            icon={<Tooltip title="PDF İndir"><PdfIcon sx={{ color: 'error.main' }} /></Tooltip>}
            label="PDF"
            onClick={() => handleDownloadPdf(doc)}
            disabled={!doc.uuid && !doc.ettn}
          />,
          <GridActionsCellItem
            key="download-xml"
            icon={<Tooltip title="XML İndir"><DownloadIcon sx={{ color: 'text.secondary' }} /></Tooltip>}
            label="XML İndir"
            onClick={() => handleDownloadXml(doc)}
            disabled={!doc.rawXml}
          />,
        ];
      },
    },
  ];

  return (
    <>
      <Box sx={{ height: '100%', width: '100%' }}>
        <DataGrid
          rows={documents}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[25, 50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
            '& .MuiDataGrid-cell': {
              borderColor: 'divider',
              py: 1
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.02)
            }
          }}
          getRowHeight={() => 'auto'}
        />
      </Box>

      <XmlModal
        open={xmlModalOpen}
        onClose={() => { setXmlModalOpen(false); setSelectedDocument(null); }}
        xml={selectedDocument?.rawXml || ''}
        document={selectedDocument}
      />

      <InvoiceViewModal
        open={invoiceModalOpen}
        onClose={() => { setInvoiceModalOpen(false); setSelectedDocument(null); }}
        document={selectedDocument}
      />
    </>
  );
}
