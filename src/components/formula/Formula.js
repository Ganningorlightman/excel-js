import { $ } from "core/dom";
import { ExcelComponent } from "core/ExcelComponent";

export class Formula extends ExcelComponent {
    static className = "excel__formula";

    constructor($root, options) {
        super($root, {
            name: "Formula",
            listeners: ["input", "keydown"],
            subscribe: ["currentText"],
            ...options,
        });
    }

    toHTML() {
        return `
            <div class="info">fx</div>
            <div id="formula" class="input" contenteditable="true" spellcheck="false"></div>
        `;
    }

    init() {
        super.init();
        this.$formula = this.$root.find("#formula");

        this.$on("Table:select", $cell => {
            this.$formula.text($cell.data.value);
        });
    }

    storeChanged({ currentText }) {
        this.$formula.text(currentText);
    }

    onInput(e) {
        this.$emit("Formula:onInput", $(e.target).text());
    }
    onKeydown(e) {
        const keys = ["Enter", "Tab"];
        if (keys.includes(e.key)) {
            e.preventDefault();
            this.$emit("Formula:done");
        }
    }
}
