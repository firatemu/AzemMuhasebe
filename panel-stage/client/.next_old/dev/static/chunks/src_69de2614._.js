(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/hooks/useDebounce.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDebounce",
    ()=>useDebounce
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useDebounce(value, delay = 500) {
    _s();
    const [debouncedValue, setDebouncedValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(value);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDebounce.useEffect": ()=>{
            const handler = setTimeout({
                "useDebounce.useEffect.handler": ()=>{
                    setDebouncedValue(value);
                }
            }["useDebounce.useEffect.handler"], delay);
            return ({
                "useDebounce.useEffect": ()=>{
                    clearTimeout(handler);
                }
            })["useDebounce.useEffect"];
        }
    }["useDebounce.useEffect"], [
        value,
        delay
    ]);
    return debouncedValue;
}
_s(useDebounce, "KDuPAtDOgxm8PU6legVJOb3oOmA=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCariler",
    ()=>useCariler,
    "useCreateCari",
    ()=>useCreateCari,
    "useCreateFatura",
    ()=>useCreateFatura,
    "useCreateStok",
    ()=>useCreateStok,
    "useFatura",
    ()=>useFatura,
    "useFaturalar",
    ()=>useFaturalar,
    "useKasalar",
    ()=>useKasalar,
    "usePersoneller",
    ()=>usePersoneller,
    "useStokHareketler",
    ()=>useStokHareketler,
    "useStoklar",
    ()=>useStoklar,
    "useTahsilatlar",
    ()=>useTahsilatlar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.7_react@19.2.0/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.7_react@19.2.0/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.7_react@19.2.0/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature();
;
;
function useStoklar(search, limit = 20) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'stoklar',
            search,
            limit
        ],
        queryFn: {
            "useStoklar.useQuery": async ()=>{
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/product', {
                    params: {
                        search,
                        limit
                    }
                });
                const data = response.data?.data || response.data;
                return Array.isArray(data) ? data : [];
            }
        }["useStoklar.useQuery"],
        staleTime: 2 * 60 * 1000
    });
}
_s(useStoklar, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCariler(tip, limit = 1000) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'cariler',
            tip,
            limit
        ],
        queryFn: {
            "useCariler.useQuery": async ()=>{
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/account', {
                    params: {
                        tip,
                        limit
                    }
                });
                const data = response.data?.data || response.data;
                return Array.isArray(data) ? data : [];
            }
        }["useCariler.useQuery"],
        staleTime: 3 * 60 * 1000
    });
}
_s1(useCariler, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useKasalar(aktif = true) {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'kasalar',
            aktif
        ],
        queryFn: {
            "useKasalar.useQuery": async ()=>{
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/cashbox', {
                    params: {
                        aktif
                    }
                });
                return response.data || [];
            }
        }["useKasalar.useQuery"],
        staleTime: 2 * 60 * 1000
    });
}
_s2(useKasalar, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useFaturalar(faturaTipi, page = 1, limit = 50) {
    _s3();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'faturalar',
            faturaTipi,
            page,
            limit
        ],
        queryFn: {
            "useFaturalar.useQuery": async ()=>{
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/invoice', {
                    params: {
                        faturaTipi,
                        page,
                        limit
                    }
                });
                const data = response.data?.data || response.data;
                return Array.isArray(data) ? data : [];
            }
        }["useFaturalar.useQuery"],
        staleTime: 60 * 1000
    });
}
_s3(useFaturalar, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useFatura(id) {
    _s4();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'fatura',
            id
        ],
        queryFn: {
            "useFatura.useQuery": async ()=>{
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/fatura/${id}`);
                return response.data;
            }
        }["useFatura.useQuery"],
        enabled: !!id
    });
}
_s4(useFatura, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useTahsilatlar(page = 1, limit = 50) {
    _s5();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'tahsilatlar',
            page,
            limit
        ],
        queryFn: {
            "useTahsilatlar.useQuery": async ()=>{
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/collection', {
                    params: {
                        page,
                        limit
                    }
                });
                const data = response.data?.data || response.data;
                return Array.isArray(data) ? data : [];
            }
        }["useTahsilatlar.useQuery"],
        staleTime: 60 * 1000
    });
}
_s5(useTahsilatlar, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useStokHareketler(stokId, hareketTipi, limit = 100, enabled = true) {
    _s6();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'stok-hareketler',
            stokId,
            hareketTipi,
            limit
        ],
        queryFn: {
            "useStokHareketler.useQuery": async ()=>{
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/product-movement', {
                    params: {
                        stokId,
                        hareketTipi,
                        limit
                    }
                });
                const data = response.data?.data || response.data;
                return Array.isArray(data) ? data : [];
            }
        }["useStokHareketler.useQuery"],
        staleTime: 60 * 1000,
        enabled: enabled
    });
}
_s6(useStokHareketler, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function usePersoneller() {
    _s7();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'personeller'
        ],
        queryFn: {
            "usePersoneller.useQuery": async ()=>{
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/employee');
                // Personel API returns a direct array, not wrapped in { data: [...] }
                const data = response.data?.data || response.data;
                return Array.isArray(data) ? data : [];
            }
        }["usePersoneller.useQuery"],
        staleTime: 5 * 60 * 1000
    });
}
_s7(usePersoneller, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateStok() {
    _s8();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateStok.useMutation": async (data)=>{
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/product', data);
                return response.data;
            }
        }["useCreateStok.useMutation"],
        onSuccess: {
            "useCreateStok.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'stoklar'
                    ]
                });
            }
        }["useCreateStok.useMutation"]
    });
}
_s8(useCreateStok, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useCreateCari() {
    _s9();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateCari.useMutation": async (data)=>{
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/account', data);
                return response.data;
            }
        }["useCreateCari.useMutation"],
        onSuccess: {
            "useCreateCari.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'cariler'
                    ]
                });
            }
        }["useCreateCari.useMutation"]
    });
}
_s9(useCreateCari, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useCreateFatura() {
    _s10();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateFatura.useMutation": async (data)=>{
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/invoice', data);
                return response.data;
            }
        }["useCreateFatura.useMutation"],
        onSuccess: {
            "useCreateFatura.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'faturalar'
                    ]
                });
            }
        }["useCreateFatura.useMutation"]
    });
}
_s10(useCreateFatura, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$7_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Loading/TableSkeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CardSkeleton",
    ()=>CardSkeleton,
    "ListSkeleton",
    ()=>ListSkeleton,
    "default",
    ()=>TableSkeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Skeleton$2f$Skeleton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Skeleton$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Skeleton/Skeleton.js [app-client] (ecmascript) <export default as Skeleton>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/TableCell/TableCell.js [app-client] (ecmascript) <export default as TableCell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableRow$2f$TableRow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableRow$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/TableRow/TableRow.js [app-client] (ecmascript) <export default as TableRow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
;
;
function TableSkeleton({ rows = 5, columns = 6 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: Array.from({
            length: rows
        }).map((_, rowIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableRow$2f$TableRow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableRow$3e$__["TableRow"], {
                children: Array.from({
                    length: columns
                }).map((_, colIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Skeleton$2f$Skeleton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Skeleton$3e$__["Skeleton"], {
                            animation: "wave"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Loading/TableSkeleton.tsx",
                            lineNumber: 15,
                            columnNumber: 15
                        }, this)
                    }, colIndex, false, {
                        fileName: "[project]/src/components/Loading/TableSkeleton.tsx",
                        lineNumber: 14,
                        columnNumber: 13
                    }, this))
            }, rowIndex, false, {
                fileName: "[project]/src/components/Loading/TableSkeleton.tsx",
                lineNumber: 12,
                columnNumber: 9
            }, this))
    }, void 0, false);
}
_c = TableSkeleton;
function CardSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
        sx: {
            p: 2
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Skeleton$2f$Skeleton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Skeleton$3e$__["Skeleton"], {
                variant: "text",
                width: "40%",
                height: 30
            }, void 0, false, {
                fileName: "[project]/src/components/Loading/TableSkeleton.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Skeleton$2f$Skeleton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Skeleton$3e$__["Skeleton"], {
                variant: "text",
                width: "60%"
            }, void 0, false, {
                fileName: "[project]/src/components/Loading/TableSkeleton.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Skeleton$2f$Skeleton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Skeleton$3e$__["Skeleton"], {
                variant: "rectangular",
                height: 100,
                sx: {
                    mt: 2,
                    borderRadius: 1
                }
            }, void 0, false, {
                fileName: "[project]/src/components/Loading/TableSkeleton.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Loading/TableSkeleton.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_c1 = CardSkeleton;
function ListSkeleton({ items = 5 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
        children: Array.from({
            length: items
        }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    mb: 2
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Skeleton$2f$Skeleton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Skeleton$3e$__["Skeleton"], {
                        variant: "text",
                        width: "30%",
                        height: 25
                    }, void 0, false, {
                        fileName: "[project]/src/components/Loading/TableSkeleton.tsx",
                        lineNumber: 39,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Skeleton$2f$Skeleton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Skeleton$3e$__["Skeleton"], {
                        variant: "text",
                        width: "70%"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Loading/TableSkeleton.tsx",
                        lineNumber: 40,
                        columnNumber: 11
                    }, this)
                ]
            }, index, true, {
                fileName: "[project]/src/components/Loading/TableSkeleton.tsx",
                lineNumber: 38,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/Loading/TableSkeleton.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c2 = ListSkeleton;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "TableSkeleton");
__turbopack_context__.k.register(_c1, "CardSkeleton");
__turbopack_context__.k.register(_c2, "ListSkeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Layout/MainLayout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MainLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [app-client] (ecmascript)");
'use client';
;
function MainLayout({ children }) {
    // Pass-through proxy. Architecture now handled by app/(main)/layout.tsx
    // This ensures legacy 'use client' pages that import MainLayout still work.
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_c = MainLayout;
var _c;
__turbopack_context__.k.register(_c, "MainLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(main)/stock/material-list/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MalzemeListesiPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0/node_modules/@emotion/react/jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript) <export default as Typography>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Button/Button.js [app-client] (ecmascript) <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Paper$2f$Paper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paper$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Paper/Paper.js [app-client] (ecmascript) <export default as Paper>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Table$2f$Table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Table/Table.js [app-client] (ecmascript) <export default as Table>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableBody$2f$TableBody$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableBody$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/TableBody/TableBody.js [app-client] (ecmascript) <export default as TableBody>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/TableCell/TableCell.js [app-client] (ecmascript) <export default as TableCell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableContainer$2f$TableContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableContainer$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/TableContainer/TableContainer.js [app-client] (ecmascript) <export default as TableContainer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableHead$2f$TableHead$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableHead$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/TableHead/TableHead.js [app-client] (ecmascript) <export default as TableHead>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableRow$2f$TableRow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableRow$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/TableRow/TableRow.js [app-client] (ecmascript) <export default as TableRow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/TextField/TextField.js [app-client] (ecmascript) <export default as TextField>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/IconButton/IconButton.js [app-client] (ecmascript) <export default as IconButton>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Chip/Chip.js [app-client] (ecmascript) <export default as Chip>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Dialog$2f$Dialog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dialog$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Dialog/Dialog.js [app-client] (ecmascript) <export default as Dialog>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogTitle$2f$DialogTitle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DialogTitle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/DialogTitle/DialogTitle.js [app-client] (ecmascript) <export default as DialogTitle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogContent$2f$DialogContent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DialogContent$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/DialogContent/DialogContent.js [app-client] (ecmascript) <export default as DialogContent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogActions$2f$DialogActions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DialogActions$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/DialogActions/DialogActions.js [app-client] (ecmascript) <export default as DialogActions>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/FormControl/FormControl.js [app-client] (ecmascript) <export default as FormControl>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/InputLabel/InputLabel.js [app-client] (ecmascript) <export default as InputLabel>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Select/Select.js [app-client] (ecmascript) <export default as Select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/MenuItem/MenuItem.js [app-client] (ecmascript) <export default as MenuItem>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Grid/Grid.js [app-client] (ecmascript) <export default as Grid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Autocomplete$2f$Autocomplete$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Autocomplete$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Autocomplete/Autocomplete.js [app-client] (ecmascript) <locals> <export default as Autocomplete>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Divider$2f$Divider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Divider$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Divider/Divider.js [app-client] (ecmascript) <export default as Divider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputAdornment$2f$InputAdornment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputAdornment$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/InputAdornment/InputAdornment.js [app-client] (ecmascript) <export default as InputAdornment>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormHelperText$2f$FormHelperText$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormHelperText$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/FormHelperText/FormHelperText.js [app-client] (ecmascript) <export default as FormHelperText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ListSubheader$2f$ListSubheader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListSubheader$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/ListSubheader/ListSubheader.js [app-client] (ecmascript) <export default as ListSubheader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CircularProgress$2f$CircularProgress$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircularProgress$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/CircularProgress/CircularProgress.js [app-client] (ecmascript) <export default as CircularProgress>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emotion+s_4e73157eb597994b66e5584b450a6441/node_modules/@mui/material/esm/Tooltip/Tooltip.js [app-client] (ecmascript) <export default as Tooltip>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$x$2d$data$2d$grid$40$8$2e$17$2e$0_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emoti_d792b99621bd2f8e2790952227d3b59b$2f$node_modules$2f40$mui$2f$x$2d$data$2d$grid$2f$esm$2f$DataGrid$2f$DataGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+x-data-grid@8.17.0_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emoti_d792b99621bd2f8e2790952227d3b59b/node_modules/@mui/x-data-grid/esm/DataGrid/DataGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$x$2d$data$2d$grid$40$8$2e$17$2e$0_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emoti_d792b99621bd2f8e2790952227d3b59b$2f$node_modules$2f40$mui$2f$x$2d$data$2d$grid$2f$esm$2f$components$2f$toolbar$2f$GridToolbar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+x-data-grid@8.17.0_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emoti_d792b99621bd2f8e2790952227d3b59b/node_modules/@mui/x-data-grid/esm/components/toolbar/GridToolbar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$x$2d$data$2d$grid$40$8$2e$17$2e$0_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emoti_d792b99621bd2f8e2790952227d3b59b$2f$node_modules$2f40$mui$2f$x$2d$data$2d$grid$2f$esm$2f$locales$2f$trTR$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+x-data-grid@8.17.0_@emotion+react@11.14.0_@types+react@19.2.2_react@19.2.0__@emoti_d792b99621bd2f8e2790952227d3b59b/node_modules/@mui/x-data-grid/esm/locales/trTR.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Add$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Add.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Edit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Edit.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Delete$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Delete.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Search.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$FileDownload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/FileDownload.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$History$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/History.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CompareArrows$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/CompareArrows.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Warehouse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Warehouse.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Refresh$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+icons-material@7.3.7_@mui+material@7.3.7_@emotion+react@11.14.0_@types+react@19.2._1fb279aa6c02e7bb2953f3c97325ca8e/node_modules/@mui/icons-material/esm/Refresh.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$tabStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/tabStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useDebounce$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useDebounce.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Loading$2f$TableSkeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Loading/TableSkeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$MainLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Layout/MainLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$xlsx$40$0$2e$18$2e$5$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/xlsx@0.18.5/node_modules/xlsx/xlsx.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
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
// Custom Search Bar Component (External to DataGrid to avoid slot issues)
const MaterialSearchBar = ({ search, setSearch, onSearch, onRefresh })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
        sx: {
            p: 1.5,
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            width: '100%',
            bgcolor: 'var(--card)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                size: "small",
                placeholder: "Stok kodu, adı, barkod veya OEM kodu ile ara...",
                value: search || '',
                onChange: (e)=>setSearch?.(e.target.value),
                onKeyDown: (e)=>{
                    if (e.key === 'Enter') {
                        onSearch?.();
                    }
                },
                sx: {
                    width: {
                        xs: '100%',
                        md: 450
                    },
                    '& .MuiInputBase-root': {
                        bgcolor: 'var(--background)'
                    }
                },
                InputProps: {
                    startAdornment: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputAdornment$2f$InputAdornment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputAdornment$3e$__["InputAdornment"], {
                        position: "start",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            fontSize: "small",
                            sx: {
                                color: 'var(--primary)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 91,
                            columnNumber: 15
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                        lineNumber: 90,
                        columnNumber: 13
                    }, void 0)
                }
            }, void 0, false, {
                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                variant: "contained",
                size: "medium",
                onClick: ()=>onSearch?.(),
                startIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                    lineNumber: 100,
                    columnNumber: 20
                }, void 0),
                sx: {
                    bgcolor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    '&:hover': {
                        bgcolor: 'var(--primary)',
                        opacity: 0.9
                    }
                },
                children: "Ara"
            }, void 0, false, {
                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__["Tooltip"], {
                title: "Listeyi yenile",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                    variant: "outlined",
                    size: "medium",
                    onClick: ()=>onRefresh?.(),
                    startIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Refresh$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                        lineNumber: 120,
                        columnNumber: 22
                    }, void 0),
                    sx: {
                        textTransform: 'none',
                        fontWeight: 600
                    },
                    children: "Yenile"
                }, void 0, false, {
                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                    lineNumber: 116,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = MaterialSearchBar;
const formatDateOnly = (date)=>{
    const pad = (value)=>value.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
const MalzemeFormDialog = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s(({ open, initialFormData, editingMalzeme, locations, kategoriler, markalar, aracMarkalar, aracModeller, aracMotorHacimleri, aracYakitTipleri, birimSetleri, onAracMarkaChange, onClose, onSubmit })=>{
    _s();
    // Local State - Parent'ı etkilemez, ping sorunu çözülür
    const [localFormData, setLocalFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialFormData);
    // initialFormData değiştiğinde local state'i güncelle
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MalzemeFormDialog.useEffect": ()=>{
            // Eğer düzenleme modundaysak ve initialFormData.altKategori varsa,
            // önce kategorilerin yüklenmesini bekleyelim
            if (open && initialFormData.anaKategori && initialFormData.altKategori) {
                const currentOptions = kategoriler[initialFormData.anaKategori] || [];
                // Eğer alt kategori mevcut seçenekler arasında değilse ve düzenleme modundaysak,
                // alt kategoriyi koruyalım (çünkü malzeme zaten bu değere sahip)
                setLocalFormData(initialFormData);
            } else {
                setLocalFormData(initialFormData);
            }
        }
    }["MalzemeFormDialog.useEffect"], [
        initialFormData,
        open,
        kategoriler
    ]);
    // Local değişiklik fonksiyonu - Sadece dialog re-render olur
    const handleLocalChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeFormDialog.useCallback[handleLocalChange]": (field, value)=>{
            setLocalFormData({
                "MalzemeFormDialog.useCallback[handleLocalChange]": (prev)=>({
                        ...prev,
                        [field]: value
                    })
            }["MalzemeFormDialog.useCallback[handleLocalChange]"]);
        }
    }["MalzemeFormDialog.useCallback[handleLocalChange]"], []);
    // Ana kategori değiştiğinde alt kategoriyi sıfırla
    const handleAnaKategoriChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeFormDialog.useCallback[handleAnaKategoriChange]": (value)=>{
            setLocalFormData({
                "MalzemeFormDialog.useCallback[handleAnaKategoriChange]": (prev)=>({
                        ...prev,
                        anaKategori: value,
                        altKategori: ''
                    })
            }["MalzemeFormDialog.useCallback[handleAnaKategoriChange]"]);
        }
    }["MalzemeFormDialog.useCallback[handleAnaKategoriChange]"], []);
    // Araç markası değiştiğinde modeli sıfırla ve modelleri yükle
    const handleAracMarkaChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeFormDialog.useCallback[handleAracMarkaChange]": (value)=>{
            setLocalFormData({
                "MalzemeFormDialog.useCallback[handleAracMarkaChange]": (prev)=>({
                        ...prev,
                        aracMarka: value,
                        aracModel: ''
                    })
            }["MalzemeFormDialog.useCallback[handleAracMarkaChange]"]);
            onAracMarkaChange(value);
        }
    }["MalzemeFormDialog.useCallback[handleAracMarkaChange]"], [
        onAracMarkaChange
    ]);
    // Local submit - Parent'a sadece burada veri gönderilir
    const handleLocalSubmit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeFormDialog.useCallback[handleLocalSubmit]": ()=>{
            onSubmit(localFormData);
        }
    }["MalzemeFormDialog.useCallback[handleLocalSubmit]"], [
        localFormData,
        onSubmit
    ]);
    // Alt kategori seçenekleri - useMemo ile optimize edilmiş
    const altKategoriOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MalzemeFormDialog.useMemo[altKategoriOptions]": ()=>{
            if (!localFormData.anaKategori) {
                return [];
            }
            const options = kategoriler[localFormData.anaKategori] || [];
            // Eğer düzenleme modundaysak ve mevcut altKategori seçenekler arasında yoksa,
            // onu da ekle (malzeme zaten bu değere sahip olabilir)
            if (editingMalzeme && localFormData.altKategori && !options.includes(localFormData.altKategori)) {
                return [
                    ...options,
                    localFormData.altKategori
                ];
            }
            return options;
        }
    }["MalzemeFormDialog.useMemo[altKategoriOptions]"], [
        localFormData.anaKategori,
        localFormData.altKategori,
        kategoriler,
        editingMalzeme
    ]);
    // Hook'lar bittikten SONRA conditional return
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Dialog$2f$Dialog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dialog$3e$__["Dialog"], {
        open: open,
        onClose: onClose,
        maxWidth: "lg",
        fullWidth: true,
        PaperProps: {
            sx: {
                minHeight: '70vh',
                bgcolor: 'var(--card)',
                backgroundImage: 'none'
            }
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogTitle$2f$DialogTitle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DialogTitle$3e$__["DialogTitle"], {
                component: "div",
                sx: {
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    color: 'var(--primary-foreground)',
                    fontSize: '1.25rem',
                    py: 2,
                    borderBottom: '1px solid var(--border)'
                },
                children: editingMalzeme ? '✏️ Malzeme Düzenle' : '➕ Yeni Malzeme Ekle'
            }, void 0, false, {
                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                lineNumber: 314,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogContent$2f$DialogContent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DialogContent$3e$__["DialogContent"], {
                sx: {
                    mt: 3,
                    bgcolor: 'var(--background)',
                    borderTop: '1px solid var(--border)',
                    px: 3
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                    sx: {
                        py: 1
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "h6",
                            sx: {
                                mb: 2,
                                color: 'var(--foreground)',
                                fontWeight: 700,
                                letterSpacing: '-0.01em'
                            },
                            children: "📋 Genel Bilgiler"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 328,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                            container: true,
                            spacing: 3,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 3
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                        fullWidth: true,
                                        label: "Stok Kodu",
                                        value: localFormData.stokKodu,
                                        onChange: (e)=>handleLocalChange('stokKodu', e.target.value),
                                        size: "medium",
                                        className: "form-control-textfield",
                                        helperText: localFormData.stokKodu ? "Önerilen kod (değiştirilebilir)" : "Otomatik üretilecek",
                                        placeholder: "Otomatik",
                                        sx: {
                                            '& .MuiInputBase-input': {
                                                color: localFormData.stokKodu && !editingMalzeme ? 'var(--primary)' : 'var(--foreground)',
                                                fontWeight: localFormData.stokKodu && !editingMalzeme ? 500 : 'normal'
                                            }
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 333,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 332,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 6
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                        fullWidth: true,
                                        label: "Stok Adı",
                                        value: localFormData.stokAdi,
                                        onChange: (e)=>handleLocalChange('stokAdi', e.target.value),
                                        required: true,
                                        size: "medium",
                                        className: "form-control-textfield",
                                        helperText: "Detaylı ürün açıklaması giriniz",
                                        inputProps: {
                                            style: {
                                                fontSize: '1rem'
                                            }
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 351,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 350,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 3
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                        fullWidth: true,
                                        label: "Barkod",
                                        value: localFormData.barkod,
                                        onChange: (e)=>handleLocalChange('barkod', e.target.value),
                                        size: "medium",
                                        className: "form-control-textfield",
                                        helperText: "Ürün barkod numarası",
                                        placeholder: "Örn: 8690123456789",
                                        sx: {
                                            '& .MuiInputBase-input': {
                                                fontFamily: 'monospace',
                                                fontSize: '0.95rem'
                                            }
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 364,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 363,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 331,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Divider$2f$Divider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Divider$3e$__["Divider"], {
                            sx: {
                                my: 4
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 383,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "h6",
                            sx: {
                                mb: 2,
                                color: 'var(--foreground)',
                                fontWeight: 700,
                                letterSpacing: '-0.01em'
                            },
                            children: "🏷️ Kategori ve Ölçü Bilgileri"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 386,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                            container: true,
                            spacing: 3,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 6
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                        fullWidth: true,
                                        label: "Tedarikçi Kodu",
                                        value: localFormData.tedarikciKodu,
                                        onChange: (e)=>handleLocalChange('tedarikciKodu', e.target.value),
                                        placeholder: "Tedarikçinin ürün kodu",
                                        size: "medium",
                                        className: "form-control-textfield",
                                        helperText: "Tedarikçinin kullandığı ürün kodu"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 391,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 390,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 6
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                        fullWidth: true,
                                        label: "OEM Kodu",
                                        value: localFormData.oem,
                                        onChange: (e)=>handleLocalChange('oem', e.target.value),
                                        placeholder: "Orijinal parça numarası",
                                        size: "medium",
                                        className: "form-control-textfield",
                                        helperText: "Orjinal ekipman üreticisi kodu"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 404,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 403,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 6
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__["FormControl"], {
                                        fullWidth: true,
                                        size: "medium",
                                        className: "form-control-select",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__["InputLabel"], {
                                                shrink: true,
                                                children: "Marka"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 418,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                                value: localFormData.marka,
                                                label: "Marka",
                                                displayEmpty: true,
                                                onChange: (e)=>handleLocalChange('marka', e.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                        value: "",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                                            children: "Seçiniz"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 426,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 425,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    markalar.map((marka)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                            value: marka,
                                                            children: marka
                                                        }, marka, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 429,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 419,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 417,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 416,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 6
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__["FormControl"], {
                                        fullWidth: true,
                                        size: "medium",
                                        className: "form-control-select",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__["InputLabel"], {
                                                shrink: true,
                                                children: "Ana Kategori *"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 439,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                                value: localFormData.anaKategori,
                                                label: "Ana Kategori *",
                                                displayEmpty: true,
                                                onChange: (e)=>handleAnaKategoriChange(e.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                        value: "",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                                            children: "Seçiniz"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 447,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 446,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    Object.keys(kategoriler).map((kategori)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                            value: kategori,
                                                            children: kategori
                                                        }, kategori, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 450,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 440,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 438,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 437,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 6
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__["FormControl"], {
                                        fullWidth: true,
                                        size: "medium",
                                        className: "form-control-select",
                                        disabled: !localFormData.anaKategori,
                                        error: Boolean(localFormData.altKategori && altKategoriOptions.length > 0 && !altKategoriOptions.includes(localFormData.altKategori)),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__["InputLabel"], {
                                                shrink: true,
                                                children: "Alt Kategori"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 466,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                                value: // Eğer altKategoriOptions boşsa, boş string kullan (MUI hatası önlemek için)
                                                // Eğer mevcut altKategori seçenekler arasındaysa, onu kullan
                                                // Aksi halde boş string kullan
                                                !localFormData.altKategori || altKategoriOptions.length === 0 ? '' : altKategoriOptions.includes(localFormData.altKategori) ? localFormData.altKategori : '',
                                                label: "Alt Kategori",
                                                displayEmpty: true,
                                                onChange: (e)=>handleLocalChange('altKategori', e.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                        value: "",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                                            children: "Seçiniz"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 483,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 482,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    altKategoriOptions.map((altKat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                            value: altKat,
                                                            children: altKat
                                                        }, altKat, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 486,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 467,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            localFormData.altKategori && altKategoriOptions.length > 0 && !altKategoriOptions.includes(localFormData.altKategori) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormHelperText$2f$FormHelperText$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormHelperText$3e$__["FormHelperText"], {
                                                error: true,
                                                children: "Bu alt kategori mevcut ana kategori altında bulunmuyor. Lütfen ana kategoriyi kontrol edin."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 492,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            altKategoriOptions.length === 0 && localFormData.anaKategori && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormHelperText$2f$FormHelperText$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormHelperText$3e$__["FormHelperText"], {
                                                children: "Bu ana kategori için henüz alt kategori tanımlanmamış."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 497,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 459,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 458,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 8
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                        fullWidth: true,
                                        label: "Ölçü / Teknik Özellikler",
                                        value: localFormData.olcu,
                                        onChange: (e)=>handleLocalChange('olcu', e.target.value),
                                        placeholder: "Örn: 12x1.5, 195/65R15, M14x1.5, 180x20mm",
                                        size: "medium",
                                        className: "form-control-textfield",
                                        helperText: "Ürünün ölçü veya teknik özelliklerini giriniz"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 505,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 504,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 2
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Autocomplete$2f$Autocomplete$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Autocomplete$3e$__["Autocomplete"], {
                                        fullWidth: true,
                                        options: locations,
                                        getOptionLabel: (option)=>typeof option === 'string' ? option : option.code,
                                        value: locations.find((l)=>l.code === localFormData.raf) ?? null,
                                        onChange: (_, newValue)=>{
                                            if (typeof newValue === 'string') {
                                                handleLocalChange('raf', newValue);
                                            } else {
                                                handleLocalChange('raf', newValue?.code || '');
                                            }
                                        },
                                        renderInput: (params)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                                ...params,
                                                label: "Raf Adresi",
                                                placeholder: "Seçiniz veya yazınız",
                                                size: "medium",
                                                className: "form-control-textfield",
                                                helperText: "Depo raf konumu"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 531,
                                                columnNumber: 19
                                            }, void 0),
                                        freeSolo: true,
                                        onInputChange: (_, newValue, reason)=>{
                                            if (reason === 'input') {
                                                handleLocalChange('raf', newValue);
                                            }
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 518,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 517,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 2
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__["FormControl"], {
                                        fullWidth: true,
                                        size: "medium",
                                        className: "form-control-select",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__["InputLabel"], {
                                                shrink: true,
                                                children: "Birim *"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 551,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                                value: localFormData.birimId || '',
                                                label: "Birim *",
                                                displayEmpty: true,
                                                onChange: (e)=>{
                                                    const selectedId = e.target.value;
                                                    let selectedName = '';
                                                    birimSetleri.forEach((set)=>{
                                                        const found = set.birimler.find((b)=>b.id === selectedId);
                                                        if (found) selectedName = found.ad;
                                                    });
                                                    setLocalFormData((prev)=>({
                                                            ...prev,
                                                            birimId: selectedId,
                                                            birim: selectedName
                                                        }));
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                        value: "",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                                            children: "Seçiniz"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 566,
                                                            columnNumber: 38
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 566,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    birimSetleri.map((set)=>[
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ListSubheader$2f$ListSubheader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListSubheader$3e$__["ListSubheader"], {
                                                                children: set.ad
                                                            }, `set-${set.id}`, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 568,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            ...set.birimler.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                                    value: b.id,
                                                                    children: [
                                                                        b.ad,
                                                                        " ",
                                                                        b.kod ? `(${b.kod})` : ''
                                                                    ]
                                                                }, b.id, true, {
                                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                    lineNumber: 570,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)))
                                                        ])
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 552,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 550,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 549,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 389,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Divider$2f$Divider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Divider$3e$__["Divider"], {
                            sx: {
                                my: 4
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 580,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "h6",
                            sx: {
                                mb: 2,
                                color: 'var(--foreground)',
                                fontWeight: 700,
                                letterSpacing: '-0.01em'
                            },
                            children: "💰 Fiyat Bilgileri"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 583,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                            container: true,
                            spacing: 3,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 6
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                        fullWidth: true,
                                        label: "Alış Fiyatı",
                                        type: "number",
                                        value: localFormData.alisFiyati,
                                        onChange: (e)=>handleLocalChange('alisFiyati', parseFloat(e.target.value) || 0),
                                        size: "medium",
                                        className: "form-control-textfield",
                                        InputProps: {
                                            startAdornment: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputAdornment$2f$InputAdornment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputAdornment$3e$__["InputAdornment"], {
                                                position: "start",
                                                children: "₺"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 597,
                                                columnNumber: 35
                                            }, void 0),
                                            readOnly: Boolean(editingMalzeme)
                                        },
                                        disabled: Boolean(editingMalzeme),
                                        helperText: editingMalzeme ? 'Güncelleme sırasında alış fiyatı değiştirilemez.' : 'Tedarikçiden aldığınız fiyat'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 588,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 587,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 6
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                        fullWidth: true,
                                        label: "Satış Fiyatı",
                                        type: "number",
                                        value: localFormData.satisFiyati,
                                        onChange: (e)=>handleLocalChange('satisFiyati', parseFloat(e.target.value) || 0),
                                        size: "medium",
                                        className: "form-control-textfield",
                                        InputProps: {
                                            startAdornment: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputAdornment$2f$InputAdornment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputAdornment$3e$__["InputAdornment"], {
                                                position: "start",
                                                children: "₺"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 615,
                                                columnNumber: 35
                                            }, void 0),
                                            readOnly: Boolean(editingMalzeme)
                                        },
                                        disabled: Boolean(editingMalzeme),
                                        helperText: editingMalzeme ? 'Güncelleme sırasında satış fiyatı değiştirilemez.' : 'Müşteriye satış fiyatı'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 606,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 605,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 586,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        localFormData.alisFiyati > 0 && localFormData.satisFiyati > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                            sx: {
                                mt: 2,
                                p: 2,
                                bgcolor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                variant: "body2",
                                sx: {
                                    color: 'var(--foreground)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Kâr Marjı:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 627,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " ₺",
                                    (localFormData.satisFiyati - localFormData.alisFiyati).toFixed(2),
                                    "(",
                                    localFormData.alisFiyati > 0 ? ((localFormData.satisFiyati - localFormData.alisFiyati) / localFormData.alisFiyati * 100).toFixed(1) : 0,
                                    "%)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                lineNumber: 626,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 625,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Divider$2f$Divider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Divider$3e$__["Divider"], {
                            sx: {
                                my: 4,
                                borderColor: 'var(--border)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 633,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "h6",
                            sx: {
                                mb: 2,
                                color: 'var(--foreground)',
                                fontWeight: 700,
                                letterSpacing: '-0.01em'
                            },
                            children: "📦 Kurumsal / Ek Özellikler"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 636,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                            container: true,
                            spacing: 3,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 3
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                        fullWidth: true,
                                        label: "Ağırlık",
                                        type: "number",
                                        value: localFormData.weight ?? '',
                                        onChange: (e)=>handleLocalChange('weight', e.target.value === '' ? undefined : parseFloat(e.target.value)),
                                        size: "medium",
                                        className: "form-control-textfield",
                                        InputProps: {
                                            endAdornment: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputAdornment$2f$InputAdornment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputAdornment$3e$__["InputAdornment"], {
                                                position: "end",
                                                children: localFormData.weightUnit || 'kg'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 641,
                                                columnNumber: 288
                                            }, void 0)
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 641,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 640,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 2
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__["FormControl"], {
                                        fullWidth: true,
                                        size: "medium",
                                        className: "form-control-select",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__["InputLabel"], {
                                                shrink: true,
                                                children: "Ağırlık Birimi"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 645,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                                value: localFormData.weightUnit || 'kg',
                                                label: "Ağırlık Birimi",
                                                onChange: (e)=>handleLocalChange('weightUnit', e.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                        value: "kg",
                                                        children: "kg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 647,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                        value: "g",
                                                        children: "g"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 648,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                        value: "lb",
                                                        children: "lb"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 649,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 646,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 644,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 643,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 4
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                        fullWidth: true,
                                        label: "Boyutlar",
                                        value: localFormData.dimensions ?? '',
                                        onChange: (e)=>handleLocalChange('dimensions', e.target.value),
                                        placeholder: "Örn: 10x20x5 cm",
                                        size: "medium",
                                        className: "form-control-textfield"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 654,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 653,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 3
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                        fullWidth: true,
                                        label: "Menşei Ülke",
                                        value: localFormData.countryOfOrigin ?? '',
                                        onChange: (e)=>handleLocalChange('countryOfOrigin', e.target.value),
                                        size: "medium",
                                        className: "form-control-textfield"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 657,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 656,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 3
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                        fullWidth: true,
                                        label: "Garanti (Ay)",
                                        type: "number",
                                        value: localFormData.warrantyMonths ?? '',
                                        onChange: (e)=>handleLocalChange('warrantyMonths', e.target.value === '' ? undefined : parseInt(e.target.value, 10)),
                                        size: "medium",
                                        className: "form-control-textfield",
                                        inputProps: {
                                            min: 0
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 660,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 659,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 3
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                        fullWidth: true,
                                        label: "Min. Sipariş Miktarı",
                                        type: "number",
                                        value: localFormData.minOrderQty ?? '',
                                        onChange: (e)=>handleLocalChange('minOrderQty', e.target.value === '' ? undefined : parseInt(e.target.value, 10)),
                                        size: "medium",
                                        className: "form-control-textfield",
                                        inputProps: {
                                            min: 0
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 663,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 662,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 3
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                        fullWidth: true,
                                        label: "Tedarik Süresi (Gün)",
                                        type: "number",
                                        value: localFormData.leadTimeDays ?? '',
                                        onChange: (e)=>handleLocalChange('leadTimeDays', e.target.value === '' ? undefined : parseInt(e.target.value, 10)),
                                        size: "medium",
                                        className: "form-control-textfield",
                                        inputProps: {
                                            min: 0
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 666,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 665,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                                        fullWidth: true,
                                        label: "İç Not",
                                        multiline: true,
                                        rows: 2,
                                        value: localFormData.internalNote ?? '',
                                        onChange: (e)=>handleLocalChange('internalNote', e.target.value),
                                        placeholder: "Sadece iç kullanım",
                                        size: "medium",
                                        className: "form-control-textfield"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 669,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 668,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 639,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Divider$2f$Divider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Divider$3e$__["Divider"], {
                            sx: {
                                my: 4,
                                borderColor: 'var(--border)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 673,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "h6",
                            sx: {
                                mb: 2,
                                color: 'var(--foreground)',
                                fontWeight: 700,
                                letterSpacing: '-0.01em'
                            },
                            children: "🚗 Araç Bilgileri"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 676,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                            container: true,
                            spacing: 3,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 6
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__["FormControl"], {
                                        fullWidth: true,
                                        size: "medium",
                                        className: "form-control-select",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__["InputLabel"], {
                                                shrink: true,
                                                children: "Araç Markası"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 682,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                                value: localFormData.aracMarka || '',
                                                label: "Araç Markası",
                                                displayEmpty: true,
                                                onChange: (e)=>handleAracMarkaChange(e.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                        value: "",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                                            children: "Seçiniz"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 690,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 689,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    aracMarkalar.map((marka)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                            value: marka,
                                                            children: marka
                                                        }, marka, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 693,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 683,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 681,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 680,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 6
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__["FormControl"], {
                                        fullWidth: true,
                                        size: "medium",
                                        disabled: !localFormData.aracMarka,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__["InputLabel"], {
                                                shrink: true,
                                                children: "Araç Modeli"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 703,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                                value: localFormData.aracModel || '',
                                                label: "Araç Modeli",
                                                displayEmpty: true,
                                                onChange: (e)=>handleLocalChange('aracModel', e.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                        value: "",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                                            children: "Seçiniz"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 711,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 710,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    aracModeller.map((model)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                            value: model,
                                                            children: model
                                                        }, model, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 714,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 704,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 702,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 701,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 6
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__["FormControl"], {
                                        fullWidth: true,
                                        size: "medium",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__["InputLabel"], {
                                                shrink: true,
                                                children: "Motor Hacmi"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 724,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                                value: localFormData.aracMotorHacmi || '',
                                                label: "Motor Hacmi",
                                                displayEmpty: true,
                                                onChange: (e)=>handleLocalChange('aracMotorHacmi', e.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                        value: "",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                                            children: "Seçiniz"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 732,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 731,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    aracMotorHacimleri.map((hacim)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                            value: hacim,
                                                            children: hacim
                                                        }, hacim, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 735,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 725,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 723,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 722,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                                    size: {
                                        xs: 12,
                                        md: 6
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__["FormControl"], {
                                        fullWidth: true,
                                        size: "medium",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__["InputLabel"], {
                                                shrink: true,
                                                children: "Yakıt Tipi"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 745,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                                value: localFormData.aracYakitTipi || '',
                                                label: "Yakıt Tipi",
                                                displayEmpty: true,
                                                onChange: (e)=>handleLocalChange('aracYakitTipi', e.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                        value: "",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                                            children: "Seçiniz"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 753,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 752,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    aracYakitTipleri.map((yakit)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                            value: yakit,
                                                            children: yakit
                                                        }, yakit, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 756,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 746,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 744,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 743,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 679,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Divider$2f$Divider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Divider$3e$__["Divider"], {
                            sx: {
                                my: 4
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 765,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                    lineNumber: 326,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                lineNumber: 325,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogActions$2f$DialogActions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DialogActions$3e$__["DialogActions"], {
                sx: {
                    px: 3,
                    py: 2,
                    bgcolor: 'var(--muted)',
                    borderTop: '1px solid var(--border)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                        onClick: onClose,
                        size: "large",
                        sx: {
                            minWidth: 100,
                            borderRadius: '999px',
                            px: 2.4,
                            border: '1px solid var(--border)',
                            color: 'var(--muted-foreground)',
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: 'var(--card)'
                            }
                        },
                        children: "İptal"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                        lineNumber: 770,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                        onClick: handleLocalSubmit,
                        variant: "contained",
                        size: "large",
                        disabled: !localFormData.stokAdi,
                        sx: {
                            background: '#527575',
                            color: '#0b0b0b',
                            minWidth: 140,
                            borderRadius: '999px',
                            px: 2.8,
                            fontWeight: 700,
                            letterSpacing: '-0.01em',
                            boxShadow: '0 10px 24px color-mix(in srgb, #527575 30%, transparent)',
                            textTransform: 'none',
                            '&:hover': {
                                background: 'color-mix(in srgb, #527575 90%, #000 10%)',
                                transform: 'translateY(-1px)'
                            }
                        },
                        children: editingMalzeme ? '💾 Güncelle' : '➕ Ekle'
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                        lineNumber: 785,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                lineNumber: 769,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
        lineNumber: 301,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "tVe93wYHAA8mu8gNR7gBKCif13w="));
_c1 = MalzemeFormDialog;
MalzemeFormDialog.displayName = 'MalzemeFormDialog';
function MalzemeListesiPage() {
    _s1();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { addTab, setActiveTab } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$tabStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTabStore"])();
    const [stoklar, setStoklar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [openDialog, setOpenDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingMalzeme, setEditingMalzeme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [locations, setLocations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedKategori, setSelectedKategori] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedAltKategori, setSelectedAltKategori] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedMarka, setSelectedMarka] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [stokDurumu, setStokDurumu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [openEslestirmeDialog, setOpenEslestirmeDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedMalzeme, setSelectedMalzeme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedEquivalents, setSelectedEquivalents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [hareketDialogOpen, setHareketDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hareketMalzeme, setHareketMalzeme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hareketTipiFilter, setHareketTipiFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Eşdeğer ürünler modal state
    const [esdegerDialogOpen, setEsdegerDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [esdegerMalzeme, setEsdegerMalzeme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [esdegerUrunler, setEsdegerUrunler] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [esdegerLoading, setEsdegerLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Debounced search - 500ms sonra arama yapılır
    const debouncedSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useDebounce$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebounce"])(search, 500);
    // Kategoriler ve markalar state
    const [kategoriler, setKategoriler] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [markalar, setMarkalar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Araç bilgileri state
    const [aracMarkalar, setAracMarkalar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [aracModeller, setAracModeller] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [aracMotorHacimleri] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        '1.0L',
        '1.2L',
        '1.4L',
        '1.5L',
        '1.6L',
        '1.8L',
        '2.0L',
        '2.2L',
        '2.5L',
        '3.0L',
        '3.5L',
        '4.0L',
        '5.0L'
    ]);
    const [aracYakitTipleri, setAracYakitTipleri] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedAracMarka, setSelectedAracMarka] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [birimSetleri, setBirimSetleri] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Initial form data - sadece dialog açıldığında kullanılır
    const [initialFormData, setInitialFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        stokKodu: '',
        stokAdi: '',
        barkod: '',
        marka: '',
        anaKategori: '',
        altKategori: '',
        birim: 'Adet',
        olcu: '',
        oem: '',
        raf: '',
        tedarikciKodu: '',
        alisFiyati: 0,
        satisFiyati: 0,
        birimId: ''
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MalzemeListesiPage.useEffect": ()=>{
            setSelectedAltKategori('');
        }
    }["MalzemeListesiPage.useEffect"], [
        selectedKategori
    ]);
    // Fetch locations - useCallback ile optimize edilmiş
    const fetchLocations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeListesiPage.useCallback[fetchLocations]": async ()=>{
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/location');
                setLocations(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Raf listesi alınamadı:', error);
                setLocations([]);
            }
        }
    }["MalzemeListesiPage.useCallback[fetchLocations]"], []);
    // Fetch kategoriler - useCallback ile optimize edilmiş
    const fetchKategoriler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeListesiPage.useCallback[fetchKategoriler]": async ()=>{
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/category');
                const kategoriData = response.data || [];
                // Kategorileri Record<string, string[]> formatına çevir
                const kategoriMap = {};
                kategoriData.forEach({
                    "MalzemeListesiPage.useCallback[fetchKategoriler]": (kategori)=>{
                        kategoriMap[kategori.anaKategori] = kategori.altKategoriler || [];
                    }
                }["MalzemeListesiPage.useCallback[fetchKategoriler]"]);
                setKategoriler(kategoriMap);
            } catch (error) {
                console.error('Kategori listesi alınamadı:', error);
                setKategoriler({});
            }
        }
    }["MalzemeListesiPage.useCallback[fetchKategoriler]"], []);
    // Fetch markalar - useCallback ile optimize edilmiş
    const fetchMarkalar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeListesiPage.useCallback[fetchMarkalar]": async ()=>{
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/brand');
                const markaData = response.data || [];
                // Markaları string array'e çevir
                const markaList = markaData.map({
                    "MalzemeListesiPage.useCallback[fetchMarkalar].markaList": (marka)=>marka.markaAdi
                }["MalzemeListesiPage.useCallback[fetchMarkalar].markaList"]);
                setMarkalar(markaList);
            } catch (error) {
                console.error('Marka listesi alınamadı:', error);
                setMarkalar([]);
            }
        }
    }["MalzemeListesiPage.useCallback[fetchMarkalar]"], []);
    // Fetch araç markaları
    const fetchAracMarkalar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeListesiPage.useCallback[fetchAracMarkalar]": async ()=>{
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/vehicle-brand/brands').catch({
                    "MalzemeListesiPage.useCallback[fetchAracMarkalar]": ()=>({
                            data: []
                        })
                }["MalzemeListesiPage.useCallback[fetchAracMarkalar]"]);
                setAracMarkalar(response.data || []);
            } catch (error) {
                console.error('Araç markaları yüklenemedi:', error);
                setAracMarkalar([]);
            }
        }
    }["MalzemeListesiPage.useCallback[fetchAracMarkalar]"], []);
    // Fetch araç modelleri (marka seçildiğinde)
    const fetchAracModeller = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeListesiPage.useCallback[fetchAracModeller]": async (marka)=>{
            if (!marka) {
                setAracModeller([]);
                return;
            }
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/vehicle-brand/models', {
                    params: {
                        brand: marka
                    }
                });
                setAracModeller(response.data || []);
            } catch (error) {
                console.error('Araç modelleri yüklenemedi:', error);
                setAracModeller([]);
            }
        }
    }["MalzemeListesiPage.useCallback[fetchAracModeller]"], []);
    // Fetch yakıt tipleri
    const fetchAracYakitTipleri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeListesiPage.useCallback[fetchAracYakitTipleri]": async ()=>{
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/vehicle-brand/fuel-types');
                setAracYakitTipleri(response.data || []);
            } catch (error) {
                console.error('Yakıt tipleri yüklenemedi:', error);
                setAracYakitTipleri([]);
            }
        }
    }["MalzemeListesiPage.useCallback[fetchAracYakitTipleri]"], []);
    const fetchBirimSetleri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeListesiPage.useCallback[fetchBirimSetleri]": async ()=>{
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/unit-set');
                setBirimSetleri(response.data || []);
            } catch (error) {
                console.error('Birim setleri yüklenemedi:', error);
                setBirimSetleri([]);
            }
        }
    }["MalzemeListesiPage.useCallback[fetchBirimSetleri]"], []);
    // Araç markası değiştiğinde modelleri yükle
    const handleAracMarkaChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeListesiPage.useCallback[handleAracMarkaChange]": (marka)=>{
            setSelectedAracMarka(marka);
            fetchAracModeller(marka);
        }
    }["MalzemeListesiPage.useCallback[handleAracMarkaChange]"], [
        fetchAracModeller
    ]);
    // Fetch stoklar - useCallback ile optimize edilmiş (tüm sayfalar için veri çek)
    const fetchStoklar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeListesiPage.useCallback[fetchStoklar]": async ()=>{
            try {
                setLoading(true);
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/product', {
                    params: {
                        search: debouncedSearch,
                        limit: 5000,
                        page: 1
                    }
                });
                const stokData = response.data.data || [];
                setStoklar(stokData);
            } catch (error) {
                console.error('Stok verisi alınamadı:', error);
                setStoklar([]);
            } finally{
                setLoading(false);
            }
        }
    }["MalzemeListesiPage.useCallback[fetchStoklar]"], [
        debouncedSearch
    ]);
    // Initial fetch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MalzemeListesiPage.useEffect": ()=>{
            fetchStoklar();
            fetchLocations();
            fetchKategoriler();
            fetchMarkalar();
            fetchAracMarkalar();
            fetchAracYakitTipleri();
            fetchBirimSetleri();
        }
    }["MalzemeListesiPage.useEffect"], [
        fetchStoklar,
        fetchLocations,
        fetchKategoriler,
        fetchMarkalar,
        fetchAracMarkalar,
        fetchAracYakitTipleri,
        fetchBirimSetleri
    ]);
    // Dialog açma - initialFormData hazırla - useCallback ile optimize edilmiş
    const handleOpenDialog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeListesiPage.useCallback[handleOpenDialog]": async (malzeme)=>{
            if (malzeme) {
                setEditingMalzeme(malzeme);
                // Araç markası varsa modelleri yükle
                if (malzeme.aracMarka) {
                    await fetchAracModeller(malzeme.aracMarka);
                    setSelectedAracMarka(malzeme.aracMarka);
                }
                setInitialFormData({
                    stokKodu: malzeme.stokKodu,
                    stokAdi: malzeme.stokAdi,
                    barkod: malzeme.barkod || '',
                    marka: malzeme.marka || '',
                    anaKategori: malzeme.anaKategori || '',
                    altKategori: malzeme.altKategori || '',
                    birim: malzeme.birim || 'Adet',
                    olcu: malzeme.olcu || '',
                    oem: malzeme.oem || '',
                    raf: malzeme.raf || '',
                    tedarikciKodu: malzeme.tedarikciKodu || '',
                    alisFiyati: malzeme.alisFiyati || 0,
                    satisFiyati: malzeme.satisFiyati || 0,
                    birimId: malzeme.birimId || '',
                    aracMarka: malzeme.aracMarka || '',
                    aracModel: malzeme.aracModel || '',
                    aracMotorHacmi: malzeme.aracMotorHacmi || '',
                    aracYakitTipi: malzeme.aracYakitTipi || '',
                    weight: malzeme.weight,
                    weightUnit: malzeme.weightUnit || 'kg',
                    dimensions: malzeme.dimensions || '',
                    countryOfOrigin: malzeme.countryOfOrigin || '',
                    warrantyMonths: malzeme.warrantyMonths,
                    internalNote: malzeme.internalNote || '',
                    minOrderQty: malzeme.minOrderQty,
                    leadTimeDays: malzeme.leadTimeDays
                });
            } else {
                setEditingMalzeme(null);
                setSelectedAracMarka('');
                setAracModeller([]);
                // Stok kodunu otomatik olarak al
                let nextCode = '';
                try {
                    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/code-template/next-code/PRODUCT');
                    nextCode = response.data.nextCode || '';
                    console.log('Bir sonraki stok kodu:', nextCode);
                } catch (error) {
                    console.log('Numara şablonu bulunamadı veya hata oluştu, stok kodu manuel girilecek', error);
                }
                setInitialFormData({
                    stokKodu: nextCode,
                    stokAdi: '',
                    barkod: '',
                    marka: '',
                    anaKategori: '',
                    altKategori: '',
                    birim: 'Adet',
                    olcu: '',
                    oem: '',
                    raf: '',
                    tedarikciKodu: '',
                    alisFiyati: 0,
                    satisFiyati: 0,
                    birimId: '',
                    // Araç bilgileri
                    aracMarka: '',
                    aracModel: '',
                    aracMotorHacmi: '',
                    aracYakitTipi: '',
                    weight: undefined,
                    weightUnit: 'kg',
                    dimensions: '',
                    countryOfOrigin: '',
                    warrantyMonths: undefined,
                    internalNote: '',
                    minOrderQty: undefined,
                    leadTimeDays: undefined
                });
            }
            setOpenDialog(true);
        }
    }["MalzemeListesiPage.useCallback[handleOpenDialog]"], [
        fetchAracModeller,
        fetchBirimSetleri
    ]);
    // Dialog kapatma - useCallback ile optimize edilmiş
    const handleCloseDialog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeListesiPage.useCallback[handleCloseDialog]": ()=>{
            setOpenDialog(false);
            setEditingMalzeme(null);
        }
    }["MalzemeListesiPage.useCallback[handleCloseDialog]"], []);
    // Submit handler - useCallback ile optimize edilmiş
    const handleSubmit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeListesiPage.useCallback[handleSubmit]": async (submitFormData)=>{
            // Stok kodu kontrolü - sadece girilmişse ve aynı koda sahip başka kayıt varsa engelle
            if (submitFormData.stokKodu && submitFormData.stokKodu.trim().length > 0) {
                const mevcutStok = stoklar.find({
                    "MalzemeListesiPage.useCallback[handleSubmit].mevcutStok": (s)=>s.stokKodu.toLowerCase() === submitFormData.stokKodu.toLowerCase() && s.id !== editingMalzeme?.id
                }["MalzemeListesiPage.useCallback[handleSubmit].mevcutStok"]);
                if (mevcutStok) {
                    alert(`Bu stok kodu zaten kullanılıyor! (${mevcutStok.stokAdi})\nLütfen farklı bir stok kodu giriniz.`);
                    return;
                }
            }
            try {
                // Backend'e gönderilecek veri - stokKodu boşsa undefined gönder (backend otomatik üretsin)
                const payload = {
                    stokKodu: submitFormData.stokKodu && submitFormData.stokKodu.trim().length > 0 ? submitFormData.stokKodu : undefined,
                    stokAdi: submitFormData.stokAdi,
                    barkod: submitFormData.barkod && submitFormData.barkod.trim().length > 0 ? submitFormData.barkod : undefined,
                    birim: submitFormData.birim,
                    birimId: submitFormData.birimId || undefined,
                    alisFiyati: Number(submitFormData.alisFiyati),
                    satisFiyati: Number(submitFormData.satisFiyati),
                    kategori: submitFormData.anaKategori || undefined,
                    anaKategori: submitFormData.anaKategori || undefined,
                    altKategori: submitFormData.altKategori || undefined,
                    marka: submitFormData.marka || undefined,
                    oem: submitFormData.oem || undefined,
                    olcu: submitFormData.olcu || undefined,
                    raf: submitFormData.raf || undefined,
                    tedarikciKodu: submitFormData.tedarikciKodu && submitFormData.tedarikciKodu.trim().length > 0 ? submitFormData.tedarikciKodu : undefined,
                    // Araç bilgileri
                    aracMarka: submitFormData.aracMarka || undefined,
                    aracModel: submitFormData.aracModel || undefined,
                    aracMotorHacmi: submitFormData.aracMotorHacmi || undefined,
                    aracYakitTipi: submitFormData.aracYakitTipi || undefined,
                    weight: submitFormData.weight != null ? submitFormData.weight : undefined,
                    weightUnit: submitFormData.weightUnit || undefined,
                    dimensions: submitFormData.dimensions || undefined,
                    countryOfOrigin: submitFormData.countryOfOrigin || undefined,
                    warrantyMonths: submitFormData.warrantyMonths != null ? submitFormData.warrantyMonths : undefined,
                    internalNote: submitFormData.internalNote || undefined,
                    minOrderQty: submitFormData.minOrderQty != null ? submitFormData.minOrderQty : undefined,
                    leadTimeDays: submitFormData.leadTimeDays != null ? submitFormData.leadTimeDays : undefined
                };
                console.log('Backend\'e gönderilen veri:', payload);
                let stokId = editingMalzeme?.id;
                if (editingMalzeme) {
                    // Güncelleme
                    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/product/${editingMalzeme.id}`, payload);
                    if (!stokId) {
                        stokId = response?.data?.id ?? response?.data?.data?.id;
                    }
                } else {
                    // Yeni ekleme
                    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/product', payload);
                    stokId = response?.data?.id ?? response?.data?.data?.id;
                }
                const priceCardPayloads = [];
                if (submitFormData.alisFiyati > 0 && (!editingMalzeme || editingMalzeme.alisFiyati !== submitFormData.alisFiyati)) {
                    priceCardPayloads.push({
                        type: 'PURCHASE',
                        price: Number(submitFormData.alisFiyati)
                    });
                }
                if (submitFormData.satisFiyati > 0 && (!editingMalzeme || editingMalzeme.satisFiyati !== submitFormData.satisFiyati)) {
                    priceCardPayloads.push({
                        type: 'SALE',
                        price: Number(submitFormData.satisFiyati)
                    });
                }
                if (stokId && priceCardPayloads.length > 0) {
                    const effectiveFrom = formatDateOnly(new Date());
                    try {
                        await Promise.all(priceCardPayloads.map({
                            "MalzemeListesiPage.useCallback[handleSubmit]": (item)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/price-cards', {
                                    stokId,
                                    type: item.type,
                                    price: item.price,
                                    effectiveFrom,
                                    note: 'Malzeme kartı kaydı sırasında otomatik oluşturuldu.'
                                })
                        }["MalzemeListesiPage.useCallback[handleSubmit]"]));
                    } catch (priceCardError) {
                        console.error('Fiyat kartı oluşturulamadı:', priceCardError);
                    }
                }
                handleCloseDialog();
                // Listeyi yenile - fetchStoklar'ı dependency'den çıkar, doğrudan çağır
                try {
                    setLoading(true);
                    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/product', {
                        params: {
                            search: debouncedSearch,
                            limit: 5000,
                            page: 1
                        }
                    });
                    const stokData = response.data.data || [];
                    setStoklar(stokData);
                } catch (error) {
                    console.error('Stok verisi alınamadı:', error);
                    setStoklar([]);
                } finally{
                    setLoading(false);
                }
            } catch (error) {
                console.error('Malzeme kaydedilemedi:', error);
                console.error('Backend hatası:', error.response?.data);
                alert(`Malzeme kaydedilirken bir hata oluştu:\n${error.response?.data?.message || error.message}`);
            }
        }
    }["MalzemeListesiPage.useCallback[handleSubmit]"], [
        editingMalzeme,
        stoklar,
        handleCloseDialog,
        debouncedSearch
    ]);
    // Delete handler - useCallback ile optimize edilmiş
    const handleDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeListesiPage.useCallback[handleDelete]": async (id)=>{
            try {
                // Önce silinebilir mi kontrol et
                const canDeleteResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/product/${id}/can-delete`);
                const canDelete = canDeleteResponse.data;
                if (!canDelete.canDelete) {
                    alert(`❌ Bu malzeme silinemez!\n\n` + `Malzeme ${canDelete.toplamHareketSayisi} işlemde kullanılmıştır:\n` + `• Hareket: ${canDelete.hareketSayisi}\n` + `• Fatura: ${canDelete.faturaKalemSayisi}\n` + `• Sipariş: ${canDelete.siparisKalemSayisi}\n` + `• Teklif: ${canDelete.teklifKalemSayisi}\n` + `• Sayım: ${canDelete.sayimKalemSayisi}\n` + `• Depo Hareketi: ${canDelete.stockMoveSayisi}\n\n` + `Hareket gören malzemeler silinemez.`);
                    return;
                }
                if (confirm('Bu malzemeyi silmek istediğinizden emin misiniz?')) {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/product/${id}`);
                    // Listeyi yenile
                    try {
                        setLoading(true);
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/product', {
                            params: {
                                search: debouncedSearch,
                                limit: 5000,
                                page: 1
                            }
                        });
                        const stokData = response.data.data || [];
                        setStoklar(stokData);
                    } catch (error) {
                        console.error('Stok verisi alınamadı:', error);
                        setStoklar([]);
                    } finally{
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.error('Malzeme silinemedi:', error);
                if (error.response?.status === 400) {
                    alert(`❌ ${error.response.data.message || 'Malzeme silinemez'}`);
                } else {
                    alert('Malzeme silinirken bir hata oluştu');
                }
            }
        }
    }["MalzemeListesiPage.useCallback[handleDelete]"], [
        debouncedSearch
    ]);
    const handleOpenEslestirme = async (malzeme)=>{
        setSelectedMalzeme(malzeme);
        setOpenEslestirmeDialog(true);
        // Mevcut eşdeğer ürünleri yükle
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/product/${malzeme.id}/esdegerler`);
            if (response.data.esdegerler && response.data.esdegerler.length > 0) {
                setSelectedEquivalents(response.data.esdegerler);
            }
        } catch (error) {
            console.error('Eşdeğer ürünler yüklenemedi:', error);
        }
    };
    const handleCloseEslestirme = ()=>{
        setOpenEslestirmeDialog(false);
        setSelectedMalzeme(null);
        setSelectedEquivalents([]);
    };
    const handleSaveEslestirme = async ()=>{
        if (!selectedMalzeme) {
            return;
        }
        // Eğer tüm eşdeğerler silinmişse, eşleştirmeyi kaldır
        if (selectedEquivalents.length === 0) {
            const confirm1 = window.confirm(`${selectedMalzeme.stokKodu} ürününün tüm eşleştirmelerini kaldırmak istediğinizden emin misiniz?`);
            if (!confirm1) return;
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/product/${selectedMalzeme.id}/match`);
                alert(`✅ ${selectedMalzeme.stokKodu} ürününün eşleştirmesi kaldırıldı.`);
                handleCloseEslestirme();
                // Listeyi yenile
                try {
                    setLoading(true);
                    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/product', {
                        params: {
                            search: debouncedSearch,
                            limit: 5000,
                            page: 1
                        }
                    });
                    const stokData = response.data.data || [];
                    setStoklar(stokData);
                } catch (error) {
                    console.error('Stok verisi alınamadı:', error);
                    setStoklar([]);
                } finally{
                    setLoading(false);
                }
            } catch (error) {
                console.error('Eşleştirme kaldırılamadı:', error);
                alert(`❌ Hata: ${error.response?.data?.message || 'Eşleştirme kaldırılamadı.'}`);
            }
            return;
        }
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/product/match', {
                anaUrunId: selectedMalzeme.id,
                esUrunIds: selectedEquivalents.map((eq)=>eq.id)
            });
            const { toplamUrun, urunler } = response.data;
            alert(`✅ Eşleştirme başarılı!\n\n` + `${selectedMalzeme.stokKodu} için ${selectedEquivalents.length} ürün eşleştirildi.\n` + `Grup toplam ${toplamUrun} ürün içeriyor:\n\n` + urunler.map((u)=>`• ${u.marka} - ${u.stokKodu}`).join('\n'));
            handleCloseEslestirme();
            // Listeyi yenile
            try {
                setLoading(true);
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/product', {
                    params: {
                        search: debouncedSearch,
                        limit: 5000,
                        page: 1
                    }
                });
                const stokData = response.data.data || [];
                setStoklar(stokData);
            } catch (error) {
                console.error('Stok verisi alınamadı:', error);
                setStoklar([]);
            } finally{
                setLoading(false);
            }
        } catch (error) {
            console.error('Eşleştirme kaydedilemedi:', error);
            const errorMsg = error.response?.data?.message || 'Eşleştirme kaydedilemedi. Lütfen tekrar deneyin.';
            alert(`❌ Hata: ${errorMsg}`);
        }
    };
    const handleRemoveEslestirme = async (stok)=>{
        const confirm1 = window.confirm(`${stok.stokKodu} ürününün tüm eşleştirmelerini kaldırmak istediğinizden emin misiniz?\n\n` + `Bu işlem geri alınamaz!`);
        if (!confirm1) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/product/${stok.id}/match`);
            alert(`✅ ${stok.stokKodu} ürününün eşleştirmesi başarıyla kaldırıldı.`);
            // Listeyi yenile
            try {
                setLoading(true);
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/product', {
                    params: {
                        search: debouncedSearch,
                        limit: 5000,
                        page: 1
                    }
                });
                const stokData = response.data.data || [];
                setStoklar(stokData);
            } catch (error) {
                console.error('Stok verisi alınamadı:', error);
                setStoklar([]);
            } finally{
                setLoading(false);
            }
        } catch (error) {
            console.error('Eşleştirme kaldırılamadı:', error);
            alert(`❌ Hata: ${error.response?.data?.message || 'Eşleştirme kaldırılamadı.'}`);
        }
    };
    const filteredStoklar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MalzemeListesiPage.useMemo[filteredStoklar]": ()=>{
            if (!Array.isArray(stoklar)) return [];
            return stoklar.filter({
                "MalzemeListesiPage.useMemo[filteredStoklar]": (stok)=>{
                    const kategoriMatch = selectedKategori ? stok.anaKategori === selectedKategori : true;
                    const altKategoriMatch = selectedAltKategori ? stok.altKategori === selectedAltKategori : true;
                    const markaMatch = selectedMarka ? stok.marka === selectedMarka : true;
                    const miktar = stok.miktar ?? 0;
                    const stokMatch = stokDurumu === 'inStock' ? miktar > 0 : stokDurumu === 'outOfStock' ? miktar <= 0 : true;
                    return kategoriMatch && altKategoriMatch && markaMatch && stokMatch;
                }
            }["MalzemeListesiPage.useMemo[filteredStoklar]"]);
        }
    }["MalzemeListesiPage.useMemo[filteredStoklar]"], [
        stoklar,
        selectedKategori,
        selectedAltKategori,
        selectedMarka,
        stokDurumu
    ]);
    const { data: hareketData, isLoading: hareketlerLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStokHareketler"])(hareketMalzeme?.id, hareketTipiFilter || undefined, 100, !!hareketMalzeme?.id);
    // useStokHareketler hook already returns the array in data.
    // The property access here was redundant and causing issues.
    const hareketler = Array.isArray(hareketData) ? hareketData : [];
    const formatHareketDate = (value)=>new Date(value).toLocaleString('tr-TR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    const formatMoney = (value)=>new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(value || 0);
    const getHareketLabel = (hareket)=>{
        const tip = hareket?.hareketTipi || '';
        const faturaTipi = hareket?.faturaKalemi?.fatura?.faturaTipi;
        const durum = hareket?.faturaKalemi?.fatura?.durum;
        if (tip === 'SALE' && durum === 'CANCELLED') return 'Satış faturası iptal';
        if (tip === 'ENTRY' && faturaTipi === 'PURCHASE' && durum === 'CANCELLED') return 'Satınalma faturası iptal';
        if (tip === 'RETURN' && faturaTipi === 'SALES_RETURN' && durum === 'CANCELLED') return 'Satış iadesi iptal';
        if (tip === 'RETURN' && faturaTipi === 'PURCHASE_RETURN' && durum === 'CANCELLED') return 'Alış iadesi iptal';
        const labels = {
            ENTRY: faturaTipi === 'PURCHASE' ? 'Satınalma faturası' : 'Giriş',
            EXIT: 'Çıkış',
            SALE: 'Satış faturası',
            RETURN: faturaTipi === 'PURCHASE_RETURN' ? 'Alış iadesi' : faturaTipi === 'SALES_RETURN' ? 'Satış iadesi' : 'İade',
            CANCELLATION_ENTRY: 'İptal',
            CANCELLATION_EXIT: 'İptal',
            COUNT: 'Sayım',
            COUNT_SURPLUS: 'Sayım fazlası',
            COUNT_SHORTAGE: 'Sayım eksiği'
        };
        return labels[tip] || tip;
    };
    const getFaturaDurumLabel = (hareket)=>{
        const durum = hareket?.faturaKalemi?.fatura?.durum;
        if (!durum) {
            if (hareket?.hareketTipi === 'CANCELLATION_ENTRY' || hareket?.hareketTipi === 'CANCELLATION_EXIT') return 'İptal';
            return '-';
        }
        const labels = {
            APPROVED: 'Onaylandı',
            OPEN: 'Beklemede',
            CANCELLED: 'İptal',
            PARTIALLY_PAID: 'Kısmen Ödendi',
            CLOSED: 'Kapalı',
            DRAFT: 'Taslak'
        };
        return labels[durum] || durum;
    };
    const getFaturaDurumColor = (hareket)=>{
        const durum = hareket?.faturaKalemi?.fatura?.durum;
        if (!durum) {
            if (hareket?.hareketTipi === 'CANCELLATION_ENTRY' || hareket?.hareketTipi === 'CANCELLATION_EXIT') return 'error';
            return 'default';
        }
        if (durum === 'CANCELLED') return 'error';
        if (durum === 'APPROVED') return 'success';
        if (durum === 'OPEN') return 'warning';
        return 'default';
    };
    // Eşdeğer ürünler dialog handler
    const handleOpenEsdegerDialog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeListesiPage.useCallback[handleOpenEsdegerDialog]": async (malzeme)=>{
            setEsdegerMalzeme(malzeme);
            setEsdegerDialogOpen(true);
            setEsdegerLoading(true);
            setEsdegerUrunler([]);
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/product/${malzeme.id}/esdegerler`);
                if (response.data?.esdegerler && Array.isArray(response.data.esdegerler)) {
                    setEsdegerUrunler(response.data.esdegerler);
                } else {
                    setEsdegerUrunler([]);
                }
            } catch (error) {
                console.error('Eşdeğer ürünler alınamadı:', error);
                if (error.response?.status !== 404) {
                    alert(`❌ Hata: ${error.response?.data?.message || 'Eşdeğer ürünler alınamadı.'}`);
                }
                setEsdegerUrunler([]);
            } finally{
                setEsdegerLoading(false);
            }
        }
    }["MalzemeListesiPage.useCallback[handleOpenEsdegerDialog]"], []);
    const handleCloseEsdegerDialog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MalzemeListesiPage.useCallback[handleCloseEsdegerDialog]": ()=>{
            setEsdegerDialogOpen(false);
            setEsdegerMalzeme(null);
            setEsdegerUrunler([]);
        }
    }["MalzemeListesiPage.useCallback[handleCloseEsdegerDialog]"], []);
    const getHareketColor = (tip)=>{
        const colors = {
            ENTRY: 'success',
            EXIT: 'error',
            SALE: 'primary',
            RETURN: 'warning',
            CANCELLATION_ENTRY: 'error',
            CANCELLATION_EXIT: 'error',
            COUNT: 'default',
            COUNT_SURPLUS: 'success',
            COUNT_SHORTAGE: 'error'
        };
        return colors[tip] || 'default';
    };
    const handleOpenHareketDialog = (malzeme)=>{
        setHareketMalzeme(malzeme);
        setHareketTipiFilter('');
        setHareketDialogOpen(true);
    };
    const handleCloseHareketDialog = ()=>{
        setHareketDialogOpen(false);
        setHareketMalzeme(null);
    };
    const handleExportExcel = ()=>{
        if (filteredStoklar.length === 0) {
            alert('Excel çıktısı için listede stok bulunamadı.');
            return;
        }
        const rows = filteredStoklar.map((stok)=>({
                'Stok Kodu': stok.stokKodu,
                'Stok Adı': stok.stokAdi,
                Marka: stok.marka || '-',
                'Raf Adresi': stok.raf || '-',
                'Ölçü': stok.olcu || '-',
                OEM: stok.oem || '-',
                'Araç Markası': stok.aracMarka || '-',
                'Araç Modeli': stok.aracModel || '-',
                'Motor Hacmi': stok.aracMotorHacmi || '-',
                'Yakıt Tipi': stok.aracYakitTipi || '-',
                Miktar: stok.miktar ?? 0,
                Birim: stok.birim,
                'Son Alış Fiyatı': Number(stok.sonAlisFiyati ?? stok.alisFiyati ?? 0),
                'Satış Fiyatı': Number(stok.satisFiyati ?? 0)
            }));
        const worksheet = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$xlsx$40$0$2e$18$2e$5$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(rows);
        const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$xlsx$40$0$2e$18$2e$5$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_new();
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$xlsx$40$0$2e$18$2e$5$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(workbook, worksheet, 'Malzeme Listesi');
        const timestamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$xlsx$40$0$2e$18$2e$5$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeFile"](workbook, `malzeme-listesi-${timestamp}.xlsx`);
    };
    const altKategoriOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MalzemeListesiPage.useMemo[altKategoriOptions]": ()=>{
            if (!selectedKategori) {
                return [];
            }
            return kategoriler[selectedKategori] || [];
        }
    }["MalzemeListesiPage.useMemo[altKategoriOptions]"], [
        selectedKategori,
        kategoriler
    ]);
    const markaOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MalzemeListesiPage.useMemo[markaOptions]": ()=>{
            const collected = stoklar.map({
                "MalzemeListesiPage.useMemo[markaOptions].collected": (s)=>s.marka
            }["MalzemeListesiPage.useMemo[markaOptions].collected"]).filter(Boolean);
            return Array.from(new Set([
                ...markalar,
                ...collected
            ])).sort();
        }
    }["MalzemeListesiPage.useMemo[markaOptions]"], [
        stoklar,
        markalar
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$MainLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Paper$2f$Paper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paper$3e$__["Paper"], {
                elevation: 0,
                sx: {
                    mb: 3,
                    p: 2.5,
                    border: '1px solid var(--border)',
                    borderRadius: 2,
                    bgcolor: 'var(--card)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                    sx: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                    variant: "h5",
                                    fontWeight: 700,
                                    sx: {
                                        color: 'var(--foreground)',
                                        letterSpacing: '-0.02em'
                                    },
                                    children: "Malzeme Listesi"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 1590,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                    variant: "body2",
                                    sx: {
                                        color: 'var(--muted-foreground)',
                                        mt: 0.5
                                    },
                                    children: "Stok kartlarını görüntüleyin, arayın ve yönetin."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 1593,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 1589,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                            sx: {
                                display: 'flex',
                                gap: 1.5,
                                alignItems: 'center'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                                    variant: "outlined",
                                    startIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$FileDownload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 1600,
                                        columnNumber: 26
                                    }, void 0),
                                    onClick: handleExportExcel,
                                    sx: {
                                        color: 'var(--foreground)',
                                        borderColor: 'var(--border)',
                                        borderRadius: 1.5,
                                        px: 2,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: 'var(--primary)',
                                            color: 'var(--primary)',
                                            bgcolor: 'var(--muted)'
                                        }
                                    },
                                    children: "Excel'e Aktar"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 1598,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                                    variant: "contained",
                                    startIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Add$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 1616,
                                        columnNumber: 26
                                    }, void 0),
                                    onClick: ()=>{
                                        handleOpenDialog();
                                    },
                                    sx: {
                                        bgcolor: 'var(--primary)',
                                        color: 'var(--primary-foreground)',
                                        borderRadius: 1.5,
                                        px: 2.5,
                                        py: 1.25,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                        '&:hover': {
                                            bgcolor: 'var(--primary)',
                                            opacity: 0.92,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                        }
                                    },
                                    children: "Yeni Malzeme Ekle"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 1614,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 1597,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                    lineNumber: 1588,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                lineNumber: 1578,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Paper$2f$Paper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paper$3e$__["Paper"], {
                sx: {
                    mb: 3,
                    p: 2,
                    bgcolor: 'var(--card)',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-sm)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                    container: true,
                    spacing: 2,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                            size: {
                                xs: 12,
                                md: 3
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__["FormControl"], {
                                fullWidth: true,
                                size: "small",
                                className: "form-control-select",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__["InputLabel"], {
                                        children: "Kategori"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 1647,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                        label: "Kategori",
                                        value: selectedKategori,
                                        onChange: (e)=>setSelectedKategori(e.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                value: "",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                                    children: "Hepsi"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 1654,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 1653,
                                                columnNumber: 17
                                            }, this),
                                            Object.keys(kategoriler).map((kategori)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                    value: kategori,
                                                    children: kategori
                                                }, kategori, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 1657,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 1648,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                lineNumber: 1646,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 1645,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                            size: {
                                xs: 12,
                                md: 3
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__["FormControl"], {
                                fullWidth: true,
                                size: "small",
                                disabled: !selectedKategori,
                                className: "form-control-select",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__["InputLabel"], {
                                        children: "Alt Kategori"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 1666,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                        label: "Alt Kategori",
                                        value: selectedAltKategori,
                                        onChange: (e)=>setSelectedAltKategori(e.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                value: "",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                                    children: "Hepsi"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 1673,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 1672,
                                                columnNumber: 17
                                            }, this),
                                            altKategoriOptions.map((altKategori)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                    value: altKategori,
                                                    children: altKategori
                                                }, altKategori, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 1676,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 1667,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                lineNumber: 1665,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 1664,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                            size: {
                                xs: 12,
                                md: 3
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__["FormControl"], {
                                fullWidth: true,
                                size: "small",
                                className: "form-control-select",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__["InputLabel"], {
                                        children: "Marka"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 1685,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                        label: "Marka",
                                        value: selectedMarka,
                                        onChange: (e)=>setSelectedMarka(e.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                value: "",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                                    children: "Hepsi"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 1692,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 1691,
                                                columnNumber: 17
                                            }, this),
                                            markaOptions.map((marka)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                    value: marka,
                                                    children: marka
                                                }, marka, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 1695,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 1686,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                lineNumber: 1684,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 1683,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Grid$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"], {
                            size: {
                                xs: 12,
                                md: 3
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__["FormControl"], {
                                fullWidth: true,
                                size: "small",
                                className: "form-control-select",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__["InputLabel"], {
                                        children: "Stok Durumu"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 1704,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                        label: "Stok Durumu",
                                        value: stokDurumu,
                                        onChange: (e)=>setStokDurumu(e.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                value: "all",
                                                children: "Hepsi"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 1710,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                value: "inStock",
                                                children: "Stokta Olanlar"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 1711,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                value: "outOfStock",
                                                children: "Stoğu Bitenler"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 1712,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 1705,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                lineNumber: 1703,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 1702,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                    lineNumber: 1644,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                lineNumber: 1643,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Paper$2f$Paper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paper$3e$__["Paper"], {
                sx: {
                    width: '100%',
                    bgcolor: 'var(--card)',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-sm)',
                    overflow: 'hidden'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MaterialSearchBar, {
                        search: search,
                        setSearch: setSearch,
                        onSearch: fetchStoklar,
                        onRefresh: fetchStoklar
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                        lineNumber: 1720,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                        sx: {
                            height: 1420,
                            width: '100%'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$x$2d$data$2d$grid$40$8$2e$17$2e$0_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emoti_d792b99621bd2f8e2790952227d3b59b$2f$node_modules$2f40$mui$2f$x$2d$data$2d$grid$2f$esm$2f$DataGrid$2f$DataGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataGrid"], {
                            rows: filteredStoklar,
                            columns: [
                                {
                                    field: 'stokKodu',
                                    headerName: 'Stok Kodu',
                                    flex: 1.5,
                                    minWidth: 150,
                                    renderCell: (params)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                            sx: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                width: '100%',
                                                height: '100%'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                    variant: "body2",
                                                    fontWeight: "600",
                                                    sx: {
                                                        color: 'var(--primary)',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    },
                                                    children: params.value
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 1737,
                                                    columnNumber: 21
                                                }, void 0),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__["Tooltip"], {
                                                    title: "Eşdeğer ürünleri göster",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__["IconButton"], {
                                                        size: "small",
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            handleOpenEsdegerDialog(params.row);
                                                        },
                                                        sx: {
                                                            padding: '4px',
                                                            color: 'var(--primary)',
                                                            '&:hover': {
                                                                bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)'
                                                            }
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CompareArrows$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            fontSize: "small"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 1755,
                                                            columnNumber: 25
                                                        }, void 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 1741,
                                                        columnNumber: 23
                                                    }, void 0)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 1740,
                                                    columnNumber: 21
                                                }, void 0)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                            lineNumber: 1736,
                                            columnNumber: 19
                                        }, void 0)
                                },
                                {
                                    field: 'stokAdi',
                                    headerName: 'Stok Adı',
                                    flex: 2,
                                    minWidth: 200
                                },
                                {
                                    field: 'marka',
                                    headerName: 'Marka',
                                    flex: 1,
                                    minWidth: 100,
                                    valueFormatter: (value)=>value || '-'
                                },
                                {
                                    field: 'raf',
                                    headerName: 'Raf Adresi',
                                    flex: 1,
                                    minWidth: 120,
                                    renderCell: (params)=>params.value ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__["Chip"], {
                                            label: params.value,
                                            size: "small",
                                            variant: "outlined",
                                            sx: {
                                                fontSize: '0.75rem',
                                                borderColor: 'var(--primary)',
                                                color: 'var(--primary)',
                                                bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                            lineNumber: 1781,
                                            columnNumber: 21
                                        }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                            variant: "caption",
                                            sx: {
                                                color: 'var(--muted-foreground)'
                                            },
                                            children: "Raf atanmamış"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                            lineNumber: 1793,
                                            columnNumber: 21
                                        }, void 0)
                                },
                                {
                                    field: 'aracBilgisi',
                                    headerName: 'Araç Bilgileri',
                                    flex: 1.5,
                                    minWidth: 180,
                                    renderCell: (params)=>{
                                        const row = params.row;
                                        if (!row.aracMarka && !row.aracModel && !row.aracMotorHacmi && !row.aracYakitTipi) {
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                variant: "caption",
                                                sx: {
                                                    color: 'var(--muted-foreground)'
                                                },
                                                children: "-"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 1807,
                                                columnNumber: 28
                                            }, void 0);
                                        }
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                            sx: {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                height: '100%'
                                            },
                                            children: [
                                                row.aracMarka && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                    variant: "caption",
                                                    fontWeight: "600",
                                                    sx: {
                                                        color: 'var(--chart-1)',
                                                        lineHeight: 1.2
                                                    },
                                                    children: row.aracMarka
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 1812,
                                                    columnNumber: 25
                                                }, void 0),
                                                row.aracModel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                    variant: "caption",
                                                    sx: {
                                                        color: 'var(--muted-foreground)',
                                                        lineHeight: 1.2
                                                    },
                                                    children: row.aracModel
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 1817,
                                                    columnNumber: 25
                                                }, void 0)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                            lineNumber: 1810,
                                            columnNumber: 21
                                        }, void 0);
                                    }
                                },
                                {
                                    field: 'miktar',
                                    headerName: 'Miktar',
                                    type: 'number',
                                    width: 100,
                                    align: 'center',
                                    headerAlign: 'center',
                                    renderCell: (params)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__["Chip"], {
                                            label: params.value || 0,
                                            size: "small",
                                            sx: {
                                                bgcolor: (params.value || 0) > 0 ? 'color-mix(in srgb, var(--chart-2) 15%, transparent)' : 'color-mix(in srgb, var(--destructive) 15%, transparent)',
                                                color: (params.value || 0) > 0 ? 'var(--chart-2)' : 'var(--destructive)',
                                                fontWeight: 600,
                                                width: '100%',
                                                justifyContent: 'center'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                            lineNumber: 1833,
                                            columnNumber: 19
                                        }, void 0)
                                },
                                {
                                    field: 'birim',
                                    headerName: 'Birim',
                                    width: 80
                                },
                                {
                                    field: 'sonAlisFiyati',
                                    headerName: 'Son Alış Fiyatı',
                                    type: 'number',
                                    width: 140,
                                    align: 'right',
                                    headerAlign: 'right',
                                    valueGetter: (value, row)=>value ?? row.alisFiyati,
                                    valueFormatter: (value)=>{
                                        if (value == null) return '';
                                        return `₺${Number(value).toLocaleString('tr-TR', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}`;
                                    }
                                },
                                {
                                    field: 'satisFiyati',
                                    headerName: 'Satış Fiyatı',
                                    type: 'number',
                                    width: 120,
                                    align: 'right',
                                    headerAlign: 'right',
                                    renderCell: (params)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                            variant: "body2",
                                            fontWeight: "600",
                                            sx: {
                                                color: 'var(--primary)',
                                                width: '100%',
                                                textAlign: 'right'
                                            },
                                            children: [
                                                "₺",
                                                Number(params.value || 0).toLocaleString('tr-TR', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                            lineNumber: 1874,
                                            columnNumber: 19
                                        }, void 0)
                                },
                                {
                                    field: 'actions',
                                    headerName: 'İşlemler',
                                    width: 160,
                                    sortable: false,
                                    filterable: false,
                                    renderCell: (params)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                            sx: {
                                                display: 'flex',
                                                gap: 0.5,
                                                justifyContent: 'center',
                                                width: '100%'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__["Tooltip"], {
                                                    title: "Düzenle",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__["IconButton"], {
                                                        size: "small",
                                                        color: "primary",
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            handleOpenDialog(params.row);
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Edit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            fontSize: "small"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 1896,
                                                            columnNumber: 25
                                                        }, void 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 1888,
                                                        columnNumber: 23
                                                    }, void 0)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 1887,
                                                    columnNumber: 21
                                                }, void 0),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__["Tooltip"], {
                                                    title: "Ambar Toplamları",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__["IconButton"], {
                                                        size: "small",
                                                        color: "info",
                                                        href: `/stok/${params.row.id}/ambar-toplamlari`,
                                                        onClick: (e)=>e.stopPropagation(),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Warehouse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            fontSize: "small"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 1906,
                                                            columnNumber: 25
                                                        }, void 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 1900,
                                                        columnNumber: 23
                                                    }, void 0)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 1899,
                                                    columnNumber: 21
                                                }, void 0),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__["Tooltip"], {
                                                    title: "Hareketler",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__["IconButton"], {
                                                        size: "small",
                                                        color: "secondary",
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            handleOpenHareketDialog(params.row);
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$History$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            fontSize: "small"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 1918,
                                                            columnNumber: 25
                                                        }, void 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 1910,
                                                        columnNumber: 23
                                                    }, void 0)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 1909,
                                                    columnNumber: 21
                                                }, void 0),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__["Tooltip"], {
                                                    title: "Sil",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__["IconButton"], {
                                                        size: "small",
                                                        color: "error",
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            handleDelete(params.row.id);
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Delete$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            fontSize: "small"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 1930,
                                                            columnNumber: 25
                                                        }, void 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 1922,
                                                        columnNumber: 23
                                                    }, void 0)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 1921,
                                                    columnNumber: 21
                                                }, void 0)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                            lineNumber: 1886,
                                            columnNumber: 19
                                        }, void 0)
                                }
                            ],
                            initialState: {
                                pagination: {
                                    paginationModel: {
                                        pageSize: 25,
                                        page: 0
                                    }
                                }
                            },
                            pageSizeOptions: [
                                25,
                                50,
                                100
                            ],
                            disableRowSelectionOnClick: true,
                            loading: loading,
                            localeText: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$x$2d$data$2d$grid$40$8$2e$17$2e$0_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emoti_d792b99621bd2f8e2790952227d3b59b$2f$node_modules$2f40$mui$2f$x$2d$data$2d$grid$2f$esm$2f$locales$2f$trTR$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trTR"].components.MuiDataGrid.defaultProps.localeText,
                            slots: {
                                toolbar: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$x$2d$data$2d$grid$40$8$2e$17$2e$0_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emoti_d792b99621bd2f8e2790952227d3b59b$2f$node_modules$2f40$mui$2f$x$2d$data$2d$grid$2f$esm$2f$components$2f$toolbar$2f$GridToolbar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GridToolbar"]
                            },
                            slotProps: {
                                toolbar: {
                                    showQuickFilter: false
                                }
                            },
                            sx: {
                                border: 'none',
                                '& .MuiDataGrid-cell': {
                                    borderColor: 'var(--border)',
                                    display: 'flex',
                                    alignItems: 'center'
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    bgcolor: 'var(--muted)',
                                    borderBottom: '1px solid var(--border)'
                                },
                                '& .MuiDataGrid-columnHeaderTitle': {
                                    fontWeight: 700,
                                    color: 'var(--foreground)'
                                },
                                '& .MuiDataGrid-row:hover': {
                                    bgcolor: 'var(--muted)'
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    borderTop: '1px solid var(--border)'
                                }
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 1727,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                        lineNumber: 1726,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                lineNumber: 1719,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                    variant: "body2",
                    sx: {
                        color: 'var(--muted-foreground)'
                    },
                    children: [
                        "Toplam ",
                        filteredStoklar.length,
                        " malzeme gösteriliyor"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                    lineNumber: 1981,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                lineNumber: 1980,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Dialog$2f$Dialog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dialog$3e$__["Dialog"], {
                open: hareketDialogOpen,
                onClose: handleCloseHareketDialog,
                fullWidth: true,
                maxWidth: "lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogTitle$2f$DialogTitle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DialogTitle$3e$__["DialogTitle"], {
                        component: "div",
                        children: hareketMalzeme ? `${hareketMalzeme.stokKodu} - ${hareketMalzeme.stokAdi}` : 'Malzeme Hareketleri'
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                        lineNumber: 1992,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogContent$2f$DialogContent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DialogContent$3e$__["DialogContent"], {
                        sx: {
                            mt: 2
                        },
                        children: hareketMalzeme ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                    sx: {
                                        display: 'flex',
                                        gap: 1,
                                        flexWrap: 'wrap',
                                        mb: 2
                                    },
                                    children: [
                                        hareketMalzeme.marka && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__["Chip"], {
                                            label: `Marka: ${hareketMalzeme.marka}`,
                                            size: "small",
                                            color: "primary",
                                            variant: "outlined"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                            lineNumber: 2002,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__["Chip"], {
                                            label: `Stok Miktarı: ${hareketMalzeme.miktar ?? 0} ${hareketMalzeme.birim}`,
                                            size: "small",
                                            color: (hareketMalzeme.miktar ?? 0) > 0 ? 'success' : 'error',
                                            variant: "outlined"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                            lineNumber: 2004,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__["Chip"], {
                                            label: `Raf: ${hareketMalzeme.raf && hareketMalzeme.raf.trim() !== '' ? hareketMalzeme.raf : 'Belirtilmemiş'}`,
                                            size: "small",
                                            variant: "outlined"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                            lineNumber: 2010,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 2000,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__["FormControl"], {
                                    size: "small",
                                    sx: {
                                        width: {
                                            xs: '100%',
                                            sm: 240
                                        },
                                        mb: 2
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__["InputLabel"], {
                                            children: "Hareket Tipi"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                            lineNumber: 2018,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                            label: "Hareket Tipi",
                                            value: hareketTipiFilter,
                                            onChange: (e)=>setHareketTipiFilter(e.target.value),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                    value: "",
                                                    children: "Tümü"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 2024,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                    value: "ENTRY",
                                                    children: "Giriş / Satınalma"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 2025,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                    value: "EXIT",
                                                    children: "Çıkış"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 2026,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                    value: "SALE",
                                                    children: "Satış faturası"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 2027,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                    value: "RETURN",
                                                    children: "İade"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 2028,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                    value: "CANCELLATION_ENTRY",
                                                    children: "İptal (giriş)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 2029,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                    value: "CANCELLATION_EXIT",
                                                    children: "İptal (çıkış)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 2030,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                    value: "COUNT",
                                                    children: "Sayım"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 2031,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                    value: "COUNT_SURPLUS",
                                                    children: "Sayım fazlası"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 2032,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                                    value: "COUNT_SHORTAGE",
                                                    children: "Sayım eksiği"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 2033,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                            lineNumber: 2019,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 2017,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableContainer$2f$TableContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableContainer$3e$__["TableContainer"], {
                                    component: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Paper$2f$Paper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paper$3e$__["Paper"],
                                    sx: {
                                        maxHeight: 420,
                                        '& .MuiTableCell-root': {
                                            color: 'var(--foreground)'
                                        }
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Table$2f$Table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"], {
                                        stickyHeader: true,
                                        size: "small",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableHead$2f$TableHead$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableHead$3e$__["TableHead"], {
                                                sx: {
                                                    bgcolor: 'var(--muted)'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableRow$2f$TableRow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableRow$3e$__["TableRow"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                            sx: {
                                                                color: 'var(--foreground)'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Tarih"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2041,
                                                                columnNumber: 70
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2041,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                            sx: {
                                                                color: 'var(--foreground)'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "İşlem Türü"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2042,
                                                                columnNumber: 70
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2042,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                            sx: {
                                                                color: 'var(--foreground)'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Fatura Durumu"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2043,
                                                                columnNumber: 70
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2043,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                            sx: {
                                                                color: 'var(--foreground)'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Ambar"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2044,
                                                                columnNumber: 70
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2044,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                            sx: {
                                                                color: 'var(--foreground)'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Cari"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2045,
                                                                columnNumber: 70
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2045,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                            align: "right",
                                                            sx: {
                                                                color: 'var(--foreground)'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Miktar"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2046,
                                                                columnNumber: 84
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2046,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                            align: "right",
                                                            sx: {
                                                                color: 'var(--foreground)'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Birim Fiyat"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2047,
                                                                columnNumber: 84
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2047,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                            align: "right",
                                                            sx: {
                                                                color: 'var(--foreground)'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Toplam"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2048,
                                                                columnNumber: 84
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2048,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                            sx: {
                                                                color: 'var(--foreground)'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Açıklama"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2049,
                                                                columnNumber: 70
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2049,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 2040,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 2039,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableBody$2f$TableBody$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableBody$3e$__["TableBody"], {
                                                children: hareketlerLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Loading$2f$TableSkeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    rows: 5,
                                                    columns: 6
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 2054,
                                                    columnNumber: 23
                                                }, this) : hareketler.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableRow$2f$TableRow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableRow$3e$__["TableRow"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                        colSpan: 9,
                                                        align: "center",
                                                        sx: {
                                                            py: 6
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                            variant: "body2",
                                                            sx: {
                                                                color: 'var(--muted-foreground)'
                                                            },
                                                            children: "Bu ürün için hareket kaydı bulunamadı."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2058,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 2057,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 2056,
                                                    columnNumber: 23
                                                }, this) : hareketler.map((hareket)=>{
                                                    const birimFiyat = Number(hareket.birimFiyat ?? hareket.faturaKalemi?.birimFiyat ?? 0);
                                                    const toplamTutar = (hareket.miktar || 0) * birimFiyat;
                                                    const cariBilgi = hareket.faturaKalemi?.fatura?.cari;
                                                    const cariLabel = cariBilgi ? `${cariBilgi.cariKodu || ''} - ${cariBilgi.unvan || ''}`.trim() : '-';
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableRow$2f$TableRow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableRow$3e$__["TableRow"], {
                                                        hover: true,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                                    variant: "caption",
                                                                    sx: {
                                                                        color: 'var(--foreground)'
                                                                    },
                                                                    children: formatHareketDate(hareket.createdAt)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                    lineNumber: 2072,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2071,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__["Chip"], {
                                                                    label: getHareketLabel(hareket),
                                                                    color: getHareketColor(hareket.hareketTipi),
                                                                    size: "small"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                    lineNumber: 2077,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2076,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__["Chip"], {
                                                                    label: getFaturaDurumLabel(hareket),
                                                                    color: getFaturaDurumColor(hareket),
                                                                    size: "small",
                                                                    variant: "outlined"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                    lineNumber: 2084,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2083,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                                    variant: "body2",
                                                                    sx: {
                                                                        color: 'var(--foreground)'
                                                                    },
                                                                    children: hareket.warehouse?.name || '-'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                    lineNumber: 2092,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2091,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                                    variant: "body2",
                                                                    sx: {
                                                                        color: 'var(--foreground)'
                                                                    },
                                                                    children: cariLabel
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                    lineNumber: 2097,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2096,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                                align: "right",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                                    variant: "body2",
                                                                    fontWeight: "600",
                                                                    sx: {
                                                                        color: 'var(--foreground)'
                                                                    },
                                                                    children: (hareket.miktar || 0).toLocaleString('tr-TR')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                    lineNumber: 2102,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2101,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                                align: "right",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                                    variant: "body2",
                                                                    sx: {
                                                                        color: 'var(--foreground)'
                                                                    },
                                                                    children: formatMoney(birimFiyat)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                    lineNumber: 2107,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2106,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                                align: "right",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                                    variant: "body2",
                                                                    fontWeight: "600",
                                                                    sx: {
                                                                        color: 'var(--foreground)'
                                                                    },
                                                                    children: formatMoney(toplamTutar)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                    lineNumber: 2112,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2111,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                                    variant: "body2",
                                                                    sx: {
                                                                        color: 'var(--foreground)'
                                                                    },
                                                                    children: hareket.aciklama || '-'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                    lineNumber: 2117,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2116,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, hareket.id, true, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 2070,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 2052,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 2038,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 2037,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                    variant: "caption",
                                    color: "text.secondary",
                                    sx: {
                                        display: 'block',
                                        mt: 1
                                    },
                                    children: [
                                        "Toplam ",
                                        hareketler.length,
                                        " hareket listeleniyor."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 2129,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "body2",
                            color: "text.secondary",
                            children: "Görüntülemek için bir malzeme seçiniz."
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 2134,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                        lineNumber: 1997,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogActions$2f$DialogActions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DialogActions$3e$__["DialogActions"], {
                        sx: {
                            px: 3,
                            py: 2
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                            onClick: handleCloseHareketDialog,
                            autoFocus: true,
                            children: "Kapat"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 2140,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                        lineNumber: 2139,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                lineNumber: 1986,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MalzemeFormDialog, {
                open: openDialog,
                initialFormData: initialFormData,
                editingMalzeme: editingMalzeme,
                locations: locations,
                kategoriler: kategoriler,
                markalar: markalar,
                aracMarkalar: aracMarkalar,
                aracModeller: aracModeller,
                aracMotorHacimleri: aracMotorHacimleri,
                aracYakitTipleri: aracYakitTipleri,
                birimSetleri: birimSetleri,
                onAracMarkaChange: handleAracMarkaChange,
                onClose: handleCloseDialog,
                onSubmit: handleSubmit
            }, void 0, false, {
                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                lineNumber: 2145,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Dialog$2f$Dialog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dialog$3e$__["Dialog"], {
                open: esdegerDialogOpen,
                onClose: handleCloseEsdegerDialog,
                maxWidth: "md",
                fullWidth: true,
                PaperProps: {
                    sx: {
                        bgcolor: 'var(--card)',
                        backgroundImage: 'none'
                    }
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogTitle$2f$DialogTitle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DialogTitle$3e$__["DialogTitle"], {
                        component: "div",
                        sx: {
                            bgcolor: 'var(--secondary)',
                            color: 'var(--secondary-foreground)',
                            py: 2,
                            borderBottom: '1px solid var(--border)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                            sx: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CompareArrows$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    sx: {
                                        color: 'var(--secondary-foreground)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 2182,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                    variant: "h6",
                                    fontWeight: 700,
                                    children: "Eşdeğer Ürünler"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 2183,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 2181,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                        lineNumber: 2175,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogContent$2f$DialogContent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DialogContent$3e$__["DialogContent"], {
                        sx: {
                            mt: 2,
                            bgcolor: 'var(--background)'
                        },
                        children: [
                            esdegerMalzeme && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                sx: {
                                    mb: 3,
                                    p: 2,
                                    bgcolor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid var(--border)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                        variant: "body2",
                                        sx: {
                                            color: 'var(--muted-foreground)',
                                            mb: 0.5
                                        },
                                        children: "Ürün:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 2191,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                        variant: "h6",
                                        fontWeight: 700,
                                        sx: {
                                            color: 'var(--primary)'
                                        },
                                        children: [
                                            esdegerMalzeme.stokKodu,
                                            " - ",
                                            esdegerMalzeme.stokAdi
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 2194,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                lineNumber: 2190,
                                columnNumber: 13
                            }, this),
                            esdegerLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                sx: {
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    py: 4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CircularProgress$2f$CircularProgress$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircularProgress$3e$__["CircularProgress"], {
                                        size: 24,
                                        sx: {
                                            mr: 2
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 2202,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                        variant: "body2",
                                        sx: {
                                            color: 'var(--muted-foreground)'
                                        },
                                        children: "Yükleniyor..."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 2203,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                lineNumber: 2201,
                                columnNumber: 13
                            }, this) : esdegerUrunler.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                sx: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    py: 4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$icons$2d$material$40$7$2e$3$2e$7_$40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$_1fb279aa6c02e7bb2953f3c97325ca8e$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CompareArrows$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        sx: {
                                            fontSize: 48,
                                            color: 'var(--muted-foreground)',
                                            mb: 2
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 2209,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                        variant: "body1",
                                        sx: {
                                            color: 'var(--foreground)',
                                            fontWeight: 500
                                        },
                                        children: "Bu ürünün eşdeğeri bulunmamaktadır"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 2210,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                        variant: "body2",
                                        sx: {
                                            color: 'var(--muted-foreground)',
                                            mt: 1
                                        },
                                        children: "Eşdeğer ürünleri eklemek için eşleştirme yapabilirsiniz"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                        lineNumber: 2213,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                lineNumber: 2208,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableContainer$2f$TableContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableContainer$3e$__["TableContainer"], {
                                component: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Paper$2f$Paper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paper$3e$__["Paper"],
                                sx: {
                                    bgcolor: 'var(--card)',
                                    boxShadow: 'var(--shadow-sm)'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Table$2f$Table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"], {
                                    size: "small",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableHead$2f$TableHead$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableHead$3e$__["TableHead"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableRow$2f$TableRow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableRow$3e$__["TableRow"], {
                                                sx: {
                                                    bgcolor: 'var(--muted)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                        sx: {
                                                            fontWeight: 700,
                                                            color: 'var(--foreground) !important'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Stok Kodu"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2222,
                                                            columnNumber: 96
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 2222,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                        sx: {
                                                            fontWeight: 700,
                                                            color: 'var(--foreground) !important'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Stok Adı"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2223,
                                                            columnNumber: 96
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 2223,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                        sx: {
                                                            fontWeight: 700,
                                                            color: 'var(--foreground) !important'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Marka"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2224,
                                                            columnNumber: 96
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 2224,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                        align: "center",
                                                        sx: {
                                                            fontWeight: 700,
                                                            color: 'var(--foreground) !important'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Miktar"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2225,
                                                            columnNumber: 111
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 2225,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                        align: "right",
                                                        sx: {
                                                            fontWeight: 700,
                                                            color: 'var(--foreground) !important'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Alış Fiyatı"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2226,
                                                            columnNumber: 110
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 2226,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                        align: "right",
                                                        sx: {
                                                            fontWeight: 700,
                                                            color: 'var(--foreground) !important'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Satış Fiyatı"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2227,
                                                            columnNumber: 110
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                        lineNumber: 2227,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                lineNumber: 2221,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                            lineNumber: 2220,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableBody$2f$TableBody$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableBody$3e$__["TableBody"], {
                                            children: esdegerUrunler.map((urun)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableRow$2f$TableRow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableRow$3e$__["TableRow"], {
                                                    hover: true,
                                                    sx: {
                                                        bgcolor: 'var(--background)',
                                                        '&:hover': {
                                                            bgcolor: 'var(--muted) !important'
                                                        },
                                                        borderBottom: '1px solid var(--border)'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                                variant: "body2",
                                                                fontWeight: 600,
                                                                sx: {
                                                                    color: 'var(--primary)'
                                                                },
                                                                children: urun.stokKodu
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2244,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2243,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                            sx: {
                                                                color: 'var(--foreground)'
                                                            },
                                                            children: urun.stokAdi
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2248,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                            sx: {
                                                                color: 'var(--muted-foreground)'
                                                            },
                                                            children: urun.marka || '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2249,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                            align: "center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__["Chip"], {
                                                                label: urun.miktar ?? 0,
                                                                size: "small",
                                                                sx: {
                                                                    bgcolor: urun.miktar > 0 ? 'color-mix(in srgb, var(--chart-2) 15%, transparent)' : 'color-mix(in srgb, var(--destructive) 15%, transparent)',
                                                                    color: urun.miktar > 0 ? 'var(--chart-2)' : 'var(--destructive)',
                                                                    borderColor: urun.miktar > 0 ? 'var(--chart-2)' : 'var(--destructive)'
                                                                },
                                                                variant: "outlined"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2251,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2250,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                            align: "right",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                                variant: "body2",
                                                                sx: {
                                                                    color: 'var(--foreground)'
                                                                },
                                                                children: [
                                                                    "₺",
                                                                    Number(urun.alisFiyati ?? 0).toLocaleString('tr-TR', {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2
                                                                    })
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2265,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2264,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$TableCell$2f$TableCell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TableCell$3e$__["TableCell"], {
                                                            align: "right",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                                                variant: "body2",
                                                                fontWeight: 600,
                                                                sx: {
                                                                    color: 'var(--primary)'
                                                                },
                                                                children: [
                                                                    "₺",
                                                                    Number(urun.satisFiyati ?? 0).toLocaleString('tr-TR', {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2
                                                                    })
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                                lineNumber: 2273,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                            lineNumber: 2272,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, urun.id, true, {
                                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                                    lineNumber: 2232,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                            lineNumber: 2230,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                    lineNumber: 2219,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                                lineNumber: 2218,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                        lineNumber: 2188,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$DialogActions$2f$DialogActions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DialogActions$3e$__["DialogActions"], {
                        sx: {
                            px: 3,
                            pb: 2,
                            bgcolor: 'var(--card)',
                            borderTop: '1px solid var(--border)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$emotion$2f$react$2f$jsx$2d$dev$2d$runtime$2f$dist$2f$emotion$2d$react$2d$jsx$2d$dev$2d$runtime$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$7$2e$3$2e$7_$40$emotion$2b$react$40$11$2e$14$2e$0_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0_$5f40$emotion$2b$s_4e73157eb597994b66e5584b450a6441$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                            onClick: handleCloseEsdegerDialog,
                            variant: "outlined",
                            autoFocus: true,
                            sx: {
                                borderColor: 'var(--border)',
                                color: 'var(--foreground)',
                                '&:hover': {
                                    borderColor: 'var(--primary)',
                                    bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)'
                                }
                            },
                            children: "Kapat"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                            lineNumber: 2288,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                        lineNumber: 2287,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
                lineNumber: 2163,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(main)/stock/material-list/page.tsx",
        lineNumber: 1577,
        columnNumber: 5
    }, this);
}
_s1(MalzemeListesiPage, "EkVSju6t0helkm+I0pdQTkn6xJ0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$tabStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTabStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useDebounce$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebounce"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStokHareketler"]
    ];
});
_c2 = MalzemeListesiPage;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "MaterialSearchBar");
__turbopack_context__.k.register(_c1, "MalzemeFormDialog");
__turbopack_context__.k.register(_c2, "MalzemeListesiPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_69de2614._.js.map