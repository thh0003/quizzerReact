import { combineReducers } from "redux";
import quizzer from "./reducequizzer";
import layout from "./layoutReducer";
import sidebar from "./sidebarReducers";

export default combineReducers({ quizzer,layout,sidebar });