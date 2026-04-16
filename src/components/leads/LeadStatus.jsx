export default function LeadStatus({ code, nivel }) {

  let color = ''

  if (code === 'CD') color = 'bg-green-200'
  else if (code === 'CC') color = 'bg-yellow-200'
  else if (code === 'NC') color = 'bg-red-200'
  else color = ''

  return (
    <td className={`border p-2 ${color}`}>
      {code ? `${code}-${nivel}` : 'S/G'}
    </td>
  )
}
