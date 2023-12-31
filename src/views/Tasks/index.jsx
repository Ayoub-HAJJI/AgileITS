import React, { useEffect, useRef, useState } from "react";
import { Breadcrumb, Col, Row, Select, Tooltip, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import  "./Task.css";
import { createAction } from "../../store/actions";
import { actionType } from "../../store/actions/type";
import { fetchProjectDetail } from "../../store/actions/project";
import {
  createTask,
  fetchAllTaskTypes,
  updateTaskStatus,
} from "../../store/actions/task";
import TaskListTitle from "../../components/Tasks/TaskListTitle";
import TaskItem from "../../components/Tasks/TaskItem";
import EditTaskModal from "../../components/Tasks/EditTaskModal";
import { ReactComponent as NewTaskIcon } from "../../assets/images/icons/new_task.svg";
import { ReactComponent as BugIcon } from "../../assets/images/icons/bug.svg";

const Tasks = (props) => {
  const dispatch = useDispatch();
  const projectDetail = useSelector((state) => state.project.projectDetail);
  const taskTypes = useSelector((state) => state.task.taskTypes);
  const taskError = useSelector((state) => state.task.error);
  const [clonedProjectDetail, setClonedProjectDetail] = useState(null);
  const [showNewTaskTextarea, setShowNewTaskTextarea] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const newTaskRef = useRef(null);
  const { projectId } = props.match.params;
  //console.log("I am in tasks/index");
  console.log("ProjectId ",projectId);



  const formik = useFormik({
    initialValues: {
      listUserAsign: [],
      TaskName__c: "",
      Description__c: "",
      Status__r:{Id: "1"},
      originalEstimate__c: 0,
      TimeTrackingSpent__c: 0,
      timeTrackingRemeaining__c: 0,
      Task_Project__r:{Id: projectId},
      typeId: 1,
      Priority__r:{Id:2},
    },
  });

  useEffect(() => {
    console.log('useeffect');
    dispatch(fetchProjectDetail(projectId));
    dispatch(fetchAllTaskTypes);

    return () => {
      dispatch(createAction(actionType.SET_PROJECT_DETAIL, null));
      dispatch(createAction(actionType.SET_TASK_ERROR, null));
    };
  }, [dispatch, projectId]);

  //console.log("ProjectDetail from task ",projectDetail);


  useEffect(() => {
    console.log("useEffect setclonedprojectdetiual");
    setClonedProjectDetail({ ...projectDetail });
  }, [projectDetail]);

  //console.log("clonedProjectDetail",clonedProjectDetail);


  useEffect(() => {
    if (taskError === "Task already exists!") {
      formik.setErrors({
        TaskName__c: taskError,
        ...formik.errors,
      });
    }

    if (taskError === "User is unthorization!") {
      Swal.fire({
        icon: "error",
        title: taskError,
        customClass: {
          confirmButton:
            "flex justify-center items-center h-8 leading-none bg-blue-700 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none text-white hover:text-white font-medium py-1.5 px-3 rounded cursor-pointer",
        },
        buttonsStyling: false,
      }).then(() => formik.resetForm());
    }
    // eslint-disable-next-line
  }, [taskError]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    const clonedProject = { ...projectDetail };

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    console.log("clonedProjectDetail before",clonedProjectDetail);
    console.log(" draggableId : ", draggableId);
    console.log(" source : ", source);
    console.log(" destination : ", destination);


    const draggedItem = {
      ...clonedProject.Statuss__r[source.droppableId].Tasks1__r?.records[source.index],
    };
    
    console.log("draggedItem", draggedItem);
    
    
    // Check if 'tasks1__r' property exists before modifying the records
    if (clonedProject.Statuss__r[source.droppableId].Tasks1__r) {
      clonedProject.Statuss__r[source.droppableId].Tasks1__r.records.splice(
        source.index,
        1
      );
    }

    if (!clonedProject.Statuss__r[destination.droppableId].Tasks1__r) {
      clonedProject.Statuss__r[destination.droppableId].Tasks1__r = {
        records: [],
      };
    }
    if (clonedProject.Statuss__r[destination.droppableId].Tasks1__r) {

        clonedProject.Statuss__r[destination.droppableId].Tasks1__r.records.splice(
        destination.index,
        0,
        draggedItem
      );
    }
    
    
    setClonedProjectDetail({ ...clonedProject });
    

    console.log("clonedProjectDetail after ",clonedProjectDetail);


    dispatch(
      updateTaskStatus(
        {
          taskId: draggableId,  //taskId
          statusId: destination.droppableId,
          projectId:projectId
        },
        () => dispatch(fetchProjectDetail(projectId))
      )
    );
  };
  console.log("clonedProjectDetail",clonedProjectDetail);

  const handleKeyDownOnNewTaskTextarea = (e) => {
    // keyCode = 27 <=> press ESC button
    if (e.keyCode === 27) {
      setShowNewTaskTextarea(false);
    }

    // keyCode = 13 <=> press ENTER button
    if (e.keyCode === 13) {
      e.preventDefault();

      if (!formik.values.TaskName__c.trim().length) {
        return;
      }

      dispatch(
        createTask(formik.values, () => {
          formik.resetForm();
          dispatch(fetchProjectDetail(projectId));
        })
      );
    }
  };

  const handleBlurNewTaskTextarea = () => {
    setShowNewTaskTextarea(false);
  };

  const handleTaskTypeClick = () => {
    setShowNewTaskTextarea(true);
  };

  const handleTaskTypeDropdownVisibleChange = (open) => {
    if (!open) {
      newTaskRef.current.focus();
    }
  };

  const handleClickTaskItem = (taskItem) => () => {
    setSelectedTask(taskItem);
    setShowEditTaskModal(true);
  };

  const handleCancelEditTask = () => {
    setSelectedTask(null);
    setShowEditTaskModal(false);
  };
console.log("i am heeere");
console.log("clonedProjectDetail.statuss_r",clonedProjectDetail?.Statuss__r);

  return (
    <>
      <Breadcrumb >
        <Breadcrumb.Item>
          <Link to="/projects">Projects</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item >{clonedProjectDetail?.Name}</Breadcrumb.Item>
      </Breadcrumb>

      <Typography.Title level={3} >Board</Typography.Title>

      <Row gutter={16}>
        <DragDropContext onDragEnd={handleDragEnd}>

        {clonedProjectDetail && clonedProjectDetail.Statuss__r && clonedProjectDetail.Statuss__r.map((listTaskItem) => {
                 // console.log("listTaskItem",listTaskItem);

            return (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                lg={{ span: 6 }}
                key={listTaskItem.Id} //statusId
                className="mb-4"
              >
                <div className=" bg-white shadow-lg w-full h-full p-2 rounded flex flex-col">
                  <TaskListTitle title={listTaskItem.Name} />

                  <Droppable droppableId={listTaskItem.Id__c}>
                    {(provided) => {
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex-grow "
                        >
                      {listTaskItem && listTaskItem.Tasks1__r && listTaskItem.Tasks1__r.records?.map(
                            (listTaskDetailItem, index) => {
                              return (
                                <TaskItem
                                  key={listTaskDetailItem.Id}
                                  listTaskDetailItem={listTaskDetailItem}
                                  index={index}
                                  onClick={handleClickTaskItem(
                                    listTaskDetailItem
                                  )}
                                />
                              );
                            }
                          )}
                          

                          {provided.placeholder}

                          {listTaskItem.Name === "BACKLOG" && (
                            <>
                              {!showNewTaskTextarea && (
                                <button
                                  onClick={() => setShowNewTaskTextarea(true)}
                                  className="h-8   bg-gray-300  w-full text-center font-medium mt-1 py-1 px-3 rounded duration-300"
                                >
                                  <PlusOutlined className="mr-1" />
                                  <span>Add Card</span>
                                </button>
                              )}
                              {showNewTaskTextarea && (
                                <>
                                  <div
                                    className={`bg-white border-2 mt-1 rounded${
                                      formik.errors.TaskName__c
                                        ? " border-red-500 focus:border-red-500"
                                        : " border-blue-400 focus:border-blue-400"
                                    }`}
                                  >
                                    <textarea
                                      rows="2"
                                      maxLength="255"
                                      placeholder="What needs to be done?"
                                      className="w-full pt-2 px-2 outline-none resize-none"
                                      onKeyDown={handleKeyDownOnNewTaskTextarea}
                                      autoFocus
                                      name="TaskName__c"
                                      value={formik.values.TaskName__c}
                                      onChange={formik.handleChange}
                                      onBlur={handleBlurNewTaskTextarea}
                                      ref={newTaskRef}
                                    ></textarea>

                                    <Select
                                      name="typeId"
                                      value={formik.values.typeId}
                                      onChange={(value) =>
                                        formik.setFieldValue("typeId", value)
                                      }
                                      onClick={handleTaskTypeClick}
                                      onDropdownVisibleChange={
                                        handleTaskTypeDropdownVisibleChange
                                      }
                                      defaultValue={1}
                                      bordered={false}
                                      className="mb-1"
                                      optionLabelProp="label"
                                      dropdownMatchSelectWidth={false}
                                      style={{ marginTop: "-8px" }}
                                    >
                                      {taskTypes.map((type) => {
                                        return (
                                          <Select.Option
                                            key={type.id}
                                            value={type.id}
                                            label={
                                              <div className="h-full flex items-center">
                                                <Tooltip
                                                  title={
                                                    type.taskType
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                    type.taskType.slice(1)
                                                  }
                                                  placement="bottom"
                                                >
                                                  {type.id === 1 && <BugIcon />}
                                                  {type.id === 2 && (
                                                    <NewTaskIcon />
                                                  )}
                                                </Tooltip>
                                              </div>
                                            }
                                          >
                                            <div className="flex justify-start items-center">
                                              {type.id === 1 && (
                                                <BugIcon className="mr-1" />
                                              )}
                                              {type.id === 2 && (
                                                <NewTaskIcon className="mr-1" />
                                              )}
                                              <span>
                                                {type.taskType
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  type.taskType.slice(1)}
                                              </span>
                                            </div>
                                          </Select.Option>
                                        );
                                      })}
                                    </Select>
                                  </div>
                                  {formik.errors.TaskName__c && (
                                    <div className="text-red-500">
                                      {formik.errors.TaskName__c}
                                    </div>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </Col>
            );
          })}
        </DragDropContext>
      </Row>

      {selectedTask && (
        <EditTaskModal
          visible={showEditTaskModal}
          onCancel={handleCancelEditTask}
          task={selectedTask}
        />
      )}
    </>
  );
};

export default Tasks;
