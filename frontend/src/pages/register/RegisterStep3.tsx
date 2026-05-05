import styles from './register.module.css';
import { Text } from '../../ui/text';
import { Illustration } from '../../ui/illustration';
import { Input } from '../../ui/input';
import { useEffect, useState, type FC, type SyntheticEvent } from 'react';
import type { TRegisterDataSet } from './Register';
import { Button } from '../../ui/button';

type TInputsState = {
  water: string;
  steps: string;
  sleep: string;
};

export const RegisterStep3: FC<TRegisterDataSet> = ({
  data,
  setData,
  next,
  prev
}) => {
  const [inputs, setInputs] = useState<TInputsState>({
    water: '',
    steps: '',
    sleep: ''
  });

  const [verified, setVerified] = useState(false);

  const onSyntheticEvent = (e: SyntheticEvent) =>
    (e.target as HTMLInputElement).value;

  const onInput = (type: keyof TInputsState, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [type]: value
    }));
  };

  useEffect(() => {
    setVerified(
      inputs.water !== '' &&
      inputs.steps !== '' &&
      inputs.sleep !== ''
    );
  }, [inputs]);

  const onNext = () => {
    setData((prev) => ({
      ...prev,
      // 👉 можно потом использовать в dashboard
      waterGoal: inputs.water,
      stepsGoal: inputs.steps,
      sleepGoal: inputs.sleep
    }));

    next();
  };

  return (
    <div className={styles.register}>
      <div className={styles.left}>
        <div className={styles.inputs_step_2_group}>
          
          <div className={styles.input}>
            <Text style='Body'>Цель по воде (мл)</Text>
            <Input
              onChanged={(e) => onInput('water', onSyntheticEvent(e))}
              placeholder='Например: 2000'
              value={inputs.water}
            />
          </div>

          <div className={styles.input}>
            <Text style='Body'>Цель по шагам</Text>
            <Input
              onChanged={(e) => onInput('steps', onSyntheticEvent(e))}
              placeholder='Например: 10000'
              value={inputs.steps}
            />
          </div>

          <div className={styles.input}>
            <Text style='Body'>Цель по сну (часы)</Text>
            <Input
              onChanged={(e) => onInput('sleep', onSyntheticEvent(e))}
              placeholder='Например: 8'
              value={inputs.sleep}
            />
          </div>

          <div className={styles.buttons_row}>
            <Button
              kind='secondary'
              text='Назад'
              onClick={prev}
            />
            <Button
              kind='primary'
              text='Завершить'
              disabled={!verified}
              onClick={onNext}
            />
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <Illustration kind='light-bulb' height={300} width={300} />
        <div className={styles.right_text}>
          <Text style='H2'>Настройте свои цели</Text>
          <Text style='Body'>
            Укажите ежедневные цели для отслеживания прогресса и улучшения здоровья
          </Text>
        </div>
      </div>
    </div>
  );
};