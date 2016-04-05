var MainController;
(function (MainController_1) {
    var MainController = (function () {
        function MainController($scope, DataProvider) {
            this.$inject = ["$scope", "DataProvider"];
            this.data = {};
            var graphProperties = {};
            this.data = DataProvider;
            graphProperties.Height = 800;
            graphProperties.Width = 1300;
            graphProperties.charge = -120;
            graphProperties.linkDistance = 150;
            graphProperties.chargeDistance = 90;
            this.personGraph = new Graph.D3Graph("#svgCanvas");
            this.personGraph.loadGraph(graphProperties);
            var _objData = this.data[0];
            _objData = jQuery.extend({}, _objData);
            this.personGraph.updateGraph(_objData);
        }
        MainController.prototype.loadData = function (person) {
            console.log(person);
            person = jQuery.extend({}, person);
            console.log(person);
            this.personGraph.updateGraph(person);
        };
        return MainController;
    }());
    angular.module("MultiObjectPOC")
        .controller("MainController", MainController);
})(MainController || (MainController = {}));
//# sourceMappingURL=MainController.js.map