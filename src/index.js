import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import produce from "immer";

class Store {
  constructor() {
    this.store = {
      ...configureStore({
        reducer: {}
      }),
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
    }
    const { getState, dispatch } = this.store;
    const currentState = getState()[name];
    const actions = Object.keys(reducers).reduce(
      (obj, nextKey) => {
        return {
          ...obj,
          [nextKey]: new Proxy(reducers[nextKey], {
            async apply(target, thisArgs, argLists) {
              const nextState = await produce(
                currentState,
                target.bind({ state: currentState, ...actions }, argLists)
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

export const { createSlice, store } = new Store();
