const origListeners = __.DEBUG && new WeakMap();

global.browser = chrome;
if (__.DEBUG) addEventLogger();

function addEventLogger() {
  const patched = new WeakSet();
  const handler = {
    get(obj, k) {
      let val = obj[k];
      if (val && typeof val === 'object' && !patched.has(val)) {
        patched.add(val);
        let hasEvents, evt, fn;
        for (k in val) {
          if (k.startsWith('on') && (evt = val[k]) && typeof evt === 'object') {
            for (const ke in evt) {
              if (ke.endsWith('Listener') && typeof (fn = evt[ke]) === 'function') {
                evt[ke] = patchEventListener(evt, k, fn);
              }
            }
            hasEvents = true;
          }
        }
        if (!hasEvents) val = new Proxy(val, handler);
      }
      return val;
    },
  };
  if (chrome === browser) {
    global.chrome = global.browser = new Proxy(chrome, handler);
  } else {
    global.chrome = new Proxy(chrome, handler);
    global.browser = new Proxy(browser, handler);
  }
}

function patchEventListener(obj, name, fn) {
  let res = fn;
  switch (fn.name) {
    case 'addListener':
      res = (cb, ...opts) =>
        fn.call(obj, (...args) => {
          console.log(name, ...name === 'onMessage' ? args.slice(0, 2) : args);
          return cb(...args);
        }, ...opts);
      origListeners.set(fn, res);
      break;
    case 'removeListener':
      res = cb => {
        fn.call(obj, origListeners.get(cb));
        origListeners.delete(cb);
      };
      break;
    case 'hasListener':
      res = cb => fn.call(obj, origListeners.get(cb));
      break;
  }
  return res;
}
