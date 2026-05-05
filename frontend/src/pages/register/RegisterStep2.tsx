import styles from './register.module.css';
import { Text } from '../../ui/text';
import { Illustration } from '../../ui/illustration';
import { Input } from '../../ui/input';
import { useEffect, useState, type FC, type SyntheticEvent } from 'react';
import type { TRegisterDataSet } from './Register';
import { DatePicker } from '../../ui/datePicker/DatePicker';
import { Dropdown } from '../../ui/dropdown';
// import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
// import { apiCities } from '../../store/cities/thunks';
import { Multidropdown } from '../../ui/multidropdown';
import { Button } from '../../ui/button';
// import { Preloader } from '../../ui/preloader';

type TInputsState = {
  name: string;
  dateBirth: string;
  city: string;
  gender: string;
  category: string[];
  subCategory: string[];
};

export const RegisterStep2: FC<TRegisterDataSet> = ({
  data,
  setData,
  next,
  prev
}) => {

  // ❌ СТАРЫЙ ВАРИАНТ (через Redux)
  // const dispatch = useAppDispatch();
  // const { data: cities, isLoaded } = useAppSelector((store) => store.cities);

  const [inputs, setInputs] = useState<TInputsState>({
    name: data.name,
    category: [],
    city: data.city,
    gender: data.gender,
    dateBirth: data.dateBirth,
    subCategory: []
  });

  const [verified, setVerified] = useState(false);
  const [errors, setErrors] = useState({ name: false });

  // ✅ ВРЕМЕННЫЙ СПИСОК ГОРОДОВ (можно заменить на API позже)
  const cityList = [
    { id: 'msk', label: 'Москва' },
    { id: 'spb', label: 'Санкт-Петербург' },
    { id: 'kzn', label: 'Казань' }
  ];

  // ❌ СТАРЫЙ ВАРИАНТ (через API)
  // const [cityList, setCityList] = useState<{ id: string; label: string }[]>([]);
  //
  // useEffect(() => {
  //   if (!isLoaded) dispatch(apiCities());
  // }, [isLoaded, dispatch]);
  //
  // useEffect(() => {
  //   if (!isLoaded) return;
  //   setCityList(cities.map((c) => ({ id: c.id, label: c.name })));
  // }, [isLoaded, cities]);

  // 👉 категории привычек
  const habitCategories = [
    { id: 'sport', label: 'Спорт' },
    { id: 'health', label: 'Здоровье' },
    { id: 'sleep', label: 'Сон' },
    { id: 'food', label: 'Питание' }
  ];

  // 👉 подкатегории привычек
  const habitSubcategoriesMap: Record<string, { id: string; label: string }[]> = {
    sport: [
      { id: 'run', label: 'Бег' },
      { id: 'gym', label: 'Тренировки' }
    ],
    health: [
      { id: 'water', label: 'Пить воду' },
      { id: 'meditation', label: 'Медитация' }
    ],
    sleep: [
      { id: 'sleep8', label: '8 часов сна' }
    ],
    food: [
      { id: 'healthy_food', label: 'Здоровое питание' }
    ]
  };

  const [subSkillsList, setSubSkillsList] = useState<
    { id: string; label: string }[]
  >([]);

  const onSyntheticEvent = (e: SyntheticEvent) =>
    (e.target as HTMLInputElement).value;

  const onDateInput = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const onInput = (
    type: 'name' | 'dateBirth' | 'city' | 'gender',
    value: string
  ) => {
    if (type === 'name') {
      setErrors((prev) => ({ ...prev, name: value === '' }));
      setInputs((prev) => ({ ...prev, name: value }));
    }

    if (type === 'dateBirth') {
      setInputs((prev) => ({ ...prev, dateBirth: value }));
    }

    if (type === 'gender') {
      setInputs((prev) => ({ ...prev, gender: value }));
    }

    if (type === 'city') {
      setInputs((prev) => ({ ...prev, city: value }));
    }
  };

  const onSkillSelect = (e: string[]) => {
    setInputs((prev) => ({ ...prev, category: e }));
  };

  const onSubSkillSelect = (e: string[]) => {
    setInputs((prev) => ({ ...prev, subCategory: e }));
  };

  useEffect(() => {
    const subs: { id: string; label: string }[] = [];

    inputs.category.forEach((cat) => {
      if (habitSubcategoriesMap[cat]) {
        subs.push(...habitSubcategoriesMap[cat]);
      }
    });

    setSubSkillsList(subs);
  }, [inputs.category]);

  useEffect(() => {
    setVerified(
      inputs.name !== '' &&
      inputs.dateBirth !== '' &&
      inputs.gender !== '' &&
      inputs.city !== '' &&
      inputs.category.length > 0 &&
      inputs.subCategory.length > 0
    );
  }, [inputs]);

  const onNext = () => {
    setData((prev) => ({
      ...prev,
      ...inputs
    }));
    next();
  };

  // ❌ СТАРЫЙ ВАРИАНТ
  // if (!isLoaded) return <Preloader />;

  return (
    <div className={styles.register}>
      <div className={styles.left}>
        <div className={styles.inputs_step_2_group}>
          <div className={styles.input}>
            <Text style='Body'>Имя</Text>
            <Input
              onChanged={(e) => onInput('name', onSyntheticEvent(e))}
              placeholder='Введите ваше имя'
              error={errors.name ? 'Введите имя' : ''}
              value={inputs.name}
            />
          </div>

          <DatePicker
            onChange={(e) => onInput('dateBirth', onDateInput(e))}
          />

          <Dropdown
            items={[
              { id: 'male', label: 'Мужской' },
              { id: 'female', label: 'Женский' }
            ]}
            onSelectionChanged={(e) => onInput('gender', e)}
          />

          <Dropdown
            items={cityList}
            onSelectionChanged={(e) => onInput('city', e)}
          />

          <Multidropdown
            items={habitCategories}
            onSelectionChanged={onSkillSelect}
          />

          <Multidropdown
            items={subSkillsList}
            onSelectionChanged={onSubSkillSelect}
          />

          <div className={styles.buttons_row}>
            <Button kind='secondary' text='Назад' onClick={prev} />
            <Button
              kind='primary'
              text='Продолжить'
              disabled={!verified}
              onClick={onNext}
            />
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <Illustration kind='user-info' height={300} width={300} />
        <div className={styles.right_text}>
          <Text style='H2'>Расскажите о себе</Text>
          <Text style='Body'>
            Это поможет настроить привычки и отслеживание здоровья
          </Text>
        </div>
      </div>
    </div>
  );
};