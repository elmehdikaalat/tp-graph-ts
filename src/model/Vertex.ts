import Coordinate from "./Coordinate";
import { Edge } from "./Edge";

/**
 * A vertex in a graph with an id and a location
 */
export class Vertex {
    /**
     * identifier of the vertex (debug purpose)
     */
    id: string;
    /**
     * location of the vertex
     */
    coordinate: Coordinate;

	/**
	 * dijkstra - cost to reach a vertex (Number.POSITIVE_INFINITY if the vertex is not reached)
	 */
	cost: number;
	/**
	 * dijkstra - incoming edge with the best cost
	 */
	reachingEdge: Edge|null;
	/**
	 * dijkstra - indicates if the vertex is visited
	 */
    visited: boolean;

	_inEdges: Edge[] = [];
	_outEdges: Edge[] = [];

}
