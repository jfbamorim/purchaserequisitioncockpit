sap.ui.define([], function(){
    "use strict";
    return {
        statusText: function(sStatus){
            var mMap = {"N": "Aberta", "B": "Em processamento", "A": "Aprovada", "G": "Convertida em PO", "S": "Suspensa", "X": "Cancelada"};
            return mMap[sStatus] || sStatus;
        },

        priorityText: function(sPriority){
            var mMap = {"1": "Alta", "2": "Média", "3": "Baixa"};
            return mMap[sPriority] || sPriority;
        },

        formatStatusState: function(sStatus){
            switch(sStatus){
                case "N": return "None";
                case "B": return "Information";
                case "A": return "Success";
                case "G": return "Success";
                case "S": return "Warning";
                case "X": return "Error";
                default:  return "None";
            }
        },

        formatDate: function(dDate) {
            if (!dDate) return "";

            var oDate = new Date(dDate);
            var sDay = String(oDate.getDate()).padStart(2, "0");
            var sMonth = String(oDate.getMonth() + 1).padStart(2, "0");
            var sYear = oDate.getFullYear();
            return sDay + "/" + sMonth + "/" + sYear;
        }
    }
});