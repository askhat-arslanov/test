/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const linkStyle = `.cordless-extension-button {
    display: inline;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    font-weight: normal;
    text-decoration: none !important;
    color: white !important;
    font-style: normal;
    color: var(--extensionButtonColor);
    cursor: pointer !important;
    background-color: #FF8B7B !important;
    border-radius: 80px !important;
    padding-top: 0px !important;
    padding-left: 6px !important;
    padding-right: 24px !important;
    padding-bottom: 0px !important;
    line-height: normal !important;
    line-height: initial !important;
    background-image: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path fill="%23FFF" fill-rule="evenodd" d="M490.651704,214.761829 C490.462193,214.58384 490.241097,214.454393 490.020001,214.341127 C489.688356,214.179319 489.198786,213.920426 488.835556,214.163138 C488.709215,214.244043 488.61446,214.38967 488.503912,214.486755 C488.361778,214.632382 488.203852,214.778009 488.014341,214.875094 C487.208919,215.295795 486.150815,215.117806 485.487526,214.486755 C485.108504,214.082234 484.871615,213.499725 484.887408,212.933397 C484.9032,212.496515 485.045334,212.043452 485.313808,211.687474 C485.424356,211.541847 485.566489,211.4124 485.69283,211.266773 C485.819171,211.137326 485.898134,210.991699 485.898134,210.797529 C485.898134,210.554817 485.787586,210.328286 485.69283,210.101754 C485.598074,209.891404 485.503319,209.664872 485.361186,209.486883 C485.234845,209.308894 485.045334,209.114725 484.84003,209.033821 C484.745274,209.001459 484.650519,208.985278 484.555763,209.01764 C484.429423,209.050001 484.334667,209.147086 484.239911,209.22799 C483.829304,209.551607 483.402904,209.923765 483.1976,210.40919 C482.850163,211.185869 483.008089,212.075814 483.308148,212.836312 C483.655585,213.693895 484.224119,214.470574 484.887408,215.101626 C485.282223,215.506146 485.724415,215.878305 486.198193,216.18574 C486.814104,216.57408 487.524771,216.897696 488.25123,216.9786 C488.756593,217.043323 489.293541,216.962419 489.735734,216.719707 C489.925245,216.606441 490.098964,216.476995 490.256889,216.315187 C490.430608,216.137198 490.620119,215.943028 490.762252,215.748858 C490.857008,215.635592 490.983349,215.522327 490.999141,215.344338 C491.014934,215.117806 490.80963,214.907456 490.651704,214.761829 Z" transform="translate(-483 -209)"/></svg>') !important;
    background-position: right 6px center !important;
    background-repeat: no-repeat !important;
    background-size: auto 60% !important;
}`;

const ExcludeTypes = [
  'SCRIPT',
  'NOSCRIPT',
  'STYLE',
  'svg',
  'path',
  'PRE',
  'VIDEO',
  'IMG',
  'IFRAME',
];

const r = /\+(?:[-+() ]*\d){10,13}/g;

const debounce = (func: any, timeout = 300) => {
  let timer: any;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

const func = (element: ChildNode, isDesktopMode: boolean) => {
  if (!(element instanceof Element)) return false;
  const t = window.getComputedStyle(element);
  if (
    !(t.display !== 'none' && t.visibility !== 'hidden' && t.opacity !== '0') &&
    t.display !== 'contents'
  )
    return false;
  if (ExcludeTypes.includes(element.nodeName)) return false;

  if (element.childNodes.length !== 0) {
    element.childNodes.forEach((e) => {
      const matches = [...e.textContent.matchAll(r)];
      if (
        e.textContent &&
        e.nodeType === Node.TEXT_NODE &&
        matches.length &&
        e.parentElement &&
        e.parentElement.classList &&
        !e.parentElement.classList.contains('cordless-extension-button') &&
        e.parentElement.getElementsByClassName('cordless-extension-button').length === 0
      ) {
        const match = matches.length && (matches[0] as any);
        const linkWrap = document.createElement('a');
        linkWrap.setAttribute('class', 'cordless-extension-button');
        linkWrap.setAttribute(
          'href',
          isDesktopMode
            ? `cordless-dialer://dial?number=${match[0]}`
            : `https://app.cordless.io/?predial=${match[0]}`,
        );
        linkWrap.setAttribute('target', '__blank');
        linkWrap.addEventListener('click', (event) => {
          event.stopPropagation();
        });

        if (match[0].length < match.input.length) {
          linkWrap.innerHTML = match[0];

          if (match.index !== 0 && match.index + match[0].length !== match?.input?.length) {
            console.info(match, 'NODE_BETWEEN');
            const leftNode = document.createTextNode(match?.input?.substring(0, match.index) || '');
            const rightNode = document.createTextNode(
              match?.input?.substring(match.index + match[0].length) || '',
            );
            e.parentElement.insertBefore(rightNode, e);
            e.parentElement.insertBefore(linkWrap, rightNode);
            e.parentElement.insertBefore(leftNode, linkWrap);
          } else if (match.index + match[0].length === match?.input?.length) {
            console.info(match, 'NODE_ON_THE_RIGHT');
            const leftNode = document.createTextNode(match.input.substring(0, match.index));
            e.parentElement.insertBefore(linkWrap, e);
            e.parentElement.insertBefore(leftNode, linkWrap);
          } else {
            console.info(match, 'NODE_ON_THE_LEFT');
            const rightNode = document.createTextNode(
              match?.input?.substring(match.index + match[0].length) || '',
            );
            e.parentElement.insertBefore(rightNode, e);
            e.parentElement.insertBefore(linkWrap, rightNode);
          }
          e.parentElement.removeChild(e);
        } else if (!e?.parentNode?.classList.contains('cordless-extension-button')) {
          console.info('WRAPPING_FULLY', match);
          e.after(linkWrap);
          linkWrap.appendChild(e);
        }
      }
      return func(e, isDesktopMode);
    });
  }
  return false;
};

const parseAndMutateDom = () => {
  chrome.storage.sync.get(['isParsingEnabled'], ({ isParsingEnabled }) => {
    if (isParsingEnabled) {
      console.info('PARSING');
      chrome.storage.sync.get(['isDesktopMode'], ({ isDesktopMode }) => {
        console.info('WEB_PARSING_MODE', isDesktopMode);
        func(document.body, isDesktopMode);
      });
    }
  });
};

const debounceParse = debounce(() => parseAndMutateDom(), 1000);

const callback = () => {
  console.info('MUTATED');
  debounceParse();
};

const observer = new MutationObserver(callback);

observer.observe(document.body, {
  attributes: false,
  childList: true,
  subtree: true,
});

window.addEventListener('load', () => {
  const style = document.createElement('style');
  style.textContent = linkStyle;
  document.head.appendChild(style);
});
