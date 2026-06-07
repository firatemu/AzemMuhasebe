type PermissionRequirement = {
  module: string;
  action: string;
};

const MENU_PERMISSION_MAP: Record<string, PermissionRequirement> = {
  dashboard: { module: "analytics", action: "view" },
  stock: { module: "product", action: "list" },
  "stock-material-list": { module: "product", action: "list" },
  "stock-price-cards": { module: "product", action: "list" },
  "stock-material-movements": { module: "product", action: "list" },
  "stock-category-management": { module: "product", action: "list" },
  "stock-brand-management": { module: "product", action: "list" },
  "stock-unit-sets": { module: "unit-set", action: "list" },
  "stock-sales-prices": { module: "product", action: "list" },
  "stock-purchase-prices": { module: "product", action: "list" },
  "stock-bulk-sales-price-update": { module: "product", action: "update" },
  "stock-costing": { module: "product", action: "view" },
  "stock-critical-stock-management": { module: "warehouse", action: "view" },
  accounts: { module: "account", action: "list" },
  "accounts-list": { module: "account", action: "list" },
  "accounts-invoice-closing": { module: "account", action: "view" },
  "accounts-reports-debit-credit": { module: "account", action: "view" },
  "accounts-maturity-analysis": { module: "account", action: "view" },
  "sales-management": { module: "invoice", action: "list" },
  invoice: { module: "invoice", action: "list" },
  "invoice-sales": { module: "invoice", action: "list" },
  "invoice-purchase": { module: "invoice", action: "list" },
  "invoice-return-sales": { module: "invoice", action: "list" },
  "invoice-return-purchase": { module: "invoice", action: "list" },
  "invoice-profitability": { module: "reporting", action: "view" },
  "invoice-archive": { module: "invoice", action: "list" },
  "invoice-incoming-e-invoice": { module: "invoice", action: "list" },
  "delivery-notes": { module: "order", action: "list" },
  "sales-delivery-note-list": { module: "order", action: "list" },
  "purchase-delivery-note-list": { module: "order", action: "list" },
  orders: { module: "order", action: "list" },
  "orders-sales": { module: "order", action: "list" },
  "orders-purchase": { module: "order", action: "list" },
  quotes: { module: "quote", action: "list" },
  "quotes-sales": { module: "quote", action: "list" },
  "quotes-purchase": { module: "quote", action: "list" },
  finance: { module: "collection", action: "list" },
  collection: { module: "collection", action: "list" },
  bank: { module: "bank", action: "list" },
  "bank-accounts": { module: "bank", action: "list" },
  "bank-credit-operations": { module: "bank", action: "list" },
  "bank-transfer-incoming": { module: "bank", action: "list" },
  "bank-transfer-outgoing": { module: "bank", action: "list" },
  "bank-transfer-deleted": { module: "bank", action: "list" },
  "checks-promissory-notes": { module: "check-bill", action: "list" },
  "checks-promissory-notes-list": { module: "check-bill", action: "list" },
  "checks-new": { module: "check-bill", action: "create" },
  "checks-reports": { module: "check-bill", action: "view" },
  "payroll-bordro": { module: "check-bill", action: "list" },
  payments: { module: "payment", action: "list" },
  cash: { module: "cashbox", action: "list" },
  hr: { module: "hr", action: "list" },
  "hr-personnel": { module: "hr", action: "list" },
  "hr-salary": { module: "hr", action: "view" },
  "hr-advances": { module: "hr", action: "view" },
  "company-vehicles": { module: "vehicle", action: "list" },
  expense: { module: "expense", action: "list" },
  warehouse: { module: "warehouse", action: "list" },
  "warehouse-warehouses": { module: "warehouse", action: "list" },
  "warehouse-transfer-note": { module: "warehouse", action: "list" },
  "warehouse-transfer": { module: "warehouse", action: "create" },
  "warehouse-inventory-count": { module: "warehouse", action: "list" },
  "warehouse-stock-report": { module: "warehouse", action: "view" },
  "warehouse-reports": { module: "warehouse", action: "view" },
  "pos-menu": { module: "pos", action: "view" },
  pos: { module: "pos", action: "view" },
  "pos-v2": { module: "pos", action: "view" },
  reporting: { module: "reporting", action: "view" },
  "reporting-general": { module: "reporting", action: "view" },
  "reporting-portfolio": { module: "check-bill", action: "view" },
  "reporting-sales-staff": { module: "reporting", action: "view" },
  "reporting-accounts-risk": { module: "reporting", action: "view" },
  management: { module: "analytics", action: "view" },
  "ceo-dashboard": { module: "analytics", action: "view" },
  settings: { module: "settings", action: "view" },
  "settings-check-bill": { module: "settings", action: "view" },
  "settings-quick-menu": { module: "settings", action: "view" },
  "settings-sales-staff": { module: "sales-agent", action: "list" },
  "settings-number-templates": { module: "settings", action: "view" },
  "settings-parameters": { module: "settings", action: "view" },
  "admin-logs": { module: "settings", action: "view" },
  "settings-company": { module: "settings", action: "view" },
  authorization: { module: "users", action: "list" },
  "authorization-users": { module: "users", action: "list" },
  "authorization-roles": { module: "roles", action: "list" },
  "data-import": { module: "settings", action: "create" },
  "data-import-accounts": { module: "account", action: "create" },
  "data-import-material": { module: "product", action: "create" },
  "data-import-sales-price": { module: "product", action: "create" },
  "data-import-purchase-price": { module: "product", action: "create" },
};

const ROUTE_PERMISSION_RULES: Array<{
  prefix: string;
  permission: PermissionRequirement;
}> = [
  { prefix: "/dashboard", permission: { module: "analytics", action: "view" } },
  {
    prefix: "/management",
    permission: { module: "analytics", action: "view" },
  },
  {
    prefix: "/stock/unit-sets",
    permission: { module: "unit-set", action: "list" },
  },
  {
    prefix: "/stock/critical-stock-management",
    permission: { module: "warehouse", action: "view" },
  },
  {
    prefix: "/stock/bulk-sales-price-update",
    permission: { module: "product", action: "update" },
  },
  {
    prefix: "/stock/costing",
    permission: { module: "product", action: "view" },
  },
  { prefix: "/stock", permission: { module: "product", action: "list" } },
  { prefix: "/accounts", permission: { module: "account", action: "list" } },
  {
    prefix: "/maturity-analysis",
    permission: { module: "account", action: "view" },
  },
  {
    prefix: "/invoice/profitability",
    permission: { module: "reporting", action: "view" },
  },
  { prefix: "/invoice", permission: { module: "invoice", action: "list" } },
  {
    prefix: "/sales-delivery-note",
    permission: { module: "order", action: "list" },
  },
  {
    prefix: "/purchase-delivery-note",
    permission: { module: "order", action: "list" },
  },
  { prefix: "/orders", permission: { module: "order", action: "list" } },
  {
    prefix: "/purchase-orders",
    permission: { module: "order", action: "list" },
  },
  { prefix: "/quotes", permission: { module: "quote", action: "list" } },
  {
    prefix: "/collection",
    permission: { module: "collection", action: "list" },
  },
  { prefix: "/bank-transfer", permission: { module: "bank", action: "list" } },
  { prefix: "/bank", permission: { module: "bank", action: "list" } },
  {
    prefix: "/checks/new",
    permission: { module: "check-bill", action: "create" },
  },
  {
    prefix: "/checks/reports",
    permission: { module: "check-bill", action: "view" },
  },
  { prefix: "/checks", permission: { module: "check-bill", action: "list" } },
  { prefix: "/payroll", permission: { module: "check-bill", action: "list" } },
  { prefix: "/payments", permission: { module: "payment", action: "list" } },
  { prefix: "/cash", permission: { module: "cashbox", action: "list" } },
  { prefix: "/hr", permission: { module: "hr", action: "list" } },
  {
    prefix: "/company-vehicles",
    permission: { module: "vehicle", action: "list" },
  },
  { prefix: "/expense", permission: { module: "expense", action: "list" } },
  {
    prefix: "/inventory-count",
    permission: { module: "warehouse", action: "list" },
  },
  {
    prefix: "/warehouse/operations/transfer",
    permission: { module: "warehouse", action: "create" },
  },
  { prefix: "/warehouse", permission: { module: "warehouse", action: "list" } },
  { prefix: "/pos", permission: { module: "pos", action: "view" } },
  { prefix: "/pos-v2", permission: { module: "pos", action: "view" } },
  { prefix: "/reporting", permission: { module: "reporting", action: "view" } },
  {
    prefix: "/reports/portfolio",
    permission: { module: "check-bill", action: "view" },
  },
  {
    prefix: "/settings/sales-staff",
    permission: { module: "sales-agent", action: "list" },
  },
  { prefix: "/settings", permission: { module: "settings", action: "view" } },
  {
    prefix: "/authorization/roller",
    permission: { module: "roles", action: "list" },
  },
  { prefix: "/authorization", permission: { module: "users", action: "list" } },
  {
    prefix: "/data-import/cari-hesap-aktarim",
    permission: { module: "account", action: "create" },
  },
  {
    prefix: "/data-import/malzeme-aktarim",
    permission: { module: "product", action: "create" },
  },
  {
    prefix: "/data-import/satis-fiyat-aktarim",
    permission: { module: "product", action: "create" },
  },
  {
    prefix: "/data-import/satin-alma-fiyat-aktarim",
    permission: { module: "product", action: "create" },
  },
];

export function canViewMenuItem(
  item: { id?: string },
  permissions: string[],
): boolean {
  if (item.id === "menu") return true;
  if (permissions.includes("ALL")) return true;

  const requirement = item.id ? MENU_PERMISSION_MAP[item.id] : undefined;
  if (!requirement) return true;

  return permissions.includes(`${requirement.module}.${requirement.action}`);
}

export function hasPermission(
  permissions: string[],
  requirement: PermissionRequirement,
): boolean {
  return (
    permissions.includes("ALL") ||
    permissions.includes(`${requirement.module}.${requirement.action}`)
  );
}

export function getRoutePermission(
  pathname: string,
): PermissionRequirement | null {
  if (pathname === "/" || pathname === "/menu") return null;

  const matchingRule = ROUTE_PERMISSION_RULES.find(
    (rule) =>
      pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`),
  );

  return matchingRule?.permission ?? null;
}

export function filterMenuItemsByPermission<
  T extends { id?: string; subItems?: T[] },
>(items: T[], permissions: string[]): T[] {
  return items
    .map((item) => {
      const subItems = item.subItems
        ? filterMenuItemsByPermission(item.subItems, permissions)
        : undefined;

      if (
        !canViewMenuItem(item, permissions) &&
        (!subItems || subItems.length === 0)
      ) {
        return null;
      }

      return {
        ...item,
        ...(subItems ? { subItems } : {}),
      };
    })
    .filter((item): item is T => item !== null);
}
