/******************************************************
 * Oorja Bills ChatGPT Project
 * Version : 1.0.0
 * Client  : BSNL Rajasthan
 * Author  : Amit Kumar + ChatGPT
 ******************************************************/

const CONFIG = {

  VERSION: "1.0.1",

  // Sheet
  SHEET_NAME: "OBE",

  // WhatsApp API
  WHATSAPP_URL: "https://aurbhejo.com/api/send.php",
  INSTANCE_ID: "9414024365",
  ACCESS_TOKEN: "d1e0d26a12039a20b1273e26f3f17fca4f8b8f6c7bf857ff",

  // TEST MODE
  TEST_MODE: true,

  TEST_MOBILE: "919414000198",

  // Dry Run
  DRY_RUN: false,

  // Processing

  MAX_RECIPIENTS: 40,

  MAX_BILLS_PER_MESSAGE: 10,

  MIN_AMOUNT: 1,

  DELAY_MIN: 1000,

  DELAY_MAX: 2000,

  // Summary

  SUMMARY_MOBILE: "919414000198"

};


const COL = {

  MOBILE:1,
  OFFICER:2,
  DUE_DATE:3,
  CA_NO:4,
  AMOUNT:5,
  STATUS:6,
  API_RESPONSE:7,
  MESSAGE_ID:8

};


/******************************************************
 * Utility Functions
 ******************************************************/


function getSheet(){

  return SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(CONFIG.SHEET_NAME);

}



function formatAmount(amount){

  return Number(amount)
      .toLocaleString("en-IN",{
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



function shortDelay(){

  const delay =

      Math.floor(

          Math.random() *

          (CONFIG.DELAY_MAX-CONFIG.DELAY_MIN+1)

      ) + CONFIG.DELAY_MIN;

  Utilities.sleep(delay);

}



function getToday(){

  let d = new Date();

  d.setHours(0,0,0,0);

  return d;

}



function getDiffDays(date){

  let due = new Date(date);

  due.setHours(0,0,0,0);

  return Math.floor(

      (due-getToday())/

      (1000*60*60*24)

  );

}

function isEligible(amount,diff){

  return (

      Number(amount) >= CONFIG.MIN_AMOUNT

      &&

      diff <= 3

  );

}



function getPriority(diff){

  if(diff<0)

      return 1;

  if(diff===0)

      return 2;

  return 3;

}



function getSendMobile(original){

  if(CONFIG.TEST_MODE)

      return CONFIG.TEST_MOBILE;

  return String(original);

}
function isValidMobile(mobile){

  mobile = String(mobile).replace(/\D/g, "");

  return (
      /^[6-9]\d{9}$/.test(mobile) ||
      /^91[6-9]\d{9}$/.test(mobile)
  );

}


function buildApiUrl(number,message){

  return CONFIG.WHATSAPP_URL

      + "?number="

      + number

      + "&type=text&message="

      + encodeURIComponent(message)

      + "&instance_id="

      + CONFIG.INSTANCE_ID

      + "&access_token="

      + CONFIG.ACCESS_TOKEN;

}



function parseResponse(body){

  try{

      const json = JSON.parse(body);

      return json.status==="success";

  }

  catch(e){

      return body

      .toLowerCase()

      .indexOf("success")>-1;

  }

}



function chunkArray(array,size){

  let result=[];

  for(let i=0;i<array.length;i+=size){

      result.push(

          array.slice(i,i+size)

      );

  }

  return result;

}



function log(message){

  Logger.log(

      Utilities.formatDate(

          new Date(),

          Session.getScriptTimeZone(),

          "HH:mm:ss"

      )

      +"  "

      +message

  );

}

/******************************************************
 * Oorja Bills ChatGPT Project
 * Message Builder
 * Version : 1.0.0
 ******************************************************/

/**
 * Build WhatsApp Message
 * bills = Array of bills (Maximum 10)
 */

function buildWhatsAppMessage(officerName, bills, partNo, totalParts) {

  let totalAmount = 0;

  let message =
`⚡ *Electricity Bill Payment Reminder* ⚡

Dear *${officerName}* 👤,

The following electricity bills are pending for your approval:

`;

  bills.forEach(function(bill, index) {

    totalAmount += Number(bill.amount);

    const due = formatDate(bill.dueDate);

    let status = "";

    if (bill.diff < 0) {
      status = "🔴 *OVERDUE-Immediate Action Required*";
    } else if (bill.diff === 0) {
      status = "🟠 *DUE TODAY*";
    } else {
      status = "🟢 Due in " + bill.diff + " day(s)";
    }

    message +=
`${index + 1}.
📌 *Can. No.* : ${bill.caNo}
📅 *Bill Due Date* : ${due}
💰 *Gross Amount* : ₹${formatAmount(bill.amount)}
${status}

`;

  });

  message +=
`━━━━━━━━━━━━━━━━━━━━

📊 *Total Pending Bills* : ${bills.length}
💰 *Total Amount* : ₹${formatAmount(totalAmount)}

`;

  if (totalParts > 1) {

    message +=
`📨 *Message ${partNo} of ${totalParts}*

`;

  }

  message +=
`The above electricity bills are pending in the Oorja Portal and require your approval. 🧾

Kindly approve the bills immediately to avoid delay ⏳.

⚠️ *Note:*
Please ensure timely bill processing to avoid LPS.

The Site Incharge will be responsible for LPS, if any.

🙏 Thanks & Regards,
*BSNL Rajasthan* 📡`;

  return message;

}


/******************************************************
 * Split Bills
 * Maximum 10 bills in one WhatsApp
 ******************************************************/

function splitBills(bills){

  return chunkArray(

      bills,

      CONFIG.MAX_BILLS_PER_MESSAGE

  );

}


/******************************************************
 * Build Complete WhatsApp Packets
 *
 * Returns:
 *
 * [
 *   {
 *      message:"",
 *      bills:[]
 *   }
 * ]
 ******************************************************/

function buildPackets(officerName, bills){

  const packets=[];

  const chunks=splitBills(bills);

  chunks.forEach(function(chunk,index){

      packets.push({

          bills:chunk,

          message:buildWhatsAppMessage(

              officerName,

              chunk,

              index+1,

              chunks.length

          )

      });

  });

  return packets;

}