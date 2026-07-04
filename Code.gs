/******************************************************
 * Oorja Bills Management System (OBMS)
 * Code.gs
 * Version : 1.2.0 (Robofast Edition)
 * Client  : BSNL Rajasthan
 ******************************************************/

const CONFIG = {

  VERSION : "1.2.0",

  // Sheet
  SHEET_NAME : "OBE",

  // ===== Robofast WhatsApp API =====
  WHATSAPP_URL : "https://message.robofast.in/api/send",
  API_KEY : "PASTE_YOUR_ROBOFAST_API_KEY_HERE",
  ACCOUNT_ID : 16,

  // ===== Execution Mode =====
  TEST_MODE : true,
  TEST_MOBILE : "919414000198",
  DRY_RUN : false,

  // ===== Processing =====
  MAX_RECIPIENTS : 40,
  MAX_BILLS_PER_MESSAGE : 10,
  MIN_AMOUNT : 1,

  // Random delay (milliseconds)
  DELAY_MIN : 1000,
  DELAY_MAX : 2000,

  // Summary
  SUMMARY_MOBILE : "919414000198"

};

/******************************************************
 * Utility Functions
 ******************************************************/

function getSheet(){
  return SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName(CONFIG.SHEET_NAME);
}

function formatAmount(amount){
  return Number(amount).toLocaleString("en-IN",{
    minimumFractionDigits:0,
    maximumFractionDigits:2
  });
}

function formatDate(date){
  return Utilities.formatDate(
    new Date(date),
    Session.getScriptTimeZone(),
    "dd-MMM-yyyy"
  );
}

function getToday(){
  const d = new Date();
  d.setHours(0,0,0,0);
  return d;
}

function getDiffDays(date){
  const due = new Date(date);
  due.setHours(0,0,0,0);
  return Math.floor((due-getToday())/(1000*60*60*24));
}

function isEligible(amount,diff){
  return Number(amount)>=CONFIG.MIN_AMOUNT && diff<=3;
}

function getPriority(diff){
  if(diff<0) return 1;
  if(diff===0) return 2;
  return 3;
}

function getSendMobile(original){
  return CONFIG.TEST_MODE ? CONFIG.TEST_MOBILE : String(original);
}

/**
 * Random delay between every WhatsApp message.
 * Current range : 1–2 seconds.
 */
function shortDelay(){

  const delay =
    Math.floor(
      Math.random() *
      (CONFIG.DELAY_MAX-CONFIG.DELAY_MIN+1)
    ) + CONFIG.DELAY_MIN;

  Utilities.sleep(delay);

}

function chunkArray(arr,size){
  const out=[];
  for(let i=0;i<arr.length;i+=size){
    out.push(arr.slice(i,i+size));
  }
  return out;
}

function log(msg){
  Logger.log(
    Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "HH:mm:ss"
    ) + " | " + msg
  );
}
