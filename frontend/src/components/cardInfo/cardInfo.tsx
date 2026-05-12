import { Icon } from "../../ui/icon";
import { Text } from "../../ui/text";
import style from "./cardInfo.module.css";

type CardInfoProps = {
  icon: "heart" | "pulse" | "water" | "moon" | "food" | "lightning";
  title: string;
  value: number;
  overall?: string;
  percent: number;
};

export const CardInfo = ({ icon, title, value, percent }: CardInfoProps) => {
  const unitsMap: Record<CardInfoProps["icon"], string> = {
    heart: "уд/мин",
    pulse: "сегодня",
    water: "литров",
    food: "ккал",
    moon: "часов",
    lightning: "%",
  };

  const getResult = () => {
    switch (icon) {
      case "heart":
        if (value < 60) return "Замедленно";
        if (value > 100) return "Повышенное";
        return "Норма";

      case "pulse":
        return `${percent}% от цели`;

      case "water":
        if (value < 1.5) return "Пейте больше";
        return "Норма";

      case "food":
        if (value < 1500) return "Мало";
        if (value > 2500) return "Много";
        return "В пределах нормы";

      case "moon":
        if (value < 6) return "Недостаточно";
        if (value > 9) return "Выше нормы";
        return "Хорошо";

      case "lightning":
        if (percent < 30) return "Низкая";
        if (percent > 70) return "Высокая";
        return "Нормальная";

      default:
        return "";
    }
  };

  return (
    <div className={style.card}>
      <div className={style.upper__side}>
        <div className={style.icon}>
          <Icon kind={icon} />
        </div>
        <div className={style.percent}>
          <Text style="H4">{percent}%</Text>
        </div>
      </div>
      <div className={style.title}>
        <Text style="H3">{title}</Text>
      </div>
      <div className={style.value}>
        <Text style="H2">
          {value} {unitsMap[icon]}
        </Text>
      </div>
      <div className={style.result}>
        <Text style="H4">{getResult()}</Text>
      </div>
    </div>
  );
};
