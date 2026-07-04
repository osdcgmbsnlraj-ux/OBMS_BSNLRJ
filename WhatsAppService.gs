/******************************************************
 * Oorja Bills Management System (OBMS)
 * WhatsAppService.gs
 * Version : 1.2.0 (Robofast Edition)
 * Client  : BSNL Rajasthan
 ******************************************************/

/**
 * Send one WhatsApp message using Robofast API.
 * Returns:
 * {
 *   success,
 *   status,
 *   response,
 *   messageId
 * }
 */
function sendWhatsApp(number, message){

  if(CONFIG.DRY_RUN){

    log("DRY RUN : " + number);

    return {
      success:true,
      status:"DRY_RUN",
      response:"DRY_RUN",
      messageId:""
    };

  }

  const payload = {
    to: String(number),
    message: message,
    account: CONFIG.ACCOUNT_ID
  };

  const options = {
    method : "post",
    contentType : "application/json",
    headers : {
      "X-API-Key" : CONFIG.API_KEY
    },
    payload : JSON.stringify(payload),
    muteHttpExceptions : true
  };

  try{

    const response = UrlFetchApp.fetch(
      CONFIG.WHATSAPP_URL,
      options
    );

    const code = response.getResponseCode();
    const body = response.getContentText();

    let json = {};

    try{
      json = JSON.parse(body);
    }catch(e){}

    const ok = (code === 200 && json.success === true);

    return {
      success : ok,
      status : ok ? "SUCCESS (200)" : "FAILED ("+code+")",
      response : body,
      messageId : json.message_id || ""
    };

  }catch(err){

    return {
      success:false,
      status:"EXCEPTION",
      response:String(err),
      messageId:""
    };

  }

}

/**
 * Send one packet and update sheet.
 */
function sendPacket(recipient, packet){

  const mobile = getSendMobile(recipient.mobile);

  const result = sendWhatsApp(
    mobile,
    packet.message
  );

  // Update original rows
  packet.bills.forEach(function(bill){

    const row = bill.row;

    getSheet().getRange(row,6).setValue(result.status);
    getSheet().getRange(row,7).setValue(result.response);
    getSheet().getRange(row,8).setValue(result.messageId);

  });

  // Random delay between packets (1–2 sec)
  shortDelay();

  log(
    mobile + " -> " +
    result.status
  );

  return result;

}
