import {kInjectionOrder} from '@/js/consts';
import {deepEqual, mapObj} from '@/js/util';
import {broadcast} from '../broadcast';
import broadcastInjectorConfig from '../broadcast-injector-config';
import {uuidIndex} from '../common';
import {prefsDB} from '../db';
import {buildCacheForStyle} from './cache-builder';

/** @type {StyleDataMap} */
export const dataMap = new Map();

export const order = /** @type {Injection.Order} */{main: {}, prio: {}};
export const orderWrap = {
  id: kInjectionOrder,
  value: mapObj(order, () => []),
  _id: `${chrome.runtime.id}-${kInjectionOrder}`,
  _rev: 0,
};

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
  });
}

export async function setOrderImpl(data, {
  broadcast: broadcastAllowed,
  calc = true,
  store = true,
} = {}) {
  if (!data || !data.value || deepEqual(data.value, orderWrap.value)) {
    return;
  }
  Object.assign(orderWrap, data);
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
    await prefsDB.put(orderWrap, orderWrap.id);
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
