import { ISettingsState } from "./SettingsContracts";
import { ISagaModule } from "redux-dynamic-modules-saga";
import { settingsReducer } from "./SettingsReduder";
import { settingsRootSaga } from "./SettingsSaga";
import { SettingActions } from "./SettingsActions";

export function getSettingsModule(): ISagaModule<ISettingsState> {
    return {
        id: "settings",
        reducerMap: {
            settings: settingsReducer
        },
        initialActions:[SettingActions.loadPreferences()],
        sagas: [settingsRootSaga]
    }
}