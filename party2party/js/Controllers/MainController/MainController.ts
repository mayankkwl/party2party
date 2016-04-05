module MainController {
    interface IMainController {
        $inject: Array<string>
    }
    /**
     * MainController
     */
    class MainController implements IMainController {
        public $inject = ["$scope", "DataProvider"];
        public data: Object = {};
        private personGraph: Graph.D3Graph;
        constructor($scope, DataProvider) {
            var graphProperties: Graph.IGraphProperties = <Graph.IGraphProperties>{};
            this.data = DataProvider;
            graphProperties.Height = 800;
            graphProperties.Width = 1300;
            graphProperties.charge = -120;
            graphProperties.linkDistance = 150;
            graphProperties.chargeDistance = 90;
            this.personGraph = new Graph.D3Graph("#svgCanvas");
            this.personGraph.loadGraph(graphProperties);
            var _objData = this.data[0];
            _objData=jQuery.extend({},_objData);
            this.personGraph.updateGraph(_objData);
        }
        public loadData(person) {
            console.log(person)
            person=jQuery.extend({},person);
            console.log(person)
            this.personGraph.updateGraph(person);
        }
    }
    angular.module("MultiObjectPOC")
        .controller("MainController", MainController);
}