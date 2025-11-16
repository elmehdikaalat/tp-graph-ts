import { Edge } from "../src/model/Edge";
import { Graph } from "../src/model/Graph";
import { Vertex } from "../src/model/Vertex";

/**
 * Create a sample graph
 */
export function createTestGraph01(): Graph {
	const g = new Graph();

	const a = new Vertex();
	a.id = "a";
	a.coordinate = [0.0, 0.0];
	g.vertices.push(a);

	const b = new Vertex();
	b.id = "b";
	b.coordinate = [1.0, 0.0];
	g.vertices.push(b);

	const c = new Vertex();
	c.id = "c";
	c.coordinate = [2.0, 0.0];
	g.vertices.push(c);

	const d = new Vertex();
	d.id = "d";
	d.coordinate = [1.0, 1.0];
	g.vertices.push(d);

	const ab = new Edge(a, b);
	ab.id = "ab";
	g.edges.push(ab);

	const bc = new Edge(b, c);
	bc.id = "bc";
	g.edges.push(bc);

	const ad = new Edge(a, d);
	ad.id = "ad";
	g.edges.push(ad);

	return g;
}
