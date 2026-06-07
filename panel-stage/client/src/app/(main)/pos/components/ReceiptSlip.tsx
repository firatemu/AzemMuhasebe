'use client';

import React, { useEffect, useRef } from 'react';
// @ts-ignore
import { QrCode } from '@/lib/qrcodegen';

export interface ReceiptItem {
    name: string;
    quantity: number;
    unitPrice: number;
    originalPrice: number | null;
    discountRate: number | null;
    lineTotal: number;
}

export interface ReceiptData {
    companyName: string;
    companySubtitle: string;
    date: string;
    time: string;
    cashRegister: string;
    documentNo: string;
    currentAccount: string | null;
    items: ReceiptItem[];
    subtotal: number;
    generalDiscount: number | null;
    generalDiscountRate: number | null;
    vatAmount: number;
    vatRate: number;
    grandTotal: number;
    paymentMethod: string;
    amountPaid: number | null;
    companyFullName: string;
    address: string;
    phone: string;
}

interface ReceiptSlipProps {
    data: ReceiptData;
}

const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
};

export const ReceiptSlip: React.FC<ReceiptSlipProps> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !data.documentNo) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const text = data.documentNo;
        const cell = 3;
        const quiet = 2;

        try {
            // @ts-ignore
            const qr = QrCode.encodeText(text, QrCode.Ecc.MEDIUM);
            const n = qr.size + quiet * 2;
            canvas.width = n * cell;
            canvas.height = n * cell;

            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#000';

            for (let r = 0; r < qr.size; r++) {
                for (let c = 0; c < qr.size; c++) {
                    if (qr.getModule(c, r)) {
                        ctx.fillRect((c + quiet) * cell, (r + quiet) * cell, cell, cell);
                    }
                }
            }
        } catch (e) {
            console.error('QR generation failed', e);
            canvas.style.display = 'none';
        }
    }, [data.documentNo]);

    return (
        <>
            <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

        .receipt-container {
          --paper: #ffffff;
          --ink: #000000;
          --ink-light: #333333;
          --ink-faint: #999999;
          --receipt-width: 302px;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'IBM Plex Mono', monospace;
          background: #f8fafc;
          padding: 20px 0;
        }

        .receipt-body-wrapper {
          width: var(--receipt-width);
          background: var(--paper);
          font-size: 9px;
          color: var(--ink);
          line-height: 1.5;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          position: relative;
        }
        
        .receipt-body-wrapper::before {
          content: "";
          position: absolute;
          top: -10px;
          left: 0;
          right: 0;
          height: 10px;
          background: linear-gradient(135deg, transparent 5px, var(--paper) 0) 0 5px,
                      linear-gradient(-135deg, transparent 5px, var(--paper) 0) 0 5px;
          background-position: center bottom;
          background-size: 10px 10px;
          background-repeat: repeat-x;
        }

        .receipt-body-wrapper::after {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 0;
          right: 0;
          height: 10px;
          background: linear-gradient(45deg, transparent 5px, var(--paper) 0) 0 5px,
                      linear-gradient(-45deg, transparent 5px, var(--paper) 0) 0 5px;
          background-position: center top;
          background-size: 10px 10px;
          background-repeat: repeat-x;
        }

        .receipt-header {
          background: #111;
          color: #fff;
          padding: 20px 14px 15px;
          text-align: center;
        }

        .company-name {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 16px;
          font-weight: 900;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .company-sub {
          font-size: 7px;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .header-rule {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.1);
          margin: 0 0 10px;
        }

        .header-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          font-size: 7px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 12px;
          font-weight: 600;
        }
        .header-grid span:nth-child(2) { text-align: center; }
        .header-grid span:nth-child(3) { text-align: right; }

        .bilgi-fisi-badge {
          display: inline-block;
          background: #fff;
          color: #000;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 4px 16px;
          border-radius: 1px;
        }

        .receipt-content { padding: 15px 16px; }

        .info-section { margin-bottom: 12px; }
        .info-row { display: flex; justify-content: space-between; font-size: 8.5px; line-height: 1.8; }
        .info-row .lbl { color: var(--ink-light); font-size: 7px; text-transform: uppercase; letter-spacing: 0.5px; }
        .info-row .val { text-align: right; font-weight: 700; color: var(--ink); }

        .dash { border: none; border-top: 1px dashed #ddd; margin: 10px 0; }

        .sec-label { font-size: 7px; letter-spacing: 1px; text-transform: uppercase; color: var(--ink-light); margin-bottom: 8px; display: flex; align-items: center; gap: 8px; font-weight: 700; }
        .sec-label::after { content: ''; flex: 1; height: 1px; background: #eee; }

        .items-header { display: grid; grid-template-columns: 1fr 30px 60px 60px; gap: 4px; font-size: 6.5px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--ink-light); padding-bottom: 6px; border-bottom: 1px solid #eee; margin-bottom: 8px; font-weight: 700; }
        .items-header span:not(:first-child) { text-align: right; }

        .item-row { margin-bottom: 10px; }
        .item-top { font-size: 9px; font-weight: 800; color: var(--ink); display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
        .discount-tag { font-size: 6.5px; font-weight: 900; border: 1.5px solid #000; padding: 0 3px; border-radius: 1px; line-height: 1.4; }
        .item-detail { display: grid; grid-template-columns: 1fr 30px 60px 60px; gap: 4px; font-size: 8px; color: var(--ink); }
        .item-detail span:not(:first-child) { text-align: right; }
        .strike { text-decoration: line-through; color: var(--ink-faint); font-size: 7px; margin-right: 2px; }

        .total-row { display: flex; justify-content: space-between; font-size: 8.5px; color: var(--ink); line-height: 2; }
        .total-row .tl { font-size: 7px; text-transform: uppercase; letter-spacing: 0.4px; font-weight: 600; }
        .total-row .tv { font-weight: 700; color: var(--ink); }

        .grand-row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 8px; padding-top: 10px; border-top: 2.5px solid #000; }
        .grand-lbl { font-family: 'IBM Plex Sans', sans-serif; font-size: 10px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; }
        .grand-amt { font-family: 'IBM Plex Sans', sans-serif; font-size: 22px; font-weight: 900; letter-spacing: -0.5px; }

        .pay-box { border: 1.5px solid #000; padding: 10px 12px; margin-top: 15px; }
        .pay-box-title { font-size: 7px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink-light); margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px dashed #eee; font-weight: 700; }
        .pay-row { display: flex; justify-content: space-between; font-size: 8.5px; line-height: 1.8; }
        .pay-row .pl { color: var(--ink); font-weight: 600; }
        .pay-row .pv { font-weight: 800; }

        .receipt-footer { border-top: 1px dashed #eee; padding: 15px 16px 20px; text-align: center; }
        .qr-wrap { display: flex; flex-direction: column; align-items: center; margin: 5px 0 15px; }
        #qr-canvas { display: block; image-rendering: pixelated; }
        .qr-label { font-size: 7px; color: var(--ink-light); letter-spacing: 2px; margin-top: 6px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; }
        .footer-company { font-size: 8px; color: var(--ink); line-height: 1.8; margin-bottom: 12px; }
        .footer-company strong { font-family: 'IBM Plex Sans', sans-serif; font-size: 9px; font-weight: 800; color: var(--ink); letter-spacing: 0.5px; display: block; margin-bottom: 2px; }
        .footer-disclaimer { font-size: 7px; color: var(--ink-light); line-height: 1.6; border-top: 1px dashed #eee; padding-top: 10px; font-style: italic; opacity: 0.8; }
        .footer-bye { font-family: 'IBM Plex Sans', sans-serif; font-size: 10px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; margin-top: 15px; color: #000; }
        
        @media print {
          body * { visibility: hidden; }
          #printable-receipt, #printable-receipt * { visibility: visible; }
          #printable-receipt { position: absolute; left: 0; top: 0; width: 100%; padding: 0; margin: 0; background: #fff; }
          .receipt-body-wrapper { box-shadow: none; }
          .receipt-container { background: white; padding: 0; }
          .receipt-body-wrapper::before, .receipt-body-wrapper::after { display: none; }
        }
      `}</style>

            <div className="receipt-container" id="printable-receipt">
                <div className="receipt-body-wrapper">
                    {/* HEADER */}
                    <div className="receipt-header">
                        <div className="company-name">{data.companyName}</div>
                        <div className="company-sub">{data.companySubtitle}</div>
                        <hr className="header-rule" />
                        <div className="header-grid">
                            <span>{data.date}</span>
                            <span>{data.time}</span>
                            <span>{data.cashRegister}</span>
                        </div>
                        <div className="bilgi-fisi-badge">BİLGİ FİŞİ</div>
                    </div>

                    {/* BODY */}
                    <div className="receipt-content">
                        <div className="info-section">
                            {data.currentAccount && (
                                <div className="info-row">
                                    <span className="lbl">Cari Hesap</span>
                                    <span className="val">{data.currentAccount}</span>
                                </div>
                            )}
                            <div className="info-row">
                                <span className="lbl">Belge No</span>
                                <span className="val">{data.documentNo}</span>
                            </div>
                        </div>

                        <hr className="dash" />

                        <div className="sec-label">Ürünler</div>

                        <div className="items-header">
                            <span>Ürün Adı</span>
                            <span>Adet</span>
                            <span>Birim</span>
                            <span>Toplam</span>
                        </div>

                        {data.items.map((item, index) => (
                            <div className="item-row" key={index}>
                                <div className="item-top">
                                    {item.name} {item.discountRate != null && item.discountRate > 0 && <span className="discount-tag">%{(item.discountRate).toFixed(0)}</span>}
                                </div>
                                <div className="item-detail">
                                    <span></span>
                                    <span>{item.quantity}</span>
                                    <span>
                                        {item.originalPrice != null && item.originalPrice !== item.unitPrice && <span className="strike">{formatCurrency(item.originalPrice)}</span>}{' '}
                                        {formatCurrency(item.unitPrice)}
                                    </span>
                                    <span style={{ fontWeight: 800 }}>{formatCurrency(item.lineTotal)}</span>
                                </div>
                            </div>
                        ))}

                        <hr className="dash" />

                        <div className="total-row">
                            <span className="tl">Ara Toplam</span>
                            <span className="tv">{formatCurrency(data.subtotal)}</span>
                        </div>

                        {data.generalDiscount != null && data.generalDiscount > 0 && (
                            <div className="total-row">
                                <span className="tl">Genel İndirim {data.generalDiscountRate ? `(%${data.generalDiscountRate})` : ''}</span>
                                <span className="tv">−{formatCurrency(data.generalDiscount)}</span>
                            </div>
                        )}

                        <div className="total-row">
                            <span className="tl">KDV (%{data.vatRate})</span>
                            <span className="tv">{formatCurrency(data.vatAmount)}</span>
                        </div>

                        <div className="grand-row">
                            <span className="grand-lbl">Toplam</span>
                            <span className="grand-amt">{formatCurrency(data.grandTotal)}</span>
                        </div>

                        <div className="pay-box">
                            <div className="pay-box-title">ÖDEME DETAYI</div>
                            <div className="pay-row">
                                <span className="pl">Yöntem</span>
                                <span className="pv">{data.paymentMethod}</span>
                            </div>
                            {data.amountPaid != null && (
                                <div className="pay-row" style={{ marginTop: 2 }}>
                                    <span className="pl">Ödenen</span>
                                    <span className="pv">{formatCurrency(data.amountPaid)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="receipt-footer">
                        <div className="qr-wrap">
                            <canvas ref={canvasRef} id="qr-canvas"></canvas>
                            <div className="qr-label">{data.documentNo}</div>
                        </div>

                        <div className="footer-company">
                            <strong>{data.companyFullName}</strong>
                            {data.address.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)}
                            Tel: {data.phone}
                        </div>

                        <div className="footer-disclaimer">
                            Bu belge bilgi amaçlıdır.<br />
                            Mali değeri yoktur.
                        </div>

                        <div className="footer-bye">Yine Bekleriz</div>
                    </div>
                </div>
            </div>
        </>
    );
};
