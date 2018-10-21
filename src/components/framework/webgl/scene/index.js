export default class Scene {

    children = []

    colorR = null
    colorG = null
    colorB = null

    constructor({
        color = 0x0,
    } = {}) {

        this.colorR = ((color >> 16) & 0x0000ff) / 255;
        this.colorG = ((color >> 8) & 0x0000ff) / 255;
        this.colorB = (color & 0x0000ff) / 255;
    }

    add(item) {
        this.children.push(item);
    }

    remove(item) {
        let index = this.children.indexOf(item);
        this.children.splice(index, 1);
    }

    update(viewer, camera) {

        const gl = viewer.gl;

        gl.clearColor(this.colorR, this.colorG, this.colorB, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        // gl.enable(gl.DEPTH_TEST);
        // gl.depthFunc(gl.LEQUAL);
        // gl.depthMask(true);//允许写入深度
        // gl.depthFunc(gl.ALWAYS);

        // gl.enable(gl.CULL_FACE); //一定要启用裁剪，否则显示不出立体感
        // gl.frontFace(gl.CW);//指定逆时针方向为正面
        // gl.cullFace(gl.BACK); //裁剪掉背面


        gl.enable(gl.DEPTH_TEST);
        // gl.depthFunc(gl.ALWAYS);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.viewport(0.0, 0.0, gl.canvas.width, gl.canvas.height);

        this.children.forEach(c => {
            if (!c.material.isTransparent)
                c.update(viewer, camera);
        });

        gl.depthMask(false);

        let meshes = this.getTransparentMeshes();
        meshes.forEach(c => {
            c.update(viewer, camera);
        });

        gl.depthMask(true);
    }

    getTransparentMeshes() {

        let meshes = [];
        this.children.forEach(c => {
            if (c.material.isTransparent)
                meshes.push(c);
        });

        return meshes;
    }
}