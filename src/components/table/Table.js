import { ExcelComponent } from "core/ExcelComponent";
import { createTable } from "./table-template";
import { resizeHandler } from "./resize";
import { shouldResize } from "./actions";

export class Table extends ExcelComponent {
    static className = "excel__table";

    constructor($root) {
        super($root, {
            name: "Table",
            listeners: ["mousedown"],
        });
    }

    toHTML() {
        return createTable(20);
    }

    onMousedown(e) {
        if (shouldResize(e)) {
            resizeHandler(e, this.$root);
        }
    }
}
