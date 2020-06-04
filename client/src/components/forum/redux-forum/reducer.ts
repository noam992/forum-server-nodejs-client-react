import { AppState } from "./app-state";
import { Action } from "./action";
import { ActionType } from "./action-type";

export function reducer(oldAppState: AppState, action: Action): AppState {

    const newAppState = { ...oldAppState }; // Spread Operator

    switch(action.type) {

        // clusters
        case ActionType.GetAllMessages:
            newAppState.clusters = action.payload;
            break;

        case ActionType.AddCluster:
            newAppState.clusters.push(action.payload);
            break;

        case ActionType.UpdateCluster:
            // לטפל בעזרת המידע שמוחזר במצב שהמשתמש מוחק את הלייק
            newAppState.clusters.map( c => {

                // Update numLike of cluster on store
                if (c.clusterId === action.payload.clusterId && action.payload.numLike !== undefined) {
                    action.payload.numLike += 1  
                }

                // Update numViewer of cluster on store
                if (c.clusterId === action.payload.clusterId && action.payload.numViewer !== undefined) {
                    action.payload.numViewer += 1
                }

            })
            break;

        
        // comments
        case ActionType.GetAllComments:
            newAppState.comments = action.payload;
            break;

        case ActionType.AddComments:
            newAppState.comments.push(action.payload)
            break;

            
        default: 
            break;

    }

    return newAppState;
}
