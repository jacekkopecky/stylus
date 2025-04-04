import {isEmptyObj} from '@/js/util';
import {buildCacheForStyle} from './cache-builder';
import {broadcastStyleUpdated, dataMap, storeInMap} from './util';

const makeRandomUUID = crypto.randomUUID?.bind(crypto);

const MISSING_PROPS = {
  name: style => `ID: ${style.id}`,
  _id: makeRandomUUID,
  _rev: Date.now,
};

/**
 * @param {StyleObj} style
 * @param {boolean} [revive]
 * @return {?StyleObj|Promise<StyleObj>}
 */
export function fixKnownProblems(style) {
  let res = 0;
  let v;
  for (const key in MISSING_PROPS) {
    if (!style[key]) {
      style[key] = MISSING_PROPS[key](style);
      res = 1;
    }
  }
  /* delete if value is null, {}, [] */
  for (const key in style) {
    v = style[key];
    if (v == null || typeof v === 'object' && isEmptyObj(v)) {
      delete style[key];
      res = 1;
    }
  }
  /* Upgrade the old way of customizing local names */
  const {originalName} = style;
  if (originalName) {
    if (originalName !== style.name) {
      style.customName = style.name;
      style.name = originalName;
    }
    delete style.originalName;
    res = 1;
  }
  /* wrong homepage url in 1.5.20-1.5.21 due to commit 1e5f118d */
  for (const key of ['url', 'installationUrl']) {
    const url = style[key];
    const fixedUrl = url && url.replace(/([^:]\/)\//, '$1');
    if (fixedUrl !== url) {
      res = 1;
      style[key] = fixedUrl;
    }
  }
  return res && style;
}

export function onBeforeSave(style) {
  if (!style.name) {
    throw new Error('Style name is empty');
  }
  if (!style._id) {
    style._id = makeRandomUUID();
  }
  if (!style.id) {
    delete style.id;
  }
  style._rev = Date.now();
  fixKnownProblems(style);
}

/**
 * @param {StyleObj} style
 * @param {string|false} [reason] - false = no broadcast
 * @param {number} [id]
 * @returns {StyleObj}
 */
export function onSaved(style, reason, id = style.id) {
  if (style.id == null) style.id = id;
  const data = dataMap.get(id);
  if (!data) {
    storeInMap(style);
  } else {
    data.style = style;
  }
  if (reason !== false) {
    broadcastStyleUpdated(style, reason, !data);
  } else {
    buildCacheForStyle(style);
  }
  return style;
}
