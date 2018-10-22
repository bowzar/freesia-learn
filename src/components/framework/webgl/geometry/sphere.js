import Geometry from './geometry';

export default class Sphere extends Geometry {

    constructor(r = 100) {
        super();
        this.create(r);
    }

    create(r) {

        let cntLat = 50;
        let cntLon = 50;

        this.vertices = [];
        this.indices = [];
        this.colors = [];

        for (let i = 0; i <= cntLat; i++) {

            let radiusLat = Math.PI / 2 - i * Math.PI / cntLat;
            let z = Math.sin(radiusLat) * r;
            let rLon = Math.cos(radiusLat) * r;

            for (let j = 0; j <= cntLon; j++) {

                let radiusLon = Math.PI - j * 2 * Math.PI / cntLon;
                let x = Math.cos(radiusLon) * rLon;
                let y = Math.sin(radiusLon) * rLon;
                let u = 1 - j / cntLon;
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