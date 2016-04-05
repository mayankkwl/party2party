var Graph;
(function (Graph) {
    var D3Graph = (function () {
        function D3Graph(selector) {
            this.seletor = selector;
        }
        D3Graph.prototype.loadGraph = function (options) {
            options.charge = options.charge || -30;
            options.linkDistance = options.linkDistance || 150;
            this.svg = d3.select("#svgCanvas").append("svg");
            this.svg.attr({
                width: options.Width,
                height: options.Height
            });
            this.force = d3.layout.force();
            this.force.size([options.Width, options.Height]);
            this.force.linkDistance(options.linkDistance);
            this.force.charge(options.charge);
            this.force.gravity(0);
            if (options.chargeDistance)
                this.force.chargeDistance(options.chargeDistance);
        };
        D3Graph.prototype.updateGraph = function (data) {
            data.children.forEach(function (_child) {
                delete _child.children;
            });
            data.type = "parent";
            var _nodes = this.flatten(data);
            var _links = d3.layout.tree().links(_nodes);
            console.log(_nodes);
            this.force
                .nodes(_nodes)
                .links(_links)
                .start();
            var _node = this.svg.selectAll("circle.node")
                .data(_nodes);
            var _link = this.svg.selectAll("line.link")
                .data(_links, function (d) { return d.target.id; });
            _link
                .enter()
                .insert("line", ".node")
                .attr("class", "link")
                .attr({
                x1: function (d) { return d.source.x; },
                y1: function (d) { return d.source.y; },
                x2: function (d) { return d.target.x; },
                y2: function (d) { return d.target.y; }
            });
            _link.exit().remove();
            _node
                .enter()
                .append("circle")
                .attr({
                "class": function (d) { return d.type == "parent" ? "parent node" : "node"; },
                "cx": function (d) { return d.x; },
                "cy": function (d) { return d.y; },
                "r": function (d) { return 15; }
            })
                .call(this.force.drag);
            _node
                .exit()
                .remove();
            var _nodeLabel = this.svg.selectAll(".nodelabel")
                .data(_nodes);
            _nodeLabel.enter()
                .append("text")
                .attr({
                x: function (d) { return d.x; },
                y: function (d) { return d.y; },
                class: "nodelabel"
            })
                .text(function (d) { return d.name; });
            _nodeLabel.exit().remove();
            this.force.on("tick", function () {
                _link.attr({
                    x1: function (d) { return d.source.x; },
                    y1: function (d) { return d.source.y; },
                    x2: function (d) { return d.target.x; },
                    y2: function (d) { return d.target.y; }
                });
                _node.attr({
                    "cx": function (d) { return d.x; },
                    "cy": function (d) { return d.y; }
                });
                _nodeLabel.attr({
                    x: function (d) { return d.x; },
                    y: function (d) { return d.y; }
                });
            });
        };
        D3Graph.prototype.clearGraph = function () {
        };
        D3Graph.prototype.flatten = function (root) {
            var nodes = [], i = 0;
            function recurse(node) {
                if (node.children)
                    node.size = node.children.reduce(function (p, v) { return p + recurse(v); }, 0);
                if (!node.id)
                    node.id = ++i;
                nodes.push(node);
                return node.size;
            }
            root.size = recurse(root);
            return nodes;
        };
        return D3Graph;
    }());
    Graph.D3Graph = D3Graph;
})(Graph || (Graph = {}));
//# sourceMappingURL=Graph.js.map