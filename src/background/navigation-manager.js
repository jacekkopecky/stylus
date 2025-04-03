import '@/js/browser';
import {CHROME} from '@/js/ua';
import {ownRoot} from '@/js/urls';
import {deepEqual} from '@/js/util';
import {sendTab} from './broadcast';
import {bgBusy, onUrlChange} from './common';
import tabCache from './tab-manager';

export const webNavigation = chrome.webNavigation;
/** @type {{ url: chrome.events.UrlFilter[] }} */
const WEBNAV_FILTER_STYLABLE = {
  url: [
    {schemes: ['http', 'https', 'file', 'ftp', 'ftps']},
    {urlPrefix: ownRoot},
  ],
};
export const kCommitted = 'committed';
let prevData = {};

webNavigation.onCommitted.addListener(onNavigation.bind(null, kCommitted),
  WEBNAV_FILTER_STYLABLE);
webNavigation.onHistoryStateUpdated.addListener(onNavigation.bind(null, 'history'),
  WEBNAV_FILTER_STYLABLE);
webNavigation.onReferenceFragmentUpdated.addListener(onNavigation.bind(null, 'hash'),
  WEBNAV_FILTER_STYLABLE);

async function onNavigation(navType, data) {
  if (CHROME && __.BUILD !== 'firefox' &&
      data.timeStamp === prevData.timeStamp && deepEqual(data, prevData)) {
    return; // Chrome bug: listener is called twice with identical data
  }
  prevData = data;
  if (bgBusy) await bgBusy;

  const {tabId} = data;
  const td = tabCache[tabId];
  if (td && navType !== kCommitted) {
    const {frameId: f, url} = data;
    const {documentId: d, frameType} = data;
    sendTab(tabId, {
      method: 'urlChanged',
      top: !frameType && !f || frameType === 'outer_frame',
      iid: 0,
      url,
    }, {documentId: d});
  }
  for (const fn of onUrlChange) fn(data, navType);
}
