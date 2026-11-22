
import { useState } from "react";

type FotogramaTrayectoria = {
  tiempoMs: number;
  cambioPostura: number;
  desplazamientoMuneca: number;
  caracteristicas: number[];
};

type Props = {
  trayectoria: FotogramaTrayectoria[];
};

export default function LSCMotionTrajectoryPlayer({
  trayectoria,
}: Props) {
  const [indice, setIndice] = useState(0);

  if (!trayectoria.length) {
    return <p>No hay fotogramas para reproducir.</p>;
  }

  const actual = trayectoria[
    Math.min(indice, trayectoria.length - 1)
  ];

  const maximo = Math.max(
    0.000001,
    ...trayectoria.map((f) =>
      Math.max(
        f.cambioPostura,
        f.desplazamientoMuneca
      )
    )
  );

  const obtenerPuntos = (
    campo: "cambioPostura" | "desplazamientoMuneca"
  ) =>
    trayectoria
      .map((f, i) => {
        const x =
          trayectoria.length === 1
            ? 150
            : 12 + (i / (trayectoria.length - 1)) * 276;

        const y =
          88 - (f[campo] / maximo) * 70;

        return `${x},${y}`;
      })
      .join(" ");

  const puntoActualX =
    trayectoria.length === 1
      ? 150
      : 12 + (indice / (trayectoria.length - 1)) * 276;

  const puntoActualY =
    88 - (actual.cambioPostura / maximo) * 70;

  return (
    <div className="motion-player">
      <h5>Reproducción de trayectoria</h5>

      <svg
        viewBox="0 0 300 110"
        width="100%"
        role="img"
        aria-label="Evolución de las métricas del movimiento"
      >
        <line x1="12" y1="18" x2="288" y2="18"
          stroke="#dce8e3" />
        <line x1="12" y1="53" x2="288" y2="53"
          stroke="#dce8e3" />
        <line x1="12" y1="88" x2="288" y2="88"
          stroke="#dce8e3" />

        <polyline
          points={obtenerPuntos("cambioPostura")}
          fill="none"
          stroke="#168bca"
          strokeWidth="2.5"
        />

        <polyline
          points={obtenerPuntos("desplazamientoMuneca")}
          fill="none"
          stroke="#e49a36"
          strokeWidth="2.5"
        />

        <line
          x1={puntoActualX}
          y1="10"
          x2={puntoActualX}
          y2="95"
          stroke="#64748b"
          strokeDasharray="3 3"
        />

        <circle
          cx={puntoActualX}
          cy={puntoActualY}
          r="5"
          fill="#168bca"
          stroke="white"
          strokeWidth="2"
        />
      </svg>

      <p>
        Fotograma {indice + 1} de {trayectoria.length}
      </p>

      <input
        type="range"
        min={0}
        max={trayectoria.length - 1}
        value={indice}
        onChange={(event) =>
          setIndice(Number(event.target.value))
        }
        aria-label="Seleccionar fotograma"
      />

      <div className="motion-player-controls">
        <button
          type="button"
          disabled={indice === 0}
          onClick={() =>
            setIndice((actual) => Math.max(0, actual - 1))
          }
        >
          ← Anterior
        </button>

        <button
          type="button"
          onClick={() =>
            setIndice(0)
          }
        >
          Reiniciar
        </button>

        <button
          type="button"
          disabled={indice === trayectoria.length - 1}
          onClick={() =>
            setIndice((actual) =>
              Math.min(trayectoria.length - 1, actual + 1)
            )
          }
        >
          Siguiente →
        </button>
      </div>

      <p>
        Tiempo: {actual.tiempoMs.toFixed(0)} ms
      </p>

      <p>
        Cambio de postura: {actual.cambioPostura.toFixed(4)}
      </p>

      <p>
        Desplazamiento de muñeca:{" "}
        {actual.desplazamientoMuneca.toFixed(4)}
      </p>

      <small>
        Reproducción técnica de las métricas registradas.
        No representa todavía una reconstrucción tridimensional
        de la mano.
      </small>
    </div>
  );
}
