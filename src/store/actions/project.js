import { projectService2 } from "../../services";
import { createAction } from ".";
import { actionType } from "./type";
import { notifitying } from "../../utils/notification";

export const fetchAllProjects = (params) => {
  return async (dispatch) => {
    try {
      const projects = await projectService2.fetchAllProjects(params);
      console.log("ha data", projects);
      dispatch(createAction(actionType.SET_PROJECT_LIST, projects));
      console.log("ha data", projects);
    } catch (err) {
      console.log("data majatx");
      console.log(err);
    }
  };
};

export const fetchAllProjectCategories = () => {
  console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");

  return async (dispatch) => {
    console.log("e3333333333333");
    try {
      console.log("fetch actions 333222222222222222222222222222222");
      const categories = await projectService2.fetchAllProjectCategories();
      console.log("Categories:",categories);
      dispatch(createAction(actionType.SET_PROJECT_CATEGORIES, categories));
    } catch (err) {
      console.log("makaynx Categories:");
      console.log(err);
    }
  };
};

export const createProjectAuthorize = (data, callback) => {
  console.log('createProjectAuthorize', data);
  return async (dispatch) => {
    dispatch(createAction(actionType.SET_PROJECT_ERROR, null));
    try {
      console.log("try");
      const projectId = await projectService2.createProjectAuthorize(data);
      const projectDetail = await projectService2.fetchProjectDetail(projectId);

      dispatch(createAction(actionType.SET_PROJECT_DETAIL, projectDetail));

      if (callback) {
        callback();
      }
    } catch (err) {
      console.log("errrrror");
      console.log(err);
      dispatch(
        createAction(actionType.SET_PROJECT_ERROR, err.response.data.content)
      );
    }
  };
};

export const fetchUsersByProject = (projectId) => {
  console.log('dakhlat lfetchusers');
  return async (dispatch) => {
    try {
      const users = await projectService2.fetchUsersByProject(projectId);
      console.log('Fetching users:',users);
      dispatch(createAction(actionType.SET_PROJECT_MEMBERS, users));
    } catch (err) {
      console.log(err);
      if (
        err.response.data.statusCode === 404 &&
        err.response.data.content === "User not found in the project!"
      ) {
        console.log("iff 404");
        dispatch(createAction(actionType.SET_PROJECT_MEMBERS, []));
      }
    }
  };
};

export const assignUserToProject = (data, callback) => {
  return async (dispatch) => {
    try {
      await projectService2.assignUserToProject(data);

      if (callback) {
        callback();
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const removeUserFromProject = (data, callback) => {
  return async (dispatch) => {
    try {
      await projectService2.removeUserFromProject(data);

      if (callback) {
        callback();
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const deleteProject = (projectId, callback) => {
  return async (dispatch) => {
    try {
      await projectService2.deleteProject(projectId);

      if (callback) {
        callback();
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const fetchProjectDetail = (projectId, callback) => {
  return async (dispatch) => {
    try {
      const projectDetail = await projectService2.fetchProjectDetail(projectId);
      console.log("fetched projectdetail",projectDetail);

      dispatch(createAction(actionType.SET_PROJECT_DETAIL, projectDetail));

      if (callback) {
        callback();
      }
    } catch (err) {
      console.log("kayn error fi fetchPd");

      console.log(err);
    }
  };
};

export const updateProject = (data, callBack) => {
  return async (dispatch) => {
    try {
      await projectService2.updateProject(data);

      callBack();
      notifitying('success', 'Project successfully updated');
    } catch (err) {
      console.log({...err});
      notifitying('warning', 'Project failed to be updated');
    }
  };
};
