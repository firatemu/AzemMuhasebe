import re

alis_path = '/home/azem/projects/muhasebe/panel-stage/client/src/app/fatura/alis/page.tsx'
satis_iade_path = '/home/azem/projects/muhasebe/panel-stage/client/src/app/fatura/iade/satis/page.tsx'

with open(alis_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Component name
content = re.sub(r'export default function AlisFaturalariPage\(\) \{', 'export default function SatisIadeFaturalariPage() {', content)

# 2. Default state API param
content = content.replace("faturaTipi: 'ALIS'", "faturaTipi: 'SATIS_IADE'")
content = content.replace("faturaTipi: 'SATIS' as 'SATIS' | 'ALIS'", "faturaTipi: 'SATIS_IADE' as 'SATIS_IADE' | 'ALIS_IADE'")
content = re.sub(r"faturaTipi: 'SATIS',(?=\s+cariId)", "faturaTipi: 'SATIS_IADE',", content)

# 3. Titles and texts
content = content.replace('Satın Alma Faturaları', 'Satış İade Faturaları')
content = content.replace('Satın alma faturalarını yönetin', 'Satış iade faturalarını görüntüleyin ve yönetin')
content = content.replace('Yeni Satın Alma Faturası', 'Yeni Satış İade Faturası')
content = content.replace('Yeni Satın Alma İade Faturası', '') # Clean return string

# Replace path for adding new
content = content.replace('/fatura/alis/yeni', '/fatura/iade/satis/yeni')
content = content.replace('fatura-alis-yeni', 'fatura-iade-satis-yeni')
content = content.replace('/fatura/alis/duzenle', '/fatura/iade/satis/duzenle')
content = content.replace('/fatura/alis/print', '/fatura/iade/satis/print')

# Replace exact strings for missing content
content = content.replace('Henüz satın alma faturası bulunmamaktadır', 'Henüz satış iade faturası bulunmamaktadır')

# Remove the `İade Oluştur` menu action block
return_menu_regex = r'<MenuItem\s+key="return"[\s\S]*?onClick=\{\(\) => \{[\s\S]*?const path = `/fatura/iade/alis/yeni\?originalId=\$\{fatura\.id\}`;[\s\S]*?\}\][\s\S]*?</MenuItem>,'
content = re.sub(return_menu_regex, '', content)

# Remove `faturaData.aciklama` default in form creation if we want, or just leave it.

# Fix Colors (Change Amber gradient to Red gradient)
content = content.replace('135deg, #f59e0b 0%, #d97706 100%', '135deg, #ef4444 0%, #dc2626 100%')
content = content.replace('rgba(245, 158, 11', 'rgba(239, 68, 68')
content = content.replace('135deg, #d97706 0%, #b45309 100%', '135deg, #dc2626 0%, #b91c1c 100%')
content = content.replace("color: '#f59e0b'", "color: '#ef4444'")
content = content.replace('color="#f59e0b"', 'color="#ef4444"')

# Add specific label change
content = content.replace('Satın Alma Faturası Düzenle', 'Satış İade Faturası Düzenle')
content = content.replace('Yeni Satış Faturası', 'Yeni Satış İade Faturası')
content = content.replace('Satış Faturası Düzenle', 'Satış İade Faturası Düzenle')

with open(satis_iade_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Done cloning and replacing!')
