import React, { useEffect, useRef } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Menu,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { EllipsisOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchAllProjects, deleteProject } from "../../store/actions/project";
import { createAction } from "../../store/actions";
import { actionType } from "../../store/actions/type";

const Projects = (props) => {
  const dispatch = useDispatch();
  const debounceSearchRef = useRef(null);
  const projectList = useSelector((state) => state.project.projectList);

  const dataSource = projectList.map((project) => {
    return { ...project, key: project.Id };
  });
  console.log("ha datasource:",dataSource);

  useEffect(() => {
    dispatch(fetchAllProjects());
  }, [dispatch]);

  const handleSearch = (e) => {
    let params = {};

    if (e.target.value.length > 0) {
      params = { keyword: e.target.value };
    }

    if (debounceSearchRef.current) {
      clearTimeout(debounceSearchRef.current);
    }

    debounceSearchRef.current = setTimeout(() => {
      dispatch(fetchAllProjects(params));
    }, 400);
  };

  const handleEditInfo =(record)=>{
      let chosenProject ={
        "Id": record.Id,
        "Name": record.Name,
        "Description__c": record.Description__c,
        "CategoryId__c":record.CategoryId__c
      }
      console.log('chosenProject:', chosenProject);
      dispatch(createAction(actionType.SET_PROJECT_EDIT_INFO, chosenProject))
    }

  const showConfirmDeleteProjectModal = ({ Name, Id: projectId }) => {
    return () => {
      Swal.fire({
        title: `Are you sure to delete\n${Name}?`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Delete",
        allowOutsideClick: false,
        focusCancel: true,
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "flex justify-center items-center h-8 leading-none mr-2 bg-red-600 hover:bg-red-500 focus:bg-red-500 text-white hover:text-white focus:text-white font-base py-1.5 px-3 rounded border-0",
          cancelButton:
            "flex justify-center items-center h-8 leading-none mr-2 bg-gray-300 hover:bg-gray-400 focus:bg-gray-300 text-gray-700 hover:text-gray-700 focus:text-gray-700 font-base py-1.5 px-3 rounded border-0",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          handleDeleteProject(projectId);
        }
      });
    };
  };

  const handleDeleteProject = (projectId) => {
    dispatch(
      deleteProject(projectId, () => {
        showProjectDeletedSuccessfullyModal();
      })
    );
  };

  const showProjectDeletedSuccessfullyModal = () => {
    dispatch(fetchAllProjects());
    Swal.fire({
      title: "Project deleted successfully",
      icon: "success",
      customClass: {
        confirmButton:
          "flex justify-center items-center h-8 leading-none bg-blue-700 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none text-white hover:text-white font-medium py-1.5 px-3 rounded cursor-pointer",
      },
      buttonsStyling: false,
    });
  };

  return (
    <>
      <div className="mb-3 flex items-start">
        <Typography.Title level={3} className="flex-grow">
          Projects
        </Typography.Title>
        <Link
          to="/projects/new"
          className="flex justify-center items-center h-8 bg-blue-800 hover:bg-blue-900 focus:bg-blue-900 text-white hover:text-white font-medium py-1.5 px-3 rounded cursor-pointer"
        >
          Create project
        </Link>
      </div>

      <div>
        <Input
          allowClear
          suffix={<SearchOutlined />}
          className="mb-6 w-48 rounded"
          onChange={handleSearch}
        />
      </div>

      <Table className="shadow-lg" dataSource={dataSource}>
        
        <Table.Column
          title="Project name"
          dataIndex="Name"
          key="Name"
          render={(Name, record) => (
            <Link
              to={`/projects/${record.Id}/board`}
              className="text-blue-700 hover:text-blue-700 focus:text-blue-700"
            >
              {Name}
            </Link>
          )}
          sorter={(a, b) => a.Name.localeCompare(b.Name)}
        />
        <Table.Column
          title="Category name"
          dataIndex="CategoryName__c"
          key="CategoryName__c"
          sorter={(a, b) => a.CategoryName__c.localeCompare(b.CategoryName__c  )}
        />
         <Table.Column
          title="Description"
          dataIndex="Description__c"
          key="Description__c"
          sorter={(a, b) => a.Description__c.localeCompare(b.Description__c  )}
        />
        <Table.Column
          title="Creator"
          key="creator__r"
          render={(record) => <>hackmasters</>}
        />
        <Table.Column
  title="Members"
  dataIndex="Project_Members__r"
  key="Project_Members__r"
  render={(Project_Members__r) => {
    if (Project_Members__r && Project_Members__r.records && Array.isArray(Project_Members__r.records)) {
      console.log("Accessing records");
      console.log("First member name:", Project_Members__r.records[0]?.Membre__r?.Name);

      return (
        <Avatar.Group
          maxCount={2}
          maxStyle={{ color: "#f56a00", backgroundColor:"rgb(241, 240, 255)" }}
        >
          {Project_Members__r.records.map((member) => (
            <Tooltip title={member?.Membre__r?.Name} key={member?.Id}>
              <Avatar src={member?.Membre__r?.avatar__c} key={member?.Id} />
            </Tooltip>

          ))}
        </Avatar.Group>
      );
    } else {
      console.log("No records found");
      return null;
    }
  }}
/>

        <Table.Column
          title="Actions"
          key="actions"
          render={(record) => {
            const menu = (
              <Menu className="rounded">
                <Menu.Item key="projectSettings">
                  <Link to={`/projects/${record.Id}/edit`} onClick={()=>{handleEditInfo(record)}}>
                    Project settings
                  </Link>
                </Menu.Item>
                <Menu.Item key="moveToTrash">
                  <button onClick={showConfirmDeleteProjectModal(record)}>
                    Move to trash
                  </button>
                </Menu.Item>
              </Menu>
            );
            return (
              <Dropdown
                placement="bottomRight"
                overlay={menu}
                trigger={["click"]}
              >
                <Button className="flex justify-center items-center py-0 px-2 border-0 rounded shadow-none text-black hover:text-black focus:text-white bg-transparent hover:bg-gray-300 focus:bg-gray-700">
                  <EllipsisOutlined className="text-xl" />
                </Button>
              </Dropdown>
            );
          }}
        />
      </Table>
      
    </>
  );
};

export default Projects;
