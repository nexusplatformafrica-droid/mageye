import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { hasInjectionContext, getCurrentInstance, inject, useSSRContext, createApp, defineComponent, ref, mergeProps, provide, onErrorCaptured, onServerPrefetch, unref, createVNode, resolveDynamicComponent, shallowReactive, reactive, effectScope, defineAsyncComponent, getCurrentScope, toRef, computed, h, isReadonly, isRef, isShallow, isReactive, toRaw } from 'vue';
import { p as parseURL, e as encodePath, i as decodePath, k as hasProtocol, l as isScriptProtocol, m as joinURL, w as withQuery, s as sanitizeStatusCode, n as getContext, $ as $fetch, o as createHooks, c as createError$1, q as isEqual, r as stringifyParsedURL, t as stringifyQuery, v as parseQuery, x as defu } from '../nitro/nitro.mjs';
import { u as useHead$1, h as headSymbol, b as baseURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.21.11";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin) {
  if (plugin.hooks) {
    nuxtApp.hooks.addHooks(plugin.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin) {
    const unresolvedPluginsForThisPlugin = plugin.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin).then(async () => {
        if (plugin._name) {
          resolvedPlugins.add(plugin._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin._name)) {
              dependsOn.delete(plugin._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin);
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin) {
  if (typeof plugin === "function") {
    return plugin;
  }
  const _name = plugin._name || plugin.name;
  delete plugin.name;
  return Object.assign(plugin.setup || (() => {
  }), plugin, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
function isScopeWithinInstance(instance) {
  const instanceScope = instance.scope;
  let scope = getCurrentScope();
  while (scope) {
    if (scope === instanceScope) {
      return true;
    }
    scope = scope.parent;
  }
  return false;
}
const useRoute = () => {
  if (hasInjectionContext()) {
    const instance = getCurrentInstance();
    if (!instance || isScopeWithinInstance(instance)) {
      return inject(PageRouteSymbol, useNuxtApp()._route);
    }
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const HTML_ATTR_UNSAFE_RE = /[&"'<>]/g;
const HTML_ATTR_ENCODE_MAP = {
  "&": "%26",
  '"': "%22",
  "'": "%27",
  "<": "%3C",
  ">": "%3E"
};
function encodeForHtmlAttr(value) {
  return value.replace(HTML_ATTR_UNSAFE_RE, (c) => HTML_ATTR_ENCODE_MAP[c]);
}
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedHeader = encodeURL(location2, isExternalHost);
        const encodedLoc = encodeForHtmlAttr(encodedHeader);
        nuxtApp.ssrContext["~renderResponse"] = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
  return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    const pathname = url.pathname.replace(/^\/{2,}/, "/");
    return pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
function encodeRoutePath(url) {
  const parsed = parseURL(url);
  return encodePath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  if (typeof error !== "string" && error.statusText) {
    error.message ??= error.statusText;
  }
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  Object.defineProperty(nuxtError, "status", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusCode,
    configurable: true
  });
  Object.defineProperty(nuxtError, "statusText", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusMessage,
    configurable: true
  });
  return nuxtError;
};
function freezeHead(head) {
  const realPush = head.push;
  head.push = () => ({ dispose: () => {
  }, patch: () => {
  }, _poll: () => {
  } });
  return () => {
    head.push = realPush;
  };
}
const unhead_5ER1iE2V7xFSGdkxtaGeEjPLYjB_WNKkX9eU2Cwn7T8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    if (nuxtApp.ssrContext.islandContext) {
      const unfreeze = freezeHead(head);
      nuxtApp.hooks.hookOnce("app:created", unfreeze);
    }
    nuxtApp.vueApp.use(head);
  }
});
const routerOptions = {};
const sensitiveMatcher = (m, p) => {
  return [];
};
const foldedMatcher = sensitiveMatcher;
const decodeRoutePath = function decodeRoutePath2(path) {
  if (!path.includes("%")) return path;
  const queryIndex = path.indexOf("?");
  const pathname = queryIndex === -1 ? path : path.slice(0, queryIndex);
  try {
    return queryIndex === -1 ? decodeURI(pathname) : decodeURI(pathname) + path.slice(queryIndex);
  } catch {
    return path;
  }
};
const normalizePath = (path, fold) => {
  if (typeof path !== "string") {
    return path;
  }
  const decoded = decodeRoutePath(path);
  return fold ? decoded.toLowerCase() : decoded;
};
const _routeRulesMatcher = (path) => routerOptions.sensitive ? defu({}, ...sensitiveMatcher("", normalizePath(path, false)).map((r) => r.data).reverse()) : defu({}, ...foldedMatcher("", normalizePath(path, true)).map((r) => r.data).reverse());
const routeRulesMatcher = _routeRulesMatcher;
function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  try {
    return routeRulesMatcher(path);
  } catch (e) {
    console.error("[nuxt] Error matching route rules.", e);
    return {};
  }
}
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  {
    return;
  }
});
const globalMiddleware = [
  manifest_45route_45rule
];
function getRouteFromPath(fullPath) {
  const route = fullPath && typeof fullPath === "object" ? fullPath : {};
  if (typeof fullPath === "object") {
    fullPath = stringifyParsedURL({
      pathname: fullPath.path || "",
      search: stringifyQuery(fullPath.query || {}),
      hash: fullPath.hash || ""
    });
  }
  const url = new URL(fullPath.toString(), "http://localhost");
  return {
    path: url.pathname,
    fullPath,
    query: parseQuery(url.search),
    hash: url.hash,
    // stub properties for compat with vue-router
    params: route.params || {},
    name: void 0,
    matched: route.matched || [],
    redirectedFrom: void 0,
    meta: route.meta || {},
    href: fullPath
  };
}
const router_wn9UATNLddn4nS3yKr2hDJFk0JLTmiBIoWHkvpKrfjE = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  setup(nuxtApp) {
    const initialURL = nuxtApp.ssrContext.url;
    const routes = [];
    const hooks = {
      "navigate:before": [],
      "resolve:before": [],
      "navigate:after": [],
      "error": []
    };
    const registerHook = (hook, guard) => {
      hooks[hook].push(guard);
      return () => {
        const index = hooks[hook].indexOf(guard);
        if (index !== -1) {
          hooks[hook].splice(index, 1);
        }
      };
    };
    (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const route = reactive(getRouteFromPath(initialURL));
    let navigationCounter = 0;
    async function handleNavigation(url, replace) {
      const navigationId = ++navigationCounter;
      try {
        const to = getRouteFromPath(url);
        for (const middleware of hooks["navigate:before"]) {
          const result = await middleware(to, route);
          if (navigationId !== navigationCounter) {
            return;
          }
          if (result === false || result instanceof Error) {
            return;
          }
          if (typeof result === "string" && result.length) {
            return await handleNavigation(result, true);
          }
        }
        for (const handler of hooks["resolve:before"]) {
          await handler(to, route);
          if (navigationId !== navigationCounter) {
            return;
          }
        }
        Object.assign(route, to);
        if (false) ;
        for (const middleware of hooks["navigate:after"]) {
          await middleware(to, route);
        }
      } catch (err) {
        for (const handler of hooks.error) {
          await handler(err);
        }
      }
    }
    const currentRoute = computed(() => route);
    const router = {
      currentRoute,
      isReady: () => Promise.resolve(),
      // These options provide a similar API to vue-router but have no effect
      options: {},
      install: () => Promise.resolve(),
      // Navigation
      push: (url) => handleNavigation(url),
      replace: (url) => handleNavigation(url),
      back: () => (void 0).history.go(-1),
      go: (delta) => (void 0).history.go(delta),
      forward: () => (void 0).history.go(1),
      // Guards
      beforeResolve: (guard) => registerHook("resolve:before", guard),
      beforeEach: (guard) => registerHook("navigate:before", guard),
      afterEach: (guard) => registerHook("navigate:after", guard),
      onError: (handler) => registerHook("error", handler),
      // Routes
      resolve: getRouteFromPath,
      addRoute: (parentName, route2) => {
        routes.push(route2);
      },
      getRoutes: () => routes,
      hasRoute: (name) => routes.some((route2) => route2.name === name),
      removeRoute: (name) => {
        const index = routes.findIndex((route2) => route2.name === name);
        if (index !== -1) {
          routes.splice(index, 1);
        }
      }
    };
    nuxtApp.vueApp.component("RouterLink", defineComponent({
      functional: true,
      props: {
        to: {
          type: String,
          required: true
        },
        custom: Boolean,
        replace: Boolean,
        // Not implemented
        activeClass: String,
        exactActiveClass: String,
        ariaCurrentValue: String
      },
      setup: (props, { slots }) => {
        const navigate = () => handleNavigation(props.to, props.replace);
        return () => {
          const route2 = router.resolve(props.to);
          return props.custom ? slots.default?.({ href: props.to, navigate, route: route2 }) : h("a", { href: props.to, onClick: (e) => {
            e.preventDefault();
            return navigate();
          } }, slots);
        };
      }
    }));
    nuxtApp._route = route;
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const initialLayout = nuxtApp.payload.state._layout;
    const initialLayoutProps = nuxtApp.payload.state._layoutProps;
    nuxtApp.hooks.hookOnce("app:created", async () => {
      router.beforeEach(async (to, from) => {
        to.meta = reactive(to.meta || {});
        if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
          to.meta.layout = initialLayout;
          to.meta.layoutProps = initialLayoutProps;
        }
        nuxtApp._processingMiddleware = true;
        {
          nuxtApp._middlewareTo = to;
        }
        if (!nuxtApp.ssrContext?.islandContext) {
          const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
          const routeRules = getRouteRules({ path: to.path });
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              const guard = nuxtApp._middleware.named[key];
              if (!guard) {
                continue;
              }
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(guard);
              } else {
                middlewareEntries.delete(guard);
              }
            }
          }
          for (const middleware of middlewareEntries) {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            {
              if (result === false || result instanceof Error) {
                const error = result || createError$1({
                  status: 404,
                  statusText: `Page Not Found: ${initialURL}`,
                  data: {
                    path: initialURL
                  }
                });
                delete nuxtApp._processingMiddleware;
                delete nuxtApp._middlewareTo;
                return nuxtApp.runWithContext(() => showError(error));
              }
            }
            if (result === true) {
              continue;
            }
            if (result || result === false) {
              return result;
            }
          }
        }
      });
      router.afterEach(() => {
        delete nuxtApp._processingMiddleware;
        {
          delete nuxtApp._middlewareTo;
        }
      });
      await router.replace(initialURL);
      if (!isEqual(route.fullPath, initialURL)) {
        await nuxtApp.runWithContext(() => navigateTo(route.fullPath));
      }
    });
    return {
      provide: {
        route,
        router
      }
    };
  }
});
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || tryUseNuxtApp();
  return nuxt?.ssrContext?.head || nuxt?.runWithContext(() => {
    if (hasInjectionContext()) {
      return inject(headSymbol);
    }
  });
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  if (head) {
    return useHead$1(input, { head, ...options });
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_HoulAl0FkwvxVeipiikWorHh8RNaea80QucKymwp2iM = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const plugins = [
  unhead_5ER1iE2V7xFSGdkxtaGeEjPLYjB_WNKkX9eU2Cwn7T8,
  router_wn9UATNLddn4nS3yKr2hDJFk0JLTmiBIoWHkvpKrfjE,
  revive_payload_server_HoulAl0FkwvxVeipiikWorHh8RNaea80QucKymwp2iM,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4
];
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const runtimeConfig = /* @__PURE__ */ useRuntimeConfig();
    const basePath = runtimeConfig.app.baseURL.replace(/\/$/, "");
    const asset = (path) => `${basePath}${path}`;
    const films = [
      {
        id: "tide-lines",
        title: "Tide Lines",
        type: "Documentary short",
        year: "2024",
        runtime: "12 min",
        image: asset("/images/film-tide.jpg"),
        color: "#d7bfa2",
        description: "A quiet portrait of the people who read the lake before the weather arrives."
      },
      {
        id: "earth-speaks",
        title: "Earth Speaks",
        type: "Brand film / Kijani",
        year: "2023",
        runtime: "02:14",
        image: asset("/images/film-earth.jpg"),
        color: "#b7bd91",
        description: "A study in hands, heat and the slow patience of making something last."
      },
      {
        id: "blue-hour",
        title: "Blue Hour",
        type: "Documentary short",
        year: "2023",
        runtime: "08 min",
        image: asset("/images/film-coast.jpg"),
        color: "#7e8e91",
        description: "A coastal portrait about memory, salt air and the people who stay with the tide."
      },
      {
        id: "in-the-making",
        title: "In the Making",
        type: "Brand film / Kijani",
        year: "2023",
        runtime: "03:40",
        image: asset("/images/film-clay.jpg"),
        color: "#bd8b60",
        description: "A tactile study of craft, patience and the hands that keep a material alive."
      },
      {
        id: "after-the-rain",
        title: "After the Rain",
        type: "Music film",
        year: "2022",
        runtime: "04:16",
        image: asset("/images/film-song.jpg"),
        color: "#596d65",
        description: "A moving portrait of rhythm, friendship and the first song after a storm."
      },
      {
        id: "the-weavers",
        title: "The Weavers",
        type: "Editorial portrait",
        year: "2021",
        runtime: "10 min",
        image: asset("/images/film-weave.jpg"),
        color: "#9b7654",
        description: "A quiet look at the patterns passed between generations by hand."
      }
    ];
    const navItems = [
      ["Home", "#top"],
      ["About", "#about"],
      ["Programs", "#programs"],
      ["Projects", "#projects"],
      ["Gallery", "#gallery"],
      ["Contact", "#contact"]
    ];
    const menuOpen = ref(false);
    const selectedFilm = ref(null);
    const cursorX = ref(0);
    const cursorY = ref(0);
    const cursorActive = ref(false);
    const revealRoot = ref(null);
    useHead({
      title: "Amara Kato — Film Director",
      meta: [
        {
          name: "description",
          content: "Amara Kato is a Nairobi-based film director making intimate human documentaries and atmospheric brand films."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "revealRoot",
        ref: revealRoot,
        class: "min-h-[100dvh] bg-[var(--paper)] text-[var(--ink)]"
      }, _attrs))}><div class="${ssrRenderClass([{ "is-active": cursorActive.value }, "cursor-play hidden md:grid"])}" style="${ssrRenderStyle({ left: `${cursorX.value}px`, top: `${cursorY.value}px` })}" aria-hidden="true"><svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="m9 6 8 6-8 6V6Z"></path></svg></div><header class="nav-glass sand-nav fixed inset-x-0 top-0 z-40 border-b border-[var(--line)]"><div class="mx-auto flex h-[74px] max-w-[1380px] items-center justify-between px-6 md:px-10"><a href="#top" class="group flex items-center gap-3" data-testid="link-home"><span class="sand-mark">AK</span><span class="font-mono-ui text-[11px] uppercase tracking-[.14em]">Amara Kato Films</span></a><nav class="hidden items-center gap-9 md:flex" aria-label="Main navigation"><!--[-->`);
      ssrRenderList(navItems, ([label, href]) => {
        _push(`<a${ssrRenderAttr("href", href)} class="font-mono-ui text-[10px] uppercase tracking-[.15em] transition-colors hover:text-[var(--coral)]"${ssrRenderAttr("data-testid", `link-nav-${label.toLowerCase()}`)}>${ssrInterpolate(label)}</a>`);
      });
      _push(`<!--]--></nav><a href="#contact" class="sand-nav-cta hidden items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.14em] md:flex" data-testid="link-email-header"> Join the reel <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 19 19 5M8 5h11v11"></path></svg></a><button type="button" class="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] md:hidden"${ssrRenderAttr("aria-label", menuOpen.value ? "Close menu" : "Open menu")}${ssrRenderAttr("aria-expanded", menuOpen.value)} data-testid="button-mobile-menu">`);
      if (menuOpen.value) {
        _push(`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m6 6 12 12M18 6 6 18"></path></svg>`);
      } else {
        _push(`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>`);
      }
      _push(`</button></div>`);
      if (menuOpen.value) {
        _push(`<nav class="border-t border-[var(--line)] bg-[var(--paper)] px-6 py-7 md:hidden" aria-label="Mobile navigation"><div class="flex flex-col gap-5"><!--[-->`);
        ssrRenderList(navItems, ([label, href]) => {
          _push(`<a${ssrRenderAttr("href", href)} class="font-display text-3xl italic"${ssrRenderAttr("data-testid", `link-mobile-${label.toLowerCase()}`)}>${ssrInterpolate(label)}</a>`);
        });
        _push(`<!--]--></div></nav>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><main id="top"><section class="sand-hero relative min-h-[800px] overflow-hidden px-6 pb-14 pt-[145px] md:min-h-[860px] md:px-10 md:pt-[174px]" aria-labelledby="hero-heading"><img${ssrRenderAttr("src", asset("/images/hero-dawn.jpg"))} alt="A woman standing among tall grass at dawn in the Ngong Hills" class="sand-hero-image"><div class="sand-hero-shade" aria-hidden="true"></div><div class="relative z-10 mx-auto flex min-h-[650px] max-w-[1380px] flex-col justify-center text-center text-white"><p class="reveal font-mono-ui text-[10px] uppercase tracking-[.22em] text-white/80">Independent director · Nairobi / East Africa</p><h1 id="hero-heading" class="reveal reveal-delay-1 mx-auto mt-7 max-w-[1120px] font-display text-[clamp(3.8rem,10vw,9.2rem)] leading-[.88] tracking-[-.065em]">Stories with<br><em>room to breathe.</em></h1><p class="reveal reveal-delay-2 mx-auto mt-9 max-w-[520px] text-[15px] leading-[1.65] text-white/80">Amara Kato is a film director and visual storyteller making intimate documentaries and atmospheric brand films about the people, places and quiet forces shaping our future.</p><a href="#projects" class="reveal reveal-delay-3 sand-hero-link mx-auto mt-10 inline-flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.16em]">Explore projects <span class="grid h-10 w-10 place-items-center rounded-full border border-white/70">↓</span></a></div><div class="relative z-10 mx-auto mt-12 flex max-w-[1380px] items-center justify-between border-t border-white/35 pt-4 text-white/75"><span class="font-mono-ui text-[9px] uppercase tracking-[.15em]">Scroll to explore</span><span class="font-mono-ui text-[9px] uppercase tracking-[.15em]">01 — 07</span></div></section><section id="projects" class="projects-section bg-[var(--ink)] px-6 py-24 text-[var(--paper)] md:px-10 md:py-36" aria-labelledby="work-heading"><div class="mx-auto max-w-[1380px]"><div class="reveal flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">Projects · Films</p><h2 id="work-heading" class="mt-5 max-w-[700px] font-display text-[clamp(3rem,6.4vw,6.7rem)] leading-[.92] tracking-[-.06em]">Stories worth returning to.</h2></div><p class="max-w-[270px] text-sm leading-[1.65] text-[var(--paper)]/60">A library of documentaries, brand films, portraits and music stories. Press play on a world.</p></div><div class="film-grid mt-16"><!--[-->`);
      ssrRenderList(films, (film, index) => {
        _push(`<article class="${ssrRenderClass([index > 2 ? `reveal-delay-${index % 3 + 1}` : "", "film-card reveal"])}"><button type="button" class="group block w-full text-left"${ssrRenderAttr("data-testid", `button-play-${film.id}`)}><div class="film-tile relative overflow-hidden rounded-[8px]" style="${ssrRenderStyle({ backgroundColor: film.color })}"><img${ssrRenderAttr("src", film.image)}${ssrRenderAttr("alt", `${film.title} film still`)} class="film-image aspect-video w-full object-cover"><div class="film-tile-shade absolute inset-0"></div><span class="film-play absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/80 text-white opacity-0 transition-opacity group-hover:opacity-100"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" stroke="currentColor" stroke-width="1"><path d="m9 6 8 6-8 6V6Z"></path></svg></span><span class="absolute bottom-3 left-3 font-mono-ui text-[9px] uppercase tracking-[.13em] text-white/90">${ssrInterpolate(film.type)}</span></div><div class="mt-4 flex flex-col gap-2 border-b border-[rgba(241,234,220,.24)] pb-5"><div><h3 class="font-display text-2xl tracking-[-.03em]">${ssrInterpolate(film.title)}</h3><p class="mt-1 text-xs text-[var(--paper)]/60">${ssrInterpolate(film.year)} · ${ssrInterpolate(film.runtime)}</p></div></div></button></article>`);
      });
      _push(`<!--]--></div><div class="reveal mt-20 flex items-center justify-between border-t border-[rgba(241,234,220,.24)] pt-5"><span class="font-mono-ui text-[9px] uppercase tracking-[.15em] text-[var(--paper)]/50">More stories in the edit</span><a href="mailto:studio@amarakato.com?subject=Amara%20Kato%20work%20request" class="group flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[var(--coral)]" data-testid="link-request-reel"> Request full reel <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" class="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"><path d="M5 19 19 5M8 5h11v11"></path></svg></a></div></div></section><section id="about" class="px-6 py-24 md:px-10 md:py-40" aria-labelledby="about-heading"><div class="mx-auto grid max-w-[1380px] gap-14 md:grid-cols-12 md:gap-6"><div class="reveal md:col-span-3"><p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">A director&#39;s note</p><p class="mt-10 max-w-[170px] font-mono-ui text-[9px] uppercase leading-[1.7] tracking-[.12em] text-[var(--ink)]/50">On attention / on trust / on the long take</p></div><div class="reveal reveal-delay-1 md:col-span-8 md:col-start-5"><h2 id="about-heading" class="font-display text-[clamp(2.7rem,5.5vw,5.8rem)] leading-[.98] tracking-[-.055em]">I make films for the moment <em class="text-[var(--coral)]">before</em> someone realises the camera is there.</h2><div class="mt-11 grid gap-8 text-[15px] leading-[1.7] text-[var(--ink)]/70 md:grid-cols-2"><p>My work begins with listening. I am interested in the in-between: a hand hovering over a workbench, a laugh that arrives late, the particular hush of a place just before it wakes.</p><p>From Nairobi, I work across East Africa and wherever a good story asks me to go. The aim is simple: make something honest enough to keep looking at.</p></div><a href="#contact" class="mt-10 inline-flex items-center gap-2 border-b border-[var(--coral)] pb-2 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[var(--coral)]" data-testid="link-about-contact">Bring me into the room <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 19 19 5M8 5h11v11"></path></svg></a></div></div></section><section id="programs" class="border-y border-[var(--line)] bg-[var(--paper-deep)] px-6 py-20 md:px-10 md:py-28" aria-labelledby="services-heading"><div class="mx-auto grid max-w-[1380px] gap-14 md:grid-cols-12 md:gap-6"><div class="reveal md:col-span-4"><p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">Ways of working</p><h2 id="services-heading" class="mt-5 font-display text-4xl leading-none tracking-[-.04em]">The right size<br><em>for the story.</em></h2></div><div class="md:col-span-7 md:col-start-6"><!--[-->`);
      ssrRenderList([["01", "Documentary & editorial", "Short films, profiles and observational work with a human centre."], ["02", "Atmospheric brand film", "Visual worlds that earn attention slowly, then stay with you."], ["03", "Creative direction", "A considered visual language from first question to final frame."]], ([number, title, description], index) => {
        _push(`<div class="${ssrRenderClass([`reveal reveal-delay-${index + 1}`, "flex gap-5 border-t border-[var(--line)] py-7 md:gap-9"])}"><span class="font-mono-ui text-[10px] text-[var(--coral)]">${ssrInterpolate(number)}</span><div class="flex-1 md:flex md:items-start md:justify-between md:gap-8"><h3 class="font-display text-2xl">${ssrInterpolate(title)}</h3><p class="mt-3 max-w-[245px] text-sm leading-[1.6] text-[var(--ink)]/60 md:mt-0">${ssrInterpolate(description)}</p></div></div>`);
      });
      _push(`<!--]--></div></div></section><section id="approach" class="bg-[var(--coral)] px-6 py-24 text-[var(--paper)] md:px-10 md:py-36" aria-labelledby="approach-heading"><div class="mx-auto grid max-w-[1380px] gap-14 md:grid-cols-12 md:gap-6"><div class="reveal md:col-span-4"><p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--paper)]/70">The approach</p><span class="mt-20 hidden h-px w-20 bg-[var(--paper)]/50 md:block"></span></div><div class="md:col-span-7 md:col-start-6"><h2 id="approach-heading" class="reveal font-display text-[clamp(2.8rem,5vw,5.5rem)] leading-[.95] tracking-[-.055em]">Slow enough to notice. Precise enough to mean something.</h2><div class="mt-14 grid gap-7 border-t border-[rgba(241,234,220,.4)] pt-6 md:grid-cols-3"><!--[-->`);
      ssrRenderList([["Listen", "We start with the question underneath the brief."], ["Make space", "Small crews, generous rooms, time for the unscripted."], ["Shape gently", "The edit finds the pulse without sanding off the edges."]], ([title, copy], index) => {
        _push(`<div class="${ssrRenderClass([`reveal-delay-${index + 1}`, "reveal"])}"><h3 class="font-display text-2xl italic">${ssrInterpolate(title)}</h3><p class="mt-4 text-sm leading-[1.6] text-[var(--paper)]/75">${ssrInterpolate(copy)}</p></div>`);
      });
      _push(`<!--]--></div></div></div></section><section id="gallery" class="gallery-section px-6 py-24 md:px-10 md:py-36" aria-labelledby="recognition-heading"><div class="mx-auto grid max-w-[1380px] gap-14 md:grid-cols-12 md:gap-6"><div class="reveal md:col-span-3"><p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">A few good words</p></div><div class="md:col-span-8 md:col-start-5"><blockquote class="reveal"><p id="recognition-heading" class="font-display text-[clamp(2.7rem,5.3vw,5.6rem)] leading-[.98] tracking-[-.055em]">“Amara finds the poetry in the practical. She made our story feel less like a campaign and more like a memory we had forgotten to keep.”</p><footer class="mt-9 flex items-center gap-4 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[var(--ink)]/55"><span class="h-px w-8 bg-[var(--coral)]"></span> Nia Wambui · Kijani Studio</footer></blockquote><div class="reveal reveal-delay-1 mt-20 grid gap-7 border-t border-[var(--line)] pt-6 md:grid-cols-2"><div><p class="font-mono-ui text-[9px] uppercase tracking-[.13em] text-[var(--ink)]/50">Recognition</p><p class="mt-3 font-display text-2xl">Official selection<br><em>Kalasha Film Festival</em></p></div><div><p class="font-mono-ui text-[9px] uppercase tracking-[.13em] text-[var(--ink)]/50">Based in</p><p class="mt-3 font-display text-2xl">Nairobi, Kenya<br><em>Working everywhere</em></p></div></div><div class="gallery-grid reveal reveal-delay-2 mt-20"><!--[-->`);
      ssrRenderList(["/images/hero-dawn.jpg", "/images/film-clay.jpg", "/images/film-weave.jpg"], (image) => {
        _push(`<figure class="gallery-frame overflow-hidden rounded-[8px]"><img${ssrRenderAttr("src", asset(image))} alt="Amara Kato film still" class="film-image aspect-[1.1] w-full object-cover"></figure>`);
      });
      _push(`<!--]--></div></div></div></section><section id="contact" class="overflow-hidden bg-[var(--ink)] px-6 py-24 text-[var(--paper)] md:px-10 md:py-36" aria-labelledby="contact-heading"><div class="mx-auto max-w-[1380px]"><div class="reveal flex items-start justify-between"><p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">The next frame</p><span class="hidden font-mono-ui text-[9px] uppercase tracking-[.15em] text-[var(--paper)]/45 md:block">07 — 07</span></div><div class="reveal reveal-delay-1 mt-16 max-w-[1060px]"><h2 id="contact-heading" class="font-display text-[clamp(3.4rem,8.5vw,8.7rem)] leading-[.87] tracking-[-.07em]">Have a story<br><em class="text-[var(--coral)]">worth sitting with?</em></h2></div><div class="reveal reveal-delay-2 mt-14 flex flex-col justify-between gap-10 border-t border-[rgba(241,234,220,.25)] pt-6 md:flex-row md:items-end"><p class="max-w-[310px] text-sm leading-[1.65] text-[var(--paper)]/60">Tell me what you are making, what you are trying to say, or what you cannot quite say yet.</p><a href="mailto:studio@amarakato.com" class="group inline-flex items-center gap-4 font-display text-3xl italic text-[var(--paper)] transition-colors hover:text-[var(--coral)]" data-testid="link-contact-email">studio@amarakato.com <span class="grid h-12 w-12 place-items-center rounded-full border border-[var(--coral)] text-[var(--coral)] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="5" width="18" height="14" rx="1"></rect><path d="m4 7 8 6 8-6"></path></svg></span></a></div><footer class="mt-24 flex flex-col justify-between gap-5 border-t border-[rgba(241,234,220,.25)] pt-5 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[var(--paper)]/45 md:flex-row"><span>© ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Amara Kato Studio</span><span>Nairobi · Kenya · East Africa</span><a href="#top" class="text-[var(--coral)] hover:underline" data-testid="link-back-to-top">Back to top ↑</a></footer></div></section></main>`);
      if (selectedFilm.value) {
        _push(`<div class="fixed inset-0 z-50 grid place-items-center bg-[rgba(25,61,58,.88)] p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="film-dialog-title"><div class="relative w-full max-w-3xl overflow-hidden rounded-[26px] bg-[var(--paper)] text-[var(--ink)] shadow-2xl"><button type="button" class="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-[var(--paper)]/90" aria-label="Close film details" data-testid="button-close-film"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m6 6 12 12M18 6 6 18"></path></svg></button><img${ssrRenderAttr("src", selectedFilm.value.image)}${ssrRenderAttr("alt", `${selectedFilm.value.title} preview`)} class="aspect-[1.9] w-full object-cover"><div class="flex flex-col gap-5 p-7 md:flex-row md:items-end md:justify-between md:p-9"><div><p class="font-mono-ui text-[9px] uppercase tracking-[.15em] text-[var(--coral)]">${ssrInterpolate(selectedFilm.value.type)} · ${ssrInterpolate(selectedFilm.value.year)} · ${ssrInterpolate(selectedFilm.value.runtime)}</p><h2 id="film-dialog-title" class="mt-3 font-display text-4xl italic">${ssrInterpolate(selectedFilm.value.title)}</h2><p class="mt-3 max-w-md text-sm leading-[1.6] text-[var(--ink)]/65">${ssrInterpolate(selectedFilm.value.description)}</p></div><a href="mailto:studio@amarakato.com?subject=Viewing%20request" class="inline-flex shrink-0 items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.12em] text-[var(--coral)]" data-testid="link-film-enquiry">Enquire about a screening <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 19 19 5M8 5h11v11"></path></svg></a></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    const status = Number(_error.statusCode || 500);
    const is404 = status === 404;
    const statusText = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-BemXqvJA.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-BjzKSuSW.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ status: unref(status), statusText: unref(statusText), statusCode: unref(status), statusMessage: unref(statusText), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@25.9.6_@vue+compiler-sfc@3.5.42_cac_4f26f11735b7eb396a77781c72e0d607/node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    function invokeAppErrorHandler(err, target, info) {
      const errorHandler = nuxtApp.vueApp.config.errorHandler;
      if (errorHandler && !errorHandler.__nuxt_default) {
        try {
          errorHandler(err, target, info);
        } catch (handlerError) {
          console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
        }
      }
    }
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        invokeAppErrorHandler(err, target, info);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@25.9.6_@vue+compiler-sfc@3.5.42_cac_4f26f11735b7eb396a77781c72e0d607/node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = ((ssrContext) => entry(ssrContext));

export { useNuxtApp as a, useRuntimeConfig as b, nuxtLinkDefaults as c, useHead as d, entry_default as default, encodeRoutePath as e, navigateTo as n, resolveRouteObject as r, useRouter as u };
//# sourceMappingURL=server.mjs.map
