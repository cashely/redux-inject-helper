import { combineReducers, createStore } from "redux";
import produce, { applyPatches, enablePatches } from "immer";

enablePatches()
class Store {
  constructor() {
    this.actionsQueens = {};
    this.store = {
      ...createStore((state = {}) => state),
      asyncReduces: {}
    };
    this.createSlice = this.createSlice.bind(this);
  }

  createReduces(reduces) {
    return combineReducers(reduces);
  }

  replaceReduces() {
    this.store.replaceReducer(this.createReduces(this.store.asyncReduces));
  }

  createSlice({ name, state, reducers }) {
    if (!this.store.asyncReduces[name]) {
      this.store.asyncReduces[name] = (s = state, action) => {
        switch (action.type) {
          default:
            return Object.assign({}, s, action.payload);
        }
      };
      this.replaceReduces();
      const { getState, dispatch } = this.store;
      const actions = Object.keys(reducers).reduce(
        (obj, nextKey) => {
          return {
            ...obj,
            [nextKey]: new Proxy(reducers[nextKey], {
              async apply(target, thisArgs, argLists) {
                const currentState = () => {
                  return nextKey === "init" ? state : getState()[name]
                }
                let changes = [];
                let fork = currentState();
                fork = await produce(
                  currentState,
                  target.bind(
                    { state: currentState, ...actions },
                    ...argLists,
                    currentState
                  ),
                  (patches) => {
                    changes.push(...patches)
                  }
                );
                dispatch({
                  type: `${name}/${nextKey}`,
                  payload: applyPatches(currentState(), changes),
                });
              }
            })
          };
        },
        {
          name
        }
      );
      this.actionsQueens[name] = actions
    }
    return this.actionsQueens[name]
  }
}

export const { createSlice, store } = new Store();
