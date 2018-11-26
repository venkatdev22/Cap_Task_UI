import { Component,NgModule,Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {TaskResult, PARENT_TASKResult} from '../services/TaskResult';

var vURL="http://localhost:62701/";

@Injectable({
  providedIn: 'root'
})

 

export class CommonServiceService {

  constructor(public http: HttpClient) { }
 

getParentTask(){    
    return this.http.get<PARENT_TASKResult>(vURL + "api/Task/parents"); 
  }

  getTaskManager(){    
 
    return this.http.get<TaskResult>(vURL + "api/Task/tasks"); 
  }

   submitTask(task){    
    return this.http.post(vURL + "api/Task",task); 
  }

    updateEndTask(task){    
    return this.http.put(vURL + "api/Task/end",task); 
  }
}
