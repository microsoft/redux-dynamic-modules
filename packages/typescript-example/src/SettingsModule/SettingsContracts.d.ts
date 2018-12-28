import { StringMap } from "../ActionHelper";

export interface ISettingsAwareState {
    settingsState: ISettingsState;
}

export interface ISettingsState {
    userPreferences: StringMap<string | boolean>;
}
