import {UCD} from '@/js/consts';
import * as URLS from '@/js/urls';
import {deepEqual, isEmptyObj, mapObj} from '@/js/util';
import {broadcast} from '../broadcast';
import broadcastInjectorConfig from '../broadcast-injector-config';
import {uuidIndex} from '../common';
import {prefsDb} from '../db';
import * as syncMan from '../sync-manager';
import {buildCacheForStyle} from './cache-builder';

/** @type {StyleDataMap} */
export const dataMap = new Map();
/** @returns {StyleDataMapEntry|void} */
export const id2data = dataMap.get.bind(dataMap);

const INJ_ORDER = 'injectionOrder';
export const order = /** @type {Injection.Order} */{main: {}, prio: {}};
export const orderWrap = {
  id: INJ_ORDER,
  value: mapObj(order, () => []),
  _id: `${chrome.runtime.id}-${INJ_ORDER}`,
  _rev: 0,
};

export function calcRemoteId({md5Url, updateUrl, [UCD]: ucd} = {}) {
  let id;
  id = (id = /\d+/.test(md5Url) || URLS.extractUsoaId(updateUrl)) && `uso-${id}`
    || (id = URLS.extractUswId(updateUrl)) && `usw-${id}`
    || '';
  return id && [
    id,
    ucd && !isEmptyObj(ucd.vars),
  ];
}

/** @returns {StyleObj} */
const createNewStyle = () => ({
  enabled: true,
  installDate: Date.now(),
});

/** @returns {StyleObj|void} */
export const getById = id => dataMap.get(+id)?.style;

/** @returns {StyleObj|void} */
export const getByUuid = uuid => getById(uuidIndex.get(uuid));

/** @returns {StyleObj} */
export const mergeWithMapped = style => ({
  ...getById(style.id) || createNewStyle(),
  ...style,
});

export function broadcastStyleUpdated(style, reason, isNew) {
  buildCacheForStyle(style);
  return broadcast({
    method: isNew ? 'styleAdded' : 'styleUpdated',
    reason,
    style: {
      id: style.id,
      enabled: style.enabled,
    },
  }, {onlyIfStyled: !style.enabled});
}

/** @return {Generator<StyleObj>} */
export function *iterStyles() {
  for (const v of dataMap.values()) yield v.style;
}

export async function setOrderImpl(data, {
  broadcast: broadcastAllowed,
  calc = true,
  store = true,
  sync,
} = {}) {
  if (!data || !data.value || deepEqual(data.value, orderWrap.value)) {
    return;
  }
  Object.assign(orderWrap, data, sync && {_rev: Date.now()});
  if (calc) {
    for (const [type, group] of Object.entries(data.value)) {
      const dst = order[type] = {};
      group.forEach((uuid, i) => {
        const id = uuidIndex.get(uuid);
        if (id) dst[id] = i;
      });
    }
  }
  if (broadcastAllowed) {
    broadcastInjectorConfig('order', order);
  }
  if (store) {
    await prefsDb.put(orderWrap, orderWrap.id);
  }
  if (sync) {
    syncMan.putDoc(orderWrap);
  }
}

/** @returns {void} */
export function storeInMap(style) {
  dataMap.set(style.id, {
    style,
    appliesTo: new Set(),
  });
  uuidIndex.set(style._id, style.id);
}

uuidIndex.addCustom(orderWrap, {set: setOrderImpl});
