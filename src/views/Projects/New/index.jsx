import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Form, Input, Select, Typography } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import "./newProject.css";
import AddMembersModal from "../../../components/Projects/AddMembersModal";
import TinyMCEEditor from "../../../components/UI/Input/TinyMCEEditor";
import {
  createProjectAuthorize,
  fetchAllProjectCategories,
} from "../../../store/actions/project";
import { createProjectSchema } from "../../../services/project";
import { createAction } from "../../../store/actions";
import { actionType } from "../../../store/actions/type";

const NewProject = (props) => {
  const dispatch = useDispatch();
  const projectCategories = useSelector(
    (state) => state.project.projectCategories
  );
  const serverError = useSelector((state) => state.project.error);
  const projectDetail = useSelector((state) => state.project.projectDetail);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  console.log('project detaim from new index ',projectDetail);


  const formik = useFormik({
    initialValues: {
      Name: "",
      Description__c: "",
      CategoryId__c: 0,
    },
    validationSchema: createProjectSchema,
    validateOnMount: true,
    // sau khi dung formik.resetForm(), tao project lan nua ma khong nhap gi thi formik.isValid van la true
    // dung initialErrors de xu ly van de nay
    initialErrors: {
      Name: "",
      Description__c: "",
      CategoryId__c: "",
    },
  });

  useEffect(() => {
    dispatch(fetchAllProjectCategories);
  }, [dispatch]);


  useEffect(() => {
    if (serverError === "Project name already exists") {
      formik.setErrors({
        Name: serverError,
        ...formik.errors,
      });
    }
    // eslint-disable-next-line
  }, [serverError]);

  const handleSubmit = () => {
    formik.setTouched({
      Name: true,
    });

    if (!formik.isValid) return;

    dispatch(
      createProjectAuthorize(formik.values, () => {
        formik.resetForm();
        setShowAddMembersModal(true);
        console.log('setShowAddMembersModal(true)')
      })
    );
  };

  const handleCancel = () => {
    dispatch(createAction(actionType.SET_PROJECT_DETAIL, null));
    setShowAddMembersModal(false);
  };

  return (
    <div style={{ maxWidth: 980 }} className="mx-auto">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/projects">Projects</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>New project</Breadcrumb.Item>
      </Breadcrumb>

      <Typography.Title level={3}>New project</Typography.Title>

      <Form className="form" layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={
            <>
              Project name <span className="text-red-700">*</span>
            </>
          }
          help={formik.touched.Name && formik.errors.Name}
          validateStatus={
            formik.touched.Name && !!formik.errors.Name
              ? "error"
              : ""
          }
        >
          <Input
            name="Name"
            value={formik.values.Name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Item>

        <Form.Item
          label={
            <>
              Project category <span className="text-red-700">*</span>
            </>
          }
          help={formik.touched.CategoryId__c && formik.errors.CategoryId__c}
          validateStatus={
            formik.touched.CategoryId__c && !!formik.errors.CategoryId__c
              ? "error"
              : ""
          }
        >
          <Select
            className="w-full"
            placeholder="Select a project category"
            name="CategoryId__c"
            value={formik.values.CategoryId__c}
            onChange={(value) => formik.setFieldValue("CategoryId__c", value)}
          >

            <Select.Option value={0}>Select a project category</Select.Option>
            {projectCategories.map(({ id, projectCategoryName }) => {
              return (
                <Select.Option key={id} value={id}>
                  {projectCategoryName}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item label="Description__c" style={{ minHeight: 230 }}>
          <TinyMCEEditor
            name="Description__c"
            value={formik.values.Description__c}
            onEditorChange={(newValue) =>
              formik.setFieldValue("Description__c", newValue)
            }
          />
        </Form.Item>

        <div className="flex">
          <Link
            to="/projects"
            className="flex justify-center items-center h-8 bg-gray-300 hover:bg-gray-400 focus:bg-blue-300 text-gray-700 hover:text-gray-700 focus:text-blue-700 border-0 mr-1 font-medium py-1.5 px-3 rounded"
          >
            Cancel
          </Link>

          <Button
            htmlType="submit"
            className="flex justify-center items-center h-8 bg-blue-800 hover:bg-blue-700 focus:bg-blue-800 text-white hover:text-white focus:text-white font-medium py-1.5 px-3 rounded border-0"
          >
            Create project
          </Button>
        </div>
      </Form>

      {projectDetail && (
        <AddMembersModal
          visible={showAddMembersModal}
          onCancel={handleCancel}
          project={projectDetail}
        />
      )}
    </div>
  );
};

export default NewProject;
