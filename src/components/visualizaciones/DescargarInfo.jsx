//front/components/visualizaciones/DescargarInfo.jsx
"use client";

import { useState } from "react";
import { RiFileExcel2Line } from "react-icons/ri";
import { BiLoader } from "react-icons/bi";
import { FaDownload } from "react-icons/fa";

export default function DescargarInfo() {

  const [estado, setEstado] =
    useState("idle");

  const [porcentaje, setPorcentaje] =
    useState(0);

  const descargarArchivo =
    async () => {

      try {

        setEstado("loading");
        setPorcentaje(0);

        const fakeProgress =
          setInterval(() => {

            setPorcentaje(prev => {

              if (prev >= 90) {
                return prev;
              }

              return prev + 5;

            });

          }, 250);

        const response =
          await fetch(
            "http://192.168.9.115:4000/api/descarga-registro"
          );

        if (!response.ok) {

          clearInterval(
            fakeProgress
          );

          throw new Error(
            "Error descargando archivo"
          );

        }

        const blob =
          await response.blob();

        clearInterval(
          fakeProgress
        );

        setPorcentaje(100);

        const disposition =
          response.headers.get(
            "content-disposition"
          );

        let fileName =
          "Rg_SeguroVida.xlsx";

        if (disposition) {

          const match =
            disposition.match(
              /filename="?([^"]+)"?/
            );

          if (
            match &&
            match[1]
          ) {
            fileName =
              match[1];
          }

        }

        const url =
          window.URL.createObjectURL(
            blob
          );

        const a =
          document.createElement(
            "a"
          );

        a.href = url;
        a.download =
          fileName;

        document.body.appendChild(
          a
        );

        a.click();

        a.remove();

        window.URL.revokeObjectURL(
          url
        );

        setEstado(
          "success"
        );

        setTimeout(() => {

          setEstado(
            "idle"
          );

          setPorcentaje(
            0
          );

        }, 3000);

      } catch (error) {

        console.error(
          error
        );

        setEstado(
          "idle"
        );

        setPorcentaje(
          0
        );

      }

    };

  return (

    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        gap-2
      "
    >

      {estado === "idle" && (

        <button
          onClick={
            descargarArchivo
          }
          className="
            flex
            items-center
            gap-2
            rounded-xl
            px-4
            py-3
            bg-emerald-600
            text-white
            font-semibold
            hover:scale-105
            transition-all
          "
        >

          <RiFileExcel2Line
            size={24}
          />

         {/* <span>
           Descargar
          </span> */} 

        </button>

      )}

      {estado === "loading" && (

        <div
          className="
            flex
            flex-col
            items-center
            gap-2
          "
        >

          <BiLoader
            size={42}
            className="
              animate-spin
              text-emerald-600
            "
          />

          <span
            className="
              text-sm
              font-bold
            "
          >
            {porcentaje}%
          </span>

        </div>

      )}

      {estado === "success" && (

        <div
          className="
            flex
            flex-col
            items-center
            gap-2
          "
        >

          <FaDownload
            size={35}
            className="
              text-emerald-600
            "
          />

          <span
            className="
              text-xs
              font-semibold
            "
          >
            Descarga completada
          </span>

        </div>

      )}

    </div>

  );

}