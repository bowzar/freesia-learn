import GroupMesh from '../mesh/group-mesh';

export default class Scene extends GroupMesh {

    colorR = null
    colorG = null
    colorB = null

    constructor({
        color = 0x0,
    } = {}) {
        super();

        this.colorR = ((color >> 16) & 0x0000ff) / 255;
        this.colorG = ((color >> 8) & 0x0000ff) / 255;
        this.colorB = (color & 0x0000ff) / 255;
    }

    update(viewer, camera, worldMatrix) {

        const gl = viewer.gl;

        gl.clearColor(this.colorR, this.colorG, this.colorB, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        gl.enable(gl.DEPTH_TEST);
        // gl.depthMask(true);//允许写入深度
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // gl.enable(gl.CULL_FACE); //一定要启用裁剪，否则显示不出立体感
        // gl.frontFace(gl.CCW);//指定逆时针方向为正面
        // gl.cullFace(gl.FRONT); //裁剪掉背面


        // gl.enable(gl.DEPTH_TEST);
        // // gl.depthFunc(gl.ALWAYS);
        // gl.enable(gl.BLEND);
        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.viewport(0.0, 0.0, gl.canvas.width, gl.canvas.height);

        this.children.forEach(c => {
            if (!c.isTransparent())
                c.update(viewer, camera, worldMatrix);
        });
        // gl.depthFunc(gl.LEQUAL);

        gl.depthMask(false);

        let meshes = this.getTransparentMeshes();
        meshes.forEach(c => {
            c.update(viewer, camera, worldMatrix);
        });

        gl.depthMask(true);
    }
}