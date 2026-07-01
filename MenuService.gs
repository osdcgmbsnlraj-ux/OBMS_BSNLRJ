/******************************************************
 * Oorja Bills Management System (OBMS)
 * MenuService.gs
 * Version : 1.1.3 (Verified)
 * Client  : BSNL Rajasthan
 * Author  : Amit Kumar + ChatGPT
 ******************************************************/

/**
 * Creates the custom menu whenever the spreadsheet is opened.
 */
function onOpen(e) {

  SpreadsheetApp.getUi()
    .createMenu("⚡ Oorja Bills")
    .addItem("🧪 Test Run", "testRun")
    .addItem("🚀 Production Run", "productionRun")
    .addSeparator()
    .addItem("📊 Send Summary", "menuSendSummary")
    .addSeparator()
    .addItem("🕒 Create Daily Trigger", "createDailyTrigger")
    .addItem("🗑 Remove Daily Trigger", "removeDailyTrigger")
    .addSeparator()
    .addItem("♻ Reset Delivery Status", "resetDeliveryStatus")
    .addItem("🧹 Clear API Response", "clearApiResponse")
    .addSeparator()
    .addItem("ℹ About", "showAbout")
    .addToUi();
}

/**
 * Called automatically when the script is installed/copied.
 */
function onInstall(e){
  onOpen(e);
}

/**
 * Send a sample summary.
 */
function menuSendSummary(){

  if(typeof sendSummary !== "function"){
    SpreadsheetApp.getUi().alert("SummaryService.gs not found.");
    return;
  }

  sendSummary({
    version: CONFIG.VERSION,
    endTime: new Date(),
    totalRecipients: 0,
    totalBills: 0,
    totalPackets: 0,
    success: 0,
    failed: 0,
    executionSeconds: 0
  });
}

/**
 * Clears Delivery Status, API Response and Message ID.
 */
function resetDeliveryStatus(){

  const ui = SpreadsheetApp.getUi();

  if(ui.alert(
      "Reset Delivery Status",
      "Clear Delivery Status, API Response and Message ID for all rows?",
      ui.ButtonSet.YES_NO
    ) !== ui.Button.YES){
    return;
  }

  const sh = getSheet();
  const lr = sh.getLastRow();

  if(lr > 1){
    sh.getRange(2,6,lr-1,3).clearContent();
  }

  SpreadsheetApp.getActive().toast(
    "Delivery status reset.",
    "Oorja Bills",
    3
  );
}

/**
 * Clears API Response and Message ID only.
 */
function clearApiResponse(){

  const sh = getSheet();
  const lr = sh.getLastRow();

  if(lr > 1){
    sh.getRange(2,7,lr-1,2).clearContent();
  }

  SpreadsheetApp.getActive().toast(
    "API Response cleared.",
    "Oorja Bills",
    3
  );
}

/**
 * About dialog.
 */
function showAbout(){

  SpreadsheetApp.getUi().alert(
    "⚡ Oorja Bills Management System (OBMS)\n\n" +
    "Version : " + CONFIG.VERSION + "\n\n" +
    "Client : BSNL Rajasthan\n" +
    "Developer : Amit Kumar\n\n" +
    "Under Guidance of : Sh. Prabhat Kumar\n\n" +
    "Powered by Google Apps Script & ChatGPT"
  );
}
