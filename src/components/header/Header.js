import { changeTitle } from "@/redux/actions";
import { defaultTitle } from "@/constants";
import { ExcelComponent } from "core/ExcelComponent";
import { $ } from "core/dom";
import { debounce } from "core/utils";

export class Header extends ExcelComponent {
    static className = "excel__header";

    constructor($root, options) {
        super($root, {
            name: "Header",
            listeners: ["input"],
            ...options,
        });
    }

    prepare() {
        this.onInput = debounce(this.onInput.bind(this), 300);
    }

    toHTML() {
        const title = this.store.getState().title || defaultTitle;
        return `
            <input class="input" type="text" value="${title}"/>
            <div>
                <div class="button">
                    <i class="material-icons">delete</i>
                </div>
                <div class="button">
                    <i class="material-icons">exit_to_app</i>
                </div>
            </div>
        `;
    }

    onInput(e) {
        const $target = $(e.target);
        this.$dispatch(changeTitle($target.text()));
    }
}
