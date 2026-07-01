# ⚡ OBMS – Oorja Bills Management System

> **Production Verified | Version 1.1.1**

A Google Apps Script based automation system developed for **BSNL Rajasthan** to automate Electricity Bill WhatsApp reminders through the **AurBhejo WhatsApp API**.

---

## 📌 Project Overview

OBMS (Oorja Bills Management System) is an enterprise automation solution that monitors pending electricity bills from Google Sheets, intelligently groups them officer-wise, and sends WhatsApp reminders automatically.

The system significantly reduces manual effort, improves timely approvals, minimizes Late Payment Surcharge (LPS), and maintains a complete execution audit trail.

---

## 🎯 Objectives

- Automate Electricity Bill Reminder Process
- Reduce Manual Follow-up
- Improve Timely Bill Approval
- Avoid Late Payment Surcharge (LPS)
- Maintain Execution Logs
- Generate Daily WhatsApp Summary

---

# 🏢 Client

**BSNL Rajasthan**

---

# 👨‍💻 Developed By

**Amit Kumar**

Assistant Director (Enterprise Business)

OSD to CGMT

BSNL Rajasthan

---

# 🤝 Technical Assistance

OpenAI ChatGPT

---

# 🚀 Current Release

| Item | Details |
|------|---------|
| Project | OBMS |
| Version | **1.1.1** |
| Status | ✅ Production Verified |
| Platform | Google Apps Script |
| Repository | GitHub |

---

# ✨ Features

- ✅ Google Sheets Integration
- ✅ WhatsApp Reminder Automation
- ✅ Officer-wise Bill Grouping
- ✅ Maximum 10 Bills per WhatsApp
- ✅ TEST Mode
- ✅ PRODUCTION Mode
- ✅ Daily Execution Summary
- ✅ Execution Log
- ✅ Queue ID Storage
- ✅ Custom Google Sheets Menu
- ✅ Daily Trigger Support
- ✅ API Response Logging
- ✅ Modular Architecture

---

# 🏗 System Architecture

```
Google Sheet
        │
        ▼
 Read Eligible Bills
        │
        ▼
 Group Bills Officer-wise
        │
        ▼
 Build WhatsApp Message
        │
        ▼
 AurBhejo WhatsApp API
        │
        ▼
 Update Google Sheet
        │
        ▼
 Execution Log
        │
        ▼
 Daily Summary
```

---

# 📂 Project Structure

```
OBMS/

├── Code.gs
├── SheetService.gs
├── MessageBuilder.gs
├── WhatsAppService.gs
├── Main.gs
├── SummaryService.gs
├── MenuService.gs
├── TriggerService.gs
│
├── README.md
├── CHANGELOG.md
└── LICENSE
```

---

# 📱 WhatsApp Features

- Officer Name
- Pending Bills
- CA Number
- Due Date
- Gross Amount
- Total Pending Bills
- Total Amount
- Overdue Indicator
- Due Today Indicator
- Multi-message Support

---

# ⚙ Configuration

Configuration is maintained inside:

```
Code.gs
```

Main Parameters

- Sheet Name
- Test Mode
- Dry Run
- API URL
- Instance ID
- Access Token
- Maximum Recipients
- Maximum Bills per Message
- Delay Between Messages
- Summary Mobile Number

---

# 📊 Google Sheet Format

| Column | Description |
|---------|-------------|
| Mobile | Officer Mobile |
| Name | Officer Name |
| Bill Due Date | Due Date |
| CA No | Consumer Number |
| Amount | Gross Amount |
| Delivery Status | Success / Failed |
| API Response | Complete API Response |
| Message ID | Queue ID |

---

# 📋 Modules

## Code.gs

Configuration & Utility Functions

---

## SheetService.gs

- Read Sheet
- Validate Data
- Group Bills
- Filter Eligible Records

---

## MessageBuilder.gs

Creates Professional WhatsApp Messages.

---

## WhatsAppService.gs

- Send WhatsApp
- Parse API Response
- Store Queue ID

---

## Main.gs

Project Execution Controller

---

## SummaryService.gs

- Daily Summary
- Execution Log

---

## MenuService.gs

Google Sheets Custom Menu

---

## TriggerService.gs

Daily Automatic Execution

---

# 🧪 TEST Mode

```javascript
TEST_MODE = true
DRY_RUN = false
```

All WhatsApp messages are sent only to the configured Test Mobile Number.

---

# 🚀 Production Mode

```javascript
TEST_MODE = false
DRY_RUN = false
```

Messages are delivered to actual officers.

---

# 📈 Execution Log

Every execution stores:

- Date
- Time
- Version
- Total Recipients
- Total Bills
- Messages Sent
- Success Count
- Failed Count
- Duration

---

# 🔐 Security

Current Version

- API Credentials stored inside Code.gs

Future Version

- Google Script Properties
- Secure Configuration

---

# 📅 Version History

| Version | Description |
|----------|-------------|
| 1.0 | Initial Development |
| 1.1 | Modular Architecture |
| 1.1.1 | Production Verified |
| 1.2 | Planned LTS |
| 2.0 | Enterprise Edition |

---

# 🚀 Future Roadmap

- HTML Dashboard
- Analytics
- Settings Page
- Script Properties
- PDF Reports
- Email Summary
- Multi-Circle Support
- Web Dashboard

---

# 📄 License

Internal Project

Developed for **BSNL Rajasthan**

---

# 🙏 Acknowledgement

This project was developed through close collaboration between **Amit Kumar** and **OpenAI ChatGPT**, combining telecom domain expertise with software engineering practices to build a production-ready automation system.

---

# ⭐ Project Status

> **OBMS Version 1.1.1**
>
> ✅ Production Verified
>
> Ready for Operational Use

---
