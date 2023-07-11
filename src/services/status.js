import { salesforceConnection } from "./salesforceConnection";
class StatusService {

  getStatus() {
    const result= salesforceConnection.query('SELECT Id, Name__c FROM Status__c');
    console.log('Satuts',result);
    return result;
  }
}

export default StatusService;

