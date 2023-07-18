import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Space, Input, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { deleteUser, fetchAllUsers } from "../../../store/actions/user";
import EditUserModal from "../../../components/Users/EditUserModal";

const UserManagment = (props) => {
  const dispatch = useDispatch();
  let userList = useSelector((state) => state.user.userList);
  const [state, setState] = useState({ filteredInfo: null, sortedInfo: null });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const customedUserListForFilter = userList?.map((item, i) => {
    return { text: item.Name, value: item.Name };
  });

  const customedListForNumber = userList?.map((item, index) => {
    return { ...item, orderNumber: index + 1, key: item.Id };
  });

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleChange = (pagination, filters, sorter) => {
    setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  const clearAll = () => {
    setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };

  const handleEditUser = (user) => () => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  const handleCancelEditUser = () => {
    setShowEditUserModal(false);
  };

  let { sortedInfo, filteredInfo } = state;
  sortedInfo = sortedInfo || {};
  filteredInfo = filteredInfo || {};

  const columns = [
    {
      title: "No.",
      dataIndex: "orderNumber",
      key: "orderNumber",
      width: "6%",
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      filters: customedUserListForFilter,
      filteredValue: filteredInfo.Name || null,
      onFilter: (value, record) => record.Name.includes(value),
      sorter: (a, b) => {
        //
        let name1 = a.Name?.trim().toLowerCase();
        let name2 = b.Name?.trim().toLowerCase();

        if (name1 < name2) {
          return 1;
        }
        return -1;
      },
      sortOrder: sortedInfo.columnKey === "Name" && sortedInfo.order,
      ellipsis: true,
      width: "25%",
      ...getColumnSearchProps("Name"),
    },
    {
      title: "User ID",
      dataIndex: "Id",
      key: "Id",
      sorter: (a, b) => a.Id - b.Id,
      sortOrder: sortedInfo.columnKey === "Id" && sortedInfo.order,
      ellipsis: true,
      width: "12%",
    },

    {
      title: "Email",
      dataIndex: "Email__c",
      key: "Email__c",
      width: "30%",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number__c",
      key: "phone_number__c",
    },
  
    {
      title: "Action",
      key: "action",
      render: (text, record, index) => (
        <Space size="small">
          {/* edit button */}
          <Button
            className="bg-transparent hover:bg-transparent focus:bg-transparent text-blue-700 hover:text-blue-500 focus:text-blue-500 border-0 shadow-none"
            icon={<EditOutlined />}
            onClick={handleEditUser(record)}
          />

          {/* delete button*/}
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => {
              dispatch(deleteUser(record.Id));
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button
              className="bg-transparent hover:bg-transparent focus:bg-transparent text-red-600 hover:text-red-500 focus:text-red-500 border-0 shadow-none"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Space>

      <Table
        columns={columns}
        dataSource={customedListForNumber}
        onChange={handleChange}
      />
      
      {selectedUser && (
        <EditUserModal
          visible={showEditUserModal}
          onCancel={handleCancelEditUser}
          user={selectedUser}
        />
      )}
    </>
  );
};

export default UserManagment;
