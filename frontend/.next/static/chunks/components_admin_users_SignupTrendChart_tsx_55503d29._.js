(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/components/admin/users/SignupTrendChart.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SignupTrendChart)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function SignupTrendChart({ data }) {
    const max = Math.max(1, ...data.map((d)=>d.value));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/50 backdrop-blur p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3",
                children: "Monthly Signups"
            }, void 0, false, {
                fileName: "[project]/components/admin/users/SignupTrendChart.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-end gap-2 h-40",
                children: data.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-purple-500 dark:from-indigo-500 dark:to-purple-400",
                                style: {
                                    height: `${d.value / max * 100}%`
                                },
                                title: `${d.label}: ${d.value}`
                            }, void 0, false, {
                                fileName: "[project]/components/admin/users/SignupTrendChart.tsx",
                                lineNumber: 13,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 text-[10px] text-center text-gray-500 dark:text-slate-400",
                                children: d.label
                            }, void 0, false, {
                                fileName: "[project]/components/admin/users/SignupTrendChart.tsx",
                                lineNumber: 18,
                                columnNumber: 13
                            }, this)
                        ]
                    }, d.label, true, {
                        fileName: "[project]/components/admin/users/SignupTrendChart.tsx",
                        lineNumber: 12,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/admin/users/SignupTrendChart.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/admin/users/SignupTrendChart.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_c = SignupTrendChart;
var _c;
__turbopack_context__.k.register(_c, "SignupTrendChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/admin/users/SignupTrendChart.tsx [app-client] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/components/admin/users/SignupTrendChart.tsx [app-client] (ecmascript)"));
}}),
}]);

//# sourceMappingURL=components_admin_users_SignupTrendChart_tsx_55503d29._.js.map