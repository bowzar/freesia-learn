
export default class FileHelper {

    static getFileSizeText(val) {

        if (val < 1024)
            return `${val} B`;

        val = val / 1024;
        if (val < 1024)
            return `${Math.round(val * 100) / 100} KB`;

        val = val / 1024;
        if (val < 1024)
            return `${Math.round(val * 100) / 100} MB`;

        val = val / 1024;
        if (val < 1024)
            return `${Math.round(val * 100) / 100} GB`;

        val = val / 1024;
        if (val < 1024)
            return `${Math.round(val * 100) / 100} TB`;

        val = val / 1024;
        if (val < 1024)
            return `${Math.round(val * 100) / 100} PB`;
    }
}