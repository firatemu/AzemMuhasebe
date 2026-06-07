"use client";

import React, { useEffect, useState } from 'react';
import { useCheck, useCheckCollections } from '@/hooks/use-checks';
import { formatAmount, formatDate } from '@/lib/format';
import { amountToText } from '@/lib/amount-to-text';

export default function PrintReceiptClient({ checkId }: { checkId: string }) {
    const { data: check, isLoading: isCheckLoading } = useCheck(checkId);
    const { data: collections, isLoading: isColsLoading } = useCheckCollections(checkId);
    const [targetCollection, setTargetCollection] = useState<{
        collectionDate: string;
        collectedAmount: number;
        cashbox?: { name?: string };
        bankAccount?: { name?: string };
    } | null>(null);

    useEffect(() => {
        if (collections && collections.length > 0) {
            setTargetCollection(
                [...collections].sort(
                    (a, b) => new Date(b.collectionDate).getTime() - new Date(a.collectionDate).getTime()
                )[0]
            );
        }
    }, [collections]);

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
      @page { size: A4 portrait; margin: 15mm 20mm; }
      body { font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; color: #000; background: #fff; margin:0; padding:20px; }
      h1 { font-size: 18pt; text-align: center; text-transform: uppercase; letter-spacing: 2pt; margin-bottom:5px;}
      .receipt-box { border: 2px solid #000; padding: 20px; margin-top: 20px; border-radius: 8px; }
      .row { display: flex; justify-content: space-between; border-bottom: 1px dotted #999; padding: 10px 0; }
      .row:last-child { border-bottom: none; }
      .label { font-weight: bold; width: 200px; display: inline-block; }
      .value { flex: 1; text-align: right; }
      .signatures { display: flex; justify-content: space-between; margin-top: 60px; padding: 0 40px; }
      .signatures div { text-align: center; width: 200px; }
      .signatures .line { border-top: 1px solid #000; margin-top: 60px; padding-top: 5px; }
      .amount-hero { text-align: center; font-size: 24pt; font-weight: bold; margin: 30px 0 10px 0; padding: 20px; border: 1px solid #000; background: #f9f9f9;}
      .amount-words { text-align: center; font-style: italic; margin-bottom: 30px; font-size: 12pt; }
      @media screen {
        body { background: #525659; display: flex; justify-content: center; padding: 40px; }
        .page-container { background: white; padding: 15mm 20mm; width: 210mm; min-height: 297mm; box-shadow: 0 0 10px rgba(0,0,0,0.5); }
        .screen-actions { position: fixed; top: 20px; right: 20px; display: flex; gap: 10px; }
        .screen-actions button { padding: 10px 15px; cursor: pointer; background: #1976d2; color: white; border: none; border-radius: 4px; font-weight:bold; }
        .screen-actions button.secondary { background: #fff; color: #333; }
      }
    `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    if (isCheckLoading || isColsLoading) return <div>Yükleniyor...</div>;
    if (!check || !targetCollection)
        return <div>Yazdırılacak tahsilat makbuzu bulunamadı. (Hiç tahsilat girilmemiş olabilir)</div>;

    return (
        <>
            <div className="screen-actions">
                <button type="button" className="secondary" onClick={() => window.close()}>
                    Kapat
                </button>
                <button type="button" onClick={() => window.print()}>
                    Yazdır
                </button>
            </div>

            <div className="page-container">
                <h1>TAHSİLAT MAKBUZU</h1>
                <p style={{ textAlign: 'center', marginTop: 0 }}>Tarih: {formatDate(targetCollection.collectionDate)}</p>

                <div className="receipt-box">
                    <div className="row">
                        <span className="label">ÖDEME YAPAN:</span>
                        <span className="value">{check.account?.title}</span>
                    </div>
                    <div className="row">
                        <span className="label">EVRAK BİLGİSİ:</span>
                        <span className="value">
                            Çek No: {check.checkNo || '-'} - {check.bank ? `${check.bank} ${check.branch || ''}` : '-'}
                        </span>
                    </div>
                    <div className="row">
                        <span className="label">EVRAK VADESİ:</span>
                        <span className="value">{formatDate(check.dueDate)}</span>
                    </div>
                    <div className="row">
                        <span className="label">EVRAK NOMİNAL TUTARI:</span>
                        <span className="value">{formatAmount(check.amount)}</span>
                    </div>
                </div>

                <div className="amount-hero">{formatAmount(targetCollection.collectedAmount)}</div>
                <div className="amount-words">Yalnızca: {amountToText(targetCollection.collectedAmount)}</div>

                <div className="row" style={{ borderBottom: 'none' }}>
                    <span className="label">Tahsilat Yeri:</span>
                    <span className="value">
                        {targetCollection.cashbox?.name || targetCollection.bankAccount?.name || 'Belirtilmedi'}
                    </span>
                </div>

                <div className="signatures">
                    <div>
                        <p>
                            <strong>Tahsil Eden</strong>
                        </p>
                        <div className="line">İmza / Kaşe</div>
                    </div>
                    <div>
                        <p>
                            <strong>Ödeme Yapan</strong>
                        </p>
                        <div className="line">İmza / Kaşe</div>
                    </div>
                </div>
            </div>
        </>
    );
}
