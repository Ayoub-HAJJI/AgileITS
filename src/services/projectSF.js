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
    console.log("fetch service");
    const query = 'SELECT Id__c, Name__c from ProjectCategory__c'; // Replace with your Salesforce object and fields
    const result = await salesforceConnection.query(query);
    console.log("category data :",result);
    return result.records;
  }

  async createProjectAuthorize(data) {
    const sObject = {
      Id: data.id,
      Name: data.Name,
      CategoryId__c: data.CategoryId__c,
      Description__c: data.Description__c,
    };
    console.log("data :",data);
    console.log("sobject",sObject);
    const result = await salesforceConnection.sobject('Project__c').create(sObject);
    return result.Id;
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
    const query = `SELECT Id__c, Name, Email__c FROM User__c WHERE ProjectId__c = '${projectId}'`; // Replace with your Salesforce object and fields
    const result = await salesforceConnection.query(query);
    return result.records;
  }

  async assignUserToProject(data) {
    const sObject = {
      Membre__c: data.userId,
      Project__c: data.projectId,
      
    };
    const result = await salesforceConnection.sobject('Project_Member__c').create(sObject); // Replace with the appropriate Salesforce object
    return result.id;
  }

  async removeUserFromProject(data) {
    const result = await salesforceConnection.sobject('Project_Member__c').destroy(data.userProjectId); // Replace with the appropriate Salesforce object and field
    return result.success;
  }

  async deleteProject(projectId) {
    const result = await salesforceConnection.sobject('Project__c').destroy(projectId); // Replace with the appropriate Salesforce object
    return result.success;
  }

  async fetchProjectDetail(projectId) {
    const query = `SELECT Id__c, Name, Description__c FROM Project__c WHERE Id__c = '${projectId}'`; // Replace with your Salesforce object and fields
    const result = await salesforceConnection.query(query);
    return result.records[0];
  }
  // ...
}
export default ProjectService2;
