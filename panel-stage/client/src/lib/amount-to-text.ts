export function amountToText(amount: number): string {
    if (amount === 0) return 'Sıfır TL';

    const units = ['', 'Bir', 'İki', 'Üç', 'Dört', 'Beş', 'Altı', 'Yedi', 'Sekiz', 'Dokuz'];
    const tens = ['', 'On', 'Yirmi', 'Otuz', 'Kırk', 'Elli', 'Altmış', 'Yetmiş', 'Seksen', 'Doksan'];
    const scales = ['', 'Bin', 'Milyon', 'Milyar'];

    const convertBlock = (n: number): string => {
        let str = '';
        const h = Math.floor(n / 100);
        const t = Math.floor((n % 100) / 10);
        const u = n % 10;

        if (h > 0) {
            if (h === 1) str += 'Yüz ';
            else str += units[h] + ' Yüz ';
        }
        if (t > 0) str += tens[t] + ' ';
        if (u > 0) str += units[u] + ' ';

        return str.trim();
    };

    const integerPart = Math.floor(amount);
    const decimalPart = Math.round((amount - integerPart) * 100);

    let result = '';
    let tempInt = integerPart;
    let scaleIdx = 0;

    while (tempInt > 0) {
        const block = tempInt % 1000;
        if (block > 0) {
            let blockStr = convertBlock(block);
            // Special case for 'Bir Bin' -> we just say 'Bin'
            if (scaleIdx === 1 && block === 1) {
                blockStr = '';
            }
            result = `${blockStr} ${scales[scaleIdx]} ${result}`.trim();
        }
        scaleIdx++;
        tempInt = Math.floor(tempInt / 1000);
    }

    result = result.replace(/\s+/g, ' ').trim() + ' Türk Lirası';

    if (decimalPart > 0) {
        result += ` ${convertBlock(decimalPart)} Kuruş`;
    }

    return result;
}
