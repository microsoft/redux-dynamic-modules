import { ISettingsState } from "./SettingsContracts";
import produce from "immer";
import { SettingsActionTypes, SettingActionsUnion } from "./SettingsActions";

export function settingsReducer(
    state: ISettingsState,
    action: SettingActionsUnion
): ISettingsState {
    return produce(
        state || { userPreferences: {} },
        (draft: ISettingsState) => {
            switch (action.type) {
                case SettingsActionTypes.SET_PREFERENCES: {
                    const { map } = action.payload;
                    for (const key in map) {
                        if (map.hasOwnProperty(key)) {
                            draft.userPreferences[key] = map[key];
                        }
                    }
                    break;
                }
            }
        }
    );
}
