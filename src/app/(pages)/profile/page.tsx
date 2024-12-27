"use client";
import React, { useState } from 'react';
import useSWR from 'swr';
import { Button, Modal, Form, Input, DatePicker, Upload, message, Avatar, Table, Tag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { CustomerEntity, UpdateCustomer } from '@/types/entities/customer-entity';
import { ChangeAvatar } from '@/services/user-service';
import { EditCustomer } from '@/services/customer-service';
import { GetMe } from '@/services/auth-service';
import moment from 'moment';
import { useSession } from 'next-auth/react';


// Fetcher function for useSWR

const ProfilePage: React.FC = () => {
  // Retrieve userId from localStorage
  const { data: session } = useSession();
  const users = session?.user;
  const userId = users?.user.Id;

  const [thumbnail, setThumbnail] = useState<File | null>(null);

//   const { data: addresses } = useSWR<Address[]>(
//     userId ? `/user/address/${userId}` : null, 
//     () => getAddress(userId!).then(res => res.data)
//   );

  // Fetch user data using useSWR
  const { data: user, error, mutate } = useSWR<CustomerEntity>(userId ? `/user/${userId}` : null, () => GetMe(userId!));

  // State to control the visibility of the Edit Profile modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Form instance for Edit Profile
  const [form] = Form.useForm();

  // Handle avatar change
  const handleChangeAvatar = async (file: File) => {
    try {
      await ChangeAvatar(userId!, file);
      message.success('Avatar updated successfully!');
      mutate(); // Refresh the user data
    } catch (err) {
      message.error('Failed to update avatar.');
    }
  };

  // Handle Edit Profile form submission
  const onFinish = async (values: UpdateCustomer) => {
    try {
      // Format the dateOfBirth to a string if it's a moment object
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth,
      };
      await EditCustomer(userId!, formattedValues);
      message.success('Profile updated successfully!');
      setIsModalVisible(false);
      mutate(); // Refresh the user data
    } catch (err) {
      message.error('Failed to update profile.');
    }
  };

  console.log(thumbnail);

  // Handle avatar upload before upload (to prevent automatic upload by antd)
  const beforeUpload = (file: File) => {
    handleChangeAvatar(thumbnail!);
    return false; // Prevent antd from uploading the file automatically
  };

  // If there's an error fetching data
  if (error) return <div className="container mb-5 mt-5 p-4 text-center">Failed to load user data.</div>;

  // While loading data
  if (!user) return <div className="container mt-5">Loading...</div>;

  const columns = [
    {
      title: 'Province',
      dataIndex: 'Province',
      key: 'province',
    },
    {
      title: 'District',
      dataIndex: 'District',
      key: 'district',
    },
    {
      title: 'Ward',
      dataIndex: 'Ward',
      key: 'ward',
    },
    {
      title: 'Specific Address',
      dataIndex: 'SpecificAddress',
      key: 'specificAddress',
    },
    {
      title: 'Postal Code',
      dataIndex: 'PostalCode',
      key: 'postalCode',
    },
    {
      title: 'Default',
      dataIndex: 'IsDefault',
      key: 'isDefault',
      render: (isDefault: boolean) => (isDefault ? 'Yes' : 'No'),
    },
    
  ];


  return (
    <div className="container mt-5 bg-white p-6 border mb-5" style={{ borderRadius: '15px' }}>
      <div className="text-center">
        {/* User Avatar */}
        <Avatar
          size={120}
          src={user.ImageSource}
          icon={!user.ImageSource && <UploadOutlined />}
        />
        <h2 className="mt-3 mb-3 font-semibold text-green-800">{user.FullName}</h2>
        {/* Change Avatar Button */}
        <Upload
          showUploadList={false}
          beforeUpload={
            (file) => {
                setThumbnail(file);
                beforeUpload(file);
                return false;
              
            }
            }
          //accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Change Avatar</Button>
        </Upload>
        {/* Edit Profile Button */}
        <Button className="ml-2" onClick={() => setIsModalVisible(true)}>
          Change Profile
        </Button>
        <Button className="ml-2" onClick={() => setIsModalVisible(true)}>
          Change Password
        </Button>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            fullName: user.FullName,
            dateOfBirth: moment(user.DateOfBirth, 'YYYY-MM-DD'),
            phoneNumber: user.PhoneNumber,
          }}
          onFinish={onFinish}
        >
          {/* Full Name Field */}
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name.' }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          {/* Date of Birth Field */}
          <Form.Item
            name="dateOfBirth"
            label="Date of Birth"
            rules={[{ required: true, message: 'Please select your date of birth.' }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>

          {/* Phone Number Field */}
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please enter your phone number.' },
              { pattern: /^\d+$/, message: 'Phone number must be digits only.' },
            ]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-100">
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* User Information */}
      <div className="mt-5 mb-5">
        {/* <h4 className="mb-3 font-semibold text-center">Personal Information</h4> */}
        <ul className="list-group p-4 text-center">
          <li className="list-group-item border border-gray-400 rounded-lg p-3">
            <strong>Email:</strong> {user.Email}
          </li>
          <li className="list-group-item border border-gray-400 rounded-lg p-3">
            <strong>Date of Birth:</strong> {user.DateOfBirth}
          </li>
          <li className="list-group-item border border-gray-400 rounded-lg p-3">
            <strong>Phone Number:</strong> {user.PhoneNumber}
          </li>
          <li className="list-group-item border border-gray-400 rounded-lg p-3">
            <strong>Role:</strong> {user.Role}
          </li>
          <li className="list-group-item border border-gray-400 rounded-lg p-3">
            <strong>Account Status:</strong> <Tag color={user.IsLocked ? 'red' : 'green'}>{user.IsLocked ? 'Locked' : 'Active'}</Tag>
          </li>
        </ul>
      </div>
                
        {/* Address
        <h4>Address Information</h4>
      <Table dataSource={addresses} columns={columns} rowKey="Id" className='mt-3 mb-5' />
      <a href="/address">Go to Address Page</a> */}

    </div>
  );
};

export default ProfilePage;