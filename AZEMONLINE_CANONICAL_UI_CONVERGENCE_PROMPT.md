# AZEMONLINE — APPLICATION-WIDE CANONICAL UI CONVERGENCE (FRONTEND ONLY)

## 0. Role and Mission

You are an autonomous senior frontend engineer working inside the AzemOnline monorepo at
`/home/azem/projects/azemonline`.

Your mission: converge **every user-facing production frontend surface outside `/accounts/**`** onto the
single canonical component system that is represented in the Design Lab at
`http://panel.azemonline.localhost:15480/design-system`, working **one page family at a time**, and never
leaving a page family until it is 100% complete.

This is a UI convergence, not a redesign, not a refactor of business logic, and not a backend task.

Treat everything in this prompt as binding architectural requirements. Do not narrow, widen, or reinterpret
the scope.

---

## 1. Absolute Scope Boundary

### IN SCOPE (frontend only)

- All production pages, nested routes, dynamic routes, list/create/edit/detail pages, dashboards, reports,
  forms, tabs, side panels.
- Main navigation, navigation groups, submenus, flyouts, mobile navigation, collapsed menus, contextual
  menus, page action menus.
- Every child surface reachable from a page: Dialog, Modal, Drawer, Sheet, Popover, Tooltip, Dropdown,
  Context Menu, Action Menu, confirmation windows, lookup/selection windows, create/edit/detail windows,
  nested windows opened by other windows.
- Every DataGrid and every DataGrid toolbar/action.
- Loading / empty / error / no-results UI states.
- Any other frontend surface a user can see.

### OUT OF SCOPE (never touch, never open as a sub-program)

- Backend code, API endpoint design, services on the server side.
- Database schema, migrations, seeds, data migrations, local or remote DB operations.
- Authentication, tenant, subscription, or SaaS product architecture.
- Infrastructure, deployment, production environment.
- Unrelated business-logic refactors.
- `git push`, deploy, or any production mutation. **PUSH = NONE. DEPLOY = NONE. PRODUCTION MUTATION = NONE.**
  Work locally only unless the owner explicitly instructs otherwise.

If you encounter a backend limitation (e.g., the API does not support a filter), bind the frontend to the
real API behavior. Never fabricate frontend filter metadata or capabilities that the API does not provide.
Do not convert a UI migration into a backend program.

---

## 2. Project Context

- Stack: Next.js 16, React 19, TypeScript strict, Tailwind CSS v4, CSS variables, pnpm via Corepack.
- Local panel runtime: `http://panel.azemonline.localhost:15480`
- Design Lab runtime: `http://panel.azemonline.localhost:15480/design-system`
- Canonical UI boundary: `@azem/ui`
- Canonical DataGrid: `@azem/datagrid` (component `AzemDataGrid`)
- Canonical notifications: `@azem/notifications`
- Design direction: **Precision Enterprise / Operational Luxury** — implemented through alignment,
  hierarchy, spacing, typography, surface, component consistency, restrained motion. Never through
  decoration, gradients, glassmorphism, pills everywhere, cards everywhere, or generic admin-template looks.
  You do not need to design anything: the canonical components already embody this. Your job is to use them.

---

## 3. Architectural Invariants (non-negotiable)

1. **LAB COMPONENT = REAL APPLICATION COMPONENT.** The component shown in the Design Lab and the component
   used in production must be the same real, imported canonical component. Never copy Design Lab JSX/CSS
   into feature code. Never imitate a canonical look with feature CSS.
2. **ONE DESIGN LANGUAGE · ONE COMPONENT SYSTEM · ONE TECHNOLOGY PER CONCERN · ONE TYPOGRAPHY SYSTEM ·
   ONE RESPONSIVE STANDARD · ONE DATA ACCESS PATTERN · NEW DEPENDENCY DEFAULT DENY ·
   LEGACY PROD CONSUMER TARGET ZERO.**
3. No domain- or product-forked generic components (`StockButton`, `FinanceButton`, `AccountingButton`,
   `RetailInput`, etc.). Generic = one canonical component. Theme identity is applied via the theme
   contract, never by forking component behavior.
4. Tokens are layered `primitive → semantic → component`. Features must not build component skins from
   raw palette values or hardcoded generic visuals.
5. Light mode and dark mode are both first-class and must both be verified.
6. Business-specific components (e.g., `StockMovementTimeline`, `InvoiceTotalsSummary`, `CustomerLookup`)
   may exist, but every generic element inside them (Button, Input, Select, Combobox, Badge, Dialog, etc.)
   must be the canonical component. A business wrapper wraps business logic around a canonical control;
   it never draws its own control UI.

### 3.1 Feature CSS ownership

Feature CSS MAY own: business page grid/flex layout, business-specific positioning, domain-specific
visualization, responsive page composition, print layout, special business geometry.

Feature CSS MUST NOT own: Button/Input/Select/Combobox/Dialog/Drawer/Popover/Badge/Tabs/Card/Surface/
DataGrid skins; generic borders, radii, shadows, control typography, hover/focus, dark-mode component
styling; old generic color palettes; ancestor selectors that override canonical components.

Acceptable:

```css
.stock-page-layout {
  display: grid;
  grid-template-columns: ...;
}
```

Not acceptable:

```css
.stock-save-button {
  background: ...;
  border-radius: ...;
  color: ...;
}
```

### 3.2 INTERNAL_ONLY technologies

The following may be used only inside canonical component implementations, never directly in feature/
production code: `@base-ui/react`, `lucide-react`, `sonner`, `@tanstack/react-table`,
`@tanstack/react-virtual`, `react-day-picker`, CVA.

Feature code must use the owned boundaries instead: the icon registry/boundary (not `lucide-react`),
`@azem/datagrid` (not TanStack), `@azem/notifications` (not Sonner), canonical date controls (not
DayPicker).

---

## 4. Ground-Truth Reset (read carefully)

Previous migration programs produced reports claiming "0 consumers", "typecheck PASS", "guard PASS",
"migration CLOSED". Owner runtime inspection proved those reports did not establish page completion: many
pages were 10–30% migrated (some components new, some old; old DataGrid; old Dialog; old feature CSS; old
nested windows) and **no page was 100% done**.

Therefore:

- **`/accounts/**` = OWNER-ACCEPTED CANONICAL REFERENCE.** Do not re-migrate Accounts feature source.
  Use it as the runtime and DataGrid reference (especially `/accounts/reports/debit-credit` and
  `/accounts`). If you fix a defect in a central component, run an Accounts regression smoke test.
- **Every other production page family starts as `UNVERIFIED`.** This includes Projects (the earlier
  pilot) and all of Stock. Previous reports may help you understand what was changed, but they carry
  **zero completion authority**.
- Truth comes only from: current source + canonical public API contract + real runtime verification.

---

## 5. Working Model — PAGE ATOMIC COMPLETION

The atomic unit of work is **one user-facing page family**. A page family is a route plus its directly
connected workflow routes (`/entity`, `/entity/new`, `/entity/[id]`, `/entity/[id]/edit`) plus every child
surface any of them opens.

**You may not start another page family until the current one is `PASS`.**
Partial results ("main page done, dialogs later", "mostly canonical", "DataGrid later", "core components
done") are prohibited outcomes. Either the page family is `PASS` or it is `IN_PROGRESS`.

### 5.1 The workflow for each page family

```text
SELECT ONE PAGE FAMILY
  ↓
DISCOVER THE COMPLETE UI TREE (recursive, see §6)
  ↓
CLASSIFY EVERY USER-FACING UI CONCERN (generic vs business-specific)
  ↓
REPLACE ALL LEGACY GENERIC UI WITH THE REAL CANONICAL COMPONENT
  ↓
REPLACE EVERY OLD DATAGRID WITH THE SEALED CANONICAL AzemDataGrid (§8)
  ↓
FOLLOW AND CLOSE EVERY DIALOG / DRAWER / MODAL / POPOVER / MENU / LOOKUP / CONFIRMATION / CHILD ROUTE
  ↓
REMOVE DEAD GENERIC CSS AND DEAD LEGACY UI CODE
  ↓
RUN THE REAL LOCAL RUNTIME AND CLICK THROUGH EVERY SURFACE (§10)
  ↓
REPAIR UNTIL LEGACY = 0 AND UNKNOWN = 0
  ↓
RECORD PAGE PASS IN THE PAGE MATRIX (§11)
  ↓
ONLY THEN: NEXT PAGE FAMILY
```

### 5.2 Ordering

1. Before migrating anything, build the complete application page matrix (§11) by enumerating every
   production menu entry, route, child route, and reachable surface outside `/accounts/**`.
2. Then process page families in this order: Projects (small pilot domain) → Stock (owner has observed
   the most mixed legacy/canonical state here) → all remaining domains, each domain completed before the
   next. Within a domain, finish list + create + edit + detail families together.

---

## 6. Complete Surface Discovery (required) vs Presentation Archaeology (forbidden)

Inspecting only `page.tsx` is insufficient. Follow the UI-producing component dependency tree recursively,
for example:
`page.tsx → StockMaterialsPage → MaterialsToolbar → MaterialsWorkspace → MaterialDataGrid →
MaterialDialogHost → MaterialEditDialog → CustomerLookup → ConfirmationDialog`.

**REQUIRED — discover completely:**
Does this page have Buttons? How many Dialogs open? Is there a DataGrid? Which business fields does it
show? Which filters does the API really support? Which action calls which callback? Where does "New" open?
Is Edit a route or a dialog? Which lookup windows exist? Does this Dialog open another Dialog? What
loading/empty/error states exist?

**FORBIDDEN — do not investigate:**
Why the old Button had 6px radius, how the old toolbar was spaced, which border the old Dialog used, how
the old pagination looked, what color the old Select was. Old generic UI is **not** a design source.
Do not normalize, preserve, or approximate the old appearance.

```text
OLD PRESENTATION ARCHAEOLOGY   = FORBIDDEN
COMPLETE PAGE SURFACE DISCOVERY = REQUIRED
```

Example surface tree that must be fully closed for one page family:

```text
/stock/materials
├── PageHeader
├── Toolbar / actions
├── DataGrid
│   ├── Search
│   ├── Filtre Oluştur (Filter Builder)
│   ├── Column Management
│   ├── Density
│   ├── Pagination
│   └── Row Action Menu
├── New (Dialog / Page / Drawer)
│   ├── Input / Select / Combobox / Date controls
│   ├── Validation
│   ├── Buttons
│   └── Nested lookup
├── Edit
├── Detail
├── Delete confirmation
├── Lookup dialogs
└── Nested child surfaces
```

If any node in this tree is legacy → `PAGE COMPLETE = FALSE`.

---

## 7. Component Replacement Algorithm

For every generic UI concern discovered:

```text
DETECT GENERIC UI TYPE
  ↓
FIND CANONICAL COUNTERPART in @azem/ui / @azem/datagrid / @azem/notifications public API
  ↓
DELETE THE OLD GENERIC PRESENTATION
  ↓
USE THE REAL CANONICAL COMPONENT (import, do not copy)
  ↓
CONNECT BUSINESS DATA / CALLBACKS / VALIDATION / QUERY / PERMISSIONS
  ↓
REMOVE DEAD LEGACY UI CODE AND CSS
  ↓
VERIFY IN REAL RUNTIME
```

Canonical mapping (non-exhaustive):

| Legacy generic UI                         | Canonical replacement                              |
| ----------------------------------------- | -------------------------------------------------- |
| local Button                              | `Button` / `IconButton`                            |
| local Input / Textarea                    | `Input` / `Textarea`                               |
| local Select                              | `Select`                                           |
| searchable selection                      | `Combobox`                                         |
| checkbox / radio / switch                 | canonical `Checkbox` / `Radio` / `Switch`          |
| date pickers                              | canonical date controls                            |
| status pill                               | `StatusBadge`                                      |
| old Modal                                 | `Dialog`                                           |
| old side panel                            | `Drawer`                                           |
| old popup                                 | `Popover`                                          |
| old tooltip                               | `Tooltip`                                          |
| old dropdown / context / action menu      | canonical Menu / Context Menu / `ActionMenu`       |
| old tabs                                  | `Tabs`                                             |
| old page header / breadcrumb              | `PageHeader` / `Breadcrumb`                        |
| ad-hoc cards                              | canonical Card / Surface                           |
| ad-hoc loading / empty / error            | `LoadingState` / `EmptyState` / `ErrorState`       |
| toasts                                    | `@azem/notifications`                              |
| any table workspace                       | sealed `AzemDataGrid` from `@azem/datagrid`        |

### 7.1 Business logic must be preserved exactly

Do not change: business data, labels, API calls, services, queries, mutations, validation semantics,
permissions, navigation, CRUD behavior, calculations, business callbacks, business state, business rules,
lookup semantics, server filtering semantics. Only rebind them to canonical UI. If an old customer select
contains customer API lookup, tenant filtering, permission checks, and transformations, all of that stays;
only the visual control becomes the canonical `Combobox`.

```text
CustomerLookup
    |
business API/query logic
    |
canonical Combobox
```

### 7.2 Missing canonical component

If a page needs a genuinely generic component with no canonical equivalent:

1. Confirm the need is truly generic (not business-specific).
2. Confirm no canonical equivalent exists in the public boundary.
3. Build it once inside the central system (`@azem/ui` or the appropriate canonical package).
4. Export it from the public canonical boundary.
5. Add **exactly one** standalone showcase to the Design Lab (variants/states inside that one showcase;
   usage inside composite/golden screens does not count as a duplicate; internal helper primitives do not
   need a standalone showcase).
6. Make the application use that same real component.
7. Continue the same page migration.

Never write a generic component inside a feature. Never open a separate long-running "Button Program",
"Select Program", or "Dialog Program". The DataGrid centralization is already complete; use it as-is and
fix the center only for concrete defects.

---

## 8. DataGrid Acceptance Contract

`@azem/datagrid` is a **data workspace**, not a table. It owns all generic DataGrid UX:
Search UI and state · `Filtre Oluştur` button · Filter Builder UI/open state · generic conditions ·
field/operator/value UI · AND/OR · Apply/Clear/Reset · Density · Column Management · Saved Views · Refresh ·
Export · Fullscreen · Pagination · canonical page-size policy (**default 50; options 50 / 150 / 250 /
Hepsi**) · toolbar · loading/empty/no-results/error · row behavior · action presentation · styling ·
light/dark treatment.

The feature provides **only business input**: rows/data, business columns, row id, business renderers,
typed `filterFields`, API/query mapping, business actions, permissions, navigation callbacks, server
totals, data fetching execution.

Canonical filter flow:

```text
business filter metadata
→ canonical DataGridFilterBuilder
→ canonical filter state
→ business query adapter
→ existing API
→ filtered rows
```

**`import { AzemDataGrid }` alone proves nothing.** A page's DataGrid is canonical only when ALL of the
following hold in source:

- no old grid presentation
- no feature DataGrid toolbar
- no feature Search UI
- no feature filter button / builder / dialog
- no feature pagination UI
- no feature `pageSizeOptions`
- no feature density UI
- no feature column manager
- no feature fullscreen / refresh / export presentation
- no DataGrid CSS skin
- no direct internal DataGrid imports
- no direct TanStack usage

And ALL of the following are verified in runtime:

- Search
- `Filtre Oluştur` and actual filtering
- Density
- Column Management
- Pagination with 50 / 150 / 250 / Hepsi
- Refresh / Export / Fullscreen where applicable
- loading / empty / error
- business row actions

Reference for expected behavior: `/accounts/reports/debit-credit` and `/accounts`.

---

## 9. Navigation and Child Surfaces

- Navigation UI (main nav, groups, submenus, flyouts, mobile nav, collapsed states, contextual menus, page
  action menus) is in scope for generic appearance. Do not change the business route/permission structure.
- A parent page can be `PASS` only if **every reachable child surface** is `PASS`. The chain
  `PAGE → New → Create Dialog → Customer Lookup → nested Select Popover → Confirmation` is one unit.
- A canonical list page that navigates to a legacy edit/detail route is **not** complete; close the whole
  page family.

---

## 10. Runtime Verification (mandatory)

Source scan is never sufficient. For every page family, in the real local runtime:

- Open the page; open every action (New, Edit, Detail, Delete, Actions, Filter, Export, menus, tabs).
- Verify for each surface: render, open, close, cancel, save, validation, reopen, nested UI,
  keyboard/focus where relevant, **light mode**, **dark mode**, no runtime exceptions in console.
- Exercise the DataGrid per §8.
- Confirm business behavior is unchanged (CRUD, filters, navigation, permissions).

If the local runtime is not running, bring it up using the repository's existing scripts. If it cannot be
started for reasons you cannot recover from, report `TRUE_BLOCKER` for that page family — do not mark
anything `PASS` without runtime evidence.

**The acceptance equation:**

```text
SOURCE COMPLETENESS + SURFACE COMPLETENESS + REAL RUNTIME = PAGE PASS
```

TypeScript PASS, lint PASS, grep = 0, canonical import present, legacy import absent, architecture guard
PASS, tests PASS are necessary signals but **never sufficient**.

---

## 11. Page Status, Metrics, and the Page Matrix

Allowed statuses per page family: `UNVERIFIED` · `IN_PROGRESS` · `PASS` · `TRUE_BLOCKER`.
Not statuses: "mostly migrated", "mostly canonical", "main page done", "core components done",
"dialogs later", "DataGrid later", "partial complete".

Maintain a machine-readable page matrix at `docs/frontend/canonical-ui-page-matrix.json` (or the
repository's existing convention if one exists). For every page family record at minimum:

```text
PAGE_ROUTE, DOMAIN, CHILD_ROUTES
UI_COMPONENTS_DISCOVERED, UI_COMPONENTS_CANONICAL
LEGACY_GENERIC_UI_REMAINING                      = 0 required
UNKNOWN_UI_REMAINING                             = 0 required
DATAGRIDS_DISCOVERED, OLD_DATAGRIDS_REMAINING    = 0 required
DIALOGS_DISCOVERED, LEGACY_DIALOGS_REMAINING     = 0 required
DRAWERS_DISCOVERED, LEGACY_DRAWERS_REMAINING     = 0 required
OTHER_CHILD_SURFACES_DISCOVERED, LEGACY_CHILD_SURFACES_REMAINING = 0 required
FEATURE_GENERIC_VISUAL_SKINS                     = 0 required
DIRECT_INTERNAL_ONLY_UI_CONSUMERS                = 0 required
PAGE_RUNTIME                                     = PASS required (light + dark)
PAGE_BUSINESS_REGRESSION                         = 0 required
PAGE_ATOMIC_COMPLETION                           = PASS | IN_PROGRESS | UNVERIFIED | TRUE_BLOCKER
```

If any zero-gate is non-zero, the page is not `PASS` and you do not move on. Update the matrix as the
page's status changes; the matrix is a ledger, not a prose report. The source of truth remains current
source + canonical API + runtime.

---

## 12. Validation Policy (task-scaled)

Do not run the full suite/build after every micro edit. Do not escalate validation level unless the task
scope requires it.

- **V0 visual micro:** runtime check of the component; scoped lint; TypeScript only if TS changed.
- **V1 component:** focused tests; scoped lint; typecheck; runtime.
- **V2 cross-cutting (e.g., a central component fix):** affected regression including Accounts smoke;
  typecheck; build only if a package boundary requires it; relevant architecture gates.
- **V3 application closure:** full tests, full lint, typecheck, build, release gates — **once**, at the
  end.

---

## 13. Application Completion and Propagation Proof

Application completion is derived mechanically, never asserted in prose:

```text
PAGE 1 = PASS … PAGE N = PASS → DOMAIN PASS
ALL DOMAINS PASS → APPLICATION PASS
```

Final zero state (excluding Accounts):

```text
LEGACY_GENERIC_COMPONENT_CONSUMERS        = 0
PARALLEL_GENERIC_IMPLEMENTATIONS          = 0
FEATURE_GENERIC_VISUAL_SKINS              = 0
OLD_GENERIC_COLOR_TOKEN_CONSUMERS         = 0
DIRECT_INTERNAL_ONLY_PRODUCTION_CONSUMERS = 0
UNKNOWN_UI_OWNERSHIP                      = 0
OLD_DATAGRID_PRESENTATIONS                = 0
FEATURE_DATAGRID_GENERIC_UI               = 0
LEGACY_GENERIC_DIALOGS                    = 0
LEGACY_GENERIC_DRAWERS                    = 0
LEGACY_GENERIC_MODALS                     = 0
LEGACY_GENERIC_POPOVERS                   = 0
LEGACY_GENERIC_CONFIRMATION_WINDOWS       = 0
UNMIGRATED_CHILD_SURFACES                 = 0
UNVERIFIED_PAGES                          = 0
PARTIAL_PAGES                             = 0
```

**Propagation proof (final stage):** make a temporary, clearly diagnostic change to a representative
canonical component (and to the canonical DataGrid). Without editing any feature file, confirm the change
appears in the Design Lab and in several domains (e.g., Stock, Finance, Invoice). Then revert the
diagnostic change. Expected:

```text
FEATURE_FILES_EDITED_FOR_PROPAGATION  = 0
APPLICATION_WIDE_CENTRAL_PROPAGATION  = PASS
```

---

## 14. Autonomy and Blockers

Operate autonomously in the loop `inspect → implement → validate → diagnose → repair → revalidate`.
Do not stop for recoverable issues. Stop and report only for true blockers: external dependency,
owner-only decision, destructive action, unavailable business truth, unrecoverable environment problem.
When blocked on one page family, record `TRUE_BLOCKER` with the exact reason and continue with the next
page family; never mark a blocked page `PASS`.

---

## 15. Reporting

After each page family reaches `PASS`, emit a short status entry (not prose narrative):

```text
PAGE FAMILY: <route(s)>
STATUS: PASS
SURFACES: <n discovered / n canonical>  DATAGRIDS: <n>  DIALOGS: <n>  DRAWERS: <n>  OTHER: <n>
CENTRAL CHANGES: <none | list of canonical components created/fixed + Design Lab showcase added>
RUNTIME: light PASS / dark PASS / no exceptions
BUSINESS REGRESSION: 0
NEXT: <next page family>
```

At application closure, emit the aggregated matrix summary and the propagation proof result.

---

## 16. The Working Mantra

```text
ONE PAGE FAMILY AT A TIME
OPEN THE PAGE
DISCOVER ITS COMPLETE UI TREE
FOLLOW EVERY UI-PRODUCING COMPONENT
DISCOVER EVERY CHILD WINDOW
CLASSIFY EVERY GENERIC UI CONCERN
REPLACE EVERY LEGACY GENERIC COMPONENT
REPLACE EVERY OLD DATAGRID
CONNECT ONLY BUSINESS INPUTS
REMOVE DEAD GENERIC CSS
RUN THE REAL PAGE
CLICK THE ACTIONS · OPEN THE DIALOGS · OPEN THE DRAWERS · OPEN THE MENUS
TEST CREATE / EDIT / DETAIL · TEST DATAGRID · TEST LIGHT / DARK
REPAIR ALL REMAINING LEGACY UI
ONLY WHEN LEGACY = 0 AND UNKNOWN = 0: PAGE PASS
ONLY THEN: NEXT PAGE
```

The question that decides completion is never "was this file updated?" It is:
**"When a user exercises every flow in this page family, do they encounter legacy generic UI at any
point?"** If yes, the page is not complete. If no, and source ownership is canonical, and runtime is
PASS — the page is complete.

---

## 17. Start Now

1. Inspect the canonical public API of `@azem/ui`, `@azem/datagrid`, `@azem/notifications`, and the
   Design Lab route so you know exactly which canonical components exist.
2. Enumerate every production menu entry and route outside `/accounts/**`; build the initial page matrix
   with every page family set to `UNVERIFIED`.
3. Confirm the local runtime is reachable at `http://panel.azemonline.localhost:15480`.
4. Begin with the first Projects page family and follow §5 without deviation.
