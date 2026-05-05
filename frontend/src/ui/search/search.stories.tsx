import type { Meta, StoryObj } from '@storybook/react';
import { Search } from './search';
import { useState } from 'react';

const meta: Meta<typeof Search> = {
  title: 'Components/Search',
  component: Search,
  tags: ['autodocs'],
  argTypes: {
    onChanged: { action: 'changed' }
  }
};

export default meta;

type Story = StoryObj<typeof Search>;

export const Default: Story = {
  args: {}
};

export const WithText: Story = {
  args: {},
  render: (args) => {
    const [value, setValue] = useState('React');
    return (
      <Search
        {...args}
        value={value}
        onChanged={(newValue) => setValue(newValue)}
      />
    );
  }
};

export const Clearable: Story = {
  args: {},
  render: (args) => {
    const [value, setValue] = useState('JavaScript');
    return (
      <div style={{ padding: '20px' }}>
        <Search
          {...args}
          value={value}
          onChanged={(newValue) => setValue(newValue)}
        />
        <p style={{ marginTop: '16px', color: '#666' }}>
          Текущее значение: <strong>{value || 'пусто'}</strong>
        </p>
      </div>
    );
  }
};
