import type { Meta, StoryObj } from '@storybook/react';
import { Multidropdown, type DropdownItem } from './Multidropdown';
import styles from './multidropdown.stories.module.css';

const meta = {
  title: 'UI/Multidropdown',
  component: Multidropdown,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: 'Массив элементов для выбора'
    },
    onSelectionChanged: {
      action: 'selectionChanged',
      description: 'Обработчик изменения выбора'
    }
  }
} satisfies Meta<typeof Multidropdown>;

export default meta;

type Story = StoryObj<typeof Multidropdown>;

const items: DropdownItem[] = [
  {
    id: '8f08c934-ea5a-4152-862c-2c20bbec0289',
    label: 'Бизнес и карьера'
  },
  {
    id: '1ae65745-eae1-413a-9901-400f40bc90c0',
    label: 'Творчество и искусство'
  },
  {
    id: '3f2e1d4c-5b6a-7c8d-9e0f-1a2b3c4d5e6f',
    label: 'Иностранные языки'
  },
  {
    id: '4a5b6c7d-8e9f-0a1b-2c3d-4e5f6a7b8c9d',
    label: 'Здоровье и лайфстайл'
  },
  {
    id: '5b6c7d8e-9f0a-1b2c-3d4e-5f6a7b8c9d0e',
    label: 'Дом и уют'
  }
];

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className={styles.wrapper}>
        <label className={styles.label}>
          Категория навыка, которому хотите научиться
        </label>
        <Story />
      </div>
    )
  ],
  args: {
    items
  }
};

export const WithSubcategories: Story = {
  name: 'С подкатегориями',
  decorators: [
    (Story) => (
      <div className={styles.wrapper}>
        <label className={styles.label}>
          Подкатегория навыка, которому хотите научиться
        </label>
        <Story />
      </div>
    )
  ],
  args: {
    items: [
      {
        id: '1',
        label: 'Рисование и иллюстрация'
      },
      {
        id: '2',
        label: 'Фотография'
      },
      {
        id: '3',
        label: 'Видеомонтаж'
      },
      {
        id: '4',
        label: 'Музыка и звук'
      },
      {
        id: '5',
        label: 'Актёрское мастерство'
      },
      {
        id: '6',
        label: 'Креативное письмо'
      },
      {
        id: '7',
        label: 'Арт-терапия'
      },
      {
        id: '8',
        label: 'Декор и DIY'
      }
    ]
  }
};
