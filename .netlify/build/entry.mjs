import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_C3esx-Iv.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/contacto.astro.mjs');
const _page1 = () => import('./pages/desarrollo-web-villa-carlos-paz.astro.mjs');
const _page2 = () => import('./pages/diseño-web-villa-carlos-paz.astro.mjs');
const _page3 = () => import('./pages/foro/articulos/_---slug_.astro.mjs');
const _page4 = () => import('./pages/foro.astro.mjs');
const _page5 = () => import('./pages/legal.astro.mjs');
const _page6 = () => import('./pages/marketing-digital-villa-carlos-paz.astro.mjs');
const _page7 = () => import('./pages/mi-experiencia.astro.mjs');
const _page8 = () => import('./pages/planes.astro.mjs');
const _page9 = () => import('./pages/politicas-privacidad.astro.mjs');
const _page10 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["src/pages/contacto.astro", _page0],
    ["src/pages/desarrollo-web-villa-carlos-paz.astro", _page1],
    ["src/pages/diseño-web-villa-carlos-paz.astro", _page2],
    ["src/pages/foro/articulos/[...slug].astro", _page3],
    ["src/pages/foro.astro", _page4],
    ["src/pages/legal.astro", _page5],
    ["src/pages/marketing-digital-villa-carlos-paz.astro", _page6],
    ["src/pages/mi-experiencia.astro", _page7],
    ["src/pages/planes.astro", _page8],
    ["src/pages/politicas-privacidad.astro", _page9],
    ["src/pages/index.astro", _page10]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "dc9591f5-e139-458c-b353-a778236909c2"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
