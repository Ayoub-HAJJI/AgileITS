import React from "react";
import { Avatar, Col, Row, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Draggable } from "react-beautiful-dnd";
import TaskItemPriorityBadge from "../TaskItemPriorityBadge";
import { ReactComponent as NewTaskIcon } from "../../../assets/images/icons/new_task.svg";
import { ReactComponent as BugIcon } from "../../../assets/images/icons/bug.svg";

const TaskItem = ({ listTaskDetailItem, index, onClick }) => {
  return (
    <Draggable draggableId={listTaskDetailItem.Id.toString()} index={index}>
      {(provided) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="w-full bg-gray-50 rounded py-3 px-2 mt-1 shadow-lg"
            onClick={onClick}
          >
            <Row>
              <Col span={18}>
                {listTaskDetailItem.TaskName__c && (
                  <div className="mb-2 ">{listTaskDetailItem.TaskName__c}</div>
                )}
                {!listTaskDetailItem.TaskName__c && (
                  <div className="mb-2 text-gray-400">Unnamed</div>
                )}

                <div className="flex justify-start items-center">
                  {/* <Tooltip
                    title={
                      listTaskDetailItem.TaskType__r.Name__c
                        .charAt(0)
                        .toUpperCase() +
                      listTaskDetailItem.TaskType__r.Name__c.slice(1)
                    }
                    placement="bottom"
                  >
                    {listTaskDetailItem.TaskType__r.Id__c === 1 && (
                      <BugIcon className="mr-1" />
                    )}
                    {listTaskDetailItem.TaskType__r.Id__c === 2 && (
                      <NewTaskIcon className="mr-1" />
                    )}
                  </Tooltip> */}

                  <TaskItemPriorityBadge
                    priorityTask={listTaskDetailItem.Priority__r.Name}
                  />
                </div>
              </Col>
              {/* <Col span={6}>
                <div className="h-full w-full flex justify-end items-end">
                  {!listTaskDetailItem.assigness.length && (
                    <Tooltip title="Unassigned" placement="top">
                      <Avatar size="small" icon={<UserOutlined />} />
                    </Tooltip>
                  )}
                  {listTaskDetailItem.assigness && (
                    <Avatar.Group size="small" maxCount={2}>
                      {listTaskDetailItem.assigness.map((assignee) => {
                        return (
                          <Tooltip
                            key={assignee.id}
                            title={assignee.name}
                            placement="top"
                          >
                            <Avatar src={assignee.avatar} />
                          </Tooltip>
                        );
                      })}
                    </Avatar.Group>
                  )}
                </div>
              </Col> */}
            </Row>
          </div>
        );
      }}
    </Draggable>
  );
};

export default TaskItem;
