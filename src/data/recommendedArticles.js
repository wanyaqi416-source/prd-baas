import articleAccountCover from '../../client/account.png'
import articleDashboardCover from '../../client/home.png'
import articleInvestmentCover from '../../client/licai.png'
import articleOtcCover from '../../client/duihuan.png'

export const initialRecommendedArticles = [
  {
    articleId: 'ARTICLE-001',
    cover: articleDashboardCover,
    title: 'A Smarter Way to Manage Your Global Wealth',
    summary: 'Bring accounts, assets and day-to-day financial decisions into one clear Fidere experience.',
    bodyHtml: '<h2>One view for your global wealth</h2><p>Fidere brings your account balances, recent activity and investment opportunities together so you can make informed decisions with less friction.</p><ul><li>Monitor balances across supported accounts</li><li>Review recent transactions</li><li>Access curated opportunities</li></ul>',
    buttonText: 'Learn More',
    positions: ['featured', 'home'],
    sort: 1,
    status: 'published',
    isHomeFeatured: true,
    updatedAt: '2026-08-10 16:20',
  },
  {
    articleId: 'ARTICLE-002',
    cover: articleOtcCover,
    title: 'Convert Assets Across Your Fidere Accounts',
    summary: 'Explore a clearer way to exchange supported fiat and digital assets across your Fidere balances.',
    bodyHtml: '<h2>Asset conversion, made clearer</h2><p>Select the assets you want to sell and receive, review the quote, and confirm the transaction in one focused flow.</p><p>Available assets and balances are shown based on your current holdings.</p>',
    buttonText: 'Explore Conversion',
    positions: ['featured'],
    sort: 2,
    status: 'published',
    isHomeFeatured: false,
    updatedAt: '2026-08-09 11:45',
  },
  {
    articleId: 'ARTICLE-003',
    cover: articleInvestmentCover,
    title: 'Explore Curated Investment Opportunities',
    summary: 'Discover selected products designed for different investment goals, time horizons and risk preferences.',
    bodyHtml: '<h2>Opportunities selected for Fidere clients</h2><p>Browse available products, compare key terms and review risk information before making an investment decision.</p><ol><li>Review the product overview</li><li>Understand the risk level</li><li>Check minimum investment requirements</li></ol>',
    buttonText: 'Explore Products',
    positions: ['featured'],
    sort: 3,
    status: 'published',
    isHomeFeatured: false,
    updatedAt: '2026-08-08 09:10',
  },
  {
    articleId: 'ARTICLE-004',
    cover: articleAccountCover,
    title: 'Understanding Your Multi-Account Experience',
    summary: 'Learn how Fidere keeps balances and transactions clear across supported jurisdictional accounts.',
    bodyHtml: '<h2>Your accounts, clearly separated</h2><p>Each jurisdictional account keeps its own supported currencies and transaction history while remaining accessible from one experience.</p>',
    buttonText: 'Read Guide',
    positions: ['featured'],
    sort: 3,
    status: 'offline',
    isHomeFeatured: false,
    updatedAt: '2026-08-06 18:30',
  },
]

export const createEmptyRecommendedArticle = () => ({
  articleId: '',
  cover: '',
  title: '',
  summary: '',
  bodyHtml: '',
  buttonText: 'Learn More',
  positions: [],
  sort: 1,
  status: 'offline',
  isHomeFeatured: false,
  updatedAt: '',
})

export function getPublishedRecommendedArticles(articles) {
  return articles.filter((article) => article.status === 'published')
}

export function getHomeRecommendedArticle(articles) {
  return getPublishedRecommendedArticles(articles)
    .find((article) => article.positions.includes('home')) || null
}

export function getFeaturedRecommendedArticles(articles) {
  return getPublishedRecommendedArticles(articles)
    .filter((article) => article.positions.includes('featured'))
    .sort((left, right) => Number(left.sort || 99) - Number(right.sort || 99))
    .slice(0, 3)
}
