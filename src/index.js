import { createStore, combineReducers } from "redux";
import produce from "immer";
import { devToolsEnhancer } from "redux-devtools-extension";

class Store {
  constructor() {
    this.store = {
      ...createStore(this.createReduces({}), devToolsEnhancer()),
      asyncReduces: {}
    };
    this.createSlice = this.createSlice.bind(this);
  }

  createReduces(reduces) {
    return combineReducers(reduces);
  }

  replaceReduces() {
    console.log("inject");
    this.store.replaceReducer(this.createReduces(this.store.asyncReduces));
  }

  createSlice({ name, state, reducers }) {
    if (!this.store.asyncReduces[name]) {
      this.store.asyncReduces[name] = (s = state, action) => {
        switch (action.type) {
          default:
            // return { ...s, ...action.payload };
            return Object.assign({}, s, action.payload);
        }
      };
      this.replaceReduces();
    }
    const { getState, dispatch } = this.store;
    const currentState = getState()[name];
    const actions = Object.keys(reducers).reduce(
      (obj, nextKey) => {
        return {
          ...obj,
          [nextKey]: new Proxy(reducers[nextKey], {
            async apply(target, thisArgs, argLists) {
              console.log(thisArgs, "thisArgs");

              const nextState = await produce(
                currentState,
                target.bind({ state: currentState }, argLists)
              );
              dispatch({
                type: `${name}/${nextKey}`,
                payload: nextState
              });
            }
          })
        };
      },
      {
        deleteSlice() {
          delete this.store.asyncReduce[name];
        }
      }
    );
    return actions;
  }
}

const store = new Store();

export const { createSlice } = store;

export default store.store;
