import { defaultStyles, defaultTitle } from "@/constants";
import { storage } from "core/utils";

const defaultState = {
    title: defaultTitle,
    colState: {},
    rowState: {},
    dataState: {},
    currentText: "",
    currentStyles: defaultStyles,
    stylesState: {},
};
const storageState = storage("excel-state");
const normalize = state => ({
    ...state,
    currentStyles: defaultStyles,
    currentText: ""
});

export const initialState = storageState ? normalize(storageState) : defaultState;