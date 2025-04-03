/** Don't use this file in content script context! */
import './browser';
import {kInvokeAPI} from '@/js/consts';
import {apiHandler} from './msg-api';
import {createPortExec, createPortProxy} from './port';
import {swPath, workerPath} from './urls';
import {getOwnTab} from './util-webext';

const needsTab = [
  'updateIconBadge',
  'styleViaAPI',
];
/** @type {MessagePort} */
const swExec = createPortExec(() => navigator.serviceWorker.controller, {lock: swPath});
const workerApiPrefix = 'worker.';
let workerProxy;
export const bg = __.IS_BG ? self : false;

async function invokeAPI({name: path}, _thisObj, args) {
  // Non-cloneable event is passed when doing `elem.onclick = API.foo`
  if (args[0] instanceof Event) args[0] = 'Event';
  if (path.startsWith(workerApiPrefix)) {
    workerProxy ??= createPortProxy(workerPath);
    return workerProxy[path.slice(workerApiPrefix.length)](...args);
  }
  let tab = false;
  // Using a fake id for our Options frame as we want to fetch styles early
  const frameId = window === top ? 0 : 1;
  if (!needsTab.includes(path) || !frameId && (tab = await getOwnTab())) {
    const msg = {method: kInvokeAPI, path, args};
    const sender = {url: location.href, tab, frameId};
    return swExec(msg, sender);
  }
}

if (__.ENTRY !== 'sw') {
  apiHandler.apply = invokeAPI;
}
