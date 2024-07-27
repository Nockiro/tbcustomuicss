function saveOptions(e) {
    e.preventDefault();
    let uiCss = document.querySelector("#global_css_override").value;
    let storageMethod = document.querySelector('input[name="storage-method"]:checked').value;

    console.debug("storage method:" + storageMethod);

    // note: inside the experimental implementation, browser storage is not accessable this way.
    browser.storage.sync.set({ storage_method: storageMethod });

    if (storageMethod == "sync") {
      console.debug("Storing CSS to sync storage..");
      browser.storage.sync.set({ tbcustomuicss: uiCss }).then(() => handleSuccessfulStore(uiCss)).catch((e) => handleStoreError(e));
    } else {
      console.debug("Storing CSS to local storage..");
      browser.storage.local.set({ tbcustomuicss: uiCss }).then(() => handleSuccessfulStore(uiCss)).catch((e) => handleStoreError(e));
    }
  }
  
  function handleSuccessfulStore(uiCss) {
    browser.tbcustomuicss.update(uiCss);
    document.querySelector("#txt-saveStatus").textContent = "> CSS stored. Don't forget to reopen tabs if you don't see changes applied.";
  }

  function handleStoreError(error) {
    document.querySelector("#txt-saveStatus").textContent = "> CSS couldn't be stored! (" + error.message + ")";
  }

  function resetOptions() {
      browser.storage.sync.set({ tbcustomuicss: '' });
      document.querySelector("#global_css_override").value = "";
      browser.tbcustomuicss.reset();  

      document.querySelector("#txt-saveStatus").textContent = "> CSS reset."
  }
  
  async function restoreOptions() {
    var syncStorage = await browser.storage.sync.get();

    if (syncStorage.storage_method == "local") {
      var localStorage = await browser.storage.local.get();
      document.querySelector("#global_css_override").value = localStorage.tbcustomuicss || '';
      document.querySelector("#inp_local_storage").checked = true
    } else {
      document.querySelector("#global_css_override").value = syncStorage.tbcustomuicss || '';
      document.querySelector("#inp_sync_storage").checked = true
    }

    if (document.querySelector("#global_css_override").value !== undefined) {
      browser.tbcustomuicss.update(document.querySelector("#global_css_override").value);
    }
  }
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);
  document.querySelector("#btn-reset").addEventListener("click", resetOptions);