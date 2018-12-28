import { ISettingsAwareState } from "./SettingsContracts";
import { ISagaModule } from "redux-dynamic-modules-saga";
import { settingsReducer } from "./SettingsReduder";
import { settingsRootSaga } from "./SettingsSaga";
import { SettingActions } from "./SettingsActions";

export function getSettingsModule(): ISagaModule<ISettingsAwareState> {
    return {
        id: "settings",
        reducerMap: {
            settingsState: settingsReducer
        } as any,
        initialActions:[SettingActions.loadPreferences()],
        sagas: [settingsRootSaga]
    }
}