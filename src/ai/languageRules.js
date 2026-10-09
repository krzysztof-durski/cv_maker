// How CV text reads in the language it is written in. These are instructions to the model, so they are
// English whatever language the app is shown in. They apply to any text the model writes in that
// language, including a translation into it, so the model is never made to switch language by them.

const POLISH_FORMS = {
  masculine: 'The person is a man: use masculine forms throughout (założyłem, prowadziłem, zbudowałem, byłem odpowiedzialny).',
  feminine: 'The person is a woman: use feminine forms throughout (założyłam, prowadziłam, zbudowałam, byłam odpowiedzialna).',
  auto: 'Take the grammatical gender from forms already used in the CV or in the user\'s messages (for example "zbudowałam", "byłem"), and use it consistently. Never guess it from the name. If there is no such evidence, avoid gendered verb forms where you can (for example "Założenie i rozwój X", or the impersonal "założono") and say in "reply" that the person can choose masculine or feminine forms in the CV language settings.',
}

const polish = gender => [
  'Whenever you write CV text in Polish (including when you translate into Polish), write it the way a Polish professional would.',
  'Describe the person\'s own work in the FIRST PERSON SINGULAR, never in the third person and without the pronoun "ja". Example: "Founded and developed watchpapa" becomes "Założyłem i rozwijałem watchpapa", never "Założył i rozwijał watchpapa". A profile or summary is also written in the first person ("Jestem inżynierem…").',
  POLISH_FORMS[gender] || POLISH_FORMS.auto,
  'Polish tense: past tense for finished roles and projects; present tense, still first person ("Prowadzę…"), for anything ongoing or marked "Present" or "Obecnie".',
  'Keep the names of companies, products, projects, schools and technologies exactly as written (for example watchpapa, React, Supabase) and do not translate them. Keep widely used English terms that Polish professionals use as they are (frontend, backend, deploy, sprint, CI/CD, pull request). Keep every number and date exactly.',
  'Use natural, idiomatic Polish with correct case endings, not word-for-word translation, and one consistent register.',
].join(' ')

const ENGLISH =
  'Whenever you write CV text in English (including when you translate into English), write bullets without personal pronouns (no "I", "he" or "she") and without a subject, in the usual CV style: "Founded and developed watchpapa". Past tense for finished roles, present tense for anything ongoing or marked "Present". Keep names of companies, products and technologies as written, and every number and date exactly.'

/**
 * Rules for writing or translating CV text, as sentences for the prompt.
 * @param gender 'auto' | 'masculine' | 'feminine': the forms Polish text uses
 */
export function languageRules(gender = 'auto') {
  return [polish(gender), ENGLISH]
}
