import Mesh from './index';
import { Matrix4 } from '../index';

export default class GroupMesh extends Mesh {

    children = [];

    constructor() {
        super(null, null);
    }

    add(mesh) {
        this.children.push(mesh);
    }

    remove(mesh) {
        let index = this.children.indexOf(mesh);
        if (index >= 0)
            this.children.splice(index, 1);
    }

    update(viewer, camera, worldMatrix) {

        worldMatrix = this.locator.calculateMatrixByWorldMatrix(worldMatrix);
        this.children.forEach(c => {
            if (!c.isTransparent())
                c.update(viewer, camera, worldMatrix);
        });
    }

    getTransparentMeshes() {

        let meshes = [];
        this.children.forEach(c => {

            if (c instanceof GroupMesh) {
                let ms = c.getTransparentMeshes();
                ms.forEach(m => meshes.push(m));
                return;
            }

            if (c.isTransparent())
                meshes.push(c);
        });

        return meshes;
    }
}