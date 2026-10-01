// Browsers name a "Save as PDF" file after the page title, so the title is set to this while printing.
// Format: Role_Name_Surname_CV (the role is left out when the CV has no job title).

const part = text =>
  String(text ?? '')
    .normalize('NFC')
    .replace(/[^\p{L}\p{N}]+/gu, '_') // anything that is not a letter or digit (spaces, &, /, quotes…) becomes _
    .replace(/^_+|_+$/g, '')

export function pdfFileName(personal) {
  return [part(personal?.jobTitle), part(personal?.name), 'CV'].filter(Boolean).join('_')
}
