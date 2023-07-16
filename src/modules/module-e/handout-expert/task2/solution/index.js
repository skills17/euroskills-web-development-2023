const localStorageKey = 'ai-news/last-article-id';

Notification.requestPermission().then((result) => {
    console.log('Notification permission:', result);
});


const fetchArticles = async () => {
    const res = await fetch('http://localhost:3000/api/news');
    const articles = await res.json();
    document.querySelector('.articles').innerHTML = `
            <ul>
                ${articles.items.map((article) => `
                    <li class="article">
                        <img src="${article.imageUrl}" alt="${article.title}" />
                        <div class="text">
                            <h2>${article.title}</h2>
                            <div>${article.author}</div>
                            <div>${new Date(article.publicationDate).toLocaleString()}</div>
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;
    return articles.items;
};

const pollArticles = () => {
    setInterval(async () => {
        const articles = await fetchArticles();
        const newestId = articles[0].id;
        const prevId = parseInt(localStorage.getItem(localStorageKey), 10);

        if (newestId !== prevId && !isNaN(prevId)) {
            if (document.hidden) {
                const notification = new Notification(articles[0].title, {
                    icon: '/icon/ai-news.png',
                });
                notification.addEventListener('click', () => window.focus());
            }
        }

        localStorage.setItem(localStorageKey, newestId);
    }, 10 * 1000);
};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
            console.log('Service Worker Registered');
            fetchArticles();
            pollArticles();
        });
}
