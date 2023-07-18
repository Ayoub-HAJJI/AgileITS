import { salesforceConnection } from "./salesforceConnection";

class UserService2 {
  async fetchAllUsers(params) {
    const query = 'SELECT Id, Name, Email__c,phone_number__c FROM User__c';
    const result = await salesforceConnection.query(query);
    console.log("users:",result);
    return result.records;
  }

  async deleterUser(id) {
    await salesforceConnection.sobject('User__c').destroy(id);
  }

  async getMembersByProjectId(projectId) {
    const query = `SELECT Id, Name, Email FROM User__c WHERE ProjectId__c = '${projectId}'`;
    const result = await salesforceConnection.query(query);
    return result.records;
  }

  async updateUser(data) {
    const sObject = {
      Id: data.Id,
      Name: data.Name,
      Email__c: data.Email__c,
      phone_number__c:data.phone_number__c
      // Update other fields as needed
    };
    const result = await salesforceConnection.sobject('User__c').update(sObject);
    return result.success;
  }
}

export default UserService2;
