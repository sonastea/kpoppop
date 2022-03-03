import words from 'profane-words';

export const profanityFilter = (text: string): boolean | undefined => {
  const texts = text.split(" ");

  for (const t of texts) {
    if (words.includes(t.toLowerCase())) return false;
  }
  return true;
}
