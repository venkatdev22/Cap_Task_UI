export interface Task {
    Task_ID: number;
    Parent_ID?: number;
    Parent_Task?: any;
    Task: string;
    Start_Date: Date;
    End_Date: Date;
    Priority: number;
    Project_ID?: any;
    Status?: any;
    User_ID?: any;
    Action?: any;
    Is_Active: number;
    Project_Name?: any;
}

export interface GetTaskResult {
    IsStatusSuccessful: boolean;
    ContentResult: Task[];
    ErrorResponseMessageList?: any;
}

export interface ParentTask {
    Parent_ID: number;
    Parent_Task: string;
}

export interface ParentTaskResult {
    IsStatusSuccessful: boolean;
    ContentResult: ParentTask[];
    ErrorResponseMessageList?: any;
}

export interface User {
    User_ID: number;
    First_Name: string;
    Last_Name: string;
    Employee_ID: number;
    Project_ID: number;
    Task_ID?: any;
}

export interface UserResult {
    IsStatusSuccessful: boolean;
    ContentResult: User[];
    ErrorResponseMessageList?: any;
}

export interface Project {
    Project_ID: number;
    Project: string;
    Start_Date?: Date;
    End_Date?: Date;
    Priority?: number;
    Manager_ID?: any;
    Status?: any;
    TaskCount: number;
    ProjStatus: string;
    Action?: any;
    Is_Active: number;
    Active_Progress: string;
}

export interface ProjectResult {
    IsStatusSuccessful: boolean;
    ContentResult: Project[];
    ErrorResponseMessageList?: any;
}


