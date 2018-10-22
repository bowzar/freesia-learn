import Geometry from './geometry';
import MathUtils from '../math/utils';

export default class TileSurface extends Geometry {

    constructor(r = 100, radiusLTLat, radiusLTLon, radiusRBLat, radiusRBLon, cntLat = 16, cntLon = 16) {
        super();
        this.create(r, radiusLTLat, radiusLTLon, radiusRBLat, radiusRBLon, cntLat, cntLon);
    }

    create(r, radiusLTLat, radiusLTLon, radiusRBLat, radiusRBLon, cntY, cntX) {

        let minX = MathUtils.radianLonToWebMercatorX(radiusLTLon, r);
        let minY = MathUtils.radianLatToWebMercatorY(radiusRBLat, r);
        let maxX = MathUtils.radianLonToWebMercatorX(radiusRBLon, r);
        let maxY = MathUtils.radianLatToWebMercatorY(radiusLTLat, r);

        this.vertices = [];
        this.indices = [];
        this.colors = [];
        let stepX = (maxX - minX) / cntX;
        let stepY = (maxY - minY) / cntY;

        for (let i = 0; i <= cntY; i++) {

            let mY = maxY - stepY * i;
            let radiusLat = MathUtils.webMercatorYToRadianLat(mY, r);
            let z = Math.sin(radiusLat) * r;
            let rLon = Math.cos(radiusLat) * r;

            for (let j = 0; j <= cntX; j++) {

                let mX = minX + stepX * j;
                let radiusLon = MathUtils.webMercatorXToRadianLon(mX, r);
                let x = Math.cos(radiusLon) * rLon;
                let y = Math.sin(radiusLon) * rLon;
                let u = j / cntX;
                let v = i / cntY;

                this.vertices.push(x);
                this.vertices.push(y);
                this.vertices.push(z);

                this.colors.push(u);
                this.colors.push(v);
            }
        }

        for (let i = 0; i < cntY; i++) {
            for (let j = 0; j < cntX; j++) {

                let p1 = i * (cntX + 1) + j;
                let p2 = p1 + 1;
                let p3 = p1 + cntX + 1;
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