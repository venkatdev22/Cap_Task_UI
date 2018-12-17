import { Component, NgModule, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {GetTaskResult,ParentTask,ParentTaskResult,ProjectResult,UserResult,Task,Project,User} from '../services/ServiceModels';

//var ApiUrl = "http://localhost:62701/";
var ApiUrl="http://fsetaskmgr.net/"

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable({
  providedIn: 'root'
})

export class CommonServiceService {

  constructor(public http: HttpClient) { }

  getParentTask() {
    return this.http.get<ParentTaskResult>(ApiUrl + "api/Task/parents");
  }

  getTaskManager() {
    return this.http.get<GetTaskResult>(ApiUrl + "api/Task/tasks");
  }

  submitTask(task) {
    return this.http.post(ApiUrl + "api/Task", task, httpOptions);
  }

  updateEndTask(task) {
    return this.http.put(ApiUrl + "api/Task/end", task);
  }
  
  getProjectDetails() {
    return this.http.get<ProjectResult>(ApiUrl + "api/Project/projects");
  }

  getManagerDetails() {
    return this.http.get<ProjectResult>(ApiUrl + "api/Project/projectmanagers");
  }

  getProjectName() {
    return this.http.get<ProjectResult>(ApiUrl + "api/Project/projectnames");
  }

  submitProject(project) {
    return this.http.post(ApiUrl + "api/Project", project, httpOptions);
  }

  SuspendProject(project) {
    return this.http.put(ApiUrl + "api/Project/end", project, httpOptions);
  }
  
  getUserDetails() {
    return this.http.get<UserResult>(ApiUrl + "api/User/users");
  }

  submitUser(user) {
    return this.http.post(ApiUrl + "api/User", user, httpOptions);
  }

  deleteUser(user) {
    return this.http.delete(ApiUrl + "api/User/delete", user);
  }


};
