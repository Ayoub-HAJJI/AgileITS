import { statusService } from "../../services";
import { createAction } from ".";
import { actionType } from "./type";

export const getStatus = async (dispatch) => {
  try {
    const res = await statusService.getStatus();
    console.log('stattttttus',res.records);
    dispatch(createAction(actionType.GET_STATUS, res.records));
  } catch (err) {
    console.log(err);
  }
};
