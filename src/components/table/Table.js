import { TableSelection } from "@/components/table/TableSelection";
import * as actions from "@/redux/actions";
import { defaultStyles } from "@/constants";
import { $ } from "core/dom";
import { ExcelComponent } from "core/ExcelComponent";
import { parse } from "core/parse";

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
        return createTable(20, this.store.getState());
    }

    prepare() {
        this.selection = new TableSelection();
    }

    init() {
        super.init();
        this.selectCell(this.$root.find('[data-id="0:0"]'));

        this.$on("Formula:onInput", value => {
            this.selection.current.attr("data-value", value);
            this.selection.current.text(parse(value));
            this.updateTextInStore(value);
        });
        this.$on("Formula:done", () => {
            this.selection.current.focus();
        });
        this.$on("Toolbar:applyStyle", style => {
            this.selection.applyStyle(style);
            this.$dispatch(actions.applyStyle({
                value: style,
                ids: this.selection.selectedIds,
            }));
        });
    }

    selectCell($cell) {
        this.selection.select($cell);
        this.$emit("Table:select", $cell);
        const styles = $cell.getStyles(Object.keys(defaultStyles));
        this.$dispatch(actions.changeStyles(styles));
    }

    updateTextInStore(value) {
        this.$dispatch(actions.changeText({
            id: this.selection.current.id(),
            value,
        }));
    }

    async resizeTable(e) {
        try {
            const data = await resizeHandler(e, this.$root);
            this.$dispatch(actions.tableResize(data));
        } catch (err) {
            console.error("Resize error", err.message);
        }
    }

    onMousedown(e) {
        if (shouldResize(e)) {
            this.resizeTable(e);
        } else if (isCell(e)) {
            const $target = $(e.target);
            if (e.shiftKey) {
                const $cells = matrix($target, this.selection.current)
                    .map(id => this.$root.find(`[data-id="${id}"]`));
                this.selection.selectGroup($cells);
            } else {
                this.selectCell($target);
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
        this.updateTextInStore($(e.target).text());
    }
}
