import {kInvokeAPI} from '@/js/consts';

export const FF = __.BUILD !== 'chrome' && (
  __.ENTRY
    ? 'contextualIdentities' in chrome || 'activityLog' in chrome
    : global !== window
);
export const rxIgnorableError = /(R)eceiving end does not exist|The message (port|channel) closed|moved into back\/forward cache/;

export const apiHandler = !__.IS_BG && {
  get: ({name: path}, name) => new Proxy(
    Object.defineProperty(() => {}, 'name', {value: path ? path + '.' + name : name}),
    apiHandler),
  apply: apiSendProxy,
};
/** @typedef {{}} API */
/** @type {API} */
export const API = __.IS_BG
  ? global[__.API]
  : global[__.API] = new Proxy({path: ''}, apiHandler);
export const isFrame = !__.IS_BG && window !== top;

export let bgReadySignal;
/** @type {number} top document mode
 * -1 = top prerendered, 0 = iframe, 1 = top, 2 = top reified */
export let TDM = isFrame ? 0 : !__.IS_BG && document.prerendering ? -1 : 1;

export function updateTDM(value) {
  TDM = value;
}

export async function apiSendProxy({name: path}, thisObj, args) {
  const localErr = new Error();
  const msg = {data: {method: kInvokeAPI, path, args}, TDM};
  for (let res, err, retry = 0; retry < 2; retry++) {
    try {
      res = await (FF ? browser : chrome).runtime.sendMessage(msg);
      if (res) {
        bgReadySignal = null;
        if ((err = res.error)) {
          err.stack += '\n' + localErr.stack;
          throw err;
        } else {
          return res.data;
        }
      }
    } catch (e) {
      e.stack = localErr.stack;
      throw e;
    }
    if (retry) {
      throw new Error('Stylus could not connect to the background script.');
    }
  }
}
