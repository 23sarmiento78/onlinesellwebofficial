import '@astrojs/internal-helpers/path';
import { N as NOOP_MIDDLEWARE_HEADER, l as decodeKey } from './chunks/astro/server_CHFiF9VD.mjs';
import 'clsx';
import 'es-module-lexer';

var dist = {};

var hasRequiredDist;

function requireDist () {
	if (hasRequiredDist) return dist;
	hasRequiredDist = 1;
	Object.defineProperty(dist, "__esModule", { value: true });
	dist.parse = parse;
	dist.serialize = serialize;
	/**
	 * RegExp to match cookie-name in RFC 6265 sec 4.1.1
	 * This refers out to the obsoleted definition of token in RFC 2616 sec 2.2
	 * which has been replaced by the token definition in RFC 7230 appendix B.
	 *
	 * cookie-name       = token
	 * token             = 1*tchar
	 * tchar             = "!" / "#" / "$" / "%" / "&" / "'" /
	 *                     "*" / "+" / "-" / "." / "^" / "_" /
	 *                     "`" / "|" / "~" / DIGIT / ALPHA
	 *
	 * Note: Allowing more characters - https://github.com/jshttp/cookie/issues/191
	 * Allow same range as cookie value, except `=`, which delimits end of name.
	 */
	const cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
	/**
	 * RegExp to match cookie-value in RFC 6265 sec 4.1.1
	 *
	 * cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
	 * cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
	 *                     ; US-ASCII characters excluding CTLs,
	 *                     ; whitespace DQUOTE, comma, semicolon,
	 *                     ; and backslash
	 *
	 * Allowing more characters: https://github.com/jshttp/cookie/issues/191
	 * Comma, backslash, and DQUOTE are not part of the parsing algorithm.
	 */
	const cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
	/**
	 * RegExp to match domain-value in RFC 6265 sec 4.1.1
	 *
	 * domain-value      = <subdomain>
	 *                     ; defined in [RFC1034], Section 3.5, as
	 *                     ; enhanced by [RFC1123], Section 2.1
	 * <subdomain>       = <label> | <subdomain> "." <label>
	 * <label>           = <let-dig> [ [ <ldh-str> ] <let-dig> ]
	 *                     Labels must be 63 characters or less.
	 *                     'let-dig' not 'letter' in the first char, per RFC1123
	 * <ldh-str>         = <let-dig-hyp> | <let-dig-hyp> <ldh-str>
	 * <let-dig-hyp>     = <let-dig> | "-"
	 * <let-dig>         = <letter> | <digit>
	 * <letter>          = any one of the 52 alphabetic characters A through Z in
	 *                     upper case and a through z in lower case
	 * <digit>           = any one of the ten digits 0 through 9
	 *
	 * Keep support for leading dot: https://github.com/jshttp/cookie/issues/173
	 *
	 * > (Note that a leading %x2E ("."), if present, is ignored even though that
	 * character is not permitted, but a trailing %x2E ("."), if present, will
	 * cause the user agent to ignore the attribute.)
	 */
	const domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
	/**
	 * RegExp to match path-value in RFC 6265 sec 4.1.1
	 *
	 * path-value        = <any CHAR except CTLs or ";">
	 * CHAR              = %x01-7F
	 *                     ; defined in RFC 5234 appendix B.1
	 */
	const pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
	const __toString = Object.prototype.toString;
	const NullObject = /* @__PURE__ */ (() => {
	    const C = function () { };
	    C.prototype = Object.create(null);
	    return C;
	})();
	/**
	 * Parse a cookie header.
	 *
	 * Parse the given cookie header string into an object
	 * The object has the various cookies as keys(names) => values
	 */
	function parse(str, options) {
	    const obj = new NullObject();
	    const len = str.length;
	    // RFC 6265 sec 4.1.1, RFC 2616 2.2 defines a cookie name consists of one char minimum, plus '='.
	    if (len < 2)
	        return obj;
	    const dec = options?.decode || decode;
	    let index = 0;
	    do {
	        const eqIdx = str.indexOf("=", index);
	        if (eqIdx === -1)
	            break; // No more cookie pairs.
	        const colonIdx = str.indexOf(";", index);
	        const endIdx = colonIdx === -1 ? len : colonIdx;
	        if (eqIdx > endIdx) {
	            // backtrack on prior semicolon
	            index = str.lastIndexOf(";", eqIdx - 1) + 1;
	            continue;
	        }
	        const keyStartIdx = startIndex(str, index, eqIdx);
	        const keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
	        const key = str.slice(keyStartIdx, keyEndIdx);
	        // only assign once
	        if (obj[key] === undefined) {
	            let valStartIdx = startIndex(str, eqIdx + 1, endIdx);
	            let valEndIdx = endIndex(str, endIdx, valStartIdx);
	            const value = dec(str.slice(valStartIdx, valEndIdx));
	            obj[key] = value;
	        }
	        index = endIdx + 1;
	    } while (index < len);
	    return obj;
	}
	function startIndex(str, index, max) {
	    do {
	        const code = str.charCodeAt(index);
	        if (code !== 0x20 /*   */ && code !== 0x09 /* \t */)
	            return index;
	    } while (++index < max);
	    return max;
	}
	function endIndex(str, index, min) {
	    while (index > min) {
	        const code = str.charCodeAt(--index);
	        if (code !== 0x20 /*   */ && code !== 0x09 /* \t */)
	            return index + 1;
	    }
	    return min;
	}
	/**
	 * Serialize data into a cookie header.
	 *
	 * Serialize a name value pair into a cookie string suitable for
	 * http headers. An optional options object specifies cookie parameters.
	 *
	 * serialize('foo', 'bar', { httpOnly: true })
	 *   => "foo=bar; httpOnly"
	 */
	function serialize(name, val, options) {
	    const enc = options?.encode || encodeURIComponent;
	    if (!cookieNameRegExp.test(name)) {
	        throw new TypeError(`argument name is invalid: ${name}`);
	    }
	    const value = enc(val);
	    if (!cookieValueRegExp.test(value)) {
	        throw new TypeError(`argument val is invalid: ${val}`);
	    }
	    let str = name + "=" + value;
	    if (!options)
	        return str;
	    if (options.maxAge !== undefined) {
	        if (!Number.isInteger(options.maxAge)) {
	            throw new TypeError(`option maxAge is invalid: ${options.maxAge}`);
	        }
	        str += "; Max-Age=" + options.maxAge;
	    }
	    if (options.domain) {
	        if (!domainValueRegExp.test(options.domain)) {
	            throw new TypeError(`option domain is invalid: ${options.domain}`);
	        }
	        str += "; Domain=" + options.domain;
	    }
	    if (options.path) {
	        if (!pathValueRegExp.test(options.path)) {
	            throw new TypeError(`option path is invalid: ${options.path}`);
	        }
	        str += "; Path=" + options.path;
	    }
	    if (options.expires) {
	        if (!isDate(options.expires) ||
	            !Number.isFinite(options.expires.valueOf())) {
	            throw new TypeError(`option expires is invalid: ${options.expires}`);
	        }
	        str += "; Expires=" + options.expires.toUTCString();
	    }
	    if (options.httpOnly) {
	        str += "; HttpOnly";
	    }
	    if (options.secure) {
	        str += "; Secure";
	    }
	    if (options.partitioned) {
	        str += "; Partitioned";
	    }
	    if (options.priority) {
	        const priority = typeof options.priority === "string"
	            ? options.priority.toLowerCase()
	            : undefined;
	        switch (priority) {
	            case "low":
	                str += "; Priority=Low";
	                break;
	            case "medium":
	                str += "; Priority=Medium";
	                break;
	            case "high":
	                str += "; Priority=High";
	                break;
	            default:
	                throw new TypeError(`option priority is invalid: ${options.priority}`);
	        }
	    }
	    if (options.sameSite) {
	        const sameSite = typeof options.sameSite === "string"
	            ? options.sameSite.toLowerCase()
	            : options.sameSite;
	        switch (sameSite) {
	            case true:
	            case "strict":
	                str += "; SameSite=Strict";
	                break;
	            case "lax":
	                str += "; SameSite=Lax";
	                break;
	            case "none":
	                str += "; SameSite=None";
	                break;
	            default:
	                throw new TypeError(`option sameSite is invalid: ${options.sameSite}`);
	        }
	    }
	    return str;
	}
	/**
	 * URL-decode string value. Optimized to skip native call when no %.
	 */
	function decode(str) {
	    if (str.indexOf("%") === -1)
	        return str;
	    try {
	        return decodeURIComponent(str);
	    }
	    catch (e) {
	        return str;
	    }
	}
	/**
	 * Determine if value is a Date.
	 */
	function isDate(val) {
	    return __toString.call(val) === "[object Date]";
	}
	
	return dist;
}

requireDist();

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/flarr/Desktop/proyectos/proyect/","cacheDir":"file:///C:/Users/flarr/Desktop/proyectos/proyect/node_modules/.astro/","outDir":"file:///C:/Users/flarr/Desktop/proyectos/proyect/dist/","srcDir":"file:///C:/Users/flarr/Desktop/proyectos/proyect/src/","publicDir":"file:///C:/Users/flarr/Desktop/proyectos/proyect/public/","buildClientDir":"file:///C:/Users/flarr/Desktop/proyectos/proyect/dist/","buildServerDir":"file:///C:/Users/flarr/Desktop/proyectos/proyect/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"always"}}},{"file":"contacto/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contacto","isIndex":false,"type":"page","pattern":"^\\/contacto\\/$","segments":[[{"content":"contacto","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contacto.astro","pathname":"/contacto","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"always"}}},{"file":"desarrollo-web-villa-carlos-paz/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/desarrollo-web-villa-carlos-paz","isIndex":false,"type":"page","pattern":"^\\/desarrollo-web-villa-carlos-paz\\/$","segments":[[{"content":"desarrollo-web-villa-carlos-paz","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/desarrollo-web-villa-carlos-paz.astro","pathname":"/desarrollo-web-villa-carlos-paz","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"always"}}},{"file":"dise%C3%B1o-web-villa-carlos-paz/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/diseño-web-villa-carlos-paz","isIndex":false,"type":"page","pattern":"^\\/diseño-web-villa-carlos-paz\\/$","segments":[[{"content":"diseño-web-villa-carlos-paz","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/diseño-web-villa-carlos-paz.astro","pathname":"/diseño-web-villa-carlos-paz","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"always"}}},{"file":"foro/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/foro","isIndex":false,"type":"page","pattern":"^\\/foro\\/$","segments":[[{"content":"foro","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/foro.astro","pathname":"/foro","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"always"}}},{"file":"legal/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/legal","isIndex":false,"type":"page","pattern":"^\\/legal\\/$","segments":[[{"content":"legal","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/legal.astro","pathname":"/legal","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"always"}}},{"file":"marketing-digital-villa-carlos-paz/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/marketing-digital-villa-carlos-paz","isIndex":false,"type":"page","pattern":"^\\/marketing-digital-villa-carlos-paz\\/$","segments":[[{"content":"marketing-digital-villa-carlos-paz","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/marketing-digital-villa-carlos-paz.astro","pathname":"/marketing-digital-villa-carlos-paz","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"always"}}},{"file":"mi-experiencia/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/mi-experiencia","isIndex":false,"type":"page","pattern":"^\\/mi-experiencia\\/$","segments":[[{"content":"mi-experiencia","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/mi-experiencia.astro","pathname":"/mi-experiencia","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"always"}}},{"file":"planes/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/planes","isIndex":false,"type":"page","pattern":"^\\/planes\\/$","segments":[[{"content":"planes","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/planes.astro","pathname":"/planes","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"always"}}},{"file":"politicas-privacidad/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/politicas-privacidad","isIndex":false,"type":"page","pattern":"^\\/politicas-privacidad\\/$","segments":[[{"content":"politicas-privacidad","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/politicas-privacidad.astro","pathname":"/politicas-privacidad","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"always"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"always"}}}],"site":"https://service.hgaruna.org/","base":"/","trailingSlash":"always","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["C:/Users/flarr/Desktop/proyectos/proyect/src/pages/foro/articulos/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/foro/articulos/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["C:/Users/flarr/Desktop/proyectos/proyect/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/flarr/Desktop/proyectos/proyect/src/pages/contacto.astro",{"propagation":"none","containsHead":true}],["C:/Users/flarr/Desktop/proyectos/proyect/src/pages/desarrollo-web-villa-carlos-paz.astro",{"propagation":"none","containsHead":true}],["C:/Users/flarr/Desktop/proyectos/proyect/src/pages/diseño-web-villa-carlos-paz.astro",{"propagation":"none","containsHead":true}],["C:/Users/flarr/Desktop/proyectos/proyect/src/pages/foro.astro",{"propagation":"none","containsHead":true}],["C:/Users/flarr/Desktop/proyectos/proyect/src/pages/legal.astro",{"propagation":"none","containsHead":true}],["C:/Users/flarr/Desktop/proyectos/proyect/src/pages/marketing-digital-villa-carlos-paz.astro",{"propagation":"none","containsHead":true}],["C:/Users/flarr/Desktop/proyectos/proyect/src/pages/mi-experiencia.astro",{"propagation":"none","containsHead":true}],["C:/Users/flarr/Desktop/proyectos/proyect/src/pages/planes.astro",{"propagation":"none","containsHead":true}],["C:/Users/flarr/Desktop/proyectos/proyect/src/pages/politicas-privacidad.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/contacto@_@astro":"pages/contacto.astro.mjs","\u0000@astro-page:src/pages/desarrollo-web-villa-carlos-paz@_@astro":"pages/desarrollo-web-villa-carlos-paz.astro.mjs","\u0000@astro-page:src/pages/diseño-web-villa-carlos-paz@_@astro":"pages/diseño-web-villa-carlos-paz.astro.mjs","\u0000@astro-page:src/pages/foro/articulos/[...slug]@_@astro":"pages/foro/articulos/_---slug_.astro.mjs","\u0000@astro-page:src/pages/foro@_@astro":"pages/foro.astro.mjs","\u0000@astro-page:src/pages/legal@_@astro":"pages/legal.astro.mjs","\u0000@astro-page:src/pages/marketing-digital-villa-carlos-paz@_@astro":"pages/marketing-digital-villa-carlos-paz.astro.mjs","\u0000@astro-page:src/pages/mi-experiencia@_@astro":"pages/mi-experiencia.astro.mjs","\u0000@astro-page:src/pages/planes@_@astro":"pages/planes.astro.mjs","\u0000@astro-page:src/pages/politicas-privacidad@_@astro":"pages/politicas-privacidad.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_C3esx-Iv.mjs","C:/Users/flarr/Desktop/proyectos/proyect/node_modules/astro/node_modules/unstorage/drivers/fs-lite.mjs":"chunks/fs-lite_COtHaKzy.mjs","C:\\Users\\flarr\\Desktop\\proyectos\\proyect\\.astro\\content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","C:\\Users\\flarr\\Desktop\\proyectos\\proyect\\.astro\\content-modules.mjs":"chunks/content-modules_Dz-S_Wwv.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_D_8U2ebN.mjs","C:/Users/flarr/Desktop/proyectos/proyect/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BQokkN47.mjs","C:/Users/flarr/Desktop/proyectos/proyect/src/layouts/BaseLayout.astro?astro&type=script&index=3&lang.ts":"_astro/BaseLayout.astro_astro_type_script_index_3_lang.DZT1nSej.js","C:/Users/flarr/Desktop/proyectos/proyect/src/pages/foro.astro?astro&type=script&index=0&lang.ts":"_astro/foro.astro_astro_type_script_index_0_lang.Bsidzh-_.js","C:/Users/flarr/Desktop/proyectos/proyect/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts":"_astro/BaseLayout.astro_astro_type_script_index_0_lang.CdFd-6sy.js","C:/Users/flarr/Desktop/proyectos/proyect/src/layouts/BaseLayout.astro?astro&type=script&index=1&lang.ts":"_astro/BaseLayout.astro_astro_type_script_index_1_lang.BSwxCm1l.js","C:/Users/flarr/Desktop/proyectos/proyect/src/layouts/BaseLayout.astro?astro&type=script&index=2&lang.ts":"_astro/BaseLayout.astro_astro_type_script_index_2_lang.CChBqveG.js","C:/Users/flarr/Desktop/proyectos/proyect/src/layouts/BaseLayout.astro?astro&type=script&index=4&lang.ts":"_astro/BaseLayout.astro_astro_type_script_index_4_lang.DqPXzeQy.js","C:/Users/flarr/Desktop/proyectos/proyect/src/layouts/BaseLayout.astro?astro&type=script&index=5&lang.ts":"_astro/BaseLayout.astro_astro_type_script_index_5_lang.DZT1nSej.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/flarr/Desktop/proyectos/proyect/src/pages/foro.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{const t=document.getElementById(\"newPostContent\"),e=document.getElementById(\"publishButton\");t&&e&&t.addEventListener(\"input\",()=>{e.disabled=!t.value.trim()})});"],["C:/Users/flarr/Desktop/proyectos/proyect/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts","console.log(\"🔍 Verificando enlaces del footer...\");document.addEventListener(\"DOMContentLoaded\",()=>{const e=document.querySelectorAll(\".footer-links a\");console.log(`📋 Encontrados ${e.length} enlaces en el footer:`),e.forEach((o,s)=>{const n=o.getAttribute(\"href\"),i=o.textContent.trim();if(console.log(`${s+1}. \"${i}\" -> ${n}`),n&&n.includes(\"politicas-privacidad\")){console.log(\"✅ Enlace de políticas de privacidad encontrado!\");const c=window.getComputedStyle(o);c.display===\"none\"||c.visibility===\"hidden\"?console.log(\"⚠️ El enlace está oculto por CSS\"):console.log(\"✅ El enlace es visible\")}});const t=document.querySelector(\".site-footer\");t?(console.log(\"✅ Footer encontrado\"),window.getComputedStyle(t).display===\"none\"?console.log(\"⚠️ El footer está oculto\"):console.log(\"✅ El footer es visible\")):console.log(\"❌ Footer no encontrado\");const l=document.querySelector(\".footer-links\");l?(console.log(\"✅ Sección de navegación del footer encontrada\"),window.getComputedStyle(l).display===\"none\"?console.log(\"⚠️ La navegación del footer está oculta\"):console.log(\"✅ La navegación del footer es visible\")):console.log(\"❌ Sección de navegación del footer no encontrada\")});function a(){const e=document.querySelector('a[href*=\"politicas-privacidad\"]');e?(console.log(\"🔗 Probando enlace de políticas de privacidad...\"),e.click()):console.log(\"❌ Enlace de políticas de privacidad no encontrado\")}window.testPrivacyLink=a;"],["C:/Users/flarr/Desktop/proyectos/proyect/src/layouts/BaseLayout.astro?astro&type=script&index=1&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{const e=document.querySelector(\".navbar\"),t=document.querySelector(\".main-header\").offsetHeight;window.addEventListener(\"scroll\",()=>{window.scrollY>t/2?e.classList.add(\"scrolled\"):e.classList.remove(\"scrolled\")})});"],["C:/Users/flarr/Desktop/proyectos/proyect/src/layouts/BaseLayout.astro?astro&type=script&index=2&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{const n=document.getElementById(\"theme-toggle\"),t=document.body,c=document.getElementById(\"nav-logo\"),l=document.getElementById(\"footer-logo\"),o=document.querySelector(\".navbar-toggler\"),s=document.querySelector(\".navbar-collapse\"),d=\"/logos-he-imagenes/logo3.png\",e=\"/logos-he-imagenes/logonegro-Photoroom.png\";o&&s&&(o.addEventListener(\"click\",()=>{o.classList.toggle(\"active\"),s.classList.toggle(\"show\")}),document.querySelectorAll(\".nav-link\").forEach(r=>{r.addEventListener(\"click\",()=>{o.classList.remove(\"active\"),s.classList.remove(\"show\")})}),document.addEventListener(\"click\",r=>{!o.contains(r.target)&&!s.contains(r.target)&&(o.classList.remove(\"active\"),s.classList.remove(\"show\"))}));function a(i){i===\"dark-theme\"?(c&&(c.src=d),l&&(l.src=d)):(c&&(c.src=e),l&&(l.src=e))}function m(i){const r=n.querySelector(\"i\");i===\"dark-theme\"?r.className=\"fas fa-sun\":r.className=\"fas fa-moon\"}const u=localStorage.getItem(\"theme\");u?(t.classList.remove(\"dark-theme\",\"light-theme\"),t.classList.add(u),m(u),a(u)):(t.classList.add(\"dark-theme\"),m(\"dark-theme\"),a(\"dark-theme\")),n.addEventListener(\"click\",()=>{t.classList.contains(\"dark-theme\")?(t.classList.remove(\"dark-theme\"),t.classList.add(\"light-theme\"),localStorage.setItem(\"theme\",\"light-theme\"),m(\"light-theme\"),a(\"light-theme\")):(t.classList.remove(\"light-theme\"),t.classList.add(\"dark-theme\"),localStorage.setItem(\"theme\",\"dark-theme\"),m(\"dark-theme\"),a(\"dark-theme\"))});const h=window.location.pathname;document.querySelectorAll(\".nav-link\").forEach(i=>{i.getAttribute(\"href\")===h&&i.classList.add(\"active\")})});document.addEventListener(\"DOMContentLoaded\",()=>{const n=document.getElementById(\"login-button\"),t=document.getElementById(\"admin-button\");function c(){const e=localStorage.getItem(\"auth0_user\"),a=localStorage.getItem(\"auth0_token\");return e&&a}function l(){try{const e=localStorage.getItem(\"auth0_user\");if(e){const a=JSON.parse(e);return a.name||a.email.split(\"@\")[0]}}catch(e){console.error(\"Error al obtener nombre de usuario:\",e)}return\"Usuario\"}function o(){c()?(n.innerHTML=`\n              <i class=\"fas fa-user\"></i>\n              <span>${l()}</span>\n            `,n.href=\"#\",n.onclick=d,t&&(t.style.display=\"inline-flex\")):(n.innerHTML=`\n              <i class=\"fas fa-user\"></i>\n              <span>Iniciar Sesión</span>\n            `,n.href=\"#\",n.onclick=s,t&&(t.style.display=\"none\"))}function s(e){e.preventDefault(),window.auth0Auth?window.auth0Auth.login():window.location.href=\"/admin/\"}function d(e){e.preventDefault(),window.auth0Auth?window.auth0Auth.logout():(localStorage.removeItem(\"auth0_user\"),localStorage.removeItem(\"auth0_token\"),o())}o(),window.addEventListener(\"storage\",e=>{(e.key===\"auth0_user\"||e.key===\"auth0_token\")&&o()})});"],["C:/Users/flarr/Desktop/proyectos/proyect/src/layouts/BaseLayout.astro?astro&type=script&index=4&lang.ts","window.dataLayer=window.dataLayer||[];function a(){dataLayer.push(arguments)}a(\"js\",new Date);a(\"config\",\"G-5ZCGMRFV8Z\");"]],"assets":["/_astro/contacto.FTpPcNlp.css","/admin.html","/advanced-schema.json","/auth0-test.html","/auth_config.json","/gmb-content-calendar.json","/gmb-service-area-setup.md","/google-my-business-info.json","/google07afd1ef2630a04f.html","/linkedin-callback.html","/local-seo-config.json","/local-sitemap.xml","/manifest.json","/optimized-meta-tags.json","/optimized-sitemap.xml","/robots-optimized.txt","/robots.txt","/seo-config.json","/seo-keywords.json","/seo-optimization-report.json","/sitemap.xml","/admin/config.yml","/admin/index.html","/css/styles.css","/data/articles.json","/data/forum-posts.json","/data/linkedin-posts.json","/js/admin-app-new.js","/js/admin-app.js","/js/admin-legacy-backup.txt","/js/auth0-config.js","/js/auth0-debug.js","/js/auth0-test.js","/js/form-setup.js","/js/foro.js","/js/indexnow.js","/js/linkedin-config.js","/js/linkedin-integration.js","/js/nav.js","/js/test-linkedin-auth.js","/js/verify-forms.js","/uploads/pexels-thisisengineering-3861972.jpg","/uploads/programacion.jpeg","/logos-he-imagenes/Captura de pantalla 2025-01-22 221221.png","/logos-he-imagenes/ferresa.png","/logos-he-imagenes/fondo-hero.jpg","/logos-he-imagenes/fondo-negro.png","/logos-he-imagenes/israel.jpg","/logos-he-imagenes/logo-sell.png","/logos-he-imagenes/logo3.png","/logos-he-imagenes/logonegro-Photoroom.png","/logos-he-imagenes/logoosw1.jpg","/logos-he-imagenes/programacion.jpeg","/_astro/BaseLayout.astro_astro_type_script_index_3_lang.DZT1nSej.js","/_astro/BaseLayout.astro_astro_type_script_index_5_lang.DZT1nSej.js","/contacto/index.html","/desarrollo-web-villa-carlos-paz/index.html","/dise%C3%B1o-web-villa-carlos-paz/index.html","/foro/index.html","/legal/index.html","/marketing-digital-villa-carlos-paz/index.html","/mi-experiencia/index.html","/planes/index.html","/politicas-privacidad/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"tnvPqS2VNYuhwr5IPpOvEpNU+oa8Iy6jgEOZTqcuXko=","sessionConfig":{"driver":"fs-lite","options":{"base":"C:\\Users\\flarr\\Desktop\\proyectos\\proyect\\node_modules\\.astro\\sessions"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/fs-lite_COtHaKzy.mjs');

export { manifest };
