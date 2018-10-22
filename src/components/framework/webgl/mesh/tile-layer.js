import GroupMesh from './group-mesh';
import MathUtils from '../math/utils';
import { TileSurface, ImageMaterial, Tile } from '../index';

export default class TileLayer extends GroupMesh {

    currentLevel = -1;
    radius = -1;
    url = null;

    constructor({
        radius = 1000,
        url = '',
    } = {}) {
        super();
        this.radius = radius;
        this.url = url
    }

    update(viewer, camera, worldMatrix) {

        const gl = viewer.gl;

        gl.enable(gl.CULL_FACE); //一定要启用裁剪，否则显示不出立体感
        gl.frontFace(gl.CCW);//指定逆时针方向为正面
        gl.cullFace(gl.FRONT); //裁剪掉背面

        gl.depthFunc(gl.ALWAYS);
        super.update(viewer, camera, worldMatrix);
        gl.depthFunc(gl.LEQUAL);

        gl.disable(gl.CULL_FACE);
    }

    getTransparentMeshes() {
        return [];
    }

    changeLevel(level) {

        level = Math.round(level);
        if (this.currentLevel == level)
            return;

        this.createEarthTileByLevel(level);
        this.clearTilesExceptLevel(level);
        this.currentLevel = level;
    }

    clearTilesExceptLevel(level) {

        let tiles = [];
        this.children.forEach(c => {
            if (c.level > level)
                tiles.push(c);
        });

        tiles.forEach(c => {
            this.remove(c);
            c.dispose();
        });
    }

    createEarthTileByLevel(level) {

        let l = 18;
        let row = 104668;
        let col = 44976;

        let cnt = Math.pow(2, level);
        let d = level - l;
        let dv = Math.pow(2, d);

        let r = Math.round(row * dv);
        let c = Math.round(col * dv);

        let range = 2;

        let rstart = r - range < 0 ? 0 : r - range;
        let rend = r + range > cnt ? cnt : r + range;
        let cstart = c - range < 0 ? 0 : c - range;
        let cend = c + range > cnt ? cnt : c + range;

        for (let i = rstart; i < rend; i++) {
            for (let j = cstart; j < cend; j++) {
                this.createEarthTile(level, i, j);
            }
        }
    }

    createEarthTile(level, row, col) {

        let grid = MathUtils.getTileWebMercatorEnvelopeByGrid(level, row, col, this.radius);
        let segment = 1;

        if (level < 6) {
            var changeLevel = 6 - level;
            segment = Math.pow(2, changeLevel);
        }

        let geoTile = new TileSurface(this.radius, grid.maxLat, grid.minLon, grid.minLat, grid.maxLon, segment, segment);
        let material = new ImageMaterial({ src: this.url + `/${level}/${row}/${col}` });
        material.colors = geoTile.colors;

        let mesh = new Tile(geoTile, material, {
            level, row, col
        });

        this.add(mesh);
    }
}