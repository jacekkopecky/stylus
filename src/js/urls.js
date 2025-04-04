/** Ends with "/" */
export const ownRoot = /*@__PURE__*/ chrome.runtime.getURL('');
export const actionPopupUrl = ownRoot + 'popup.html';
export const installUsercss = 'install-usercss.html';
export const workerPath = '/js/worker.js';
export const swPath = `/${__.PAGE_BG}.js`;
export const favicon = host => `https://icons.duckduckgo.com/ip3/${host}.ico`;
export const chromeProtectsNTP = true;

const regExpTest = RegExp.prototype.test;

export const supported = /*@__PURE__*/ regExpTest.bind(new RegExp(
  `^(?:(?:ht|f)tps?:|file:|${ownRoot})`
));

export const isLocalhost = /*@__PURE__*/ regExpTest.bind(
  /^file:|^https?:\/\/([^/]+@)?(localhost|127\.0\.0\.1)(:\d+)?\//
);
