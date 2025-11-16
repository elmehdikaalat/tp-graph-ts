import { Graph } from "../model/Graph";
import { Vertex } from "../model/Vertex";
import { Edge } from "../model/Edge";
import { PathNode } from "./PathNode";
import { RouteNotFound } from "../errors/RouteNotFound";

export class PathTree {

    private nodes: Map<Vertex, PathNode> = new Map();
    private origin: Vertex;


    constructor(private graph: Graph, origin: Vertex) {
        this.origin = origin;
        this.init(origin);
    }

    /**
     * Initialise tous les PathNode pour chaque sommet du graphe
     */
    private init(origin: Vertex) {
        this.nodes = new Map<Vertex, PathNode>();

        // Création d’un PathNode par Vertex
        for (const vertex of this.graph.vertices) {
            const node = new PathNode();
            if (vertex === origin) {
                node.cost = 0.0;
            }
            this.nodes.set(vertex, node);
        }

        // Exécution complète de Dijkstra
        this.runDijkstra(origin);
    }

    /**
     * Récupère le PathNode d’un sommet
     */
    getNode(vertex: Vertex): PathNode {
        const node = this.nodes.get(vertex);
        if (!node) {
            throw new Error(`PathNode not found for vertex ${vertex.id}`);
        }
        return node;
    }

    /**
     * Exécute Dijkstra en utilisant PathNode
     */
    private runDijkstra(origin: Vertex) {

        let current: Vertex | null;

        while ((current = this.findNextVertex()) !== null) {
            const currentNode = this.getNode(current);

            for (const out of this.graph.getOutEdges(current)) {
                const tgt = out.getTarget();
                const tgtNode = this.getNode(tgt);

                const newCost = currentNode.cost + out.getLength();

                if (newCost < tgtNode.cost) {
                    tgtNode.cost = newCost;
                    tgtNode.reachingEdge = out;
                }
            }

            currentNode.visited = true;
        }
    }

    /**
     * Sélectionne le prochain sommet non visité avec le plus petit coût
     */
    private findNextVertex(): Vertex | null {
        let best: Vertex | null = null;

        for (const v of this.graph.vertices) {
            const node = this.getNode(v);

            if (node.visited) continue;
            if (node.cost === Number.POSITIVE_INFINITY) continue;

            if (!best || node.cost < this.getNode(best).cost) {
                best = v;
            }
        }

        return best;
    }

    /**
     * Reconstruit le chemin (liste d’arcs) entre origin -> destination
     */
    getPath(destination: Vertex): Edge[] {

        const destNode = this.getNode(destination);

        if (destNode.cost === Number.POSITIVE_INFINITY) {
            throw new RouteNotFound(
                `no route found from '${this.origin.id}' to '${destination.id}'`
            );
        }


        const edges: Edge[] = [];

        let e = destNode.reachingEdge;

        while (e) {
            edges.push(e);
            const src = e.getSource();
            e = this.getNode(src).reachingEdge;
        }

        return edges.reverse();
    }
}
