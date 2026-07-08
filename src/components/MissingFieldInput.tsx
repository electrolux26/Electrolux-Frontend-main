import React, { useEffect, useState } from 'react';
import { Input, Button } from 'antd';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import { MissingField, MissingFieldStatus } from '../models/invoice.model';

interface MissingFieldInputProps {
  fieldKey: string;
  field: MissingField;
  onChange: (fieldKey: string, value: string, status?: MissingFieldStatus) => void;
}

const MissingFieldInput: React.FC<MissingFieldInputProps> = ({
  fieldKey,
  field,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState(field.value || '');
  const [editing, setEditing] = useState(!field.value?.trim());

  useEffect(() => {
    setInputValue(field.value || '');
    setEditing(!field.value?.trim());
  }, [field.value]);

  const isFilled = !!field.value?.trim();

  const commitValue = () => {
    const trimmedValue = inputValue.trim();
    const nextStatus = trimmedValue ? MissingFieldStatus.FILLED : MissingFieldStatus.PENDING;
    onChange(fieldKey, trimmedValue, nextStatus);
    setEditing(!trimmedValue);
  };

  const markNotSure = () => {
    setInputValue('');
    setEditing(false);
    onChange(fieldKey, '', MissingFieldStatus.NOT_SURE);
  };

  const fieldStyle = field.userStatus === MissingFieldStatus.NOT_SURE
    ? 'border-amber-200 bg-amber-50'
    : isFilled
    ? 'border-emerald-200 bg-emerald-50'
    : 'border-red-200 bg-red-50';

  return (
    <div className={`rounded-lg border px-3 py-2 ${fieldStyle}`}>
      {editing ? (
        <>
          <Input
            size="small"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onPressEnter={(event) => {
              event.preventDefault();
              commitValue();
            }}
            placeholder={field.label ? `Enter ${field.label}` : 'Enter value'}
            suffix={<EditOutlined className="text-slate-400" />}
          />
          <div className="mt-2 flex flex-wrap justify-between gap-2">
            <Button
              type="default"
              size="small"
              onClick={markNotSure}
              className="min-w-[90px]"
            >
              Mark Not Sure
            </Button>
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={commitValue}
              className="min-w-[60px]"
            >
              OK
            </Button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-slate-800">
            {field.userStatus === MissingFieldStatus.NOT_SURE
              ? 'Marked as Not Sure'
              : field.value || 'No value entered'}
          </span>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => setEditing(true)}
            className="text-slate-500 hover:text-slate-700"
          />
        </div>
      )}
    </div>
  );
};

export const renderVerifiedField = (value: React.ReactNode) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700">
    {value}
  </div>
);

export default MissingFieldInput;
