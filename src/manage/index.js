import '@/js/dom-init';
import {setupLivePrefs} from '@/js/dom-util';
import {tBody} from '@/js/localization';
import * as prefs from '@/js/prefs';
import {t} from '@/js/util';
import {readBadFavs, showStyles} from './render';
import * as router from './router';
import * as sorter from './sorter';
import {newUI} from './util';
import './manage.css';
import './manage-newui.css';

tBody();

(async () => {
  const {badFavs, ids, styles} = prefs.clientData;
  const rerenderNewUI = () => newUI.render();
  setupLivePrefs();
  newUI.render(true);
  prefs.subscribe(newUI.ids.map(newUI.prefKeyForId), rerenderNewUI);
  sorter.init();
  router.update();
  if (newUI.hasFavs()) readBadFavs(badFavs);
  showStyles(styles, ids);
  console.log('without-network: not initializing sync button');
  import('./lazy-init');
})();

// translate CSS manually
document.styleSheets[0].insertRule(
  `:root {${[
    'genericDisabledLabel',
    'updateAllCheckSucceededSomeEdited',
    'filteredStylesAllHidden',
  ].map(id => `--${id}:"${CSS.escape(t(id))}";`).join('')
  }}`);
