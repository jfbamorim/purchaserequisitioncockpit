sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "purchaserequestlist/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller, formatter, Filter, FilterOperator) {
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
            console.log("entrou")

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
        }
    });
});
