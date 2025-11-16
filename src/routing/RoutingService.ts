import { Vertex } from "../model/Vertex";
import { Graph } from "../model/Graph";
import { Edge } from "../model/Edge";
import { RouteNotFound } from "../errors/RouteNotFound";

/**
 * Find routes using Dijkstra's algorithm.
 * 
 * @see https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
 */
export class RoutingService {

    constructor(
        private graph: Graph
    ) {

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

            // until the destination is reached...
            if (destination.cost != Number.POSITIVE_INFINITY) {
                return this.buildRoute(destination);
            }
        }

        throw new RouteNotFound(`no route found from '${origin.id}' to '${destination.id}'`);
    }

    /**
     * Prepare the graph to find a route from an origin.
     */
    initGraph(origin: Vertex) {
        for (let vertex of this.graph.vertices) {
            vertex.cost = origin == vertex ? 0.0 : Number.POSITIVE_INFINITY;
            vertex.reachingEdge = null;
            vertex.visited = false;
        }
    }

    /**
     * Explores out edges for a given vertex and try to reach vertex with a better cost.
     */
    private visit(vertex: Vertex) {
        for (const outEdge of this.graph.getOutEdges(vertex)) {
            const reachedVertex = outEdge.getTarget();
            /*
             * Test if reachedVertex is reached with a better cost.
             * (Note that the cost is POSITIVE_INFINITY for unreached vertex)
             */
            const newCost = vertex.cost + outEdge.getLength();
            if (newCost < reachedVertex.cost) {
                reachedVertex.cost = newCost;
                reachedVertex.reachingEdge = outEdge;
            }
        }
        // mark vertex as visited
        vertex.visited = true;
    }

    /**
     * Find the next vertex to visit. With Dijkstra's algorithm, 
     * it is the nearest vertex of the origin that is not already visited.
     */
    findNextVertex(): Vertex | null {
        let candidate: Vertex | null = null;
        for (const vertex of this.graph.vertices) {
            // already visited?
            if (vertex.visited) {
                continue;
            }
            // not reached?
            if (vertex.cost == Number.POSITIVE_INFINITY) {
                continue;
            }
            // nearest from origin?
            if (candidate == null || vertex.cost < candidate.cost) {
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

        for (
            let current = destination.reachingEdge;
            current != null;
            current = current.getSource().reachingEdge
        ) {
            edges.push(current);
        }

        return edges.reverse();
    }

}
