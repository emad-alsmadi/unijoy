(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/components/ui/Charts.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "BarChart": (()=>BarChart),
    "DonutChart": (()=>DonutChart)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
'use client';
;
;
function BarChart({ data, height = 140 }) {
    const max = Math.max(1, ...data.map((d)=>d.value));
    const barWidth = 28;
    const gap = 16;
    const width = data.length * (barWidth + gap) + gap;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: width,
        height: height,
        role: "img",
        "aria-label": "bar chart",
        children: data.map((d, i)=>{
            const barHeight = Math.round(d.value / max * (height - 32));
            const x = gap + i * (barWidth + gap);
            const y = height - barHeight - 20;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].rect, {
                        initial: {
                            height: 0,
                            y: height - 20
                        },
                        animate: {
                            height: barHeight,
                            y
                        },
                        transition: {
                            type: 'spring',
                            stiffness: 140,
                            damping: 18,
                            delay: i * 0.05
                        },
                        x: x,
                        width: barWidth,
                        rx: 6,
                        fill: d.color || '#8b5cf6'
                    }, void 0, false, {
                        fileName: "[project]/components/ui/Charts.tsx",
                        lineNumber: 21,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: x + barWidth / 2,
                        y: height - 6,
                        textAnchor: "middle",
                        fontSize: "10",
                        fill: "#6b7280",
                        children: d.label
                    }, void 0, false, {
                        fileName: "[project]/components/ui/Charts.tsx",
                        lineNumber: 30,
                        columnNumber: 13
                    }, this)
                ]
            }, d.label, true, {
                fileName: "[project]/components/ui/Charts.tsx",
                lineNumber: 20,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/components/ui/Charts.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = BarChart;
function DonutChart({ data, size = 160 }) {
    const total = Math.max(1, data.reduce((acc, d)=>acc + d.value, 0));
    const radius = size / 2 - 10;
    const cx = size / 2;
    const cy = size / 2;
    let cumulative = 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        role: "img",
        "aria-label": "donut chart",
        children: [
            data.map((d, i)=>{
                const portion = d.value / total;
                const startAngle = cumulative * 2 * Math.PI;
                cumulative += portion;
                const endAngle = cumulative * 2 * Math.PI;
                const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
                const x1 = cx + radius * Math.cos(startAngle);
                const y1 = cy + radius * Math.sin(startAngle);
                const x2 = cx + radius * Math.cos(endAngle);
                const y2 = cy + radius * Math.sin(endAngle);
                const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].path, {
                    d: pathData,
                    fill: d.color || [
                        '#8b5cf6',
                        '#ec4899',
                        '#22c55e',
                        '#f59e0b'
                    ][i % 4],
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    transition: {
                        delay: i * 0.08
                    }
                }, d.label, false, {
                    fileName: "[project]/components/ui/Charts.tsx",
                    lineNumber: 60,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: cx,
                cy: cy,
                r: radius * 0.6,
                fill: "white"
            }, void 0, false, {
                fileName: "[project]/components/ui/Charts.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                x: cx,
                y: cy + 4,
                textAnchor: "middle",
                fontSize: "12",
                fill: "#6b7280",
                children: total
            }, void 0, false, {
                fileName: "[project]/components/ui/Charts.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/Charts.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_c1 = DonutChart;
var _c, _c1;
__turbopack_context__.k.register(_c, "BarChart");
__turbopack_context__.k.register(_c1, "DonutChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/ui/Charts.tsx [app-client] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/components/ui/Charts.tsx [app-client] (ecmascript)"));
}}),
}]);

//# sourceMappingURL=components_ui_Charts_tsx_94bfb8ad._.js.map