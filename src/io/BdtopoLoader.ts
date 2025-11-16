import { readFileSync } from 'fs';
import { Graph } from '../model/Graph';
import { LineString } from 'geojson';

/**
 * Load graph from BDTOPO troncon_de_route.
 * 
 * @see https://geoservices.ign.fr/documentation/services/services-geoplateforme/diffusion
 */
export class BdtopoLoader {

    /**
     * Read a troncon_de_route.geojson file as a graph.
     */
    async loadGraphFromFile(inputPath: string): Promise<Graph> {
        const g = new Graph();
        const featureCollection = JSON.parse(readFileSync(inputPath, 'utf-8'));

        for (const feature of featureCollection.features) {

            /* retrieve geometry */
            const geometry: LineString = feature.geometry;
            if (!geometry || geometry.coordinates.length < 2) {
                continue;
            }

            /* create start and end vertex */
            const startVertex = g.getOrCreateVertex(geometry.coordinates[0]);
            const endVertex = g.getOrCreateVertex(
                geometry.coordinates[geometry.coordinates.length - 1]
            );

            /* split edge creating direct and reverse way */
            const allowedDirection = feature.properties.sens_de_circulation;
            const baseId = feature.properties.cleabs_ge;

            // direct
            if (allowedDirection === "Double sens" || allowedDirection === "Sens direct") {
                const directEdge = g.createEdge(startVertex, endVertex, baseId + "-direct");

                const fixedCoordinates = [...geometry.coordinates];
                fixedCoordinates[0] = startVertex.coordinate;
                fixedCoordinates[fixedCoordinates.length - 1] = endVertex.coordinate;

                directEdge.setGeometry({
                    type: "LineString",
                    coordinates: fixedCoordinates
                });
            }


            // reverse
            if (allowedDirection === "Double sens" || allowedDirection === "Sens inverse") {
                const reverseEdge = g.createEdge(endVertex, startVertex, baseId + "-reverse");

                const fixedCoordinates = [...geometry.coordinates];
                fixedCoordinates[0] = endVertex.coordinate;
                fixedCoordinates[fixedCoordinates.length - 1] = startVertex.coordinate;

                reverseEdge.setGeometry({
                    type: "LineString",
                    coordinates: fixedCoordinates
                });
            }
        }

        return g;
    }

}
