class TouchControl {
    static getTouchPos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();

        var touchobj = evt.changedTouches[0];
        let x = parseInt(touchobj.clientX);
        let y = parseInt(touchobj.clientY);

        return {
            x: x - rect.left,
            y: y - rect.top
        }
    }
}