(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/stores/tabStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTabStore",
    ()=>useTabStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const useTabStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        tabs: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                path: '/dashboard',
                icon: 'home'
            }
        ],
        activeTab: 'dashboard',
        addTab: (tab)=>{
            const { tabs } = get();
            const existingTab = tabs.find((t)=>t.id === tab.id);
            if (!existingTab) {
                set({
                    tabs: [
                        ...tabs,
                        tab
                    ],
                    activeTab: tab.id
                });
            } else {
                set({
                    activeTab: tab.id
                });
            }
        },
        removeTab: (tabId)=>{
            const { tabs, activeTab } = get();
            const newTabs = tabs.filter((t)=>t.id !== tabId);
            if (newTabs.length === 0) {
                set({
                    tabs: [
                        {
                            id: 'dashboard',
                            label: 'Dashboard',
                            path: '/dashboard',
                            icon: 'home'
                        }
                    ],
                    activeTab: 'dashboard'
                });
                return;
            }
            let newActiveTab = activeTab;
            if (activeTab === tabId) {
                const index = tabs.findIndex((t)=>t.id === tabId);
                newActiveTab = newTabs[Math.max(0, index - 1)].id;
            }
            set({
                tabs: newTabs,
                activeTab: newActiveTab
            });
        },
        setActiveTab: (tabId)=>set({
                activeTab: tabId
            }),
        clearTabs: ()=>set({
                tabs: [
                    {
                        id: 'dashboard',
                        label: 'Dashboard',
                        path: '/dashboard'
                    }
                ],
                activeTab: 'dashboard'
            })
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/axios.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$axios$40$1$2e$13$2e$1$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/axios@1.13.1/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
// Helper function to safely access localStorage
const safeLocalStorage = {
    getItem: (key)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.warn(`[Axios] Failed to access localStorage.getItem('${key}'):`, e);
            return null;
        }
    },
    setItem: (key, value)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn(`[Axios] Failed to access localStorage.setItem('${key}'):`, e);
        }
    },
    removeItem: (key)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn(`[Axios] Failed to access localStorage.removeItem('${key}'):`, e);
        }
    }
};
// Determine baseURL: Use proxy in browser to avoid CORS, direct URL only for SSR
const getBaseURL = ()=>{
    // In browser, always use proxy to avoid CORS issues
    if ("TURBOPACK compile-time truthy", 1) {
        return '/api';
    }
    //TURBOPACK unreachable
    ;
};
const axiosInstance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$axios$40$1$2e$13$2e$1$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000,
    withCredentials: true
});
// Staging ortamı için default tenant ID
const STAGING_DEFAULT_TENANT_ID = 'cmi5of04z0000ksb3g5eyu6ts';
// Backend'in beklediği header formatı (küçük harf)
const TENANT_HEADER_NAME = 'x-tenant-id';
// Request interceptor
axiosInstance.interceptors.request.use((config)=>{
    // #region agent log
    // Debug logging removed - was causing CORS errors in production
    // fetch('http://localhost:7247/ingest/4fbe5973-d45f-4058-9235-4d634c6bd17e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'panel-stage/client/src/lib/axios.ts:58',message:'Axios request interceptor',data:{url:config.url,fullURL:config.baseURL + config.url,method:config.method},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    let token = null;
    let tenantIdToUse = null;
    if ("TURBOPACK compile-time truthy", 1) {
        token = safeLocalStorage.getItem('accessToken');
        tenantIdToUse = safeLocalStorage.getItem('tenantId');
    } else //TURBOPACK unreachable
    ;
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    // ✅ SaaS Multi-Tenant: Add tenant ID header
    // Auth endpoint'lerinde tenant ID ekleme (login ve refresh hariç)
    const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/refresh');
    if (!isAuthEndpoint && tenantIdToUse) {
        if (!config.headers) {
            config.headers = {};
        }
        config.headers[TENANT_HEADER_NAME] = tenantIdToUse;
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// Response interceptor
axiosInstance.interceptors.response.use((response)=>response, async (error)=>{
    const originalRequest = error.config;
    // Handle 401 Unauthorized errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            if ("TURBOPACK compile-time truthy", 1) {
                const refreshToken = safeLocalStorage.getItem('refreshToken');
                // If no refresh token, redirect to login immediately
                if (!refreshToken) {
                    safeLocalStorage.removeItem('accessToken');
                    safeLocalStorage.removeItem('refreshToken');
                    // Only redirect if we're not already on the login page
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                        // Return a resolved promise to prevent error from bubbling up
                        return Promise.resolve({
                            data: null
                        });
                    }
                    return Promise.reject(error);
                }
                // Always use proxy in browser to avoid CORS
                const baseURL = '/api';
                // Use raw axios for refresh to avoid infinite loop
                // Create a new axios instance without interceptors to prevent loop
                const refreshAxios = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$axios$40$1$2e$13$2e$1$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
                    baseURL,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000,
                    withCredentials: true
                });
                // Sadece production ortamında değil, her zaman tenant ID header'ı ekle
                const tenantId = safeLocalStorage.getItem('tenantId');
                const refreshHeaders = {
                    Authorization: `Bearer ${refreshToken}`
                };
                // Tenant ID varsa header'a ekle (tüm ortamlar için)
                if (tenantId) {
                    refreshHeaders[TENANT_HEADER_NAME] = tenantId;
                }
                try {
                    const response = await refreshAxios.post('/auth/refresh', {}, {
                        headers: refreshHeaders
                    });
                    const { accessToken } = response.data;
                    safeLocalStorage.setItem('accessToken', accessToken);
                    // Update the original request with new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    // Retry the original request
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // Refresh token request failed
                    // This could be 401 (invalid refresh token) or 500 (server error)
                    throw refreshError;
                }
            }
        } catch (refreshError) {
            // Refresh token is invalid, expired, or server error occurred
            if ("TURBOPACK compile-time truthy", 1) {
                safeLocalStorage.removeItem('accessToken');
                safeLocalStorage.removeItem('refreshToken');
                // Only redirect if we're not already on the login page
                if (window.location.pathname !== '/login') {
                    // Redirect to login without showing error to user
                    window.location.href = '/login';
                    // Return a resolved promise to prevent error from bubbling up
                    return Promise.resolve({
                        data: null
                    });
                }
            }
            // If we're on login page, reject with the original error
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
});
const __TURBOPACK__default__export__ = axiosInstance;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/systemParameterService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createParameter",
    ()=>createParameter,
    "deleteParameter",
    ()=>deleteParameter,
    "getAllParameters",
    ()=>getAllParameters,
    "getParameter",
    ()=>getParameter,
    "getParameterAsBoolean",
    ()=>getParameterAsBoolean,
    "setParameterAsBoolean",
    ()=>setParameterAsBoolean,
    "updateParameter",
    ()=>updateParameter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.ts [app-client] (ecmascript)");
;
async function getAllParameters(category) {
    const params = category ? {
        category
    } : {};
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/system-parameter', {
        params
    });
    return response.data;
}
async function getParameter(key) {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/system-parameter/${key}`);
    return response.data;
}
async function createParameter(dto) {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/system-parameter', dto);
    return response.data;
}
async function updateParameter(key, dto) {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/system-parameter/${key}`, dto);
    return response.data;
}
async function deleteParameter(key) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/system-parameter/${key}`);
}
async function getParameterAsBoolean(key, defaultValue = false) {
    try {
        const value = await getParameter(key);
        return value === true || value === 'true' || value === 1;
    } catch (error) {
        return defaultValue;
    }
}
async function setParameterAsBoolean(key, value, description, category) {
    return updateParameter(key, {
        value,
        description,
        category
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/quickMenuStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useQuickMenuStore",
    ()=>useQuickMenuStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$systemParameterService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/systemParameterService.ts [app-client] (ecmascript)");
;
;
;
const QUICK_MENU_KEY = 'QUICK_MENU_ITEMS';
const defaultQuickMenuItems = [
    {
        id: 'quick-fatura',
        label: 'Yeni Fatura',
        icon: 'Receipt',
        path: '/invoice/sales',
        color: '#8b5cf6',
        enabled: true,
        order: 0
    },
    {
        id: 'quick-cari',
        label: 'Yeni Cari',
        icon: 'People',
        path: '/account',
        color: '#527575',
        enabled: true,
        order: 1
    },
    {
        id: 'quick-stok',
        label: 'Yeni Stok',
        icon: 'Inventory',
        path: '/stock/material-list',
        color: '#06b6d4',
        enabled: true,
        order: 2
    }
];
const useQuickMenuStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        items: defaultQuickMenuItems,
        isLoading: false,
        fetchQuickMenuItems: async ()=>{
            set({
                isLoading: true
            });
            try {
                const remoteItems = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$systemParameterService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getParameter"])(QUICK_MENU_KEY);
                if (remoteItems && Array.isArray(remoteItems)) {
                    set({
                        items: remoteItems
                    });
                }
            } catch (error) {
                console.error('Hızlı menü yüklenemedi:', error);
            } finally{
                set({
                    isLoading: false
                });
            }
        },
        addQuickMenuItem: async (item)=>{
            const { items } = get();
            const newId = `quick-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const maxOrder = Math.max(...items.map((i)=>i.order), 0);
            const newItems = [
                ...items,
                {
                    ...item,
                    id: newId,
                    order: maxOrder + 1
                }
            ];
            set({
                items: newItems
            });
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$systemParameterService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateParameter"])(QUICK_MENU_KEY, {
                    value: newItems,
                    category: 'QUICK_MENU'
                });
            } catch (error) {
                console.error('Hızlı menü kaydedilirken hata:', error);
            }
        },
        updateQuickMenuItem: async (id, updates)=>{
            const { items } = get();
            const newItems = items.map((item)=>item.id === id ? {
                    ...item,
                    ...updates
                } : item);
            set({
                items: newItems
            });
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$systemParameterService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateParameter"])(QUICK_MENU_KEY, {
                    value: newItems,
                    category: 'QUICK_MENU'
                });
            } catch (error) {
                console.error('Hızlı menü güncellenirken hata:', error);
            }
        },
        deleteQuickMenuItem: async (id)=>{
            const { items } = get();
            const newItems = items.filter((item)=>item.id !== id);
            set({
                items: newItems
            });
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$systemParameterService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateParameter"])(QUICK_MENU_KEY, {
                    value: newItems,
                    category: 'QUICK_MENU'
                });
            } catch (error) {
                console.error('Hızlı menü silinirken hata:', error);
            }
        },
        reorderQuickMenuItems: async (newItems)=>{
            const itemsWithOrder = newItems.map((item, index)=>({
                    ...item,
                    order: index
                }));
            set({
                items: itemsWithOrder
            });
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$systemParameterService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateParameter"])(QUICK_MENU_KEY, {
                    value: itemsWithOrder,
                    category: 'QUICK_MENU'
                });
            } catch (error) {
                console.error('Hızlı menü sıralanırken hata:', error);
            }
        },
        resetToDefaults: async ()=>{
            set({
                items: defaultQuickMenuItems
            });
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$systemParameterService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateParameter"])(QUICK_MENU_KEY, {
                    value: defaultQuickMenuItems,
                    category: 'QUICK_MENU'
                });
            } catch (error) {
                console.error('Hızlı menü sıfırlanırken hata:', error);
            }
        },
        setQuickMenuItems: (items)=>{
            set({
                items
            });
        }
    }), {
    name: 'quick-menu-storage'
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Layout/Sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SIDEBAR_WIDTH",
    ()=>SIDEBAR_WIDTH,
    "default",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/authStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$tabStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/tabStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$quickMenuStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/quickMenuStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$AccountBalance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/AccountBalance.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$AccountBalanceWallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/AccountBalanceWallet.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Add$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Add.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Assessment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Assessment.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Assignment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Assignment.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$AttachMoney$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/AttachMoney.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Badge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Badge.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Build$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Build.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CalendarMonth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/CalendarMonth.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CheckCircle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/CheckCircle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Close$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Close.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CloudUpload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/CloudUpload.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CloudDownload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/CloudDownload.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CreditCard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/CreditCard.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Dashboard.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Delete$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Delete.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Description$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Description.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$DirectionsCar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/DirectionsCar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Engineering$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Engineering.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$FlashOn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/FlashOn.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$ExpandLess$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/ExpandLess.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$ExpandMore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/ExpandMore.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Inventory$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Inventory.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$LocalShipping$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/LocalShipping.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Logout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Logout.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Menu.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$MoreVert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/MoreVert.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Notifications$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Notifications.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Payment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Payment.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$People$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/People.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PointOfSale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/PointOfSale.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PushPin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/PushPin.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Receipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Receipt.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$ReceiptLong$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/ReceiptLong.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Search.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Settings.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$ShoppingCart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/ShoppingCart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$SwapHoriz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/SwapHoriz.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$TrendingDown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/TrendingDown.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$TrendingUp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/TrendingUp.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Tv$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Tv.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Warehouse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Warehouse.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Warning$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Warning.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$AdminPanelSettings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/AdminPanelSettings.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Event$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Event.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Help$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Help.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Button/Button.js [app-client] (ecmascript) <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Collapse$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Collapse/Collapse.js [app-client] (ecmascript) <export default as Collapse>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Divider$2f$Divider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Divider$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Divider/Divider.js [app-client] (ecmascript) <export default as Divider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Drawer$2f$Drawer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Drawer$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Drawer/Drawer.js [app-client] (ecmascript) <export default as Drawer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/IconButton/IconButton.js [app-client] (ecmascript) <export default as IconButton>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputAdornment$2f$InputAdornment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputAdornment$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/InputAdornment/InputAdornment.js [app-client] (ecmascript) <export default as InputAdornment>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$List$2f$List$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/List/List.js [app-client] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ListItem$2f$ListItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListItem$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/ListItem/ListItem.js [app-client] (ecmascript) <export default as ListItem>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ListItemButton$2f$ListItemButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListItemButton$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/ListItemButton/ListItemButton.js [app-client] (ecmascript) <export default as ListItemButton>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ListItemIcon$2f$ListItemIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListItemIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/ListItemIcon/ListItemIcon.js [app-client] (ecmascript) <export default as ListItemIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ListItemText$2f$ListItemText$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListItemText$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/ListItemText/ListItemText.js [app-client] (ecmascript) <export default as ListItemText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Menu$2f$Menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Menu/Menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/MenuItem/MenuItem.js [app-client] (ecmascript) <export default as MenuItem>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/TextField/TextField.js [app-client] (ecmascript) <export default as TextField>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Toolbar$2f$Toolbar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Toolbar$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Toolbar/Toolbar.js [app-client] (ecmascript) <export default as Toolbar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript) <export default as Typography>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Avatar$2f$Avatar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Avatar$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Avatar/Avatar.js [app-client] (ecmascript) <export default as Avatar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Skeleton$2f$Skeleton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Skeleton$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Skeleton/Skeleton.js [app-client] (ecmascript) <export default as Skeleton>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const SIDEBAR_WIDTH = 280;
const palette = {
    secondaryHex: '#527575',
    // Light + clean, marka tokenlarıyla (örnek dashboard’a yakın)
    gradient: 'var(--card)',
    headerGradient: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 65%, #527575 35%) 0%, color-mix(in srgb, var(--primary) 45%, var(--background) 55%) 100%)',
    textPrimary: 'var(--foreground)',
    textSecondary: 'color-mix(in srgb, var(--foreground) 60%, transparent)',
    iconBg: 'color-mix(in srgb, var(--primary) 10%, var(--card) 90%)',
    iconBgActive: 'color-mix(in srgb, #527575 18%, var(--card) 82%)',
    itemHover: 'color-mix(in srgb, #527575 24%, var(--card) 76%)',
    itemBorder: 'color-mix(in srgb, var(--border) 85%, transparent)',
    itemSelectedBorder: 'color-mix(in srgb, var(--primary) 55%, var(--border) 45%)',
    itemSelectedBg: 'color-mix(in srgb, var(--primary) 35%, #527575 25%, var(--card) 40%)',
    submenuBg: 'color-mix(in srgb, var(--card) 80%, #527575 20%)',
    submenuBorder: 'color-mix(in srgb, #527575 45%, var(--border) 55%)',
    searchBg: 'color-mix(in srgb, var(--input) 92%, var(--card) 8%)',
    searchBorder: 'color-mix(in srgb, var(--border) 80%, var(--primary) 20%)'
};
// İkon Haritası - Wildcard import yerine güvenli ve performanslı eşleme
const IconMap = {
    AccountBalance: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$AccountBalance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    AccountBalanceWallet: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$AccountBalanceWallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Add: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Add$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Assessment: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Assessment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Assignment: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Assignment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    AttachMoney: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$AttachMoney$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Badge: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Badge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Build: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Build$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    CalendarMonth: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CalendarMonth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    CheckCircle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CheckCircle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Close: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Close$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    CloudUpload: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CloudUpload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    CloudDownload: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CloudDownload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    CreditCard: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CreditCard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Dashboard: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Delete: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Delete$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Description$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    DirectionsCar: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$DirectionsCar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Engineering: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Engineering$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    FlashOn: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$FlashOn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    ExpandLess: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$ExpandLess$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    ExpandMore: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$ExpandMore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Inventory: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Inventory$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    LocalShipping: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$LocalShipping$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Logout: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Logout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Menu: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    MoreVert: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$MoreVert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Notifications: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Notifications$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Payment: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Payment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    People: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$People$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    PointOfSale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PointOfSale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    PushPin: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PushPin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Receipt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Receipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    ReceiptLong: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$ReceiptLong$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Search: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Settings: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    ShoppingCart: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$ShoppingCart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    SwapHoriz: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$SwapHoriz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    TrendingDown: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$TrendingDown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    TrendingUp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$TrendingUp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Tv: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Tv$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Warehouse: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Warehouse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Warning: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Warning$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    AdminPanelSettings: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$AdminPanelSettings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Event: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Event$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    Help: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Help$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
};
function Sidebar({ open, pinned, onClose, onTogglePin, menuItems }) {
    _s();
    const { addTab, setActiveTab, activeTab } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$tabStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTabStore"])();
    const { user: authUser, clearAuth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const { items: quickMenuItems, fetchQuickMenuItems } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$quickMenuStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuickMenuStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Sidebar.useEffect": ()=>{
            fetchQuickMenuItems();
        }
    }["Sidebar.useEffect"], [
        fetchQuickMenuItems
    ]);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [openSubMenu, setOpenSubMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [userMenuAnchor, setUserMenuAnchor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [quickMenuAnchor, setQuickMenuAnchor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [tenantSettings, setTenantSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [tenantLoading, setTenantLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Sidebar.useEffect": ()=>{
            const fetchTenantSettings = {
                "Sidebar.useEffect.fetchTenantSettings": async ()=>{
                    try {
                        setTenantLoading(true);
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/tenants/settings');
                        setTenantSettings(res.data);
                    } catch (error) {
                        console.error('Sidebar tenant settings error:', error);
                    } finally{
                        setTenantLoading(false);
                    }
                }
            }["Sidebar.useEffect.fetchTenantSettings"];
            fetchTenantSettings();
        }
    }["Sidebar.useEffect"], []);
    const handleMenuClick = (item)=>{
        if (item.subItems) {
            setOpenSubMenu((current)=>current === item.id ? null : item.id);
            return;
        }
        addTab({
            id: item.id,
            label: item.label,
            path: item.path
        });
        setActiveTab(item.id);
        router.push(item.path);
        if (!pinned) {
            onClose();
        }
    };
    const handleSubMenuClick = (_parentItem, subItem)=>{
        addTab({
            id: subItem.id,
            label: subItem.label,
            path: subItem.path
        });
        setActiveTab(subItem.id);
        router.push(subItem.path);
        if (!pinned) {
            onClose();
        }
    };
    const filteredMenuItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Sidebar.useMemo[filteredMenuItems]": ()=>{
            if (!searchTerm) {
                return menuItems;
            }
            const searchLower = searchTerm.toLowerCase();
            return menuItems.filter({
                "Sidebar.useMemo[filteredMenuItems]": (item)=>{
                    if (item.label.toLowerCase().includes(searchLower)) {
                        return true;
                    }
                    if (item.subItems) {
                        return item.subItems.some({
                            "Sidebar.useMemo[filteredMenuItems]": (subItem)=>subItem.label.toLowerCase().includes(searchLower)
                        }["Sidebar.useMemo[filteredMenuItems]"]);
                    }
                    return false;
                }
            }["Sidebar.useMemo[filteredMenuItems]"]);
        }
    }["Sidebar.useMemo[filteredMenuItems]"], [
        searchTerm,
        menuItems
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Sidebar.useEffect": ()=>{
            if (!searchTerm) {
                return;
            }
            filteredMenuItems.forEach({
                "Sidebar.useEffect": (item)=>{
                    if (item.subItems) {
                        const hasMatchingSubItem = item.subItems.some({
                            "Sidebar.useEffect.hasMatchingSubItem": (subItem)=>subItem.label.toLowerCase().includes(searchTerm.toLowerCase())
                        }["Sidebar.useEffect.hasMatchingSubItem"]);
                        if (hasMatchingSubItem) {
                            setOpenSubMenu(item.id);
                        }
                    }
                }
            }["Sidebar.useEffect"]);
        }
    }["Sidebar.useEffect"], [
        searchTerm,
        filteredMenuItems
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Sidebar.useEffect": ()=>{
            if (!open) {
                setOpenSubMenu(null);
                setSearchTerm('');
            }
        }
    }["Sidebar.useEffect"], [
        open
    ]);
    const handleQuickCreate = (path)=>{
        setQuickMenuAnchor(null);
        router.push(path);
        if (!pinned) {
            onClose();
        }
    };
    const handleUserMenuClick = (event)=>{
        setUserMenuAnchor(event.currentTarget);
    };
    const handleUserMenuClose = ()=>{
        setUserMenuAnchor(null);
    };
    const handleLogout = ()=>{
        clearAuth();
        router.push('/login');
        handleUserMenuClose();
    };
    const drawerVariant = pinned ? 'permanent' : 'temporary';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Drawer$2f$Drawer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Drawer$3e$__["Drawer"], {
        anchor: "left",
        variant: drawerVariant,
        open: pinned ? true : open,
        onClose: pinned ? undefined : onClose,
        ModalProps: pinned ? undefined : {
            keepMounted: true
        },
        transitionDuration: pinned ? undefined : {
            enter: 250,
            exit: 200
        },
        sx: {
            '& .MuiDrawer-paper': {
                width: SIDEBAR_WIDTH,
                boxSizing: 'border-box',
                background: palette.gradient,
                color: palette.textPrimary,
                borderRight: 'none',
                position: pinned ? 'relative' : 'fixed',
                display: 'flex',
                flexDirection: 'column'
            }
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Toolbar$2f$Toolbar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Toolbar$3e$__["Toolbar"], {
                sx: {
                    background: 'var(--card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    py: 2,
                    px: 2.5,
                    borderBottom: '1px solid var(--border)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                        sx: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            flex: 1,
                            minWidth: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                sx: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 42,
                                    height: 42,
                                    borderRadius: 'var(--radius-md)',
                                    background: tenantSettings?.logoUrl ? 'transparent' : 'linear-gradient(135deg, var(--primary), #527575)',
                                    border: tenantSettings?.logoUrl ? '1px solid var(--border)' : 'none',
                                    padding: tenantSettings?.logoUrl ? 0.5 : 0,
                                    boxShadow: tenantSettings?.logoUrl ? 'none' : '0 4px 12px color-mix(in srgb, var(--primary) 20%, transparent)',
                                    flexShrink: 0,
                                    overflow: 'hidden'
                                },
                                children: tenantLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Skeleton$2f$Skeleton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Skeleton$3e$__["Skeleton"], {
                                    variant: "rectangular",
                                    width: 42,
                                    height: 42,
                                    sx: {
                                        borderRadius: 'var(--radius-sm)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                    lineNumber: 344,
                                    columnNumber: 15
                                }, this) : tenantSettings?.logoUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                    component: "img",
                                    src: tenantSettings.logoUrl,
                                    sx: {
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                    lineNumber: 346,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$DirectionsCar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        fontSize: 22,
                                        color: 'var(--primary-foreground)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                    lineNumber: 352,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                lineNumber: 323,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                sx: {
                                    flex: 1,
                                    minWidth: 0
                                },
                                children: tenantLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                    sx: {
                                        py: 0.5
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Skeleton$2f$Skeleton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Skeleton$3e$__["Skeleton"], {
                                            variant: "text",
                                            width: "80%",
                                            height: 20
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                            lineNumber: 358,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Skeleton$2f$Skeleton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Skeleton$3e$__["Skeleton"], {
                                            variant: "text",
                                            width: "50%",
                                            height: 14
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                            lineNumber: 359,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                    lineNumber: 357,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                            variant: "subtitle1",
                                            noWrap: true,
                                            fontWeight: "800",
                                            sx: {
                                                lineHeight: 1.2,
                                                fontSize: '0.9375rem',
                                                color: 'var(--foreground)',
                                                letterSpacing: '-0.025em',
                                                textTransform: 'uppercase'
                                            },
                                            children: tenantSettings?.companyName || 'OTOMUHASEBE'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                            lineNumber: 363,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                            variant: "caption",
                                            sx: {
                                                color: 'var(--muted-foreground)',
                                                fontSize: '0.6875rem',
                                                fontWeight: 600,
                                                display: 'block',
                                                letterSpacing: '0.05em'
                                            },
                                            children: "KURUMSAL ERP"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                            lineNumber: 377,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                lineNumber: 355,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Layout/Sidebar.tsx",
                        lineNumber: 322,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__["IconButton"], {
                        onClick: pinned ? onTogglePin : onClose,
                        size: "small",
                        sx: {
                            color: 'var(--muted-foreground)',
                            '&:hover': {
                                bgcolor: 'var(--muted)',
                                color: 'var(--foreground)'
                            },
                            transition: 'all 0.2s ease'
                        },
                        children: pinned ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PushPin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                fontSize: 18
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                            lineNumber: 406,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Close$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                fontSize: 18
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                            lineNumber: 408,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Layout/Sidebar.tsx",
                        lineNumber: 393,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                lineNumber: 310,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    px: 2,
                    pt: 2,
                    pb: 1
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                        fullWidth: true,
                        variant: "contained",
                        startIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Add$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                            lineNumber: 418,
                            columnNumber: 22
                        }, void 0),
                        onClick: (e)=>setQuickMenuAnchor(e.currentTarget),
                        sx: {
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            color: 'var(--primary-foreground)',
                            fontWeight: 600,
                            py: 1.25,
                            borderRadius: 'var(--radius)',
                            textTransform: 'none',
                            fontSize: '0.875rem',
                            boxShadow: '0 4px 12px color-mix(in srgb, var(--primary) 25%, transparent)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                boxShadow: '0 6px 16px color-mix(in srgb, var(--primary) 35%, transparent)',
                                transform: 'translateY(-1px)'
                            },
                            transition: 'all 0.2s ease'
                        },
                        children: "Hızlı İşlem"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Layout/Sidebar.tsx",
                        lineNumber: 415,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Menu$2f$Menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                        anchorEl: quickMenuAnchor,
                        open: Boolean(quickMenuAnchor),
                        onClose: ()=>setQuickMenuAnchor(null),
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left'
                        },
                        transformOrigin: {
                            vertical: 'top',
                            horizontal: 'left'
                        },
                        PaperProps: {
                            sx: {
                                mt: 1,
                                minWidth: 240,
                                maxWidth: 320,
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)',
                                boxShadow: '0 8px 24px color-mix(in srgb, var(--foreground) 8%, transparent)'
                            }
                        },
                        children: [
                            quickMenuItems.filter((item)=>item.enabled).sort((a, b)=>a.order - b.order).map((item)=>{
                                const IconComponent = IconMap[item.icon];
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                    onClick: ()=>handleQuickCreate(item.path),
                                    sx: {
                                        py: 1.25
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                            sx: {
                                                mr: 1.5,
                                                width: 32,
                                                height: 32,
                                                borderRadius: 1,
                                                bgcolor: `${item.color}20`,
                                                color: item.color,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            },
                                            children: IconComponent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                                                sx: {
                                                    fontSize: 18
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                                lineNumber: 480,
                                                columnNumber: 38
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Add$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                sx: {
                                                    fontSize: 18
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                                lineNumber: 480,
                                                columnNumber: 80
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                            lineNumber: 467,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                    variant: "body2",
                                                    fontWeight: 600,
                                                    children: item.label
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                                    lineNumber: 483,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                    variant: "caption",
                                                    color: "text.secondary",
                                                    sx: {
                                                        fontSize: '0.7rem'
                                                    },
                                                    children: item.path
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                                    lineNumber: 484,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                            lineNumber: 482,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, item.id, true, {
                                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                    lineNumber: 462,
                                    columnNumber: 17
                                }, this);
                            }),
                            quickMenuItems.filter((item)=>item.enabled).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                sx: {
                                    px: 2,
                                    py: 3,
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                        variant: "body2",
                                        color: "text.secondary",
                                        children: "Hızlı menü öğesi yok"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                        lineNumber: 494,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                                        size: "small",
                                        onClick: ()=>{
                                            setQuickMenuAnchor(null);
                                            router.push('/ayarlar/hizli-menu');
                                        },
                                        sx: {
                                            mt: 1,
                                            textTransform: 'none'
                                        },
                                        children: "Hızlı Menü Ayarları"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                        lineNumber: 497,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                lineNumber: 493,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Layout/Sidebar.tsx",
                        lineNumber: 439,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                lineNumber: 414,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Divider$2f$Divider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Divider$3e$__["Divider"], {
                sx: {
                    borderColor: 'var(--border)',
                    mx: 2
                }
            }, void 0, false, {
                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                lineNumber: 512,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    px: 2,
                    pt: 2,
                    pb: 1
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                    size: "small",
                    fullWidth: true,
                    placeholder: "Menüde ara...",
                    value: searchTerm,
                    onChange: (e)=>setSearchTerm(e.target.value),
                    InputProps: {
                        startAdornment: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputAdornment$2f$InputAdornment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputAdornment$3e$__["InputAdornment"], {
                            position: "start",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    color: 'var(--muted-foreground)',
                                    fontSize: 18
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                lineNumber: 525,
                                columnNumber: 17
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                            lineNumber: 524,
                            columnNumber: 15
                        }, void 0)
                    },
                    sx: {
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'var(--input)',
                            borderRadius: 'var(--radius)',
                            '& fieldset': {
                                borderColor: 'var(--border)'
                            },
                            '&:hover fieldset': {
                                borderColor: 'var(--ring)'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'var(--primary)',
                                borderWidth: '2px'
                            }
                        },
                        '& .MuiOutlinedInput-input': {
                            fontSize: '0.875rem',
                            py: 1.25,
                            '&::placeholder': {
                                color: 'var(--muted-foreground)',
                                opacity: 1
                            }
                        }
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                    lineNumber: 516,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                lineNumber: 515,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$List$2f$List$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
                sx: {
                    px: 1.5,
                    pt: 1,
                    flexGrow: 1,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '6px'
                    },
                    '&::-webkit-scrollbar-track': {
                        bgcolor: 'transparent'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        bgcolor: 'var(--border)',
                        borderRadius: '3px',
                        '&:hover': {
                            bgcolor: 'var(--muted-foreground)'
                        }
                    }
                },
                children: filteredMenuItems.length === 0 && searchTerm ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                    sx: {
                        px: 2,
                        py: 4,
                        textAlign: 'center'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                fontSize: 48,
                                color: 'var(--muted-foreground)',
                                mb: 1,
                                opacity: 0.5
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                            lineNumber: 559,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "body2",
                            sx: {
                                color: 'var(--muted-foreground)',
                                fontWeight: 500
                            },
                            children: [
                                '"',
                                searchTerm,
                                '" için sonuç bulunamadı'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                            lineNumber: 560,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                    lineNumber: 558,
                    columnNumber: 11
                }, this) : filteredMenuItems.map((item)=>{
                    const isActive = activeTab === item.id;
                    const hasSubMenu = !!item.subItems;
                    const isOpen = openSubMenu === item.id;
                    const ParentIcon = IconMap[item.icon] || IconMap.Help;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ListItem$2f$ListItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListItem$3e$__["ListItem"], {
                                disablePadding: true,
                                sx: {
                                    mb: 0.5
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ListItemButton$2f$ListItemButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListItemButton$3e$__["ListItemButton"], {
                                    onClick: ()=>handleMenuClick(item),
                                    sx: {
                                        borderRadius: 'var(--radius)',
                                        px: 1.5,
                                        py: 0.875,
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        background: isActive ? 'color-mix(in srgb, var(--primary) 10%, var(--card) 90%)' : 'transparent',
                                        position: 'relative',
                                        '&::before': isActive ? {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: 3,
                                            height: '60%',
                                            bgcolor: 'var(--primary)',
                                            borderRadius: '0 2px 2px 0'
                                        } : {},
                                        '&:hover': {
                                            background: isActive ? 'color-mix(in srgb, var(--primary) 10%, var(--card) 90%)' : 'color-mix(in srgb, #527575 20%, var(--card) 80%)',
                                            transform: 'translateX(2px)'
                                        }
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ListItemIcon$2f$ListItemIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListItemIcon$3e$__["ListItemIcon"], {
                                            sx: {
                                                minWidth: 40
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                                sx: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 'calc(var(--radius) - 2px)',
                                                    bgcolor: isActive ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : 'transparent',
                                                    transition: 'all 0.2s ease'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ParentIcon, {
                                                    sx: {
                                                        color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                                                        fontSize: 18,
                                                        transition: 'color 0.2s ease'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                                    lineNumber: 619,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                                lineNumber: 605,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                            lineNumber: 604,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ListItemText$2f$ListItemText$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListItemText$3e$__["ListItemText"], {
                                            primary: item.label,
                                            sx: {
                                                '& .MuiListItemText-primary': {
                                                    fontWeight: isActive ? 600 : 500,
                                                    fontSize: '0.875rem',
                                                    color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
                                                    letterSpacing: '-0.01em',
                                                    transition: 'all 0.2s ease'
                                                }
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                            lineNumber: 626,
                                            columnNumber: 21
                                        }, this),
                                        hasSubMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                            sx: {
                                                color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                                                transition: 'all 0.2s ease',
                                                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$ExpandMore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                sx: {
                                                    fontSize: 18
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                                lineNumber: 644,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                            lineNumber: 639,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                    lineNumber: 574,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                lineNumber: 573,
                                columnNumber: 17
                            }, this),
                            hasSubMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Collapse$2f$Collapse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Collapse$3e$__["Collapse"], {
                                in: isOpen,
                                timeout: 200,
                                unmountOnExit: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                    sx: {
                                        bgcolor: 'color-mix(in srgb, var(--muted) 85%, #527575 15%)',
                                        borderRadius: 'var(--radius)',
                                        mx: 1,
                                        mb: 1,
                                        mt: 0.5,
                                        px: 0.5,
                                        py: 0.75,
                                        border: '1px solid color-mix(in srgb, var(--border) 75%, #527575 25%)'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$List$2f$List$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
                                        component: "div",
                                        disablePadding: true,
                                        children: item.subItems?.filter((subItem)=>!searchTerm || subItem.label.toLowerCase().includes(searchTerm.toLowerCase())).map((subItem)=>{
                                            const isSubActive = activeTab === subItem.id;
                                            const SubIcon = IconMap[subItem.icon] || IconMap.Help;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ListItem$2f$ListItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListItem$3e$__["ListItem"], {
                                                disablePadding: true,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ListItemButton$2f$ListItemButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListItemButton$3e$__["ListItemButton"], {
                                                    onClick: ()=>handleSubMenuClick(item, subItem),
                                                    sx: {
                                                        borderRadius: 'calc(var(--radius) - 2px)',
                                                        mb: 0.25,
                                                        py: 0.75,
                                                        px: 1.25,
                                                        transition: 'all 0.2s ease',
                                                        bgcolor: isSubActive ? 'color-mix(in srgb, #527575 18%, transparent)' : 'transparent',
                                                        '&:hover': {
                                                            bgcolor: isSubActive ? 'color-mix(in srgb, #527575 18%, transparent)' : 'color-mix(in srgb, #527575 14%, transparent)',
                                                            transform: 'translateX(2px)'
                                                        }
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ListItemIcon$2f$ListItemIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListItemIcon$3e$__["ListItemIcon"], {
                                                            sx: {
                                                                minWidth: 32
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                                                sx: {
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    width: 24,
                                                                    height: 24,
                                                                    borderRadius: 'calc(var(--radius) - 4px)',
                                                                    bgcolor: isSubActive ? 'color-mix(in srgb, #527575 10%, transparent)' : 'transparent'
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SubIcon, {
                                                                    sx: {
                                                                        color: isSubActive ? '#527575' : 'var(--muted-foreground)',
                                                                        fontSize: 16
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                                                    lineNumber: 706,
                                                                    columnNumber: 39
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                                                lineNumber: 693,
                                                                columnNumber: 37
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                                            lineNumber: 692,
                                                            columnNumber: 35
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ListItemText$2f$ListItemText$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListItemText$3e$__["ListItemText"], {
                                                            primary: subItem.label,
                                                            sx: {
                                                                '& .MuiListItemText-primary': {
                                                                    fontWeight: isSubActive ? 600 : 500,
                                                                    fontSize: '0.8125rem',
                                                                    color: isSubActive ? '#527575' : 'var(--muted-foreground)'
                                                                }
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                                            lineNumber: 712,
                                                            columnNumber: 35
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                                    lineNumber: 675,
                                                    columnNumber: 33
                                                }, this)
                                            }, subItem.id, false, {
                                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                                lineNumber: 674,
                                                columnNumber: 31
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                        lineNumber: 664,
                                        columnNumber: 23
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                    lineNumber: 652,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                lineNumber: 651,
                                columnNumber: 19
                            }, this)
                        ]
                    }, item.id, true, {
                        fileName: "[project]/src/components/Layout/Sidebar.tsx",
                        lineNumber: 572,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                lineNumber: 556,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    px: 2,
                    pb: 2,
                    pt: 1,
                    borderTop: '1px solid var(--border)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                        sx: {
                            bgcolor: 'var(--card)',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                bgcolor: 'var(--muted)',
                                borderColor: 'var(--ring)'
                            }
                        },
                        onClick: handleUserMenuClick,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Avatar$2f$Avatar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Avatar$3e$__["Avatar"], {
                                sx: {
                                    width: 36,
                                    height: 36,
                                    bgcolor: 'var(--primary)',
                                    color: 'var(--primary-foreground)',
                                    fontWeight: 600,
                                    fontSize: '0.875rem'
                                },
                                children: authUser?.fullName?.[0]?.toUpperCase() || 'U'
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                lineNumber: 756,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                sx: {
                                    flex: 1,
                                    minWidth: 0
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                        variant: "body2",
                                        sx: {
                                            fontWeight: 600,
                                            color: 'var(--foreground)',
                                            fontSize: '0.875rem',
                                            lineHeight: 1.2,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        },
                                        children: authUser?.fullName || 'Kullanıcı'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                        lineNumber: 769,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                        variant: "caption",
                                        sx: {
                                            color: 'var(--muted-foreground)',
                                            fontSize: '0.75rem',
                                            display: 'block',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        },
                                        children: authUser?.role || 'Rol bilgisi'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                        lineNumber: 783,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                lineNumber: 768,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__["IconButton"], {
                                size: "small",
                                sx: {
                                    color: 'var(--muted-foreground)',
                                    '&:hover': {
                                        bgcolor: 'var(--accent)',
                                        color: 'var(--foreground)'
                                    }
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$MoreVert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        fontSize: 18
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                    lineNumber: 807,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                lineNumber: 797,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Layout/Sidebar.tsx",
                        lineNumber: 738,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Menu$2f$Menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                        anchorEl: userMenuAnchor,
                        open: Boolean(userMenuAnchor),
                        onClose: handleUserMenuClose,
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right'
                        },
                        transformOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right'
                        },
                        PaperProps: {
                            sx: {
                                mt: 1,
                                minWidth: 200,
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)',
                                boxShadow: '0 8px 24px color-mix(in srgb, var(--foreground) 8%, transparent)'
                            }
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                onClick: handleUserMenuClose,
                                sx: {
                                    py: 1
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                    sx: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        width: '100%'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Avatar$2f$Avatar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Avatar$3e$__["Avatar"], {
                                            sx: {
                                                width: 32,
                                                height: 32,
                                                bgcolor: 'var(--primary)',
                                                fontSize: '0.75rem'
                                            },
                                            children: authUser?.fullName?.[0]?.toUpperCase() || 'U'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                            lineNumber: 828,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                    variant: "body2",
                                                    fontWeight: 600,
                                                    children: authUser?.fullName || 'Kullanıcı'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                                    lineNumber: 832,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                    variant: "caption",
                                                    color: "text.secondary",
                                                    children: authUser?.email || authUser?.role || 'Bilgi yok'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                                    lineNumber: 835,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                            lineNumber: 831,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                    lineNumber: 827,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                lineNumber: 826,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Divider$2f$Divider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Divider$3e$__["Divider"], {
                                sx: {
                                    my: 0.5
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                lineNumber: 841,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                onClick: handleUserMenuClose,
                                sx: {
                                    py: 1
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        sx: {
                                            mr: 1.5,
                                            fontSize: 18,
                                            color: 'var(--muted-foreground)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                        lineNumber: 843,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                        variant: "body2",
                                        children: "Ayarlar"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                        lineNumber: 844,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                lineNumber: 842,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                onClick: handleLogout,
                                sx: {
                                    py: 1,
                                    color: 'var(--destructive)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Logout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        sx: {
                                            mr: 1.5,
                                            fontSize: 18
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                        lineNumber: 847,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                        variant: "body2",
                                        fontWeight: 500,
                                        children: "Çıkış Yap"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                        lineNumber: 848,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                                lineNumber: 846,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Layout/Sidebar.tsx",
                        lineNumber: 810,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Layout/Sidebar.tsx",
                lineNumber: 737,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Layout/Sidebar.tsx",
        lineNumber: 289,
        columnNumber: 5
    }, this);
}
_s(Sidebar, "mkco8jaEQ5zftb3sA3gYn7rp6ms=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$tabStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTabStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$quickMenuStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuickMenuStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Layout/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$AppBar$2f$AppBar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AppBar$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/AppBar/AppBar.js [app-client] (ecmascript) <export default as AppBar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Toolbar$2f$Toolbar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Toolbar$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Toolbar/Toolbar.js [app-client] (ecmascript) <export default as Toolbar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript) <export default as Typography>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/IconButton/IconButton.js [app-client] (ecmascript) <export default as IconButton>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Avatar$2f$Avatar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Avatar$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Avatar/Avatar.js [app-client] (ecmascript) <export default as Avatar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Menu$2f$Menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Menu/Menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/MenuItem/MenuItem.js [app-client] (ecmascript) <export default as MenuItem>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Chip/Chip.js [app-client] (ecmascript) <export default as Chip>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Divider$2f$Divider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Divider$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Divider/Divider.js [app-client] (ecmascript) <export default as Divider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Logout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Logout.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Person$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Person.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CalendarMonth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/CalendarMonth.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Menu.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PushPin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/PushPin.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PushPinOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/PushPinOutlined.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Settings.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Notifications$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Notifications.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$LightMode$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/LightMode.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$DarkMode$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/DarkMode.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/authStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$themeStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/themeStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Layout/Sidebar.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function Header({ onToggleSidebar, onToggleSidebarPin, sidebarPinned }) {
    _s();
    const [anchorEl, setAnchorEl] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
    const [currentDateTime, setCurrentDateTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const { user, clearAuth } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]();
    const { isDarkMode, toggleDarkMode } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$themeStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"]();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Sistem tarih/saat güncelleme
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            const updateDateTime = {
                "Header.useEffect.updateDateTime": ()=>{
                    const now = new Date();
                    const formatted = now.toLocaleString('tr-TR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                    setCurrentDateTime(formatted);
                }
            }["Header.useEffect.updateDateTime"];
            updateDateTime();
            const interval = setInterval(updateDateTime, 1000);
            return ({
                "Header.useEffect": ()=>clearInterval(interval)
            })["Header.useEffect"];
        }
    }["Header.useEffect"], []);
    const handleMenu = (event)=>{
        setAnchorEl(event.currentTarget);
    };
    const handleClose = ()=>{
        setAnchorEl(null);
    };
    const handleLogout = ()=>{
        clearAuth();
        router.push('/login');
        handleClose();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$AppBar$2f$AppBar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AppBar$3e$__["AppBar"], {
        position: "fixed",
        sx: {
            width: `calc(100% - ${sidebarPinned ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIDEBAR_WIDTH"] : 0}px)`,
            ml: sidebarPinned ? `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIDEBAR_WIDTH"]}px` : 0,
            bgcolor: 'var(--card)',
            color: 'var(--foreground)',
            boxShadow: 'var(--shadow-sm)',
            borderBottom: '1px solid var(--border)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: (theme)=>sidebarPinned ? theme.zIndex.drawer + 1 : theme.zIndex.appBar
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Toolbar$2f$Toolbar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Toolbar$3e$__["Toolbar"], {
            sx: {
                px: 3,
                py: 1.5,
                minHeight: '64px !important'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                    sx: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__["IconButton"], {
                            edge: "start",
                            "aria-label": "open drawer",
                            onClick: onToggleSidebar,
                            sx: {
                                color: 'var(--muted-foreground)',
                                '&:hover': {
                                    bgcolor: 'var(--muted)',
                                    color: 'var(--foreground)'
                                },
                                transition: 'all 0.2s ease'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/src/components/Layout/Header.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Layout/Header.tsx",
                            lineNumber: 101,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__["IconButton"], {
                            "aria-label": sidebarPinned ? 'Menüyü sabitlemeyi kaldır' : 'Menüyü sabitle',
                            onClick: onToggleSidebarPin,
                            sx: {
                                color: sidebarPinned ? 'var(--primary)' : 'var(--muted-foreground)',
                                bgcolor: sidebarPinned ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'transparent',
                                '&:hover': {
                                    bgcolor: 'var(--muted)',
                                    color: sidebarPinned ? 'var(--primary)' : 'var(--foreground)'
                                },
                                transition: 'all 0.2s ease'
                            },
                            children: sidebarPinned ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PushPin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    fontSize: 18
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layout/Header.tsx",
                                lineNumber: 129,
                                columnNumber: 30
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PushPinOutlined$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    fontSize: 18
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layout/Header.tsx",
                                lineNumber: 129,
                                columnNumber: 66
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Layout/Header.tsx",
                            lineNumber: 116,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Layout/Header.tsx",
                    lineNumber: 100,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                    variant: "h6",
                    noWrap: true,
                    component: "div",
                    sx: {
                        flexGrow: 1,
                        ml: 2,
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: 'var(--foreground)',
                        letterSpacing: '-0.01em'
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/Layout/Header.tsx",
                    lineNumber: 134,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                    sx: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__["IconButton"], {
                            onClick: toggleDarkMode,
                            size: "small",
                            sx: {
                                color: 'var(--muted-foreground)',
                                bgcolor: 'var(--muted)',
                                border: '1px solid var(--border)',
                                '&:hover': {
                                    bgcolor: 'var(--accent)',
                                    color: 'var(--foreground)',
                                    borderColor: 'var(--primary)',
                                    transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease'
                            },
                            title: isDarkMode ? 'Aydınlık Mod' : 'Karanlık Mod',
                            children: isDarkMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$LightMode$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    fontSize: 20,
                                    color: 'var(--chart-3)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layout/Header.tsx",
                                lineNumber: 171,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$DarkMode$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    fontSize: 20,
                                    color: 'var(--primary)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layout/Header.tsx",
                                lineNumber: 173,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Layout/Header.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__["Chip"], {
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CalendarMonth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    fontSize: 16
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layout/Header.tsx",
                                lineNumber: 179,
                                columnNumber: 19
                            }, void 0),
                            label: currentDateTime,
                            variant: "outlined",
                            size: "small",
                            sx: {
                                fontWeight: 500,
                                fontSize: '0.8125rem',
                                borderColor: 'var(--border)',
                                color: 'var(--muted-foreground)',
                                bgcolor: 'var(--muted)',
                                '& .MuiChip-icon': {
                                    color: 'var(--muted-foreground)'
                                },
                                '&:hover': {
                                    borderColor: 'var(--secondary)',
                                    color: 'var(--secondary)',
                                    bgcolor: 'var(--secondary-light)'
                                },
                                transition: 'all 0.2s ease'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/Layout/Header.tsx",
                            lineNumber: 178,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__["IconButton"], {
                            size: "small",
                            sx: {
                                color: 'var(--muted-foreground)',
                                '&:hover': {
                                    bgcolor: 'var(--muted)',
                                    color: 'var(--foreground)'
                                },
                                transition: 'all 0.2s ease'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Notifications$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                sx: {
                                    fontSize: 20
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layout/Header.tsx",
                                lineNumber: 214,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Layout/Header.tsx",
                            lineNumber: 203,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                            sx: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                px: 1.5,
                                py: 0.75,
                                borderRadius: 'var(--radius)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: 'var(--muted)'
                                }
                            },
                            onClick: handleMenu,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                    sx: {
                                        textAlign: 'right',
                                        display: {
                                            xs: 'none',
                                            sm: 'block'
                                        }
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                            variant: "body2",
                                            sx: {
                                                fontWeight: 600,
                                                fontSize: '0.875rem',
                                                color: 'var(--foreground)',
                                                lineHeight: 1.2
                                            },
                                            children: user?.fullName || 'Kullanıcı'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Header.tsx",
                                            lineNumber: 235,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                            variant: "caption",
                                            sx: {
                                                fontSize: '0.75rem',
                                                color: 'var(--muted-foreground)',
                                                display: 'block'
                                            },
                                            children: user?.role || 'Rol'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Header.tsx",
                                            lineNumber: 246,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Layout/Header.tsx",
                                    lineNumber: 234,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Avatar$2f$Avatar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Avatar$3e$__["Avatar"], {
                                    sx: {
                                        width: 36,
                                        height: 36,
                                        bgcolor: 'var(--secondary)',
                                        color: 'var(--secondary-foreground)',
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        border: '2px solid var(--border)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderColor: 'var(--secondary)',
                                            transform: 'scale(1.05)'
                                        }
                                    },
                                    children: user?.fullName?.[0]?.toUpperCase() || 'U'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Layout/Header.tsx",
                                    lineNumber: 257,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Layout/Header.tsx",
                            lineNumber: 218,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Menu$2f$Menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                            id: "menu-appbar",
                            anchorEl: anchorEl,
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right'
                            },
                            transformOrigin: {
                                vertical: 'top',
                                horizontal: 'right'
                            },
                            open: Boolean(anchorEl),
                            onClose: handleClose,
                            PaperProps: {
                                sx: {
                                    mt: 1,
                                    minWidth: 220,
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid var(--border)',
                                    boxShadow: 'var(--shadow-lg)',
                                    bgcolor: 'var(--card)'
                                }
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                    sx: {
                                        px: 2,
                                        py: 1.5
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                            variant: "body2",
                                            fontWeight: 600,
                                            sx: {
                                                color: 'var(--foreground)'
                                            },
                                            children: user?.fullName || 'Kullanıcı'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Header.tsx",
                                            lineNumber: 303,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                            variant: "caption",
                                            sx: {
                                                color: 'var(--muted-foreground)',
                                                fontSize: '0.75rem'
                                            },
                                            children: user?.email || user?.role || 'Bilgi yok'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Header.tsx",
                                            lineNumber: 306,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Layout/Header.tsx",
                                    lineNumber: 302,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Divider$2f$Divider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Divider$3e$__["Divider"], {
                                    sx: {
                                        borderColor: 'var(--border)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Layout/Header.tsx",
                                    lineNumber: 310,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                    onClick: handleClose,
                                    sx: {
                                        py: 1.25,
                                        px: 2,
                                        '&:hover': {
                                            bgcolor: 'var(--muted)'
                                        }
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Person$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            sx: {
                                                mr: 1.5,
                                                fontSize: 18,
                                                color: 'var(--muted-foreground)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Header.tsx",
                                            lineNumber: 321,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                            variant: "body2",
                                            sx: {
                                                color: 'var(--foreground)'
                                            },
                                            children: "Profil"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Header.tsx",
                                            lineNumber: 322,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Layout/Header.tsx",
                                    lineNumber: 311,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                    onClick: handleClose,
                                    sx: {
                                        py: 1.25,
                                        px: 2,
                                        '&:hover': {
                                            bgcolor: 'var(--muted)'
                                        }
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            sx: {
                                                mr: 1.5,
                                                fontSize: 18,
                                                color: 'var(--muted-foreground)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Header.tsx",
                                            lineNumber: 334,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                            variant: "body2",
                                            sx: {
                                                color: 'var(--foreground)'
                                            },
                                            children: "Ayarlar"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Header.tsx",
                                            lineNumber: 335,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Layout/Header.tsx",
                                    lineNumber: 324,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Divider$2f$Divider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Divider$3e$__["Divider"], {
                                    sx: {
                                        borderColor: 'var(--border)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Layout/Header.tsx",
                                    lineNumber: 337,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                    onClick: handleLogout,
                                    sx: {
                                        py: 1.25,
                                        px: 2,
                                        color: 'var(--destructive)',
                                        '&:hover': {
                                            bgcolor: 'color-mix(in srgb, var(--destructive) 10%, transparent)'
                                        }
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Logout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            sx: {
                                                mr: 1.5,
                                                fontSize: 18
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Header.tsx",
                                            lineNumber: 349,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                            variant: "body2",
                                            fontWeight: 500,
                                            children: "Çıkış Yap"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Layout/Header.tsx",
                                            lineNumber: 350,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Layout/Header.tsx",
                                    lineNumber: 338,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Layout/Header.tsx",
                            lineNumber: 278,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Layout/Header.tsx",
                    lineNumber: 151,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Layout/Header.tsx",
            lineNumber: 98,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Layout/Header.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
_s(Header, "EsUqklBgp/oiVoQI0BLulcle8Wo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Layout/TabBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TabBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tabs$2f$Tabs$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tabs$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Tabs/Tabs.js [app-client] (ecmascript) <export default as Tabs>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tab$2f$Tab$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tab$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Tab/Tab.js [app-client] (ecmascript) <export default as Tab>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Close$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Close.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$tabStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/tabStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function TabBar() {
    _s();
    const { tabs, activeTab, setActiveTab, removeTab } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$tabStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTabStore"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleChange = (_event, newValue)=>{
        setActiveTab(newValue);
        const tab = tabs.find((t)=>t.id === newValue);
        if (tab) {
            router.push(tab.path);
        }
    };
    const handleCloseTab = (event, tabId)=>{
        event.stopPropagation();
        const isClosingActive = activeTab === tabId;
        let fallbackPath;
        if (isClosingActive) {
            const closingIndex = tabs.findIndex((t)=>t.id === tabId);
            const previousTab = tabs[closingIndex - 1];
            const nextTab = tabs[closingIndex + 1];
            const targetTab = previousTab ?? nextTab;
            fallbackPath = targetTab?.path;
        }
        removeTab(tabId);
        if (isClosingActive) {
            router.push(fallbackPath ?? '/dashboard');
        }
    };
    if (tabs.length === 0) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
        sx: {
            borderBottom: '1px solid var(--border)',
            bgcolor: 'var(--card)',
            boxShadow: 'var(--shadow-xs)',
            position: 'sticky',
            top: 64,
            zIndex: 1100
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tabs$2f$Tabs$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tabs$3e$__["Tabs"], {
            value: activeTab,
            onChange: handleChange,
            variant: "scrollable",
            scrollButtons: "auto",
            "aria-label": "module tabs",
            sx: {
                minHeight: 48,
                '& .MuiTabs-scrollButtons': {
                    color: 'var(--muted-foreground)',
                    '&:hover': {
                        color: 'var(--foreground)'
                    },
                    '&.Mui-disabled': {
                        opacity: 0.3
                    }
                },
                '& .MuiTabs-indicator': {
                    height: 3,
                    bgcolor: 'var(--primary)',
                    borderRadius: '3px 3px 0 0'
                }
            },
            children: tabs.map((tab)=>{
                const canCloseTab = tabs.length > 1 || tab.id !== 'dashboard';
                const isActive = tab.id === activeTab;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tab$2f$Tab$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tab$3e$__["Tab"], {
                    label: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                        sx: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 0.5
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                component: "span",
                                sx: {
                                    fontSize: '0.875rem',
                                    fontWeight: isActive ? 600 : 500,
                                    color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
                                    transition: 'all 0.2s ease'
                                },
                                children: tab.label
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layout/TabBar.tsx",
                                lineNumber: 99,
                                columnNumber: 19
                            }, void 0),
                            canCloseTab && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                component: "span",
                                onClick: (e)=>handleCloseTab(e, tab.id),
                                sx: {
                                    ml: 0.5,
                                    p: 0.5,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer',
                                    color: 'var(--muted-foreground)',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        bgcolor: 'color-mix(in srgb, var(--destructive) 10%, transparent)',
                                        color: 'var(--destructive)'
                                    }
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Close$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        fontSize: 14
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Layout/TabBar.tsx",
                                    lineNumber: 130,
                                    columnNumber: 23
                                }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layout/TabBar.tsx",
                                lineNumber: 111,
                                columnNumber: 21
                            }, void 0)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Layout/TabBar.tsx",
                        lineNumber: 91,
                        columnNumber: 17
                    }, void 0),
                    value: tab.id,
                    sx: {
                        textTransform: 'none',
                        minHeight: 48,
                        px: 2,
                        py: 1.5,
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            color: 'var(--foreground)',
                            bgcolor: 'var(--muted)'
                        },
                        '&.Mui-selected': {
                            color: 'var(--foreground)',
                            fontWeight: 600
                        }
                    }
                }, tab.id, false, {
                    fileName: "[project]/src/components/Layout/TabBar.tsx",
                    lineNumber: 88,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/src/components/Layout/TabBar.tsx",
            lineNumber: 59,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Layout/TabBar.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(TabBar, "te/ivGw3PY/a6FE5A4kx8o4RT5Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$tabStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTabStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = TabBar;
var _c;
__turbopack_context__.k.register(_c, "TabBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/layoutStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLayoutStore",
    ()=>useLayoutStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const useLayoutStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        sidebarOpen: false,
        sidebarPinned: false,
        setSidebarOpen: (open)=>set({
                sidebarOpen: open
            }),
        setSidebarPinned: (pinned)=>set((state)=>({
                    sidebarPinned: pinned,
                    sidebarOpen: pinned ? true : state.sidebarOpen
                })),
        toggleSidebar: ()=>set((state)=>{
                if (state.sidebarPinned) return state;
                return {
                    sidebarOpen: !state.sidebarOpen
                };
            }),
        toggleSidebarPin: ()=>set((state)=>{
                const nextPinned = !state.sidebarPinned;
                return {
                    sidebarPinned: nextPinned,
                    sidebarOpen: nextPinned ? true : state.sidebarOpen
                };
            })
    }), {
    name: 'layout-storage'
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Layout/ClientMainLayout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ClientMainLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Toolbar$2f$Toolbar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Toolbar$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Toolbar/Toolbar.js [app-client] (ecmascript) <export default as Toolbar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Layout/Sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Layout/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$TabBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Layout/TabBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$layoutStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/layoutStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function ClientMainLayout({ children, menuItems }) {
    _s();
    const { sidebarOpen, sidebarPinned, toggleSidebar, toggleSidebarPin, setSidebarOpen } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$layoutStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])();
    const handleToggleSidebar = ()=>{
        toggleSidebar();
    };
    const handleTogglePin = ()=>{
        toggleSidebarPin();
    };
    const handleCloseSidebar = ()=>{
        if (sidebarPinned) return;
        setSidebarOpen(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
        sx: {
            display: 'flex',
            minHeight: '100vh',
            bgcolor: 'var(--background)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: sidebarPinned ? true : sidebarOpen,
                pinned: sidebarPinned,
                onClose: handleCloseSidebar,
                onTogglePin: handleTogglePin,
                menuItems: menuItems
            }, void 0, false, {
                fileName: "[project]/src/components/Layout/ClientMainLayout.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                component: "main",
                sx: {
                    flexGrow: 1,
                    minWidth: 0,
                    bgcolor: 'var(--background)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onToggleSidebar: handleToggleSidebar,
                        onToggleSidebarPin: handleTogglePin,
                        sidebarPinned: sidebarPinned
                    }, void 0, false, {
                        fileName: "[project]/src/components/Layout/ClientMainLayout.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Toolbar$2f$Toolbar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Toolbar$3e$__["Toolbar"], {}, void 0, false, {
                        fileName: "[project]/src/components/Layout/ClientMainLayout.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$TabBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/components/Layout/ClientMainLayout.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                        sx: {
                            p: 3,
                            bgcolor: 'var(--background)',
                            overflowX: 'auto'
                        },
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/components/Layout/ClientMainLayout.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Layout/ClientMainLayout.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Layout/ClientMainLayout.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_s(ClientMainLayout, "t9sjNik6TOOM+wHC4+d/Wg5hlSU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$layoutStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"]
    ];
});
_c = ClientMainLayout;
var _c;
__turbopack_context__.k.register(_c, "ClientMainLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_4ebe207a._.js.map