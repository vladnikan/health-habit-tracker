import styles from './register.module.css';
import { Text } from '../../ui/text';
import { Illustration } from '../../ui/illustration';
import { Button } from '../../ui/button';
import { Icon } from '../../ui/icon';
import { Input } from '../../ui/input';
import { useEffect, useState, type FC, type SyntheticEvent } from 'react';
import type { TRegisterDataSet } from './Register';

export const RegisterStep1: FC<TRegisterDataSet> = ({
  data,
  setData,
  next
}) => {
  const [email, setEmail] = useState(data.email);
  const [password, setPassword] = useState(data.password);
  const [verified, setVerified] = useState(false);
  const [errors, setErrors] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false
  });

  const onInput = (type: 'email' | 'password', e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    if (type === 'email') {
      setErrors((prev) => ({
        ...prev,
        email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      }));
      setEmail(value);
    }

    if (type === 'password') {
      setErrors((prev) => ({ ...prev, password: !/^.{8,}$/.test(value) }));
      setPassword(value);
    }
  };

  useEffect(() => {
    setVerified(
      !errors.email && !errors.password && email !== '' && password !== ''
    );
  }, [errors, email, password]);

  const onNext = () => {
    setData((prev) => ({ ...prev, email, password }));
    next();
  };

  return (
    <div className={styles.register}>
      <div className={styles.left}>
        <div className={styles.buttons_step_1_group}>
          <div
            className={`${styles.buttons_step_1} ${styles.buttons_step_1_google}`}
          >
            <Button
              kind='secondary'
              className={styles.button}
              text='Продолжить с Google'
              icon={<Icon kind='google' />}
              iconPosition='left'
            />
            <Button
              kind='secondary'
              className={styles.button}
              text='Продолжить с Apple'
              icon={<Icon kind='apple' />}
              iconPosition='left'
            />
          </div>
          <div className={styles.divider}>
            <span>или</span>
          </div>
          <div className={styles.inputs_step_1}>
            <div className={styles.input}>
              <Text style='Body'>Email</Text>
              <Input
                type='email'
                onChanged={(e) => onInput('email', e)}
                placeholder='Введите email'
                error={errors.email ? 'Введите корректный email' : ''}
                value={email}
              />
            </div>

            <div className={styles.input}>
              <Text style='Body'>Пароль</Text>
              <Input
                onChanged={(e) => onInput('password', e)}
                placeholder='Придумайте надёжный пароль'
                error={
                  errors.password
                    ? 'Пароль должен содержать не менее 8 знаков'
                    : ''
                }
                value={password}
                isPassword
                clue='Пароль должен содержать не менее 8 знаков'
              />
            </div>
          </div>
        </div>

        <div className={styles.buttons_step_1}>
          <Button
            kind='primary'
            text='Далее'
            disabled={!verified}
            onClick={onNext}
          />
        </div>
      </div>

      <div className={styles.right}>
        <Illustration kind='light-bulb' height={300} width={300} />
        <div className={styles.right_text}>
          <Text style='H2'>Добро пожаловать в SkillSwap!</Text>
          <Text style='Body'>
            Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с
            другими людьми
          </Text>
        </div>
      </div>
    </div>
  );
};
