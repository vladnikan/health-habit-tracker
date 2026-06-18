import { Button } from "../../ui/button/Button";
import { Text } from "../../ui/text";
import styles from "./Login.module.css";
import { Input } from "../../ui/input";
import { Illustration } from "../../ui/illustration";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authThunks } from "../../store/auth/thunks";
import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../components/footer";

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

    const result = await dispatch(authThunks.login({ email, password }));

    if (authThunks.login.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.card}>

          <div className={styles.accent}>
            <Illustration kind="light-bulb" height={180} width={180} />
            <p className={styles.accentTitle}>С возвращением в HabitTracker!</p>
            <p className={styles.accentSub}>Создавайте привычки и&nbsp;отслеживайте прогресс каждый день</p>
          </div>

          <div className={styles.form}>
            <div className={styles.formHeader}>
              <div className={styles.formTitle}>Вход</div>
              <div className={styles.formSubtitle}>Введите данные своего аккаунта</div>
            </div>

            <form className={styles.fields} onSubmit={onAuth}>
              <div className={styles.labelWithInput}>
                <span className={styles.label}>Email</span>
                <Input
                  placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.labelWithInput}>
                <span className={styles.label}>Пароль</span>
                <Input
                  isPassword
                  placeholder="Введите пароль"
                  onChange={(e) => setPassword(e.target.value)}
                  error={error ? error : undefined}
                />
              </div>
            </form>

            <div className={styles.actions}>
              <Button
                kind="secondary"
                className={styles.logInButton}
                text="Войти"
                onClick={onAuth}
              />
              <div className={styles.divider}>
                <span className={styles.dividerText}>или</span>
              </div>
              <Button
                kind="secondary"
                className={styles.registerButton}
                text="Создать аккаунт"
                onClick={() => navigate("/register")}
              />
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};
