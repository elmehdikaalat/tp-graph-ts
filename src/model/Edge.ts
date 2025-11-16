import { LineString } from "geojson";
import { Vertex } from "./Vertex";
import length from "@turf/length";
import { lineString } from "@turf/turf";

export class Edge {

    id: string;

    private _source: Vertex;
    private _target: Vertex;

    private _geometry?: LineString;


    constructor(source: Vertex, target: Vertex) {
        if (!source) {
            throw new Error("Edge: source cannot be null");
        }
        if (!target) {
            throw new Error("Edge: target cannot be null");
        }

        this._source = source;
        this._target = target;

        this.id = source.id + target.id;
    }

    getSource(): Vertex {
        return this._source;
    }

    getTarget(): Vertex {
        return this._target;
    }

    getLength(): number {
        return length(lineString(this.getGeometry().coordinates));
    }

    getGeometry(): LineString {
        if (this._geometry) {
            return this._geometry;
        }

        return {
            type: "LineString",
            coordinates: [
                this._source.coordinate,
                this._target.coordinate
            ]
        };
    }

    setGeometry(geometry: LineString) {
        this._geometry = geometry;
    }

    
}
