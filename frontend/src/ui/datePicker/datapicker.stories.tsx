import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker } from './DatePicker';
import '../../index.css';
import '../datePicker/DatePicker.css';

const meta = {
  title: 'UI/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'date changed' }
  }
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const StoryWrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      position: 'relative',
      padding: 40,
      minHeight: 400
    }}
  >
    {children}
  </div>
);

export const Default: Story = {
  render: (args) => (
    <StoryWrapper>
      <DatePicker {...args} />
    </StoryWrapper>
  )
};

export const Controlled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    return (
      <StoryWrapper>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <DatePicker onChange={(d) => setDate(d)} />
          <div>Выбрана дата: {date ? date.toLocaleDateString() : 'нет'}</div>
        </div>
      </StoryWrapper>
    );
  }
};

export const WithButtons: Story = {
  render: () => {
    const [date, setDate] = useState<Date>(new Date());

    return (
      <StoryWrapper>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <DatePicker onChange={(d) => setDate(d)} />
          <div>
            <strong>Текущая выбранная дата:</strong> {date.toLocaleDateString()}
          </div>
        </div>
      </StoryWrapper>
    );
  }
};
