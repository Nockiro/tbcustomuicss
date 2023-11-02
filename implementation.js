/* eslint-disable object-shorthand */

"use strict";

XPCOMUtils.defineLazyGlobalGetters(this, ["IOUtils", "PathUtils"]);

// Using a closure to not leak anything but the API to the outside world.
(function (exports) {

  // Get various parts of the WebExtension framework that we need.
  var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
  var Services = globalThis.Services || ChromeUtils.import("resource://gre/modules/Services.jsm").Services;
  
  /* If needed: 
     var { ExtensionParent } = ChromeUtils.import("resource://gre/modules/ExtensionParent.jsm");
     var extension = ExtensionParent.GlobalManager.getExtension("tbcustomuicss@nockiro.de");*/

  const styleSheetService = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
  const styleSheetTmpPath = PathUtils.join(PathUtils.profileDir, "TbUiGlobalCssOverride.css");
  const styleSheetTmpFileUri = Services.io.newURI(PathUtils.toFileURI(styleSheetTmpPath));

  function loadStylesheet(styleSheetUri) {
    resetStylesheet();

    console.log("Loading new sheet.");
    styleSheetService.loadAndRegisterSheet(styleSheetUri, styleSheetService.USER_SHEET);
  }

  function resetStylesheet(){
    if (styleSheetService.sheetRegistered(styleSheetTmpFileUri, styleSheetService.USER_SHEET)) {
      console.log("Unloading sheet.");
      styleSheetService.unregisterSheet(styleSheetTmpFileUri, styleSheetService.USER_SHEET);
    }
  }

  function cacheStylesheet(css, onSuccess) {
    // since the styleSheetService only takes files: write current setting to temporary file before loading
    return IOUtils.writeUTF8(styleSheetTmpPath, css).then(function (aResult) {
      console.log(`Saved temporary css: ${aResult} bytes written.`);  

      if (onSuccess)    
        onSuccess();
    }, Components.utils.reportError);
  }

  // Implementation of functions [and events] defined in schema.json
  class tbcustomuicss extends ExtensionCommon.ExtensionAPI {
    getAPI(context) {
      return {
        tbcustomuicss: {

          update: async function (css) {
            resetStylesheet();     
            
            cacheStylesheet(css, () => {              
              // since tab.insertCss doesn't work (especially with calendar/tasks), inject css into the window
              loadStylesheet(styleSheetTmpFileUri);
            });
          },

          reset: async function () {
            resetStylesheet();
            cacheStylesheet("");
          },
        },
      };
    }

    onShutdown(isAppShutdown) {
      if (isAppShutdown) {
        return;
      }

      console.log(`Cleanup time! (Removing temporary global css file and style.)`);
      // if the add-on is removed, at least on new tabs the changes shouldn't be applied anymore
      resetStylesheet();
      cacheStylesheet("");

      // if the add-on is removed, we don't want to have any spare files laying around
      IOUtils.remove(styleSheetTmpPath);

      // Example says, the following line invalidates js caches
      Services.obs.notifyObservers(null, "startupcache-invalidate", null);
    }
  };

  exports.tbcustomuicss = tbcustomuicss;

})(this)