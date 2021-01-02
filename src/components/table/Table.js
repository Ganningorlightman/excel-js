import { TableSelection } from "@/components/table/TableSelection";
import { $ } from "core/dom";
import { ExcelComponent } from "core/ExcelComponent";

import { createTable } from "./table-template";
import { resizeHandler } from "./resize";
import { shouldResize, isCell, matrix, nextSelector } from "./actions";

export class Table extends ExcelComponent {
    static className = "excel__table";

    constructor($root, options) {
        super($root, {
            name: "Table",
            listeners: ["mousedown", "keydown", "input"],
            ...options,
        });
    }

    toHTML() {
        return createTable(20);
    }

    prepare() {
        this.selection = new TableSelection();
    }

    init() {
        super.init();
        this.selectCell(this.$root.find('[data-id="0:0"]'));

        this.$on("Formula:onInput", txt => {
            this.selection.current.text(txt);
        });
        this.$on("Formula:done", () => {
            this.selection.current.focus();
        });
    }

    selectCell($cell) {
        this.selection.select($cell);
        this.$emit("Table:select", $cell);
    }

    onMousedown(e) {
        if (shouldResize(e)) {
            resizeHandler(e, this.$root);
        } else if (isCell(e)) {
            const $target = $(e.target);
            if (e.shiftKey) {
                const $cells = matrix($target, this.selection.current)
                    .map(id => this.$root.find(`[data-id="${id}"]`));
                this.selection.selectGroup($cells);
            } else {
                this.selectCell($(e.target));
            }
        }
    }

    onKeydown(e) {
        const keys = ["Enter", "Tab", "ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"];
        if (keys.includes(e.key) && !e.shiftKey) {
            e.preventDefault();
            const id = this.selection.current.id(true);
            const $next = this.$root.find(nextSelector(e.key, id));
            this.selectCell($next);
        }
    }

    onInput(e) {
        this.$emit("Table:onInput", $(e.target));
    }
}
