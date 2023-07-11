import { salesforceConnection } from "./salesforceConnection";
class PriorityService {
 
   getPriority() {
    const result =  salesforceConnection.query('SELECT Id, Name__c FROM Priority__c');
    console.log('Priority',result);
    return result  ;

  }
}

export default PriorityService;
