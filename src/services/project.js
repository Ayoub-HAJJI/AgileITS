import * as yup from "yup";
import { salesforceConnection } from "./salesforceConnection";


export const createProjectSchema = yup.object().shape({
  Name: yup.string().required("Project name is required"),
});


class ProjectService2 {

  async fetchAllProjects() {
    
    console.log("lfetchALL");
    const query = 'select Id,Name, Description__c, CategoryId__c ,CategoryName__c ,creator__r.Id__c,creator__r.Name__c ,(select id, Membre__r.Name ,Membre__r.avatar__c from Project_Members__r)from Project__c' ;
    const result = await salesforceConnection.query(query);
    console.log('dataaaa ',result.records);
    return result.records;
  }

  async fetchAllProjectCategories() {
    console.log("fetch service cccccccc");
    const query = 'SELECT Id__c, Name__c from ProjectCategory__c'; // Replace with your Salesforce object and fields
    const result = await salesforceConnection.query(query);
    console.log("category data :",result);
    return result.records;
  }

  async createProjectAuthorize(data) {
    console.log("data",data);
    const sObject = {
      Name: data.Name,
      CategoryId__c: data.CategoryId__c,
      Description__c: data.Description__c,
    };
    console.log("sobject",sObject);
    const result = await salesforceConnection.sobject('Project__c').create(sObject);
    console.log("sobjectID",result.id);
    return result.id;
  }

  async updateProject(data) {
    const sObject = {
      Id: data.Id,
      Name: data.Name,
      Description__c: data.Description__c,
      // Update other fields as needed
    };
    console.log("data :",data);
    console.log("sobject",sObject);
    const result = await salesforceConnection.sobject('Project__c').update(sObject);
    return result.success;
  }

  async fetchUsersByProject(projectId) {
    console.log('fetchUsersByProject');
    const query = `select Membre__r.name,Membre__r.Id,Membre__r.avatar__c  from Project_Member__c where Project__r.Id = '${projectId}'`; // Replace with your Salesforce object and fields
    const result = await salesforceConnection.query(query);
    console.log('memebrs', result);
    return result.records;
  }

  async assignUserToProject(data) {
    const sObject = {
      Membre__c: data.Id,
      Project__c: data.projectId,
      
    };
    const result = await salesforceConnection.sobject('Project_Member__c').create(sObject);
    console.log("result assigtn user",result) // Replace with the appropriate Salesforce object
    return result.Id;
  }

  async removeUserFromProject(data) {
    const query = `select Id  from Project_Member__c where Project__c = '${data.projectId}' and Membre__c='${data.Id}'`; // Replace with your Salesforce object and fields
    const result1 = await salesforceConnection.query(query);
    console.log("result1",result1);
    const result2 = await salesforceConnection.sobject('Project_Member__c').destroy(result1.records[0].Id); // Replace with the appropriate Salesforce object and field
    return result2.success;
  }

  async deleteProject(projectId) {
    const result = await salesforceConnection.sobject('Project__c').destroy(projectId); // Replace with the appropriate Salesforce object
    return result.success;
  }

  async fetchProjectDetail(projectId) {
    const projectQuery = `SELECT Id, Name, Description__c FROM Project__c WHERE Id = '${projectId}'`;
    
    const projectResult = await salesforceConnection.query(projectQuery);
    const projectRecord = projectResult.records[0];
  
    const membersQuery = `SELECT Id, Membre__r.Name, Membre__r.Avatar__c, Project__c FROM Project_Member__c WHERE Project__c = '${projectId}'`;
    
    const membersResult = await salesforceConnection.query(membersQuery);
    const membersRecords = membersResult.records;

    const statusQuery = `SELECT Id,Id__c, Name, (SELECT Id, TaskName__c, Description__c, OriginalEstimate__c,timeTrackingRemeaining__c, TimeTrackingSpent__c, Comment__c, Status_task__r.Id ,Status_task__r.Id__c,Status_task__r.Name,Priority__r.Id, Priority__r.Name, TaskType__r.Id, TaskType__r.Name FROM tasks1__r) FROM Status__c   WHERE Project__c = '${projectId}' order by Id__c`;
    
    const statusResult = await salesforceConnection.query(statusQuery);
    const statusRecords = statusResult.records;
  
    const projectDetail = {
      ...projectRecord,
      Project_Members__r: membersRecords,
      Statuss__r: statusRecords,
    };
  
    console.log("projectDetail from service", projectDetail);
    return projectDetail;
  }
  
  
  // ...
}
export default ProjectService2;
