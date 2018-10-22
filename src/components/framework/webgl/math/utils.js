export default class MathUtils {

    static getTileWebMercatorEnvelopeByGrid(level, row, column, r) {
        let k = Math.PI * r;
        let size = 2 * k / Math.pow(2, level);
        let minX = -k + column * size;
        let maxX = minX + size;
        let maxY = k - row * size;
        let minY = maxY - size;
        let Eproj = {
            minLon: MathUtils.webMercatorXToRadianLon(minX, r),
            minLat: MathUtils.webMercatorYToRadianLat(minY, r),
            maxLon: MathUtils.webMercatorXToRadianLon(maxX, r),
            maxLat: MathUtils.webMercatorYToRadianLat(maxY, r)
        };
        return Eproj;
    }

    static webMercatorYToRadianLat(y, r) {

        // return y / r;

        let a = y / r;
        let b = Math.pow(Math.E, a);
        let c = Math.atan(b);
        let radianLat = 2 * c - Math.PI / 2;
        return radianLat;
    }

    static webMercatorXToRadianLon(x, r) {
        return x / r;
    }

    static radianLatToWebMercatorY(radianLat, r) {

        // return r * radianLat;

        let a = Math.PI / 4 + radianLat / 2;
        let b = Math.tan(a);
        let c = Math.log(b);
        return r * c;
    }

    static radianLonToWebMercatorX(radianLon, r) {
        return r * radianLon;
    }
}