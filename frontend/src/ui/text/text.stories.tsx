import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';
import type { TextStyle, TextSize } from './Text';

const SAMPLE_TEXT = 'The quick brown fox jumps over the lazy dog.';

const STYLES: TextStyle[] = ['H1', 'H2', 'H3', 'H4', 'Body', 'Caption'];

const meta: Meta<typeof Text> = {
  title: 'UI/Text',
  component: Text,
  tags: ['autodocs'],
  args: {
    children: SAMPLE_TEXT,
    style: 'Body',
    size: 'normal'
  },
  argTypes: {
    style: {
      control: 'select',
      options: STYLES
    },
    size: {
      control: 'select',
      options: ['normal', 'large'] satisfies TextSize[]
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'div', 'span', 'p']
    },
    children: {
      control: false
    }
  },
  parameters: {
    layout: 'centered'
  }
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    style: 'Body',
    size: 'normal',
    as: 'div'
  }
};

export const AllStyles: Story = {
  name: 'All styles',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        width: 800
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {STYLES.map((style) => (
          <Text key={style} style={style}>
            {SAMPLE_TEXT}
          </Text>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {STYLES.map((style) => (
          <Text key={style} style={style} size='large'>
            {SAMPLE_TEXT}
          </Text>
        ))}
      </div>
    </div>
  )
};
