// adapted from https://greasyfork.org/en/scripts/424030-stylus-shadow-dom-support/code
// cleaned up
// included in Stylus-without-network because the target environment disallows user scripts

const updDelay = 500;
const elementsWithShadow = [];
const styleSelector = 'html>style:is([class="stylus"],[id^="stylus-"])';

setup();

function setup() {
  const originalAttachShadow = Element.prototype.attachShadow;

  if (!originalAttachShadow) {
    console.log(
      'not installing shadow root support for Stylus-without-network'
    );
    return;
  }

  let applyTimeout = null;

  Element.prototype.attachShadow = function (opt) {
    if (
      !window._cf_chl_opt &&
      !document.querySelector(
        'script[src^="https://challenges.cloudflare.com/"]'
      )
    ) {
      if (opt) {
        opt.mode = 'open';
      } else opt = {mode: 'open'};
      if (!elementsWithShadow.includes(this)) elementsWithShadow.push(this);
      clearTimeout(applyTimeout);
      applyTimeout = setTimeout(applyStylusStyles, updDelay);
    }
    return originalAttachShadow.apply(this, arguments);
  };

  if (!document.documentElement) {
    console.log('not installing shadow mutation observer for Stylus-without-network');
    return;
  }

  const observer = new MutationObserver(function (records) {
    let haveRelevantChanges = false;

    for (const {addedNodes, removedNodes} of records) {
      for (const node of addedNodes) {
        if (isStylusStyle(node)) {
          const changeObserver = new MutationObserver(() => {
            clearTimeout(applyTimeout);
            applyTimeout = setTimeout(applyStylusStyles, updDelay);
          });
          changeObserver.observe(node, {characterData: true, subtree: true});
          node._stylusShadowRootObserver = changeObserver;
          haveRelevantChanges = true;
        }
      }

      for (const node of removedNodes) {
        if (node._stylusShadowRootObserver) {
          node._stylusShadowRootObserver.disconnect();
          haveRelevantChanges = true;
        }
      }
    }

    if (haveRelevantChanges) {
      clearTimeout(applyTimeout);
      applyTimeout = setTimeout(applyStylusStyles, updDelay);
    }
  });

  observer.observe(document.documentElement, {childList: true});
}

function isStylusStyle(el) {
  return el?.matches?.(styleSelector);
}

function applyStylusStyles() {
  const styles = document.querySelectorAll(styleSelector);

  for (const e of elementsWithShadow) {
    if (e.shadowRoot) {
      for (const el of e.shadowRoot.children) {
        if (isStylusStyle(el)) el.remove();
      }

      for (const el of styles) {
        e.shadowRoot.append(el.cloneNode(true));
      }
    }
  }
}
