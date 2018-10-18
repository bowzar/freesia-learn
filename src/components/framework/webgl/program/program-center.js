import Program from "./program";

export default class ProgramCenter {

    programs = []
    currentProgram = null
    gl = null

    constructor(gl) {
        this.gl = gl;
    }

    use(vc, fc) {

        for (let i = 0; i < this.programs.length; i++) {
            const program = this.programs[i];
            if (program.vertCode === vc && program.fragCode === fc) {
                return this.useProgram(program);
            }
        }

        let p = new Program(vc, fc);
        p.install(this.gl);
        this.programs.push(p);

        return this.useProgram(p);
    }

    useProgram(program) {

        if (this.currentProgram === program)
            return program;

        this.gl.useProgram(program.program);
        this.currentProgram = program;
        return program;
    }
}