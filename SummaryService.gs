/******************************************************
 * Oorja Bills ChatGPT Project
 * SummaryService.gs
 * Version : 1.0.2
 * Client  : BSNL Rajasthan
 * Author  : Amit Kumar + ChatGPT
 ******************************************************/

/**
 * Send Daily Execution Summary
 */
function sendSummary(summary){

  try{

    const end = Utilities.formatDate(
      summary.endTime,
      Session.getScriptTimeZone(),
      "dd-MMM-yyyy HH:mm:ss"
    );

    const msg =
`📊 *Oorja Bills Execution Summary*

🕒 Completed : ${end}

📌 Version : ${summary.version}

👥 Recipients : ${summary.totalRecipients}

🧾 Bills Processed : ${summary.totalBills}

💬 WhatsApp Messages : ${summary.totalPackets}

✅ Success : ${summary.success}

❌ Failed : ${summary.failed}

⏱ Execution Time : ${summary.executionSeconds} sec

🙏 BSNL Rajasthan`;

    const result = sendWhatsApp(
      CONFIG.SUMMARY_MOBILE,
      msg
    );

    log("Summary Status : " + result.status);

    return result;

  }catch(err){

    log("Summary Error : " + err);

    return {
      success:false,
      status:"ERROR",
      response:String(err)
    };

  }

}


/**
 * Write execution history
 * Sheet : Execution_Log
 */
function writeExecutionLog(summary){

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName("Execution_Log");

  if(!sheet){

    sheet = ss.insertSheet("Execution_Log");

    sheet.appendRow([
      "Run Date",
      "Version",
      "Recipients",
      "Bills",
      "Messages",
      "Success",
      "Failed",
      "Duration (Sec)"
    ]);

    sheet.setFrozenRows(1);

  }

  sheet.appendRow([

    Utilities.formatDate(
      summary.endTime,
      Session.getScriptTimeZone(),
      "dd-MMM-yyyy HH:mm:ss"
    ),

    summary.version,

    summary.totalRecipients,

    summary.totalBills,

    summary.totalPackets,

    summary.success,

    summary.failed,

    summary.executionSeconds

  ]);

}
