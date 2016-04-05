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
            graphProperties.onClickHandler=this.loadData;
            this.personGraph = new Graph.D3Graph("#svgCanvas");
            this.personGraph.loadGraph(graphProperties);
            var _objData = this.data[0];
            _objData=jQuery.extend({},_objData);
            // this.personGraph.updateGraph(_objData);
        }
        public loadData(person) {
			var _nodes=this.data.nodes.filter((_n)=>{
				//Filter nodes with given parent.
				return _n.parent==person.id || _n.id==person.id;
			});
			
			var _nodeList=_nodes.map((_n)=>{
				return _n.id
			});
			var _links=this.data.nodes.filter((_l)=>{
				return _nodeList.indexOf(_l.source)!=-1 && _nodeList.indexOf(_l.target)!=-1
			});
			
            this.personGraph.updateGraph({
				nodes:_nodes,
				links:_links
			});
        }
    }
    angular.module("MultiObjectPOC")
        .controller("MainController", MainController);
}
