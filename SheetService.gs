/******************************************************
 * Oorja Bills ChatGPT Project
 * SheetService.gs
 * Version : 1.0.1
 * Client  : BSNL Rajasthan
 * Author  : Amit Kumar + ChatGPT
 ******************************************************/

/**
 * Read all data from OBE sheet
 */
function getBillData() {

  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) return [];

  return sheet.getRange(2, 1, lastRow - 1, 7).getValues();
}


/**
 * Convert sheet rows into bill objects
 */
function prepareBills() {

  const rows = getBillData();
  const bills = [];

  rows.forEach(function(row, index){

    const mobile  = String(row[0]).trim();
    const officer = String(row[1]).trim();
    const dueDate = row[2];
    const caNo    = String(row[3]).trim();
    const amount  = Number(row[4]);

    bills.push({

      rowNumber : index + 2,
      mobile    : mobile,
      officer   : officer,
      dueDate   : dueDate,
      caNo      : caNo,
      amount    : amount,
      diff      : getDiffDays(dueDate),
      priority  : getPriority(getDiffDays(dueDate))

    });

  });

  return bills;

}


/**
 * Return only eligible bills
 */
function getEligibleBills(){

  return prepareBills().filter(function(bill){

    return (

      isValidMobile(bill.mobile) &&
      bill.caNo !== "" &&
      isEligible(bill.amount, bill.diff)

    );

  });

}


/**
 * Group Bills by Mobile Number
 */
function groupBillsByMobile(){

  const grouped = {};
  const bills = getEligibleBills();

  bills.forEach(function(bill){

    if(!grouped[bill.mobile]){

      grouped[bill.mobile] = {

        officer : bill.officer,
        bills   : []

      };

    }

    grouped[bill.mobile].bills.push(bill);

  });

  // Sort by priority then due date
  Object.keys(grouped).forEach(function(mobile){

    grouped[mobile].bills.sort(function(a,b){

      if(a.priority !== b.priority){
        return a.priority - b.priority;
      }

      return new Date(a.dueDate) - new Date(b.dueDate);

    });

  });

  return grouped;

}


/**
 * Limit Recipients
 */
function getRecipients(){

  const grouped = groupBillsByMobile();
  const mobiles = Object.keys(grouped).slice(0, CONFIG.MAX_RECIPIENTS);

  const recipients = [];

  mobiles.forEach(function(mobile){

    recipients.push({

      mobile  : mobile,
      officer : grouped[mobile].officer,
      bills   : grouped[mobile].bills

    });

  });

  return recipients;

}
