import * as yup from "yup";
import { salesforceConnection } from "./salesforceConnection";

export const createTaskSchema = yup.object().shape({
  taskName__c: yup.string().required("Project name is required"),
  Description__c: yup.string().required("Description is required"),
});

class TaskService {

   async updateTaskStatus(taskId, statusId) {
    console.log("TaskId:",taskId,"statusId:",statusId);
    const query = `select Id,Id__c, name ,Project__r.name,Project__c  from Status__c  where Id__c='${statusId}' and Project__c ='a6JHo000000VHEhMAO'`; 
    const result = await salesforceConnection.query(query);
    console.log("result 1",result);
    const statusId2 = result.records[0].Id;
    console.log("statusId2",statusId2);
    const sObject = {
      Id: taskId,
      Status_task__c:statusId2,
    };
    return salesforceConnection.sobject('Task__c').update(sObject);
  }

  createTask(data) {
    console.log(" create task ",data);
    const sObject = {
      TaskName__c: data.TaskName__c,
      Description__c: data.Description__c,
      // Map other fields as needed
    };
    return salesforceConnection.sobject('Task__c').create(sObject);
  }

  fetchAllTaskTypes() {
    const result = salesforceConnection.query('select Id, Name__c from TaskType__c');
    return result;
  }

  fetchTaskDetail(taskId) {
    return salesforceConnection.retrieve('Task__c', taskId, ['Id', 'TaskName__c', 'Description__c']);
  }

  async fetchTaskDetail2(taskId) {
    const query = `select id,TaskName__c,Description__c, originalEstimate__c, timeTrackingRemeaining__c,TimeTrackingSpent__c,  Comment__c, Priority__r.id,Priority__r.name , Status__r.id , Status__r.Name__c, TaskType__r.Id,TaskType__r.name, Task_Project__r.id from  task__c where id = '${taskId}'`; // Replace with your Salesforce object and fields
    const result = await salesforceConnection.query(query);
    console.log("projectDetail",result.records[0]);
    return result.records[0];
  }

  updateTask(data) {
    
    const sObject = {
      Id: data.Id,
      TaskName__c: data.TaskName__c,
      // Map other fields as needed
    };
    return salesforceConnection.sobject('Task__c').update(sObject);
  }

  updateDescription(data) {
    const sObject = {
      Id: data.Id,
      Description__c: data.Description__c,
    };
    return salesforceConnection.sobject('Task__c').update(sObject);
  }

  updatePriority(data) {
    const sObject = {
      Id: data.Id,
      Priority__c: data.Priority__c,
    };
    return salesforceConnection.sobject('Task__c').update(sObject);
  }

  assignUserToTask(data) {
    const sObject = {
      TaskId__c: data.Id,
      UserId__c: data.Id,
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
      Id: data.Id,
      originalEstimate__c: data.originalEstimate__c,
    };
    return salesforceConnection.sobject('Task__c').update(sObject);
  }

  updateTimeTracking(data) {
    const sObject = {
      Id: data.Id,
      TimeTracking__c: data.timeTracking,
    };
    return salesforceConnection.sobject('Task__c').update(sObject);
  }

  removeTask(params) {
    const sObject = {
      Id: params.Id,
    };
    return salesforceConnection.sobject('Task__c').destroy(sObject);
  }
}

export default TaskService;
