import { userService2 } from "../../services";
import { createAction } from ".";
import { actionType } from "./type";
import { notifitying } from "../../utils/notification";

export const fetchAllUsers = (params) => {
  return async (dispatch) => {
    try {
      const users = await userService2.fetchAllUsers(params);
      ///console.log('userlist from action user',users);
      dispatch(createAction(actionType.SET_USER_LIST, users));
    } catch (err) {
      console.log(err);
    }
  };
};

export const deleteUser = (id) => {
  return async (dispatch) => {
    try {
      await userService2.deleterUser(id);

      dispatch(fetchAllUsers());

      notifitying("success", "User successfully deleted");
    } catch (err) {
      console.log(err);
      notifitying("warning", "User failed to be deleted");
    }
  };
};

export const getMembersByProjectId = (id) => {
  return async (dispatch) => {
    try {
      const members = await userService2.getMembersByProjectId(id);

      dispatch(createAction(actionType.GET_PROJECT_MEMBERS, members));
    } catch (err) {
      dispatch(createAction(actionType.GET_PROJECT_MEMBERS, []));
      console.log(err);
    }
  };
};

export const updateUser = (data, callback) => {
  return async (dispatch) => {
    try {
      await userService2.updateUser(data);

      if (callback) {
        callback();
      }
    } catch (err) {
      console.log(err);
    }
  };
};
