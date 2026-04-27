import axios from 'axios'

const API = "http://192.168.9.115:4000/api"

// helper para auth correcto
const getAuthConfig = () => {
  const token = localStorage.getItem("token")

  if (!token) {
    throw new Error("Usuario no autenticado")
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

// GET LEADS
export const getLeads = async (fecha, idCamp, iniCampania) => {
  try {
    const { headers } = getAuthConfig()

    const res = await axios.get(`${API}/leads`, {
      params: {
        idCamp: Number(idCamp),
        iniCampania: iniCampania || null,
        fechaIngreso: fecha
      },
      headers
    })

    return res.data

  } catch (error) {
    console.error("Error en getLeads:", error.response?.data || error.message)
    throw error
  }
}

// GET SUBCAMPAÑAS
export const getSubcampanias = async (idCamp) => {
  try {
    const { headers } = getAuthConfig()

    const res = await axios.get(
      `${API}/leads/subcampanias/${idCamp}`,
      { headers }
    )

    return res.data

  } catch (error) {
    console.error("Error en getSubcampanias:", error.response?.data || error.message)
    throw error
  }
}

// GET VISTAS POR CAMPAÑA
export const getVistasCampana = async (idCamp) => {
  try {
    const { headers } = getAuthConfig()

    const res = await axios.get(
      `${API}/leads/vistas/${idCamp}`,
      { headers }
    )

    return res.data

  } catch (error) {
    console.error("Error en getVistasCampana:", error.response?.data || error.message)
    throw error
  }
}