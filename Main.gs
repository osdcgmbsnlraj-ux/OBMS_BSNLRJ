/******************************************************
 * Oorja Bills ChatGPT Project
 * Main.gs
 * Version : 1.0.2
 * Client  : BSNL Rajasthan
 * Author  : Amit Kumar + ChatGPT
 ******************************************************/

/**
 * Main Execution Function
 */
function sendBillReminders() {

  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const response = ui.alert(
    "Oorja Bills",
    "Send Electricity Bill reminders now?",
    ui.ButtonSet.YES_NO
  );

  if (response != ui.Button.YES) {
    log("Execution cancelled by user.");
    return;
  }

  const startTime = new Date();

  ss.toast("Reading eligible bills...", "Oorja Bills", 5);

  const recipients = getRecipients();

  const summary = {
    version: CONFIG.VERSION,
    startTime: startTime,
    totalRecipients: recipients.length,
    totalBills: 0,
    totalPackets: 0,
    success: 0,
    failed: 0
  };

  log("===== Execution Started =====");

  recipients.forEach(function(recipient, index){

    ss.toast(
      "Sending " + (index + 1) + " of " + recipients.length,
      "Oorja Bills",
      3
    );

    try {

      const packets = buildPackets(
        recipient.officer,
        recipient.bills
      );

      summary.totalPackets += packets.length;
      summary.totalBills += recipient.bills.length;

      packets.forEach(function(packet){

        const result = sendPacket(recipient, packet);

        if(result.success){
          summary.success++;
        }else{
          summary.failed++;
        }

      });

    } catch(err){

      log("ERROR : " + err);

      summary.failed++;

    }

  });

  summary.endTime = new Date();

  summary.executionSeconds =
    Math.round(
      (summary.endTime-summary.startTime)/1000
    );

  log(JSON.stringify(summary));

  ss.toast(
    "Completed in " +
    summary.executionSeconds +
    " sec",
    "Oorja Bills",
    5
  );

  if(typeof sendSummary === "function"){
    sendSummary(summary);
  }

  if(typeof writeExecutionLog === "function"){
    writeExecutionLog(summary);
  }

  return summary;

}

/******************************************************
 * Test Mode
 ******************************************************/
function testRun(){

  CONFIG.TEST_MODE = true;

  sendBillReminders();

}

/******************************************************
 * Production Mode
 ******************************************************/
function productionRun(){

  CONFIG.TEST_MODE = false;

  sendBillReminders();

}