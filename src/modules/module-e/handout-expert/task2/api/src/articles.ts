import articles from './data/articles.json';

const pageSize = 10;
const baseDate = new Date('2023-08-01T12:58:04.000Z');
const articleTimeOffset = 9 * 60 * 60 * 1000 + 13 * 60 * 1000 + 57 * 1000;

export const getArticles = (fromIndex: number, imageBaseUrl: string) => {
    const fromIndexResolved = fromIndex % articles.length;
    const toIndexResolved = (fromIndex + pageSize) % articles.length;
    let recentArticles;

    if (toIndexResolved > fromIndexResolved) {
        recentArticles = articles.slice(fromIndexResolved, toIndexResolved);
    } else {
        recentArticles = [...articles.slice(fromIndexResolved), ...articles.slice(0, toIndexResolved)];
    }

    return recentArticles.reverse().map((article, i) => {
        const id = fromIndex + pageSize - i;
        return {
            id: id,
            ...article,
            publicationDate: new Date(baseDate.getTime() + articleTimeOffset * (id)),
            imageUrl: `${imageBaseUrl}/images/${(id) % articles.length}.jpg`,
        }
    });
}
