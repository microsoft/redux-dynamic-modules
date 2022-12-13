import { StringMap } from "../ActionHelper";

export interface ISettingsState {
    userPreferences: StringMap<string | boolean>;
}

export interface ISettingsReducerState {
    settingsState: ISettingsState;
}

export type ISettingsModuleState = ISettingsReducerState
