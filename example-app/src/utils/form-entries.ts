function toObject(formData: FormData): Record<string, FormDataEntryValue> {
  const formObject = [...formData.entries()].reduce<Record<string, FormDataEntryValue>>((obj, [key, value]) => {
    obj[key] = value
    return obj
  }, {} as Record<string, FormDataEntryValue>)

  return formObject
}

export function formEntries(formData: FormData): Record<string, FormDataEntryValue> {
  return Object.fromEntries(formData.entries())
}

// function toTypedObject(formData: FormData) {
//   const formObject = {}

//   for (const [key, value] of formData.entries()) {
//     // Convert numeric strings to numbers
//     if (!isNaN(value) && value !== '') {
//       formObject[key] = Number(value)
//     } else if (value === 'true' || value === 'false') {
//       formObject[key] = value === 'true'
//     } else {
//       formObject[key] = value
//     }
//   }
// }
