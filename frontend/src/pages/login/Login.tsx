import { Icon } from "../../ui/icon";
import { Button } from "../../ui/button/Button";
import { Text } from "../../ui/text";
import styles from "./Login.module.css";
import { Input } from "../../ui/input";
import { Illustration } from "../../ui/illustration";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authThunks } from "../../store/auth/thunks";
import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";


type Props = object;

export const Login = ({}: Props) => {
  const dispatch = useAppDispatch();
  const serverError = useAppSelector((store) => store.auth.error);
  const [error, setError] = useState<string | null>(serverError);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onAuth = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    console.log("🔐 НАЖАТА КНОПКА ВХОДА");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);

    const result = await dispatch(authThunks.login({ email, password }));

    if (authThunks.login.fulfilled.match(result)) {
      navigate('/');
    }

    console.log("📤 Запрос на login отправлен");
  };

  return (
    <div className={styles.wrapper}>
      <Text style="H2">Вход</Text>
      <div className={styles.twoColumsContainer}>
        <div className={styles.leftColumn}>
          <div className={styles.elementList}>
            <Button
              kind="secondary"
              className={styles.button}
              text="Продолжить с google"
              iconPosition="left"
              icon={<Icon kind="google" />}
            />
            <Button
              kind="secondary"
              className={styles.button}
              text="Продолжить с Apple"
              iconPosition="left"
              icon={<Icon kind="apple" />}
            />
          </div>

          <div className={styles.divider}>
            <span className={styles.dividerText}>или</span>
          </div>

          <form className={styles.elementList}>
            <div className={styles.labelWithInput}>
              <Text style="H4">Email</Text>
              <Input
                placeholder="Введите email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.labelWithInput}>
              <Text style="H4">Пароль</Text>
              <Input
                isPassword
                placeholder="Введите пароль"
                onChange={(e) => setPassword(e.target.value)}
                error={error ? error : undefined}
              />
            </div>
          </form>

          <div className={styles.elementList}>
            <Button
              kind="secondary"
              className={styles.logInButton}
              text="Войти"
              onClick={onAuth}
            />
            <Button
              kind="secondary"
              className={styles.registerButton}
              text="Зарегистрироваться"
              onClick={() => navigate('/register')}
            />
          </div>
        </div>

        <div className={styles.rightColumn}>
          <Illustration kind="light-bulb" height={300} width={300} />
          <div className={styles.title}>
            <Text style="H2">С возвращением в SkillSwap!</Text>
          </div>
          <div className={styles.description}>
            <Text style="H4">
              Обменивайтесь знаниями и навыками с другими <br />
              людьми
            </Text>
          </div> 
        </div>
      </div>
    </div>
  );
};