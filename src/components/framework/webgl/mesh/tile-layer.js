import moment from 'moment';
import GroupMesh from './group-mesh';
import MathUtils from '../math/utils';
import { TileSurface, ImageMaterial, Tile } from '../index';

export default class TileLayer extends GroupMesh {

    tilesPending = [];
    tilesPendingFlag = new Map();
    tilesCache = new Map();
    tilesFlag = new Map();
    currentLevel = -1;
    radius = -1;
    url = null;
    urlGetter = null;

    lastTime = moment();

    constructor({
        radius = 1000,
        urlGetter = null,
    } = {}) {
        super();
        this.radius = radius;
        this.urlGetter = urlGetter;

        this.createEarthTileByCenter(0, 0, 0, 2, 2);
    }

    getTransparentMeshes() {
        return [];
    }

    update(viewer, camera, worldMatrix) {

        this.tryCreatePendingTiles();

        const gl = viewer.gl;

        gl.enable(gl.CULL_FACE); //一定要启用裁剪，否则显示不出立体感
        gl.frontFace(gl.CCW);//指定逆时针方向为正面
        gl.cullFace(gl.FRONT); //裁剪掉背面

        gl.depthFunc(gl.ALWAYS);
        super.update(viewer, camera, worldMatrix);
        gl.depthFunc(gl.LEQUAL);

        gl.disable(gl.CULL_FACE);
    }

    render(args) {

        let level = Math.round(args.level);
        this.clearTilesExceptLevel(level);
        this.createEarthTileByCenter(level, args.centerRow, args.centerCol, args.RowCount, args.ColCount);
        this.currentLevel = level;
    }
    clearTilesExceptLevel(level) {

        let levelKey = `${level + 1}`;
        if (!this.tilesCache.has(levelKey))
            return;

        this.tilesCache.get(levelKey).forEach(c => {
            this.remove(c);
            c.dispose();
            delete this.tilesFlag.delete(c.flagKey);
        });

        this.tilesCache.set(levelKey, []);
    }

    tryCreatePendingTiles() {

        let now = moment();
        if (now.diff(this.lastTime) < 50)
            return;

        let item = null;
        while (true) {
            item = this.tilesPending.pop();
            if (!item)
                return;
            else if (item.cancel) {
                let key = `${item.level}_${item.row}_${item.col}`;
                this.tilesPendingFlag.delete(key);
                continue;
            }
            else
                break;
        }

        this.createEarthTile(item.level, item.row, item.col);

        let key = `${item.level}_${item.row}_${item.col}`;
        this.tilesPendingFlag.delete(key);
    }

    createEarthTileByCenter(level, row, col, cntRow, cntCol) {

        let cnt = Math.pow(2, level);

        let dr = Math.round((cntRow) / 2);
        let dc = Math.round((cntCol) / 2);
        // let rStart = row - dr;
        // rStart = rStart < 0 ? 0 : rStart;
        // let rEnd = row + dr;
        // rEnd = rEnd >= cnt ? cnt - 1 : rEnd;
        // let cStart = col - dc;
        // cStart = cStart < 0 ? 0 : cStart;
        // let cEnd = col + dc;
        // cEnd = cEnd >= cnt ? cnt - 1 : cEnd;

        this.tilesPending.forEach(c => {
            if (c.level != level)
                c.cancel = true;
        });

        // for (let i = rStart; i <= rEnd; i++) {
        //     for (let j = cStart; j <= cEnd; j++) {
        //         this.tryAddTileToPending(level, i, j);

        //     }
        // }

        for (let i = dr; i >= 0; i--) {
            for (let j = dc; j >= 0; j--) {

                let r1 = row - i;
                let c1 = col - j;
                if (r1 < 0)
                    r1 = 0;
                if (c1 < 0)
                    c1 = 0;
                let r2 = row + i;
                let c2 = col + j;
                if (r2 >= cnt)
                    r2 = cnt - 1;
                if (c2 >= cnt)
                    c2 = cnt - 1;

                this.tryAddTileToPending(level, r1, c1);
                this.tryAddTileToPending(level, r1, c2);
                this.tryAddTileToPending(level, r2, c2);
                this.tryAddTileToPending(level, r2, c1);
            }
        }
    }

    tryAddTileToPending(level, row, col) {

        let key = `${level}_${row}_${col}`;

        if (this.tilesFlag.has(key) && this.tilesFlag.get(key)) {
            return;
        }

        if (this.tilesPendingFlag.has(key) && this.tilesPendingFlag.get(key)) {
            return;
        }

        this.tilesPending.push({
            level: level,
            row: row,
            col: col
        });

        this.tilesPendingFlag.set(key, true);
    }

    createEarthTile(level, row, col) {

        let key = `${level}_${row}_${col}`;

        if (this.tilesFlag.has(key) && this.tilesFlag.get(key)) {
            return;
        }

        let grid = MathUtils.getTileWebMercatorEnvelopeByGrid(level, row, col, this.radius);
        let segment = 1;

        if (level < 6) {
            var changeLevel = 6 - level;
            segment = Math.pow(2, changeLevel);
        }

        let geoTile = new TileSurface(this.radius, grid.maxLat, grid.minLon, grid.minLat, grid.maxLon, segment, segment);
        let material = new ImageMaterial({ src: this.urlGetter(level, row, col) });
        material.colors = geoTile.colors;

        let mesh = new Tile(geoTile, material, {
            level, row, col
        });

        this.add(mesh);
        mesh.flagKey = key;
        this.tilesFlag.set(key, true);

        let levelKey = `${level}`;
        let arr = null;
        if (!this.tilesCache.has(levelKey))
            this.tilesCache.set(levelKey, arr = []);
        else
            arr = this.tilesCache.get(levelKey);

        arr.push(mesh);
    }
}