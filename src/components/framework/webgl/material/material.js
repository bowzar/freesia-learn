export default class Material {

    isTransparent = false


    createViewMatrix(camera, mesh, worldMatrix) {

        let m = mesh.locator.calculatePvmMatrix(
            camera.matrixProjection,
            camera.locator.matrix,
            worldMatrix)

        return m;
    }


    dispose() {

    }
}