class TileSet {
    static FILL_RECT = 1;
    static FILL_ELLIPSE = 2;

    constructor(id, color, type = TileSet.FILL_RECT, opacity = 1) {
        this.id = id;
        this.color = color;
        this.type = type;
        this.opacity = opacity;
    }
}