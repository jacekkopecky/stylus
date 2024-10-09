import * as prefs from '/js/prefs';
import {chromeSync} from '/js/storage-util';
import {debounce, deepCopy, deepEqual} from '/js/toolbox';
import {bgReady} from './common';

const nondefaults = {};
const origSet = prefs.set;
const updateStorage = () => chromeSync.setValue(prefs.STORAGE_KEY, nondefaults);

export default {
  /** @returns {Object} only the non-default preferences.
   * WARNING for bg context: properties of object type are direct references into `values`!
   * In non-bg contexts this is correctly deep-copied by msg.js::API. */
  get: () => nondefaults,
  set: prefs.__newSet((key, val, ...rest) => {
    if (origSet(key, val, ...rest)) {
      const def = prefs.__defaults[key];
      if (val !== def && !(val && typeof def === 'object' && deepEqual(val, def))) {
        nondefaults[key] = val;
      } else if (key in nondefaults) {
        delete nondefaults[key];
      } else {
        return;
      }
      debounce(updateStorage);
      return true;
    }
  }),
};

chromeSync.getValue(prefs.STORAGE_KEY).then(orig => {
  const copy = orig && typeof orig === 'object' ? deepCopy(orig) : {};
  prefs.ready.set(copy, {});
  if (!deepEqual(orig, nondefaults)) bgReady.all.then(updateStorage);
});
