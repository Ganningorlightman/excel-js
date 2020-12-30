import { $ } from "core/dom";

export function resizeHandler(e, $root) {
    const $resizer = $(e.target);
    const $parent = $resizer.closest('[data-type="resizable"]');
    const coords = $parent.getCoords();
    const type = $resizer.data.resize;
    const cells = $root.findAll(`[data-col="${$parent.data.col}"]`);
    const sideProp = type === "col" ? "bottom" : "right";
    let value = 0;

    $resizer.css({ opacity: 1, [sideProp]: "-5000px" });

    document.onmousemove = event => {
        if (type === "col") {
            const delta = Math.floor(event.pageX - coords.right);
            value = coords.width + delta;
            $resizer.css({ right: `${-delta}px` });
        } else {
            const delta = Math.floor(event.pageY - coords.bottom);
            value = coords.height + delta;
            $resizer.css({ bottom: `${-delta}px` });
        }
    };

    document.onmouseup = () => {
        document.onmousemove = null;
        $resizer.css({ opacity: 0, bottom: 0, right: 0 });
        if (type === "col") {
            $parent.css({ width: `${value}px` });
            cells.forEach(el => el.style.width = `${value}px`);
        } else {
            $parent.css({ height: `${value}px` });
        }
        document.onmouseup = null;
    };
}