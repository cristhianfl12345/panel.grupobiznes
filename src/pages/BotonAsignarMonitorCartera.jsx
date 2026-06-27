import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API = "http://192.168.9.115:4000/api/agentes/usuario";

export default function BotonAsignarMonitorCartera({
  idUsuario,
  idCampana,
  reload
}) {

  const [tipoCampana, setTipoCampana] = useState(1);
  const [tipoOriginal, setTipoOriginal] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerTipoCampana();
  }, [idUsuario, idCampana]);

  const obtenerTipoCampana = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API}/tipo-campana/${idUsuario}/${idCampana}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      const tipo = Number(data.data.tipo_campana);

      setTipoCampana(tipo);
      setTipoOriginal(tipo);

    } catch (error) {

      console.error("Error obteniendo tipo campaña:", error);

    } finally {

      setLoading(false);

    }

  };

  const guardar = async () => {

    try {

      const token = localStorage.getItem("token");

      await fetch(`${API}/tipo-campana`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id_usuario: idUsuario,
          id_campana: idCampana,
          tipo_campana: tipoCampana
        })
      });

      setTipoOriginal(tipoCampana);

      reload?.();

    } catch (error) {

      console.error("Error actualizando tipo campaña:", error);

    }

  };

  if (loading) {
    return (
      <div className="text-xs text-slate-500">
        ...
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">

      <select
        value={tipoCampana}
        onChange={(e) => setTipoCampana(Number(e.target.value))}
        className="
          rounded-lg
          border
          border-slate-300
          px-2
          py-1
          text-xs
          font-semibold
        "
      >
        <option value={1}>Monitor</option>
        <option value={2}>Carterizacion</option>
      </select>

      {tipoCampana !== tipoOriginal && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={guardar}
          className="
            rounded-lg
            bg-green-600
            px-3
            py-1
            text-xs
            font-bold
            text-white
          "
        >
          Confirmar
        </motion.button>
      )}

    </div>
  );
}