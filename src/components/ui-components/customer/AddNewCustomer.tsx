"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, DatePicker } from 'antd';
import { toast } from 'react-toastify';
import { CreateNewCustomer } from '@/services/customer-service';
import { BadgeCheckIcon, User } from 'lucide-react';
//import dayjs from 'dayjs';

const AddCustomer: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const router = useRouter();

  const validateEmail = (_: unknown, value: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!value || emailRegex.test(value)) {
      setEmailError(null);
      return Promise.resolve();
    } else {
      setEmailError('The email must contain @gmail.com, please correct it.');
      return Promise.reject(new Error('The email must contain @gmail.com'));
    }
  };

  const handleSubmit = async (values: any) => {
    setSaving(true);
    const payload = {
      ...values,
      dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
      userClaimsRequest: [0], // Fixed value
    };
    try {
      await CreateNewCustomer(payload);
      toast.success('Customer created successfully.');
      setTimeout(() => router.push('/customer/list-customer'), 1000);
    } catch (error) {
      toast.error(`Failed to create customer: ${error}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4">
      <h3 className="flex text-xl font-semibold mb-4"> <User/> Customer information</h3>
      <Form layout="vertical" onFinish={handleSubmit} className='font-semibold'>
        {/* Email Field */}
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Email is required.' }, { validator: validateEmail }]}
          validateStatus={emailError ? 'error' : ''}
          help={emailError}
        >
          <Input placeholder="Enter your email (must contain @gmail.com)" />
        </Form.Item>

        {/* Full Name Field */}
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: 'Full Name is required.' }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        {/* Phone Number Field */}
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[{ required: true, message: 'Phone number is required.' }]}
        >
          <Input type="number" placeholder="Enter phone number" />
        </Form.Item>

        {/* Date of Birth Field */}
        <Form.Item
          label="Date of Birth"
          name="dateOfBirth"
          rules={[{ required: true, message: 'Date of Birth is required.' }]}
        >
          <DatePicker className="w-full" placeholder="Select date of birth" format="YYYY-MM-DD" />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Password is required.' }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item className="text-center">
          <Button
            type="primary"
            htmlType="submit"
            loading={saving}
            className="flex items-center justify-center w-1/5 mx-auto"
          >
            <BadgeCheckIcon className="mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCustomer;
