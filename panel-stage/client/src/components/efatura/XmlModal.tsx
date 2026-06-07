'use client';

import React, { useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import { Close, ContentCopy, Download } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

interface XmlModalProps {
  open: boolean;
  onClose: () => void;
  xml: string;
  document?: {
    ettn?: string;
    senderTitle?: string;
    invoiceNo?: string;
  } | null;
}

export default function XmlModal({ open, onClose, xml, document: docInfo }: XmlModalProps) {
  const [formattedXml, setFormattedXml] = React.useState('');
  const { enqueueSnackbar } = useSnackbar();

  // XML'i formatla
  React.useEffect(() => {
    if (!xml) {
      setFormattedXml('');
      return;
    }

    try {
      // Basit XML formatlama
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');

      if (xmlDoc.documentElement.nodeName === 'parsererror') {
        // XML parse edilemezse olduğu gibi göster
        setFormattedXml(xml);
      } else {
        // Prettier XML formatı
        const serializer = new XMLSerializer();
        const formatted = serializer.serializeToString(xmlDoc);

        // Basit indent ekleme (geliştirilebilir)
        let formattedResult = formatted
          .replace(/></g, '>\n<')
          .split('\n')
          .map((line, index, arr) => {
            const indent = (line.match(/^(\s*)/)?.[1]?.length || 0) / 2;
            const newIndent = '  '.repeat(Math.max(0, indent));
            return newIndent + line.trim();
          })
          .join('\n');

        setFormattedXml(formattedResult);
      }
    } catch (error) {
      // Hata durumunda orijinal XML'i göster
      setFormattedXml(xml);
    }
  }, [xml]);

  const handleCopy = () => {
    navigator.clipboard.writeText(xml);
    enqueueSnackbar('XML kopyalandı!', { variant: 'info' });
  };

  const handleDownload = () => {
    if (!xml) return;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docInfo?.ettn || 'document'}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
        },
      }}
    >
      <DialogTitle component="div">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" component="span">
              XML İçeriği
            </Typography>
            {docInfo?.ettn && (
              <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                ETTN: {docInfo.ettn}
              </Typography>
            )}
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        {docInfo && (
          <Box sx={{ mt: 1 }}>
            {docInfo.senderTitle && (
              <Typography variant="body2" color="text.secondary">
                Gönderen: {docInfo.senderTitle}
              </Typography>
            )}
            {docInfo.invoiceNo && (
              <Typography variant="body2" color="text.secondary">
                Fatura No: {docInfo.invoiceNo}
              </Typography>
            )}
          </Box>
        )}
      </DialogTitle>
      <DialogContent dividers>
        {xml ? (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: 'var(--muted)',
              maxHeight: 'calc(90vh - 200px)',
              overflow: 'auto',
            }}
          >
            <TextField
              multiline
              fullWidth
              value={formattedXml || xml}
              variant="outlined"
              InputProps={{
                readOnly: true,
                sx: {
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  '& textarea': {
                    overflow: 'auto !important',
                  },
                },
              }}
              minRows={20}
              maxRows={30}
            />
          </Paper>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">XML içeriği bulunamadı</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Tooltip title="XML'i Kopyala">
          <Button onClick={handleCopy} startIcon={<ContentCopy />} disabled={!xml}>
            Kopyala
          </Button>
        </Tooltip>
        <Tooltip title="XML'i İndir">
          <Button onClick={handleDownload} startIcon={<Download />} disabled={!xml}>
            İndir
          </Button>
        </Tooltip>
        <Button onClick={onClose} variant="contained">
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
}

