/* global createWorkerApi */// worker-util.js
'use strict';

/** @namespace BackgroundWorker */
createWorkerApi({
  parseMozFormat(...args) {
    require(['/js/moz-parser']); /* global extractSections */
    return extractSections(...args);
  },
});
