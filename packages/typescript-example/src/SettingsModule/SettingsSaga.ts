import { effects } from "redux-saga";
import { SettingActions, SettingsActionTypes } from "./SettingsActions";
import { ISettingsModuleState, ISettingsState } from "./SettingsContracts";

export function* settingsRootSaga() {
    if (typeof Storage === "undefined") {
        return;
    }

    yield effects.takeEvery(
        SettingsActionTypes.LOAD_PREFERENCES,
        loadPreferences
    );
    // Watch for every set preference and store in the local storage
    yield effects.takeEvery(
        SettingsActionTypes.SET_PREFERENCES,
        storePreferencs
    );
}

function* loadPreferences() {
    // Load the current state
    const settingsStr = yield effects.call(
        [localStorage, localStorage.getItem],
        "userPreferences"
    );
    if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        yield effects.put(SettingActions.setPreferences(settings));
    }
}

function* storePreferencs() {
    const settingsState: ISettingsState = yield effects.select(
        (state: ISettingsModuleState) => state.settingsState
    );
    yield effects.call(
        [localStorage, localStorage.setItem],
        "userPreferences",
        JSON.stringify(settingsState.userPreferences)
    );
}
