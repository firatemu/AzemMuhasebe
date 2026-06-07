const fs = require('fs');

const alisPagePath = '/home/azem/projects/muhasebe/panel-stage/client/src/app/fatura/alis/page.tsx';
const satisIadePagePath = '/home/azem/projects/muhasebe/panel-stage/client/src/app/fatura/iade/satis/page.tsx';

let content = fs.readFileSync(alisPagePath, 'utf8');

// Replacements

// 1. Component name
content = content.replace(/export default function AlisFaturalariPage\(\) \{/, 'export default function SatisIadeFaturalariPage() {');

// 2. Default state API param
content = content.replace(/faturaTipi: 'ALIS'/g, 'faturaTipi: \'SATIS_IADE\'');
// Default form parameter for faturaTipi (if they create via this modal - though usually returns are created from original)
content = content.replace(/faturaTipi: 'SATIS' as 'SATIS' \| 'ALIS'/g, 'faturaTipi: \'SATIS_IADE\' as \'SATIS_IADE\' | \'ALIS_IADE\'');
content = content.replace(/faturaTipi: 'SATIS',(?=\s+cariId)/g, 'faturaTipi: \'SATIS_IADE\',');

// 3. Titles and texts
content = content.replace(/Satın Alma Faturaları/g, 'Satış İade Faturaları');
content = content.replace(/Satın alma faturalarını yönetin/g, 'Satış iade faturalarını görüntüleyin ve yönetin');
content = content.replace(/Yeni Satın Alma Faturası/g, 'Yeni Satış İade Faturası');
content = content.replace(/Yeni Satın Alma İade Faturası/g, ''); // Will remove the return menu item

// Replace path for adding new
content = content.replace(/\/fatura\/alis\/yeni/g, '/fatura/iade/satis/yeni');
content = content.replace(/fatura-alis-yeni/g, 'fatura-iade-satis-yeni');
content = content.replace(/\/fatura\/alis\/duzenle/g, '/fatura/iade/satis/duzenle');
content = content.replace(/\/fatura\/alis\/print/g, '/fatura/iade/satis/print');

// Remove the `İade Oluştur` menu action block since it's already an iade
const returnMenuRegex = /<MenuItem[\s\S]*?key="return"[\s\S]*?onClick=\{\(\) => \{[\s\S]*?const path = `\/fatura\/iade\/alis\/yeni\?originalId=\$\{fatura\.id\}`;[\s\S]*?\}\][\s\S]*?<\/MenuItem>,/g;
content = content.replace(returnMenuRegex, '');


// Fix Colors (Change Amber gradient to Red gradient)
// Amber: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) -> Red: linear-gradient(135deg, #ef4444 0%, #dc2626 100%)
content = content.replace(/135deg, #f59e0b 0%, #d97706 100%/g, '135deg, #ef4444 0%, #dc2626 100%');
content = content.replace(/rgba\(245, 158, 11/g, 'rgba(239, 68, 68');
// Hover Background Amber -> Red Hover
content = content.replace(/135deg, #d97706 0%, #b45309 100%/g, '135deg, #dc2626 0%, #b91c1c 100%');
content = content.replace(/color: '#f59e0b'/g, 'color: \'#ef4444\'');
content = content.replace(/color="#f59e0b"/g, 'color="#ef4444"');

fs.writeFileSync(satisIadePagePath, content);
console.log('Done cloning and replacing!');
