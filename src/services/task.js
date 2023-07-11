import * as yup from "yup";
import { salesforceConnection } from "./salesforceConnection";

export const createTaskSchema = yup.object().shape({
  taskName: yup.string().required("Project name is required"),
  description: yup.string().required("Description is required"),
});

class TaskService {
  updateTaskStatus(taskId, statusId) {
    const sObject = {
      Id: taskId,
      StatusId__c: statusId,
    };
    return salesforceConnection.sobject('Task__c').update(sObject);
  }

  createTask(data) {
    console.log(" create task ",data);
    const sObject = {
      TaskName__c: data.taskName,
      Description__c: data.description,
      // Map other fields as needed
    };
    return salesforceConnection.sobject('Task__c').create(sObject);
  }

  fetchAllTaskTypes() {
    const result = salesforceConnection.query('select Id, Name__c from TaskType__c');
    console.log("tassssssssssssk",result);
    return result;
  }

  fetchTaskDetail(taskId) {
    return salesforceConnection.retrieve('Task__c', taskId, ['Id', 'TaskName__c', 'Description__c']);
  }

  updateTask(data) {
    const sObject = {
      Id: data.taskId,
      TaskName__c: data.taskName,
      // Map other fields as needed
    };
    return salesforceConnection.sobject('Task__c').update(sObject);
  }

  updateDescription(data) {
    const sObject = {
      Id: data.taskId,
      Description__c: data.description,
    };
    return salesforceConnection.sobject('Task__c').update(sObject);
  }

  updatePriority(data) {
    const sObject = {
      Id: data.taskId,
      Priority__c: data.priority,
    };
    return salesforceConnection.sobject('Task__c').update(sObject);
  }

  assignUserToTask(data) {
    const sObject = {
      TaskId__c: data.taskId,
      UserId__c: data.userId,
    };
    return salesforceConnection.sobject('UserTask__c').create(sObject);
  }

  removeUserFromTask(data) {
    const sObject = {
      Id: data.userTaskId,
    };
    return salesforceConnection.sobject('UserTask__c').destroy(sObject);
  }

  updateEstimate(data) {
    const sObject = {
      Id: data.taskId,
      Estimate__c: data.estimate,
    };
    return salesforceConnection.sobject('Task__c').update(sObject);
  }

  updateTimeTracking(data) {
    const sObject = {
      Id: data.taskId,
      TimeTracking__c: data.timeTracking,
    };
    return salesforceConnection.sobject('Task__c').update(sObject);
  }

  removeTask(params) {
    const sObject = {
      Id: params.taskId,
    };
    return salesforceConnection.sobject('Task__c').destroy(sObject);
  }
}

export default TaskService;
