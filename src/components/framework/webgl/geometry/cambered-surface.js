import Geometry from './geometry';

export default class CamberedSurface extends Geometry {

    constructor(r = 100, radiusLTLat, radiusLTLon, radiusRBLat, radiusRBLon, cntLat = 20, cntLon = 20) {
        super();
        this.create(r, radiusLTLat, radiusLTLon, radiusRBLat, radiusRBLon, cntLat, cntLon);
    }

    create(r, radiusLTLat, radiusLTLon, radiusRBLat, radiusRBLon, cntLat, cntLon) {

        this.vertices = [];
        this.indices = [];
        this.colors = [];

        let stepLat = (radiusRBLat - radiusLTLat) / cntLat;
        let stepLon = (radiusRBLon - radiusLTLon) / cntLon;

        for (let i = 0; i <= cntLat; i++) {

            let radiusLat = radiusLTLat + stepLat * i;
            let z = Math.sin(radiusLat) * r;
            let rLon = Math.cos(radiusLat) * r;

            for (let j = 0; j <= cntLon; j++) {

                let radiusLon = radiusLTLon + stepLon * j;
                let x = Math.cos(radiusLon) * rLon;
                let y = Math.sin(radiusLon) * rLon;
                let u = j / cntLon;
                let v = i / cntLat;

                this.vertices.push(x);
                this.vertices.push(y);
                this.vertices.push(z);

                this.colors.push(u);
                this.colors.push(v);
            }
        }

        for (let i = 0; i < cntLat; i++) {
            for (let j = 0; j < cntLon; j++) {

                let p1 = i * (cntLon + 1) + j;
                let p2 = p1 + 1;
                let p3 = p1 + cntLon + 1;
                let p4 = p3 + 1;

                this.indices.push(p1);
                this.indices.push(p2);
                this.indices.push(p3);

                this.indices.push(p3);
                this.indices.push(p2);
                this.indices.push(p4);
            }
        }

    }
}