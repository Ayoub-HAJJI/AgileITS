import React, { useEffect } from "react";
import { Breadcrumb, Button, Form, Input, Select, Typography } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import TinyMCEEditor from "../../../components/UI/Input/TinyMCEEditor";
import {
  fetchAllProjectCategories,
  updateProject,
} from "../../../store/actions/project";
import { createProjectSchema } from "../../../services/project";

const EditProject = (props) => {
  const dispatch = useDispatch();

  const projectInfo = useSelector((state) => state.project.projectEditInfo);

  const projectCategories = useSelector(
    (state) => state.project.projectCategories
  );
  const serverError = useSelector((state) => state.project.error);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      Name: "",
      Description__c: "",
      Id: 0,
      creator__r: 0,
      CategoryId__c: "",
    },
    validationSchema: createProjectSchema,
    validateOnMount: true,
    initialErrors: {
      Name: "",
      Description__c: "",
      Id: 0,
      creator__r: 0,
      CategoryId__c: "",
    },
  });

  useEffect(() => {
    dispatch(fetchAllProjectCategories);
  }, [dispatch]);

  useEffect(() => {
    formik.setValues(projectInfo);
    // eslint-disable-next-line
  }, [dispatch, projectInfo]);

  useEffect(() => {
    if (serverError === "Project name already exists") {
      formik.setErrors({
        projectName: serverError,
        ...formik.errors,
      });
    }
    // eslint-disable-next-line
  }, [serverError]);

  const handleUpdateProject = () => {
    formik.setTouched({
      projectName: true,
      categoryId: true,
    });

    if (!formik.isValid) return;

    dispatch(
      updateProject(formik.values, () => {
        props.history.push("/projects");
      })
    );
  };

  return (
    <div style={{ maxWidth: 980 }} className="mx-auto">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/projects">Projects</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Project settings</Breadcrumb.Item>
      </Breadcrumb>

      <Typography.Title level={3}>Update project</Typography.Title>

      <Form layout="vertical" onFinish={handleUpdateProject}>
        <Form.Item
          label={
            <>
              Project ID <span className="text-red-700">*</span>
            </>
          }
        >
          <Input disabled value={formik.values.id} />
        </Form.Item>
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
            name="projectName"
            value={formik.values.Name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Item>

        <Form.Item
          label={<>Project category</>}
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
            defaultValue={formik.values.CategoryId__c}
            value={formik.values.CategoryId__c}
            onChange={(value) => formik.setFieldValue("CategoryId__c", value)}
          >
            {projectCategories.map(({ id, projectCategoryName }, i) => {
              return (
                <Select.Option key={i} value={id}>
                  {projectCategoryName}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item label="Description" style={{ minHeight: 230 }}>
          <TinyMCEEditor
            name="Description__c"
            value={formik.values.Description__c}
            onEditorChange={(value) =>
              formik.setFieldValue("Description__c", value)
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
            className="flex justify-center items-center h-8 bg-blue-700 hover:bg-blue-600 focus:bg-blue-600 text-white hover:text-white focus:text-white font-medium py-1.5 px-3 rounded border-0"
          >
            Update
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditProject;
