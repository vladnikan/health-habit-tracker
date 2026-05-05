import { useState } from "react";
import { Button } from "../../ui/button";
import { Graph, type GraphType } from "../graph/Graph";
import style from "./graphSwitcher.module.css";

type GraphConfig = {
  label: string;         // что пишем на кнопке
  type: GraphType;       // line / bar / pie
  data: any[];
  xKey?: string;
  yKey?: string;
  nameKey?: string;
};

type GraphSwitcherProps = {
  configs: GraphConfig[];
};

export const GraphSwitcher = ({ configs }: GraphSwitcherProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const active = configs[activeIndex];

  return (
    <div className={style.wrapper}>
      
      {/* 🔝 переключатель */}
      <div className={style.header}>
        {configs.map((cfg, index) => (
          <Button
            key={index}
            kind={index === activeIndex ? "primary" : "secondary"}
            text={cfg.label}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {/* 📊 график */}
      <div className={style.graph}>
        <Graph
          type={active.type}
          data={active.data}
          xKey={active.xKey}
          yKey={active.yKey}
          nameKey={active.nameKey}
        />
      </div>
    </div>
  );
};