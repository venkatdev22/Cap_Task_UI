import { Component, NgModule, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonServiceService } from './services/common-service.service';
import { Http, Response } from '@angular/http';
import { PagerService } from './services/pageService';
import { AlertsModule } from 'angular-alert-module';
import Swal from 'sweetalert2';
import { OrderPipe, OrderModule } from 'ngx-order-pipe';


declare var $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PagerService]
})

@NgModule({
  declarations: [],

  imports: [OrderPipe],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppComponent implements OnInit {
  constructor(private appServices: CommonServiceService, private pageService: PagerService,
    private fb: FormBuilder, private orderPipe: OrderPipe) { }

  title = 'Project-Manager';
  parentTaskList: any;
  taskDetails: any = [];
  userDetails: any = [];
  projDetails: any = [];
  managerDetails: any = [];
  projectNameList: any = [];
  pager: any = {};
  pagedItems: any = [];
  page: number;
  response: any;
  search: any = {
    projSearch: '',
    userSearch: ''

  }
  deleteUserValue: any = [];

  key: string = ''; //set default
  reverse: boolean = false;
  submitted: boolean = false;
  addUserSubmitted: boolean = false;
  projectSubmitted: boolean = false;
  projShow: boolean = true;
  userShow: boolean = false;
  taskShow: boolean = false;
  myForm: FormGroup;
  addUserForm: FormGroup;
  myProjectForm: FormGroup;
  viewTaskForm: FormGroup;
  orderBy: boolean = false;
  isUserUpdate: boolean = false;
  filter = false;
  Start_Date = new Date();
  selectedManager: string = '';
  selectedProject: string = '';
  selectedParentTask: string = '';
  selectedUser: string = '';
  searchedProject: string = '';
  isTaskUpdate: boolean = false;

  public ngAfterContentInit() {

  }


  public ngOnInit() {


    // Common Code 

    this.callAllMethods();



    // Code for Project screen

    this.myProjectForm = this.fb.group({
      Project_ID: 0,
      Project_Name: ['', Validators.required],
      Priority_Project: [0, Validators.required],
      Start_Date: ['', Validators.required],
      End_Date: ['', Validators.required],
      Employee_ID: [''],
      Manager_Name: [''],
      Project: [''],
      Priority: 0,
      Manager_ID: [''],
      Status: 0,
      TaskCount: 0,
      Action: '',
      Is_Active: 1,
      ProjStatus: [''],
      selectedManager: [{ disabled: true, value: '' }, Validators.required],
      Active_Progress:['']
    });

    // Code for Task screen

    this.myForm = this.fb.group({
      Task_ID: 0,
      Task: ['', Validators.required],
      Priority: [0, Validators.required],
      Parent_ID: [''],
      Parent_Task: [''],
      Start_Date: ['', Validators.required],
      End_Date: [''],
      Is_Active: 0,
      IsActive: 0,
      Project_ID: 0,
      Status: 0,
      Action: [''],
      User_ID: [''],
      selectedProject: [{ disabled: true, value: '' }, Validators.required],
      selectedParentTask: [{ disabled: true, value: '' }, Validators.required],
      selectedUser: [{ disabled: true, value: '' }, Validators.required],
      Project_Name: [''],

    });


    // Code for User screen  

    this.addUserForm = this.fb.group({
      First_Name: ['', Validators.required],
      Last_Name: ['', Validators.required],
      User_ID: 0,
      Employee_ID: ['', Validators.required],
      Project_ID: '',
      Task_ID: ''
    });

    this.viewTaskForm = this.fb.group({
      searchedProject: [{ disabled: true, value: '' }]
    });


    $('.modal').on('hidden.bs.modal', (e) => {
      if (e.target.id == 'managerModal') {
        this.myProjectForm.get('selectedManager').setValue(this.selectedManager);
      };
      if (e.target.id == 'projNameModal') {
        this.myForm.get('selectedProject').setValue(this.selectedProject);
      };
      if (e.target.id == 'parentTaskModal') {
        this.myForm.get('selectedParentTask').setValue(this.selectedParentTask);
      };
      if (e.target.id == 'userModal') {
        this.myForm.get('selectedUser').setValue(this.selectedUser);
      };
      if (e.target.id == 'taskProjectModal') {
        this.viewTaskForm.get('searchedProject').setValue(this.searchedProject);
      };
    })

  };

  // Common Code 

  callAllMethods() {
    this.getProjectName();
    this.getProjectDetails();
    this.getTaskManager();
    this.getUserDetails();
    this.getManagerDetails();
    this.getParentDetails();
  };

  // Code for Project screen

  getParentDetails() {
    this.appServices.getParentTask().subscribe(data => {
      this.parentTaskList = data.ContentResult;
    });
  };

  getProjectDetails() {
    this.appServices.getProjectDetails().subscribe(data => {
      this.projDetails = data.ContentResult;
    });
  };

  getManagerDetails() {
    this.appServices.getManagerDetails().subscribe(data => {
      this.managerDetails = data.ContentResult;
    });

  };

  getProjectName() {
    this.appServices.getProjectName().subscribe(data => {
      this.projectNameList = data.ContentResult;
    });
  };


  onProjectSubmit() {
    this.projectSubmitted = true;
    var vMangerName = this.selectedManager;
    if (vMangerName == "") {
      vMangerName = this.myProjectForm.value.Manager_ID;
    }

    if (this.myProjectForm.valid && vMangerName) {
      if (this.compareTwoDates(this.myProjectForm.value)) {
        var VID = this.myProjectForm.value.Project_ID;

        var vProjForm = {
          Project_ID: VID,
          Project: this.myProjectForm.value.Project_Name,
          Start_Date: this.myProjectForm.value.Start_Date,
          End_Date: this.myProjectForm.value.End_Date,
          Priority: this.myProjectForm.value.Priority_Project,
          Manager_ID: vMangerName
        };

        this.appServices.submitProject(vProjForm).subscribe(data => {
          if (data) {
            Swal('Success', `Data ${VID == 0 ? 'Added' : 'Updated'} successfully...`, 'success');
            this.myProjectForm.reset();
            this.projectSubmitted = false;
            this.callAllMethods();
          }
          else {
            Swal('Failed', 'Please try again..', 'error');
          }
        });

      }
      else {
        Swal('Failed', 'End Date should be greater than Start Date', 'error');

      }
    }
    else {
      Swal('Failed', 'All fields are mandatory.', 'error');

    }
  };

  EditProject(proj) {
    proj.Project_Name = proj.Project;
    proj.Priority_Project = proj.Priority;
    proj.Employee_ID = proj.Manager_ID;
    proj.Manager_Name = '';
    proj.selectedManager = proj.Manager_ID;
    if (proj.Start_Date != null)
      proj.Start_Date = proj.Start_Date.slice(0, -9);
    if (proj.End_Date != null)
      proj.End_Date = proj.End_Date.slice(0, -9);
    
      this.myProjectForm.setValue(proj);
  };


  public ResetProject() {
    this.myProjectForm.reset();
    this.submitted = false;
  }

  public SuspendProject(proj) {
    this.appServices.SuspendProject(proj).subscribe(data => {
      if (data) {
        Swal('Success', `Data Suspended successfully...`, 'success');

        this.callAllMethods();
      }
      else {
        Swal('Failed', 'Please try again..', 'error');
      }
    });
  }


  // Code for Task screen

  getTaskManager() {

    this.appServices.getTaskManager().subscribe(data => {
      this.taskDetails = data.ContentResult;
      this.setPage(1);
    });
  };

  onSubmit() {
    this.submitted = true;
    var VID = this.myForm.value.Task_ID;

    var vProjName = this.selectedProject;
    if (vProjName == "")
      vProjName = this.myForm.value.Project_ID;

    var vParentTask = this.selectedParentTask;
    if (vParentTask == "")
      vParentTask = this.myForm.value.Parent_ID;

    var vUserName = this.selectedUser;
    if (vUserName == "")
      vUserName = this.myForm.value.User_ID;

    if (this.myForm.valid && vProjName != "" && vParentTask != "" && vUserName != "") {
      if (this.compareTwoDates(this.myForm.value)) {

        var vTaskForm = {
          Task_ID: VID,
          Parent_ID: vParentTask,
          Task: this.myForm.value.Task,
          Start_Date: this.myForm.value.Start_Date,
          End_Date: this.myForm.value.End_Date,
          Priority: this.myForm.value.Priority,
          Project_ID: vProjName,
          User_ID: vUserName
        };


        this.appServices.submitTask(vTaskForm).subscribe(data => {
          if (data) {
            Swal('success', `Data ${VID == 0 ? 'Added' : 'Updated'} successfully...`, 'success');
            this.myForm.reset();
            this.submitted = false;
            this.callAllMethods();
            this.isTaskUpdate = false;
            this.filter = true;
          }
          else {
            Swal('Failed', 'Please try again..', 'error');
          }
        });
      }
      else {
        Swal('Failed', 'End Date should be greater than Start Date', 'error');

      }
    }
    else {
      Swal('Failed', 'All fields are mandatory.', 'error');

    }
  };


  public EditTask(task) {

    this.isTaskUpdate = true;
    this.filter = false;

    task.IsActive = 0;
    task.selectedProject = task.Project_ID;
    task.selectedParentTask = task.Parent_ID;
    task.selectedUser = task.User_ID;
    task.Parent_Task = task.Parent_Task;
    $('.task-manager-page a[href="#addTask"]').tab('show');
    if (task.Start_Date != null)
      task.Start_Date = task.Start_Date.slice(0, -9);
    if (task.End_Date != null)
      task.End_Date = task.End_Date.slice(0, -9);
    this.myForm.setValue(task);
  };

  public EndTask(task) {

    if (task.End_Date != null && task.End_Date != "") {
      this.appServices.updateEndTask(task).subscribe(data => {

        this.callAllMethods();
        Swal('success', `Data updated successfully...`, 'success');
      });
    }
    else {
      Swal('Failed', 'Please provide End date...', 'error');
    }

  }

  public ResetTask() {
    this.myForm.reset();
    this.submitted = false;
  }

  // Code for User screen  

  getUserDetails() {

    this.appServices.getUserDetails().subscribe(data => {

      this.userDetails = data.ContentResult;

    });
  };


  AddUserSubmit() {
    this.addUserSubmitted = true;
    if (this.addUserForm.valid) {
      var VID = this.addUserForm.value.User_ID;
      this.appServices.submitUser(this.addUserForm.value).subscribe(data => {
        if (data) {
          Swal('Success', `Data ${VID == 0 ? 'Added' : 'Updated'} successfully...`, 'success');
          this.AddUserResetTask();
          this.callAllMethods();
        }
        else {
          Swal('Failed', 'Please try again..', 'error');
        }
      });
    }
  };

  public EditUser(user) {
    this.addUserForm.setValue(user);
    this.isUserUpdate = true;
  };

  public DeleteUser(user) {
    $("#deleteModal").modal();
    this.deleteUserValue = user;
  };

  public ConfirmDeleteUser() {
    var vDeleteUserValue = this.deleteUserValue;
    this.appServices.deleteUser(vDeleteUserValue).subscribe(data => {
      if (data) {
        Swal('Success', `Data Deleted successfully...`, 'success');
      }
      else {
        Swal('Failed', 'Please try again..', 'error');
      }
      $("#deleteModal").modal('hide');
      this.AddUserResetTask();
      this.callAllMethods();
    });
  };

  public AddUserResetTask() {
    this.addUserForm.reset();
    this.addUserSubmitted = false;
    this.isUserUpdate = false;
  }


  // Common function

  setPage(page: number) {
    if (this.pager.totalPages != 0) {
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }
    }
    // get pager object from service
    this.pager = this.pageService.getPager(this.taskDetails.length, page);
    // get current page of items
    this.pagedItems = this.taskDetails.slice(this.pager.startIndex, this.pager.endIndex + 1);
  };


  compareTwoDates(data) {
    if (data.End_Date != null && data.End_Date != '') {
      if (new Date(data.End_Date) < new Date(data.Start_Date))
        return false;

      else
        return true;
    }
    else {
      return true;
    }
  };

  AddProject() {
    this.userShow = false;
    this.taskShow = false;
    this.projShow = true;
  };

  AddTask() {
    this.userShow = false;
    this.taskShow = false;
    this.projShow = false;
  };

  AddUser() {
    this.userShow = true;
    this.taskShow = false;
    this.projShow = false;
  };

  ViewTask() {
    this.userShow = false;
    this.taskShow = true;
    this.projShow = false;
  };

  ManagerSearch() {
    this.selectedManager = this.myProjectForm.get('selectedManager').value;
    $("#managerModal").modal();

  };

  ProjectSearch() {
    this.selectedProject = this.myForm.get('selectedProject').value;
    $("#projNameModal").modal();

  };

  ParentSearch() {
    this.selectedParentTask = this.myForm.get('selectedParentTask').value;
    $("#parentTaskModal").modal();

  };

  UserSearch() {
    this.selectedUser = this.myForm.get('selectedUser').value;
    $("#userModal").modal();

  };

  SearchTaskProject() {
    this.searchedProject = this.viewTaskForm.get('searchedProject').value;
    $("#taskProjectModal").modal();

  };

  onFilterChange() {
    this.filter = !this.filter;
  };

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  };

  onParentCheck() {
    this.filter = !this.filter;
    if (!this.filter) {
    }
  };


  sortProject(projectkey) {
    this.projDetails = this.orderPipe.transform(this.projDetails, projectkey);
  };

  sortUser(userkey) {
    this.userDetails = this.orderPipe.transform(this.userDetails, userkey);
  };

  sortTask(taskkey) {
    this.pagedItems = this.orderPipe.transform(this.pagedItems, taskkey);
  };
}