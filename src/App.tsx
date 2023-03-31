import React, { useEffect, useState } from 'react';

import Logo from '../public/logo.svg';

function App() {
  const [isDesktopMode, toggleMode] = useState(false);
  const [isEnabled, toggleEnabled] = useState(false);

  useEffect(() => {
    /* eslint-disable no-undef */
    chrome.storage.sync.get(['isParsingEnabled'], ({ isParsingEnabled }) => {
      console.info('ENABLED_USE_EFFECT', !!isParsingEnabled);
      toggleEnabled(!!isParsingEnabled);
    });
    chrome.storage.sync.get(['isDesktopMode'], ({ isDesktopMode: isDesktop }) => {
      console.info('FRONTEND_MODE', `${isDesktop}`);
      toggleMode(!!isDesktop);
    });
  }, []);

  const callParser = (mode: boolean) => {
    console.info('UPDATED_MODE', `${mode}`);
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        const currentTabId = tabs[0].id;
        console.info('FRONTEND_MODE_CHANGED', isDesktopMode);
        if (currentTabId) {
          chrome.storage.sync.set({
            isDesktopMode: mode,
          });
          chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            func: () => window.location.reload(),
          });
        }
      },
    );
  };

  const handleToggleEnable = () => {
    toggleEnabled((prev) => {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          const currentTabId = tabs[0].id;
          if (currentTabId) {
            console.info('ENABLED_CHANGED_HANDLER', !prev);
            chrome.storage.sync.set({
              isParsingEnabled: !prev,
            });
            chrome.scripting.executeScript({
              target: { tabId: currentTabId },
              func: () => window.location.reload(),
            });
          }
        },
      );
      return !prev;
    });
  };

  const hanldeClick = () => {
    toggleMode((prev) => {
      callParser(!prev);
      return !prev;
    });
  };

  return (
    <div className='viewLyaout'>
      yo
    </div>
  );
}

export default App;
