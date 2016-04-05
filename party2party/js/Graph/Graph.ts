module Graph {
    export interface IGraphProperties {
        Height: number,
        Width: number,
        charge?: number,
        linkDistance?: number,
        chargeDistance?: number
    }
    interface ID3Graph {
        loadGraph(options: IGraphProperties): void,
        updateGraph(data): void,
        clearGraph(): void
    }

    interface IGraphNode {
        size?: number,
        name?: string,
        id?: number,
        type?: any,
        x?: number,
        y?: number,
        r?: number,
        children?:Array<any>
    }
    interface IGraphLink {
        source?: IGraphNode,
        target?: IGraphNode,
    }
    /**
     * d3Graph
     */
    export class D3Graph implements ID3Graph {
        private seletor: string;
        private force: d3.layout.Force<d3.layout.force.Link<d3.layout.force.Node>, d3.layout.force.Node>
        private svg: d3.Selection<any>;
		private renderAsParent:Function;
        constructor(selector: string) {
            this.seletor = selector;
        }
        public loadGraph(options: IGraphProperties): void {
            options.charge = options.charge || -30;
            options.linkDistance = options.linkDistance || 150;
			this.renderAsParent=options;
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
            if (options.chargeDistance) this.force.chargeDistance(options.chargeDistance);
        }
        public updateGraph(data: IGraphNode): void {
            var _nodes: Array<any> = data.nodes;
            var _links: Array<d3.layout.tree.Link<d3.layout.tree.Node>> = data.links;

            this.force
                .nodes(_nodes)
                .links(_links)
                .start();

            var _node: d3.selection.Update<{}> = this.svg.selectAll("circle.node")
                .data(_nodes);

            var _link: d3.selection.Update<{}> = this.svg.selectAll("line.link")
                .data(_links, (d) => { return d.target.id; });

            _link
                .enter()
                .insert("line", ".node")
                .attr("class", "link")
                .attr({
                    x1: (d: IGraphLink) => { return d.source.x },
                    y1: (d: IGraphLink) => { return d.source.y },
                    x2: (d: IGraphLink) => { return d.target.x },
                    y2: (d: IGraphLink) => { return d.target.y }
                });
            _link.exit().remove();

            _node
                .enter()
                .append("circle")
                .attr({
                    "class": (d: IGraphNode) => { return d.type == "parent" ? "parent node" : "node" },
                    "cx": (d: IGraphNode) => { return d.x },
                    "cy": (d: IGraphNode) => { return d.y },
                    "r": (d: IGraphNode) => { return 15; }
                })
                .call(this.force.drag);
            _node
                .exit()
                .remove();

            var _nodeLabel: d3.selection.Update<any> = this.svg.selectAll(".nodelabel")
                .data(_nodes);

            _nodeLabel.enter()
                .append("text")
                .attr({
                    x: (d) => { return d.x },
                    y: (d) => { return d.y; },
                    class: "nodelabel"
                })
                .text((d: IGraphNode) => { return d.name; });

            _nodeLabel.exit().remove();
			_node.on("click",(d)=>{
				this.renderAsParent();
			});
            this.force.on("tick", () => {
                _link.attr({
                    x1: (d: IGraphLink) => { return d.source.x },
                    y1: (d: IGraphLink) => { return d.source.y },
                    x2: (d: IGraphLink) => { return d.target.x },
                    y2: (d: IGraphLink) => { return d.target.y }
                });
                _node.attr({
                    "cx": (d: IGraphNode) => { return d.x },
                    "cy": (d: IGraphNode) => { return d.y }
                });
                _nodeLabel.attr({
                    x: (d) => { return d.x },
                    y: (d) => { return d.y; }
                });
            });
        }
        public clearGraph(): void {

        }

        // Private methods
        private flatten(root): any[] {
            var nodes = [], i = 0;

            function recurse(node) {
                if (node.children)
                    node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
                if (!node.id)
                    node.id = ++i;
                nodes.push(node);
                return node.size;
            }

            root.size = recurse(root);
            return nodes;
        }
    }
}
