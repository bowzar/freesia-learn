export default class MathUtils {

    static getTileWebMercatorEnvelopeByGrid(level, row, column, r) {
        var k = Math.PI * r;
        var size = 2 * k / Math.pow(2, level);
        var minX = -k + column * size;
        var maxX = minX + size;
        var maxY = k - row * size;
        var minY = maxY - size;
        var Eproj = {
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