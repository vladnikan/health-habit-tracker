import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchMetrics } from "../../store/metric/thunks";
import { Text } from "../../ui/text";
import style from "./DataTransfer.module.css";
import { API_URL } from "../../utils/api";

export const DataTransfer = () => {
  const token = useAppSelector(s => s.auth.token) || localStorage.getItem("token");
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  // ── Импорт ──────────────────────────────────────────────
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/metrics/import`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Ошибка импорта");

      setImportStatus(`✅ Импортировано ${data.imported} записей`);
      dispatch(fetchMetrics()); // обновляем метрики в сторе
    } catch (err: any) {
      setImportStatus(`❌ ${err.message}`);
    } finally {
      setImporting(false);
      // сбрасываем input чтобы можно было загрузить тот же файл повторно
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  // ── Экспорт ─────────────────────────────────────────────
  const handleExport = async (format: "csv" | "json") => {
    const res = await fetch(`${API_URL}/metrics/export/${format}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return;

    // Создаём ссылку и кликаем — браузер скачивает файл
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `health_metrics.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={style.wrapper}>

      {/* Импорт */}
      <div className={style.block}>
        <Text style="H3">📥 Импорт из Google Fit</Text>
        <Text style="H4">
          Скачайте архив на{" "}
          <a href="https://takeout.google.com" target="_blank" rel="noreferrer">
            takeout.google.com
          </a>
          , выберите Google Fit, затем загрузите JSON-файл из папки{" "}
          <code>Daily activity metrics</code>
        </Text>

        <input
          ref={fileRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className={style.fileInput}
          id="import-file"
        />
        <label htmlFor="import-file" className={style.importButton}>
          {importing ? "Импортируем..." : "Выбрать файл"}
        </label>

        {importStatus && (
          <p className={style.status}>{importStatus}</p>
        )}
      </div>

      {/* Экспорт */}
      <div className={style.block}>
        <Text style="H3">📤 Экспорт моих данных</Text>
        <Text style="H4">Скачайте все ваши метрики здоровья</Text>

        <div className={style.exportButtons}>
          <button className={style.exportBtn} onClick={() => handleExport("csv")}>
            Скачать CSV
          </button>
          <button className={style.exportBtn} onClick={() => handleExport("json")}>
            Скачать JSON
          </button>
        </div>
      </div>

    </div>
  );
};