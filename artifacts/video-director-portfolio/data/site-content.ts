import { events, films, upcomingProject, type Event, type Film } from './films';

export type HeroSlide = {
  id: string;
  eyebrow: string;
  heading: string;
  subheading: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
};

export type ProfileContent = {
  name: string;
  role: string;
  bio: string;
  image: string;
  location: string;
};

export type ContactContent = {
  email: string;
  instagram: string;
  instagramLabel: string;
  linkedin: string;
  linkedinLabel: string;
  availability: string;
  footerNote: string;
};

export type StoryPost = Event & {
  kind: 'event' | 'news';
  body: string;
  videoUrl: string;
  buttonLabel: string;
  buttonUrl: string;
  author: string;
  published: boolean;
};

export type SiteContent = {
  heroSlides: HeroSlide[];
  profile: ProfileContent;
  contact: ContactContent;
  films: Film[];
  posts: StoryPost[];
  upcomingProject: typeof upcomingProject;
};

const defaultBody = (post: Event) => `<p>${post.excerpt}</p><p>Read the full story and discover more about the people, places and ideas behind this moment in the work of Hassan Mageye.</p>`;

export const defaultSiteContent: SiteContent = {
  heroSlides: [
    {
      id: 'hero-01',
      eyebrow: 'Writer · director · producer · California / USA',
      heading: 'Stories with|room to breathe.',
      subheading: 'Writer, director and producer telling African stories through cultural identity, social themes and character-driven drama.',
      image: '/images/director-hero.png',
      ctaLabel: 'Explore projects',
      ctaHref: '#projects',
    },
    {
      id: 'hero-02',
      eyebrow: 'Independent cinema · working worldwide',
      heading: 'Made for|the human detail.',
      subheading: 'Films, portraits and visual stories shaped by attention, performance and place.',
      image: '/images/hero-dawn.jpg',
      ctaLabel: 'Meet the director',
      ctaHref: '#profile-heading',
    },
  ],
  profile: {
    name: 'Hassan Mageye',
    role: 'Writer • Director • Producer',
    bio: 'Hassan Mageye is a Ugandan-American writer, director and producer whose filmmaking career spans more than a decade. He studied Mass Communication at Makerere University and moved from an early interest in journalism toward filmmaking. His work has focused on African stories, cultural identity, social themes and character-driven drama. Hassan Mageye currently resides in California.',
    image: '/images/hassan-mageye.png',
    location: 'California · USA · Working worldwide',
  },
  contact: {
    email: 'mageyeglobalworks@gmail.com',
    instagram: 'https://www.instagram.com/hassan_mageye/',
    instagramLabel: '@hassan_mageye ↗',
    linkedin: 'https://www.linkedin.com/in/hassan-mageye-598b83177/',
    linkedinLabel: 'Hassan Mageye ↗',
    availability: 'Available worldwide',
    footerNote: 'California · USA · Working worldwide',
  },
  films: films.map((film) => ({ ...film, cast: [...film.cast] })),
  posts: events.map((post) => ({
    ...post,
    kind: 'event' as const,
    body: defaultBody(post),
    videoUrl: '',
    buttonLabel: 'Read the source',
    buttonUrl: post.source,
    author: 'Mageye Studio',
    published: true,
  })),
  upcomingProject: { ...upcomingProject },
};

export const SITE_CONTENT_KEY = 'mageye-site-content-v1';
export const ADMIN_CREDENTIALS_KEY = 'mageye-admin-credentials-v1';
export const ADMIN_SESSION_KEY = 'mageye-admin-session-v1';

export const cloneSiteContent = (value: SiteContent): SiteContent =>
  JSON.parse(JSON.stringify(value)) as SiteContent;

export const mergeSiteContent = (saved: Partial<SiteContent>): SiteContent => {
  const base = cloneSiteContent(defaultSiteContent);
  return {
    ...base,
    ...saved,
    profile: { ...base.profile, ...(saved.profile ?? {}) },
    contact: { ...base.contact, ...(saved.contact ?? {}) },
    upcomingProject: { ...base.upcomingProject, ...(saved.upcomingProject ?? {}) },
    heroSlides: saved.heroSlides?.length ? saved.heroSlides : base.heroSlides,
    films: saved.films?.length ? saved.films : base.films,
    posts: saved.posts?.length
      ? saved.posts.map((post) => ({
          ...base.posts.find((item) => item.id === post.id),
          ...post,
        }))
      : base.posts,
  };
};