import React from "react";
import { Button, Form, Input, Modal, Typography } from "antd";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { fetchAllUsers, updateUser } from "../../../store/actions/userSF";

const EditUserModal = ({ visible, onCancel, user }) => {
  const { Id, Email__c, Name,phone_number__c } = user;
  const dispatch = useDispatch();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      Id,
      Email__c,
      Name,
      phone_number__c
    },
    validateOnMount: true
  });

  const handleSubmit = () => {
    formik.setTouched({
      Email__c: true,
      Name: true,
    });

    if (!formik.dirty) return;

    if (!formik.isValid) return;

    dispatch(
      updateUser(formik.values, () => {
        // BE store data hơi lâu nên phải setTimeout
        setTimeout(() => {
          dispatch(fetchAllUsers());
          Swal.fire({
            title: "User updated successfully",
            icon: "success",
            showConfirmButton: false,
          });
          formik.resetForm();
          onCancel();
        }, 400);
      })
    );
  };

  const handleCancel = () => {
    formik.resetForm();
    onCancel();
  };

  return (
    <Modal
      title={<Typography.Title level={5}>Edit User</Typography.Title>}
      visible={visible}
      onCancel={onCancel}
      maskStyle={{ zIndex: 1050 }}
      maskClosable={false}
      wrapClassName="z-modal"
      className="z-modal"
      footer={null}
      centered
      destroyOnClose={true}
    >
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={
            <Typography.Text strong>
              Id <span className="text-red-700">*</span>
            </Typography.Text>
          }
        >
          <Input name="Id" value={formik.values.Id} disabled />
        </Form.Item>

        <Form.Item
          label={
            <Typography.Text strong>
              Email <span className="text-red-700">*</span>
            </Typography.Text>
          }
          help={formik.touched.Email__c && formik.errors.Email__c}
          validateStatus={
            formik.touched.Email__c && !!formik.errors.Email__c ? "error" : ""
          }
        >
          <Input
            name="Email__c"
            value={formik.values.Email__c}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Item>

        <Form.Item
          label={
            <Typography.Text strong>
              Name <span className="text-red-700">*</span>
            </Typography.Text>
          }
          help={formik.touched.Name && formik.errors.Name}
          validateStatus={
            formik.touched.Name && !!formik.errors.Name ? "error" : ""
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
          label={<Typography.Text strong>Phone number</Typography.Text>}
          help={formik.touched.phone_Number__c && formik.errors.phone_Number__c}
          validateStatus={
            formik.touched.phone_Number__c && !!formik.errors.phone_Number__c
              ? "error"
              : ""
          }
        >
          <Input
            name="phone_number__c"
            value={formik.values.phone_number__c}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Item>

      

       

        <Form.Item className="mb-0 text-right">
          <Button
            htmlType="submit"
            className="bg-blue-700 hover:bg-blue-600 focus:bg-blue-700 text-white font-semibold hover:text-white focus:text-white border-blue-700 hover:border-blue-600 focus:border-blue-700 rounded mr-1"
          >
            Update
          </Button>
          <Button
            className="hover:bg-gray-200 text-gray-700 hover:text-gray-700 font-semibold border-transparent hover:border-gray-200 rounded shadow-none"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
