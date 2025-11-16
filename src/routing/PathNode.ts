import { Edge } from "../model/Edge";

export class PathNode {
    cost: number = Number.POSITIVE_INFINITY;
    reachingEdge: Edge | null = null;
    visited: boolean = false;
}
