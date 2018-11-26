export interface TASK_DETAILS {
        Task_ID: string;
        Parent_ID: string;
        Task: string;
        Start_Date: Date;
        End_Date: Date;
        Priority: number;
        IsActive: number;
    }

    export interface TaskResult {
        IsStatusSuccessful: boolean;
        ContentResult: TASK_DETAILS[];
        ErrorResponseMessageList?: any;
    }

    export interface PARENT_TASK {
        Parent_ID: string;
        Parent_Task: string;
    }

    export interface PARENT_TASKResult {
        IsStatusSuccessful: boolean;
        ContentResult: PARENT_TASK[];
        ErrorResponseMessageList?: any;
    }

