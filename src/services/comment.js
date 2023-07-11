import { salesforceConnection } from "./salesforceConnection";

class CommentService {
  fetchAllComments(params) {
    return salesforceConnection.query('SELECT Id, CommentText__c FROM Comment__c');
  }

  insertComment(data) {
    const sObject = {
      // Map your data to Salesforce fields
      CommentText__c: data.commentText,
      // Add other fields as needed
    };
    return salesforceConnection.sobject('Comment__c').create(sObject);
  }

  updateComment(params) {
    const sObject = {
      Id: params.id,
      // Map your data to Salesforce fields to be updated
      CommentText__c: params.commentText,
      // Add other fields as needed
    };
    return salesforceConnection.sobject('Comment__c').update(sObject);
  }

  deleteComment(params) {
    return salesforceConnection.sobject('Comment__c').destroy(params.id);
  }
}

export default CommentService;
