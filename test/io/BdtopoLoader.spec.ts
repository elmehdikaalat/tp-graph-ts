import "mocha";
import { expect } from "chai";
import { BdtopoLoader } from "../../src/io/BdtopoLoader";
import { FileStore } from "../../src/io/FileStore";

const fileStore = new FileStore();
const loader = new BdtopoLoader();

describe("test RoutingService", () => {

    describe("test loadGraphFromFile with bdtopo-loray/troncon_de_route.geojson ...", async () => {

        const graph = await loader.loadGraphFromFile(fileStore.getAbsolutePath('bdtopo-loray/troncon_de_route.geojson'));

        it("should contains 21437 vertices and 47085 edges", () => {
            expect(graph.vertices.length).to.equal(21437);
            expect(graph.edges.length).to.equal(47085);
        });

        it("should produce valid vertices with an id and 2D coordinates", () => {
            for (const vertex of graph.vertices) {
                expect(vertex.id).to.be.not.empty;
                // check 2D coordinates
                expect(vertex.coordinate).to.be.not.null;
                expect(vertex.coordinate.length).to.equal(2);
            }
        });

        it("should produce valid edges with a positive length", () => {
            for (const edge of graph.edges) {
                // check id
                expect(edge.id).to.be.not.empty;

                // check 2D coordinates
                expect(edge.getSource()).to.be.not.null;
                expect(edge.getTarget()).to.be.not.null;

                // length is positive
                const length = edge.getLength();
                expect(length).to.be.greaterThan(0.0);
            }
        });


        it("should produce edges with startPoint and endPoint coordinates matching vertex", () => {
            for (const edge of graph.edges) {
                const geometry = edge.getGeometry();

                const startCoordinate = geometry.coordinates[0];
                expect(startCoordinate).to.deep.equal(edge.getSource().coordinate);

                const endCoordinate = geometry.coordinates[geometry.coordinates.length - 1];
                expect(endCoordinate).to.deep.equal(edge.getTarget().coordinate);
            }
        });


    });

});
