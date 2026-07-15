// Solves issue #7: https://github.com/ae3e/ae3e-plotly-panel/issues/7
// https://github.com/plotly/plotly.js/blob/master/dist/README.md#to-support-mathjax
// ESM version: top-level globals are not allowed in strict ESM, so we use globalThis.
(globalThis as any).PlotlyConfig = { MathJaxConfig: 'local' };
