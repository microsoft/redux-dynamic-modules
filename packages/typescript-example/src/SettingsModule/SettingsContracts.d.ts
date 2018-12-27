import { StringMap } from "../ActionHelper";

export interface ISettingsAwareState {
    settings: ISettingsState;
}

export interface ISettingsState {
    userPreferences: StringMap<string | boolean>;
}

