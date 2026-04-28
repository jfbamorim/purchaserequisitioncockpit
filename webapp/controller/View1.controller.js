sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "purchaserequestlist/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    'sap/ui/model/json/JSONModel'
],
function (Controller, formatter, Filter, FilterOperator, Fragment, JSONModel) {
    "use strict";

    return Controller.extend("purchaserequestlist.controller.View1", {
        formatter: formatter,

        onInit: function () {

        },

        onSearch: function(){
            var aFilter = [];
            var sBanfn = this.byId("filterBanfn").getValue();
            var sAfnam = this.byId("filterAfnam").getValue();
            var sReswk = this.byId("filterRsewk").getValue();
            var sEkorg = this.byId("filterEkorg").getValue();
            var sDringlichkeit = this.byId("filterDringlichkeit").getSelectedKeys();
            var sStatu = this.byId("filterStatu").getSelectedKeys();

            if (sBanfn){
                aFilter.push(new Filter("Banfn", FilterOperator.EQ, sBanfn));
            }

            if (sAfnam){
                aFilter.push(new Filter("Afnam", FilterOperator.Contains, sAfnam));
            }

            if (sReswk){
                aFilter.push(new Filter("Reswk", FilterOperator.EQ, sReswk));
            }

            if (sEkorg){
                aFilter.push(new Filter("Ekorg", FilterOperator.EQ, sEkorg));
            }

            if (sDringlichkeit.length > 0){
                var oDringFilter = new Filter({
                    filters: sDringlichkeit.map(function(sKey){
                        return new Filter("Dringlichkeit", FilterOperator.EQ, sKey);
                    }),
                    and: false
                });
                aFilter.push(oDringFilter);
            }

            if (sStatu.length > 0) {
                var oStatuFilter = new Filter({
                    filters: sStatu.map(function(sKey) {
                        return new Filter("Statu", FilterOperator.EQ, sKey);
                    }),
                    and: false
                });
                aFilter.push(oStatuFilter);
            }
            
            var oTable = this.byId("prTable");
            oTable.getBinding("items").filter(aFilter);
        },

        onClear: function(){
            var aFilter = [];

            this.byId("filterBanfn").setValue("");
            this.byId("filterAfnam").setValue("");
            this.byId("filterRsewk").setValue("");
            this.byId("filterEkorg").setValue("");
            this.byId("filterDringlichkeit").setSelectedKeys([]);
            this.byId("filterStatu").setSelectedKeys([]);

            this.byId("prTable").getBinding("items").filter(aFilter);

        },

        onItemPress: function(oEvent) {
            var oItem = oEvent.getParameter("listItem");
            var oCtx = oItem.getBindingContext();
            var sBanfn = oCtx.getProperty("Banfn");
            
            this.getOwnerComponent().getRouter().navTo("detail", {
                Banfn: sBanfn
            });
        },

        onCreatePR: function(){
            var oView = this.getView();

            var oModel = new JSONModel({
                header: {
                    Txz01: "",
                    Bsart: "NB",
                    Reswk: "",
                    Ekorg: "",
                    Dringlichkeit: "",
                    Notes: ""
                },
                plants: [
                    { key: "1000", text: "Plant 1000 — Lisboa" },
                    { key: "2000", text: "Plant 2000 — Porto" },
                    { key: "3000", text: "Plant 3000 — Faro" }
                ],
                purchGroups: [
                    { key: "B01", text: "B01 — Escritório" },
                    { key: "B02", text: "B02 — Informática" },
                    { key: "B03", text: "B03 — Manutenção" },
                    { key: "B04", text: "B04 — Laboratório" }
                ],
                items: [
                ]
            });

            if(!this._oDialog){
                Fragment.load({
                    id: oView.getId(),
                    name: "purchaserequestlist.view.fragments.CreatePRDialog",
                    controller: this
                }).then(function(oDialog){
                    this._oDialog = oDialog;
                    oView.addDependent(this._oDialog);
                    this._oDialog.setModel(oModel, "createModel");
                    this._oDialog.open();
                }.bind(this));
            } else{
                this._oDialog.setModel(oModel, "createModel");
                this._oDialog.open();
            }
        },

        onCancelPR: function() {
            this._oDialog.close();
        },

        onPlantValueHelp: function(){
            var oModel = this._oDialog.getModel("createModel");
            var aPlants = oModel.getProperty("/plants");

            var oSelectDialog = new sap.m.SelectDialog({
                title: "Select Plant",
                items: aPlants.map(function(oPlant) {
                    return new sap.m.StandardListItem({
                        title: oPlant.key,
                        description: oPlant.text
                    });
                }),
                confirm: function(oEvent) {
                    var oSelected = oEvent.getParameter("selectedItem");
                    oModel.setProperty("/header/Reswk", oSelected.getTitle());
                },
                cancel: function() {}
            });

            oSelectDialog.open();
        },

        onPurchaseGroupValueHelp: function(){
            var oModel = this._oDialog.getModel("createModel");
            var aPurchGroup = oModel.getProperty("/purchGroups");

            var oSelectDialog = new sap.m.SelectDialog({
                title: "Select Plant",
                items: aPurchGroup.map(function(aPurchGroup) {
                    return new sap.m.StandardListItem({
                        title: aPurchGroup.key,
                        description: aPurchGroup.text
                    });
                }),
                confirm: function(oEvent) {
                    var oSelected = oEvent.getParameter("selectedItem");
                    oModel.setProperty("/header/Ekorg", oSelected.getTitle());
                },
                cancel: function() {}
            });

            oSelectDialog.open();
        },

        onAddItem: function() {
            var oModel = this._oDialog.getModel("createModel");
            var aItems = oModel.getProperty("/items");
            aItems.push({
                Bnfpo: String((aItems.length + 1) * 10).padStart(5, "0"),
                Txz01: "", Matnr: "", Menge: "", Meins: "",
                Lfdat: "", Kostl: "", Matkl: "", Lifnr: "",
                Preis: "", Waers: ""
            });
            oModel.setProperty("/items", aItems);
        },

        onSubmitPR: function(){
            var oModel = this._oDialog.getModel("createModel");
            var oHeader = oModel.getProperty("/header");
            console.log(oModel.getData());
            var oItems = oModel.getProperty("/items");

            if(!oHeader.Txz01){
                sap.m.MessageToast.show("Description is required.");
                return;
            }

            if (oItems.length === 0) {
                sap.m.MessageToast.show("At least one item is required.");
                return;
            }

            this._createHeader(oHeader, oItems);
        },

        _createHeader: function(oHeader, oItems){
            var oDataModel = this.getView().getModel();
            oDataModel.create("/PurchaseRequisitionHeaderSet", oHeader, {
                success: function(oCreated) {
                    this._createItems(oCreated.Banfn, oItems);
                }.bind(this),
                error: function() {
                    sap.m.MessageToast.show("Error creating PR.");
                }
            });
        },

        _createItems: function(sBanfn, aItems) {
            var oODataModel = this.getView().getModel();
            var iCount = 0;
            aItems.forEach(function(oItem) {
                oItem.Banfn = sBanfn;
                oODataModel.create("/PurchaseRequisitionItemSet", oItem, {
                    success: function() {
                        iCount++;
                        if (iCount === aItems.length) {
                            // Todos os itens criados
                            sap.m.MessageToast.show("PR created successfully.");
                            this._oDialog.close();
                            this.getView().getModel().refresh();
                        }
                    }.bind(this)
                });
            }.bind(this));
        }
    });
});
