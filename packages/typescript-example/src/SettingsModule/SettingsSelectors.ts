import { ISettingsModuleState } from "./SettingsContracts";

export const getUserPreferences = (state: ISettingsModuleState) =>
    state.settingsState.userPreferences;
