import { Vertex } from "../model/Vertex";
import { Edge } from "../model/Edge";
import { PathTree } from "./PathTree";
import { Graph } from "../model/Graph";

export class RoutingService {

    constructor(private graph: Graph) {}

    findRoute(origin: Vertex, destination: Vertex): Edge[] {
        const tree = new PathTree(this.graph, origin);
        return tree.getPath(destination);
    }
}
