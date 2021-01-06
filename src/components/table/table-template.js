import { defaultStyles } from "@/constants";
import { toInlineStyles } from "core/utils";
import { parse } from "core/parse";

const CODES = {
    A: 65,
    Z: 90,
};

const DEFAULT_WIDTH = 120;
const DEFAULT_HEIGHT = 24;

function getWidth(state, id) {
    return `${state[id] || DEFAULT_WIDTH}px`;
}

function getHeight(state, id) {
    return `${state[id] || DEFAULT_HEIGHT}px`;
}

function toCell(state, row) {
    return function(_, col) {
        const width = getWidth(state.colState, col);
        const cellId = `${row}:${col}`;
        const data = state.dataState[cellId] || "";
        const styles = toInlineStyles({ ...defaultStyles, ...state.stylesState[cellId] });
        return `
            <div 
                class="cell" 
                contenteditable="true" 
                data-type="cell"
                data-col="${col}"
                data-id="${cellId}"
                data-value="${data}"
                style="${styles};width: ${width}"
            >${parse(data)}</div>
        `;
    };
}

function toColumn({ col, id, width }) {
    return `
        <div 
            class="column" 
            data-type="resizable" 
            data-col="${id}" 
            style="width: ${width}"
        >
            ${col}
            <div class="col-resize" data-resize="col"></div>
        </div>
    `;
}

function createRow(id = 0, content = "", state = {}) {
    const resize = id ? '<div class="row-resize" data-resize="row"></div>' : "";
    return `
        <div 
            class="row" 
            data-type="resizable" 
            data-row="${id}"
            style="height: ${getHeight(state, id)}"
        >
            <div class="row-info">
                ${id ? id : ""}
                ${resize}
            </div>
            <div class="row-data">${content}</div>
        </div>
    `;
}

function toChar(_, id) {
    return String.fromCharCode(CODES.A + id);
}

function withWidthFrom(state) {
    return function(col, id) {
        return {
            col, id, width: getWidth(state, id),
        };
    };
}

export function createTable(rowsCount = 15, state = {}) {
    const colsCount = CODES.Z - CODES.A + 1;
    const rows = [];
    const cols = new Array(colsCount)
        .fill("")
        .map(toChar)
        .map(withWidthFrom(state.colState))
        .map(toColumn)
        .join("");

    rows.push(createRow(null, cols, {}));
    for (let row = 0; row < rowsCount; row++) {
        const cells = new Array(colsCount)
            .fill("")
            .map(toCell(state, row))
            .join("");
        rows.push(createRow(row + 1, cells, state.rowState));
    }

    return rows.join("");
}