sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "purchaserequestlist/model/formatter"
], function(Controller, formatter) {
    "use strict";
    return Controller.extend("purchaserequestlist.controller.Detail", {
        formatter: formatter,  

        onInit: function() {  
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("detail").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function(oEvent) {
            var sBanfn = oEvent.getParameter("arguments").Banfn;
            var sPath = "/PurchaseRequisitionHeaderSet(" + sBanfn + ")";
            
            this.getView().bindElement({
                path: sPath,
                parameters: {
                    expand: "ToItems"
                }
            });
        },

        onNavBack: function() {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        }
    });
});