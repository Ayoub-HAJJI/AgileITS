import AuthService from "./auth";
import UserService from "./user";
import UserService2 from "./userSF";
import ProjectService from "./project";
import ProjectService2 from "./projectSF";
import TaskService from "./task";
import PriorityService from "./priority";
import StatusService from "./status";
import CommentService from "./comment";


export const authService = new AuthService();
export const userService = new UserService();
export const userService2 = new UserService2();
export const projectService = new ProjectService();
export const projectService2 = new ProjectService2();
export const taskService = new TaskService();
export const priorityService = new PriorityService();
export const statusService = new StatusService();
export const commentService = new CommentService();
