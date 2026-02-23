import Button from "./Button";

type AdFiltersProps = {
  opis: string;
  onOpisChange: (value: string) => void;
  tipUsluge: string;
  onTipUslugeChange: (value: string) => void;
  tipLjubimca: string;
  onTipLjubimcaChange: (value: string) => void;
  grad: string;
  onGradChange: (value: string) => void;
  minNaknada: string;
  onMinNaknadaChange: (value: string) => void;
  maxNaknada: string;
  onMaxNaknadaChange: (value: string) => void;
  tipoviUsluge: string[];
  tipoviLjubimaca: string[];
  gradovi: string[];
  onReset: () => void;
};

export default function AdFilters({
  opis,
  onOpisChange,
  tipUsluge,
  onTipUslugeChange,
  tipLjubimca,
  onTipLjubimcaChange,
  grad,
  onGradChange,
  minNaknada,
  onMinNaknadaChange,
  maxNaknada,
  onMaxNaknadaChange,
  tipoviUsluge,
  tipoviLjubimaca,
  gradovi,
  onReset,
}: AdFiltersProps) {
  const fieldStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
    marginBottom: 8,
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
  };

  const controlStyle = {
    width: "100%",
    padding: "7px 10px",
    borderRadius: 7,
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
    fontSize: 13,
    outline: "none",
  };

  return (
    <aside
      style={{
        width: "100%",
        backgroundColor: "#fafafa",
        border: "1px solid #ccc",
        borderRadius: 12,
        padding: 12,
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 10, fontSize: 18 }}>Filteri</h3>

      <div style={fieldStyle}>
        <label style={labelStyle}>Pretraga opisa</label>
        <input
          style={controlStyle}
          type="text"
          value={opis}
          placeholder="Unesite rec..."
          onChange={(e) => onOpisChange(e.target.value)}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Tip usluge</label>
        <select style={controlStyle} value={tipUsluge} onChange={(e) => onTipUslugeChange(e.target.value)}>
          <option value="">Svi tipovi</option>
          {tipoviUsluge.map((tip) => (
            <option key={tip} value={tip}>
              {tip}
            </option>
          ))}
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Vrsta ljubimca</label>
        <select style={controlStyle} value={tipLjubimca} onChange={(e) => onTipLjubimcaChange(e.target.value)}>
          <option value="">Sve vrste</option>
          {tipoviLjubimaca.map((tip) => (
            <option key={tip} value={tip}>
              {tip}
            </option>
          ))}
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Grad</label>
        <select style={controlStyle} value={grad} onChange={(e) => onGradChange(e.target.value)}>
          <option value="">Svi gradovi</option>
          {gradovi.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Min naknada</label>
        <input
          style={controlStyle}
          type="number"
          value={minNaknada}
          placeholder="0"
          onChange={(e) => onMinNaknadaChange(e.target.value)}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Max naknada</label>
        <input
          style={controlStyle}
          type="number"
          value={maxNaknada}
          placeholder="100000"
          onChange={(e) => onMaxNaknadaChange(e.target.value)}
        />
      </div>

      <Button text="Resetuj filtere" type="button" onClick={onReset} />
    </aside>
  );
}
