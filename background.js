getCustomUiCss().then((css) => updateApplicationCss(css));

if (messenger.windows){
  console.log("Applying custom CSS window listener..");
  messenger.windows.onCreated.addListener(() => { getCustomUiCss().then((css) => updateApplicationCss(css)); });
}

function updateApplicationCss(css){
  if (css !== undefined) {
    console.log("Applying custom CSS..");
    browser.tbcustomuicss.update(css);
  }
}

async function getCustomUiCss() {
  var syncStorage = await browser.storage.sync.get();

  if (syncStorage.storage_method == "local") {
    var localStorage = await browser.storage.local.get();
    return localStorage.tbcustomuicss
  } else {
    return syncStorage.tbcustomuicss
  }
}