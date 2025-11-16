import { Vertex } from "../model/Vertex";
import { Graph } from "../model/Graph";
import { Edge } from "../model/Edge";
import { RouteNotFound } from "../errors/RouteNotFound";
import { PathNode } from "./PathNode";

/**
 * Find routes using Dijkstra's algorithm.
 * 
 * @see https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
 */
export class RoutingService {

    nodes: Map<Vertex, PathNode>;


    constructor(private graph: Graph) {
        this.nodes = new Map<Vertex, PathNode>();
    }

    /**
     * Find a route between an origin and a destination
     */
    findRoute(origin: Vertex, destination: Vertex): Edge[] {
        // prepare graph for the visit
        this.initGraph(origin);

        // visit all vertices
        let current: Vertex | null;
        while ((current = this.findNextVertex()) != null) {
            this.visit(current);

            if (this.getNode(destination).cost !== Number.POSITIVE_INFINITY) {
                return this.buildRoute(destination);
            }

        }

        throw new RouteNotFound(`no route found from '${origin.id}' to '${destination.id}'`);
    }

    /**
     * Prepare the graph to find a route from an origin.
     */
    initGraph(origin: Vertex) {
        this.nodes = new Map<Vertex, PathNode>();

        for (const vertex of this.graph.vertices) {
            const node = new PathNode();
            if (vertex === origin) {
                node.cost = 0.0;
            }
            this.nodes.set(vertex, node);
        }
    }


    /**
     * Explores out edges for a given vertex and try to reach vertex with a better cost.
     */
    private visit(vertex: Vertex) {
        const currentNode = this.getNode(vertex);

        for (const outEdge of this.graph.getOutEdges(vertex)) {
            const reachedVertex = outEdge.getTarget();
            const reachedNode = this.getNode(reachedVertex);

            const newCost = currentNode.cost + outEdge.getLength();
            if (newCost < reachedNode.cost) {
                reachedNode.cost = newCost;
                reachedNode.reachingEdge = outEdge;
            }
        }

        currentNode.visited = true;
    }


    /**
     * Find the next vertex to visit. With Dijkstra's algorithm, 
     * it is the nearest vertex of the origin that is not already visited.
     */
    findNextVertex(): Vertex | null {
        let candidate: Vertex | null = null;

        for (const vertex of this.graph.vertices) {
            const node = this.getNode(vertex);

            if (node.visited) continue;
            if (node.cost === Number.POSITIVE_INFINITY) continue;

            if (!candidate || node.cost < this.getNode(candidate).cost) {
                candidate = vertex;
            }

        }

        return candidate;
    }


    /**
     * Build route to the reached destination.
     */
    private buildRoute(destination: Vertex): Edge[] {
        const edges: Edge[] = [];
        let currentEdge = this.getNode(destination).reachingEdge;

        while (currentEdge != null) {
            edges.push(currentEdge);
            const source = currentEdge.getSource();
            currentEdge = this.getNode(source).reachingEdge;
        }

        return edges.reverse();
    }


    private getNode(vertex: Vertex): PathNode {
        const node = this.nodes.get(vertex);
        if (!node) {
            throw new Error("PathNode not found for vertex " + vertex.id);
        }
        return node;
    }


}
