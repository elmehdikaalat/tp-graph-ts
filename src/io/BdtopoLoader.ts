import { readFile, readFileSync } from 'fs';
import { Graph } from '../model/Graph';
import { LineString } from 'geojson';
import { Edge } from '../model/Edge';

/**
 * Load graph from BDTOPO troncon_de_route.
 * 
 * @see https://geoservices.ign.fr/documentation/services/services-geoplateforme/diffusion
 * @see https://data.geopf.fr/wfs/ows?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetCapabilities
 * @see https://data.geopf.fr/wfs/ows?SERVICE=WFS&VERSION=2.0.0&REQUEST=DescribeFeatureType&outputFormat=application/json&TYPENAMES=BDCARTO_V5:troncon_de_route
 * @see https://data.geopf.fr/wfs/ows?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&outputFormat=application/json&TYPENAMES=BDCARTO_V5:troncon_de_route&COUNT=1
 */
export class BdtopoLoader {

    /**
     * Read a troncon_de_route.geojson file as a graph.
     */
    async loadGraphFromFile(inputPath: string): Promise<Graph> {
        const g = new Graph();
        const featureCollection = JSON.parse(readFileSync(inputPath, 'utf-8'));
        for (const feature of featureCollection.features) {
            /* retreive geometry */
            const geometry: LineString = feature.geometry;
            if (geometry.coordinates.length < 2) {
                continue;
            }
            /* create start and end vertex */
            const startVertex = g.getOrCreateVertex(geometry.coordinates[0]);
            const endVertex = g.getOrCreateVertex(geometry.coordinates[geometry.coordinates.length - 1]);

            /* split edge creating direct and reverse way */
            const allowedDirection = feature.properties.sens_de_circulation;
            if (allowedDirection == "Double sens" || allowedDirection == "Sens direct") {
                const directEdge = new Edge(startVertex, endVertex);
                directEdge.id = feature.properties.cleabs_ge + '-direct';
                g.edges.push(directEdge);
            }
            if (allowedDirection == "Double sens" || allowedDirection == "Sens inverse") {
                const reverseEdge = new Edge(endVertex, startVertex);
                reverseEdge.id = feature.properties.cleabs_ge + '-reverse';
                g.edges.push(reverseEdge);
            }
        }
        return g;
    }



}
