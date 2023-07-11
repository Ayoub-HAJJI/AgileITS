import { priorityService } from "../../services";
import { createAction } from ".";
import { actionType } from "./type";

export const getPriority = async (dispatch) => {
  try {
    const res = await priorityService.getPriority();
    console.log("res",res.records);

    dispatch(createAction(actionType.GET_PRIORITY, res.records));
  } catch (err) {
    console.log(err);
  }
};
