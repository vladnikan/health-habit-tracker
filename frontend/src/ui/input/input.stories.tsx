import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  args: {
    id: 'input',
    placeholder: 'Введите ваше имя'
  }
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const Password: Story = {
  args: {
    isPassword: true,
    placeholder: 'Придумайте надежный пароль',
    passwordIcon: (
      <img src='images/icons/password.svg' alt='иконка' width={16} />
    )
  }
};

export const PasswordWithIconByDefault: Story = {
  args: {
    isPassword: true,
    placeholder: 'Придумайте надежный пароль'
  }
};

export const WithError: Story = {
  args: {
    error: 'Пароль должен содержать не менее 8 знаков'
  }
};

export const Multiline: Story = {
  args: {
    isMultiline: true,
    placeholder: 'Коротко опишите, чему можете научить'
  }
};

export const WithClue: Story = {
  args: {
    placeholder: 'Пароль должен содержать не менее 8 знаков',
    isPassword: true,
    clue: 'Надежный'
  }
};
