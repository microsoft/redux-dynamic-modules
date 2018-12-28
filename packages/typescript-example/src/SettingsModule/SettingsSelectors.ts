import { ISettingsAwareState } from "./SettingsContracts";

export const getUserPreferences = (state: ISettingsAwareState) =>
    state.settingsState.userPreferences;
