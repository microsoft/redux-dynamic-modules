import { ActionsUnion, createAction, StringMap } from "redux-dynamic-modules";

export enum SettingsActionTypes {
    SET_PREFERENCES = "SETTINGS/SET_PREFRENCES",
    LOAD_PREFERENCES = "SETTINGS/LOAD",
}

export const SettingActions = {
    setPreferences: (map: StringMap<string | boolean>) =>
        createAction(SettingsActionTypes.SET_PREFERENCES, { map }),
    loadPreferences: () => createAction(SettingsActionTypes.LOAD_PREFERENCES),
};

// we leverage TypeScript token merging, so our consumer can use `Actions` for both runtime and compile time types 💪
export type SettingActionsUnion = ActionsUnion<typeof SettingActions>;
