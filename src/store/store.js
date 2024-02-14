import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";
import dataReducer from "./dataSlice";
import treeReducer from "./treeSlice"
import memberReducer from "./memberSlice"
import quizReducer from "./quizSlice"
import databaseReducer from "./databaseSlice"
import { modalMiddleware } from "./modalMiddleware";

const store = configureStore({
    reducer: {
        ui: uiReducer,
        data: dataReducer,
        tree: treeReducer,
        member: memberReducer,
        quiz: quizReducer,
        database: databaseReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(modalMiddleware),
});

export default store;