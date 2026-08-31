import gita from './gita.json'

export const chapters = gita.chapters
export const edition = gita.edition

export const allVerses = chapters.flatMap((chapter) =>
  chapter.verses.map((verse) => ({
    ...verse,
    chapterNumber: chapter.number,
    chapterTitle: chapter.title,
  })),
)

export const getVerse = (verseId) => allVerses.find((verse) => verse.id === verseId)

export const searchVerses = (query) => {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  if (!normalizedQuery) return []

  return allVerses.filter((verse) => {
    const searchable = [
      verse.id,
      verse.number,
      verse.chapterNumber,
      verse.chapterTitle.en,
      verse.chapterTitle.te,
      verse.sanskrit,
      verse.english,
      verse.telugu,
      ...verse.keywords,
    ].join(' ').toLocaleLowerCase()

    return searchable.includes(normalizedQuery)
  })
}
