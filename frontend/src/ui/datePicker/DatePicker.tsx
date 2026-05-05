import React, { useState, forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import { ru } from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css';
import '../datePicker/DatePicker.css';
import { Scrollbar } from 'react-scrollbars-custom';
import { Icon } from '../icon/Icon';

type PropsInputPicker = {
  value?: string;
  hasValue: boolean;
  onClick?: () => void;
  isOpen: boolean;
};
export const DatePickerInput = forwardRef<HTMLButtonElement, PropsInputPicker>(
  ({ value, hasValue, isOpen, onClick }, ref) => {
    const showPlaceholder = !hasValue && !isOpen;
    return (
      <button ref={ref} type='button' className='date-input' onClick={onClick}>
        <span
          className={`date-input__value ${
            showPlaceholder ? 'date-input__placeholder' : ''
          }`}
        >
          {hasValue ? value : showPlaceholder ? 'дд.мм.гггг' : ''}
        </span>

        <Icon kind='calendar' size={20} />
      </button>
    );
  }
);
DatePickerInput.displayName = 'DatePickerInput';

type DatePickerProps = {
  onChange?: (date: Date) => void;
  value?: string;
};
const parseDate = (value?: string): Date | null => {
  if (!value) return null;

  const [day, month, year] = value.split('.').map(Number);
  if (!day || !month || !year) return null;

  return new Date(year, month - 1, day);
};

export function DatePicker({
  value,
  onChange
}: DatePickerProps): React.ReactElement {
  const today = new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(() => parseDate(value));
  const [selectedBtn, setSelectedBtn] = useState<'add' | 'cancel' | null>(null);
  const [pickerKey, setPickerKey] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());

  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const shortDays: Record<string, string> = {
    понедельник: 'Пн',
    вторник: 'Вт',
    среда: 'Ср',
    четверг: 'Чт',
    пятница: 'Пт',
    суббота: 'Сб',
    воскресенье: 'Вс'
  };

  const handleAdd = (): void => {
    if (tempDate) {
      setSelectedBtn('add');
      onChange?.(tempDate);
      setIsOpen(false);
    }
  };

  const handleCancel = (): void => {
    setTempDate(today);
    setSelectedBtn('cancel');
    onChange?.(today);
    setPickerKey((prev) => prev + 1);
  };

  const getDayClassName = (date: Date): string => {
    if (
      tempDate &&
      date.getDate() === tempDate.getDate() &&
      date.getMonth() === tempDate.getMonth() &&
      date.getFullYear() === tempDate.getFullYear()
    )
      return 'selected-day';

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
      return 'today-day';

    if (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear)
      return 'outside-month-day';

    return 'current-month-day';
  };

  const CustomCalendarContainer = ({
    className,
    children
  }: {
    className: string;
    children: React.ReactNode;
  }) => (
    <div className={className}>
      {children}
      <div className='datepicker-buttons'>
        <button
          type='button'
          onClick={handleCancel}
          className={selectedBtn === 'cancel' ? 'selected' : ''}
        >
          Отменить
        </button>
        <button
          type='button'
          onClick={handleAdd}
          className={selectedBtn === 'add' ? 'selected' : ''}
        >
          Выбрать
        </button>
      </div>
    </div>
  );
  const ChevronDown = () => <Icon kind='chevron-down' size={16} />;

  const renderCustomHeader = ({
    date,
    changeMonth,
    changeYear
  }: {
    date: Date;
    changeMonth: (month: number) => void;
    changeYear: (year: number) => void;
  }) => {
    const months = Array.from({ length: 12 }, (_, i) =>
      new Date(date.getFullYear(), i).toLocaleString('ru', { month: 'long' })
    );
    const years = Array.from({ length: 2050 - 1900 + 1 }, (_, i) => 1900 + i);

    return (
      <div className='custom-header'>
        <div
          className='dropdown-wrapper'
          style={{ position: 'relative', display: 'inline-block' }}
        >
          <button
            style={{
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            className='current-month-btn'
            onClick={() => setShowMonthDropdown((prev) => !prev)}
          >
            {months[date.getMonth()].charAt(0).toUpperCase() +
              months[date.getMonth()].slice(1)}
            <ChevronDown />
          </button>
          {showMonthDropdown && (
            <Scrollbar
              style={{
                position: 'absolute',
                zIndex: 1000,
                background: '#fff',
                border: '1px solid transparent',
                borderRadius: 4,
                cursor: 'pointer',
                height: '70px',
                fontSize: '12px'
              }}
              noScrollX
              trackYProps={{ style: { background: 'transparent' } }}
              thumbYProps={{ style: { display: 'none' } }}
            >
              <div className='month-grid-dropdown'>
                {months.map((month, i) => (
                  <div
                    key={i}
                    className={`month-cell ${date.getMonth() === i ? 'selected' : ''}`}
                    onClick={() => {
                      changeMonth(i);
                      setShowMonthDropdown(false);
                    }}
                  >
                    {month.charAt(0).toUpperCase() + month.slice(1)}
                  </div>
                ))}
              </div>
            </Scrollbar>
          )}
        </div>

        <div
          className='dropdown-wrapper'
          style={{
            marginLeft: 10,
            position: 'relative',
            display: 'inline-block'
          }}
        >
          <button
            style={{
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            className='current-year-btn'
            onClick={() => setShowYearDropdown((prev) => !prev)}
          >
            {date.getFullYear()}
            <ChevronDown />
          </button>
          {showYearDropdown && (
            <Scrollbar
              style={{
                position: 'absolute',
                top: '100%',
                zIndex: 1000,
                background: '#fff',
                border: '1px solid transparent',
                borderRadius: 4,
                cursor: 'pointer',
                height: '70px',
                fontSize: '12px'
              }}
              noScrollX
              trackYProps={{ style: { background: 'transparent' } }}
              thumbYProps={{ style: { display: 'none' } }}
            >
              <div className='year-grid-dropdown'>
                {years.map((year) => (
                  <div
                    key={year}
                    className={`year-cell ${date.getFullYear() === year ? 'selected' : ''}`}
                    onClick={() => {
                      changeYear(year);
                      setShowYearDropdown(false);
                    }}
                  >
                    {year}
                  </div>
                ))}
              </div>
            </Scrollbar>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className='date-picker-field'
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '4px'
      }}
    >
      <label
        className='date-picker-label'
        style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 500 }}
      >
        Дата рождения
      </label>

      <ReactDatePicker
        key={pickerKey}
        selected={tempDate}
        onChange={(date: Date | null) => setTempDate(date)}
        locale={ru}
        dateFormat='dd.MM.yyyy'
        className='custom-datepicker'
        placeholderText='Выберите дату'
        customInput={
          <DatePickerInput
            value={tempDate ? tempDate.toLocaleDateString('ru-RU') : undefined}
            hasValue={!!tempDate}
            isOpen={isOpen}
          />
        }
        open={isOpen}
        onInputClick={() => setIsOpen(true)}
        onClickOutside={() => setIsOpen(false)}
        renderCustomHeader={renderCustomHeader}
        calendarContainer={CustomCalendarContainer}
        dayClassName={getDayClassName}
        onMonthChange={(date: Date) => setCurrentMonth(date.getMonth())}
        onYearChange={(date: Date) => setCurrentYear(date.getFullYear())}
        formatWeekDay={(day) => shortDays[day.toLowerCase()] || day}
        popperPlacement='bottom-start'
      />
    </div>
  );
}
