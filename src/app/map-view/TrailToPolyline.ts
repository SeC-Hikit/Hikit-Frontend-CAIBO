export class TrailToPolyline {
    
    constructor(private code : string,
        private polyline: L.Polyline){
    }

    getCode() : string {
        return this.code;
    }

    getPolyline() : L.Polyline {
        return this.polyline;
    }
}