/******************************************************
 * Oorja Bills ChatGPT Project
 * WhatsAppService.gs
 * Version : 1.0.1
 * Client  : BSNL Rajasthan
 * Author  : Amit Kumar + ChatGPT
 ******************************************************/

function sendWhatsApp(number, message) {

  number = getSendMobile(number);

  if (CONFIG.DRY_RUN) {
    return {
      success: true,
      status: "DRY RUN",
      httpCode: 0,
      response: "Message not sent (DRY RUN)",
      messageId: ""
    };
  }

  try {

    const url = buildApiUrl(number, message);

    log("Sending WhatsApp to : " + number);

    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true
    });

    const httpCode = response.getResponseCode();
    const body = response.getContentText();

    let json = {};
    try {
      json = JSON.parse(body);
    } catch (e) {
      json = {};
    }

    const success = (json.status === "success");

    log("HTTP : " + httpCode + " | Status : " + (success ? "SUCCESS" : "FAILED"));

    return {
      success: success,
      status: success ? "SUCCESS" : "FAILED",
      httpCode: httpCode,
      response: body,
      messageId: json.message_id || json.queue_id || json.id || ""
    };

  } catch (error) {

    log("ERROR : " + error);

    return {
      success: false,
      status: "ERROR",
      httpCode: 0,
      response: error.toString(),
      messageId: ""
    };

  }

}

function updateDeliveryStatus(rowNumber, result) {

  const sheet = getSheet();

  sheet.getRange(rowNumber, COL ? COL.STATUS : 6)
       .setValue(result.status + " (" + result.httpCode + ")");

  sheet.getRange(rowNumber, COL ? COL.API_RESPONSE : 7)
       .setValue(result.response);

}

function updateMessageId(rowNumber, messageId) {

  if (!messageId) return;

  const sheet = getSheet();

  sheet.getRange(rowNumber, COL ? COL.MESSAGE_ID : 8)
       .setValue(messageId);

}

function sendPacket(recipient, packet) {

  const result = sendWhatsApp(
    recipient.mobile,
    packet.message
  );

  packet.bills.forEach(function(bill){

    updateDeliveryStatus(
      bill.rowNumber,
      result
    );

    updateMessageId(
      bill.rowNumber,
      result.messageId
    );

  });

  log(recipient.mobile + " --> " + result.status);

  shortDelay();

  return result;

}
