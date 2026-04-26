# Purchase Requisition Cockpit

A full-stack SAP Fiori application for managing Purchase Requisitions (MM module), built with SAPUI5 freestyle on the frontend and SAP Gateway (OData v2) on the backend.

---

## Overview

This application covers the complete CRUDQ lifecycle of Purchase Requisitions in an SAP on-premise environment. It was developed as a learning project to master end-to-end Fiori development using the classic Gateway approach (SEGW + DPC_EXT), without RAP or BTP dependencies.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | SAPUI5 Freestyle (MVC pattern) |
| Backend | SAP Gateway — SEGW / DPC_EXT |
| Data | Custom Z-tables (ZMM_EBAN, ZMM_EBAN_ITEM) |
| Protocol | OData v2 |
| Dev Tools | VSCode + SAP Fiori Tools, SAP GUI, Eclipse ADT |
| System | SAP S/4HANA 1909 On-Premise |

---

## Features

### List Report
- Display all Purchase Requisitions in a responsive table
- Filter by: PR Number, Requester, Plant, Purchase Org., Priority (multi-select), Status (multi-select)
- Status displayed with color-coded badges (green, orange, red, grey)
- Priority and Status shown as human-readable labels via formatters
- Formatted creation dates (dd/MM/yyyy)
- Navigate to PR detail on row press

### Object Page (Detail)
- Display PR header information (General Information section)
- Display PR line items in a table (Items section)
- Items loaded via OData navigation property `ToItems` using `$expand`
- Back navigation to List Report

### Planned (in progress)
- Create PR with header + items
- Edit PR
- Delete PR
- State transitions (Submit, Approve, Suspend, Cancel)

---

## Project Structure

```
webapp/
├── controller/
│   ├── View1.controller.js       # List Report controller
│   └── Detail.controller.js      # Object Page controller
├── view/
│   ├── App.view.xml              # Root shell view
│   ├── View1.view.xml            # List Report view
│   └── Detail.view.xml           # Object Page view
├── model/
│   ├── formatter.js              # Formatters (date, status, priority)
│   └── models.js                 # Device model
├── i18n/
│   └── i18n.properties           # Internationalisation
├── css/
│   └── style.css                 # Custom styles
├── Component.js                  # UI5 Component
└── manifest.json                 # App descriptor
```

---

## Backend Structure

All backend objects are organised under the package `ZMM_PR`.

### Database Tables

| Table | Description |
|---|---|
| `ZMM_EBAN` | Purchase Requisition Header |
| `ZMM_EBAN_ITEM` | Purchase Requisition Line Items |

### OData Service

| Object | Name |
|---|---|
| SEGW Project | `ZMM_PUR_DLA098_PR` |
| Service Name | `ZMM_PUR_DLA098_PR_SRV` |
| MPC Extension | `ZCL_ZMM_PUR_DLA098_PR_MPC_EXT` |
| DPC Extension | `ZCL_ZMM_PUR_DLA098_PR_DPC_EXT` |

### Entity Types & Sets

| EntityType | EntitySet | Key |
|---|---|---|
| PurchaseRequisitionHeader | PurchaseRequisitionHeaderSet | Banfn |
| PurchaseRequisitionItem | PurchaseRequisitionItemSet | Banfn + Bnfpo |

### Implemented Methods (DPC_EXT)

| Method | Operation | Description |
|---|---|---|
| PURCHASEREQUISITIONHEADERSET_GET_ENTITYSET | Q | List with filter support |
| PURCHASEREQUISITIONHEADERSET_GET_ENTITY | R | Read single header by key |
| PURCHASEREQUISITIONITEMSET_GET_ENTITYSET | Q | List items by PR (navigation + filter) |
| PURCHASEREQUISITIONITEMSET_GET_ENTITY | R | Read single item by composite key |

---

## PR Status Values

| Code | Label | Color |
|---|---|---|
| N | Open | Grey (Neutral) |
| B | In Processing | Blue (Information) |
| A | Approved | Green (Success) |
| G | Converted to PO | Green (Success) |
| S | Suspended | Orange (Warning) |
| X | Cancelled | Red (Error) |

---

## Getting Started

### Prerequisites
- Node.js >= 16
- SAP Fiori Tools (`@sap/generator-fiori`)
- Access to SAP S/4HANA on-premise system

### Install dependencies
```bash
npm install
```

### Run locally
```bash
npm start
```

The app will be available at `http://localhost:8080`.

### Backend connection
The proxy is configured in `ui5.yaml` to point to the SAP backend:
```yaml
backend:
  - path: /sap
    url: http://<your-sap-host>:<port>
```

---

## Business Context

This application is part of a self-directed learning project covering the full MM Purchasing cycle:

```
Purchase Requisition (PR)  ← this app
    → Purchase Order (PO)
        → Goods Receipt (GR)
            → Invoice Verification
```

Each document in the cycle will be developed as a separate Fiori app, sharing the same architectural pattern.

---

## License

This project is for educational purposes only.
