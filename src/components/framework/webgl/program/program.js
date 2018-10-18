export default class Program {

    vertCode = null;
    fragCode = null;
    vertShader = null
    fragShader = null
    program = null

    constructor(vertCode, fragCode) {
        this.vertCode = vertCode;
        this.fragCode = fragCode;
    }

    install(gl) {

        this.vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(this.vertShader, this.vertCode);
        gl.compileShader(this.vertShader);

        this.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.fragShader, this.fragCode);
        gl.compileShader(this.fragShader);

        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertShader);
        gl.attachShader(this.program, this.fragShader);
        gl.linkProgram(this.program);
    }
}