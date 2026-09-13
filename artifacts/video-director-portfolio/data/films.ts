export type Film = {
  id: string;
  title: string;
  type: string;
  year: string;
  runtime: string;
  imdbUrl: string;
  image: string;
  color: string;
  description: string;
  body: string;
  credits: string[];
};

export type Story = {
  id: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  image: string;
};

export const films: Film[] = [
  {
    id: 'kings-virgin',
    title: "King's Virgin",
    type: 'Feature film',
    year: '2013',
    runtime: '—',
    imdbUrl: 'https://www.imdb.com/title/tt23623944/',
    image: '/images/film-tide.jpg',
    color: '#d7bfa2',
    description: "King's Virgin is a feature film released in 2013.",
    body: "Return to King's Virgin through its official IMDb listing, with cast, crew and film details.",
    credits: ['Cast & crew — IMDb'],
  },
  {
    id: 'galz-about-town',
    title: 'Galz About Town',
    type: 'Feature film',
    year: '2015',
    runtime: '—',
    imdbUrl: 'https://www.imdb.com/title/tt6649904/',
    image: '/images/film-earth.jpg',
    color: '#b7bd91',
    description: 'Galz About Town is a feature film released in 2015.',
    body: 'Return to Galz About Town through its official IMDb listing, with cast, crew and film details.',
    credits: ['Cast & crew — IMDb'],
  },
  {
    id: 'devils-chest',
    title: "Devil's Chest",
    type: 'Feature film',
    year: '2017',
    runtime: '2h 23m',
    imdbUrl: 'https://www.imdb.com/title/tt12560552/',
    image: '/images/film-coast.jpg',
    color: '#7e8e91',
    description: "Devil's Chest is a feature film released in 2017.",
    body: "Return to Devil's Chest through its official IMDb listing, with cast, crew and film details.",
    credits: ['Cast & crew — IMDb'],
  },
  {
    id: 'bedroom-chains',
    title: 'Bedroom Chains',
    type: 'Feature film',
    year: '2022',
    runtime: '1h 44m',
    imdbUrl: 'https://www.imdb.com/title/tt22098864/',
    image: '/images/film-clay.jpg',
    color: '#bd8b60',
    description: 'Bedroom Chains is a feature film released in 2022.',
    body: 'Return to Bedroom Chains through its official IMDb listing, with cast, crew and film details.',
    credits: ['Cast & crew — IMDb'],
  },
  {
    id: 'kimote',
    title: 'Kimote',
    type: 'Feature film',
    year: '2025',
    runtime: '—',
    imdbUrl: 'https://www.imdb.com/title/tt36166805/',
    image: '/images/film-song.jpg',
    color: '#596d65',
    description: 'Kimote is a feature film released in 2025.',
    body: 'Return to Kimote through its official IMDb listing, with cast, crew and film details.',
    credits: ['Cast & crew — IMDb'],
  },
];

export const stories: Story[] = [
  {
    id: 'the-long-take',
    category: 'Notes from set',
    date: '08.05.24',
    readTime: '4 min read',
    title: 'The long take is a kind of trust',
    excerpt: 'What changes when we leave the camera running long enough for performance to become presence.',
    image: '/images/hero-dawn.jpg',
  },
  {
    id: 'on-listening',
    category: 'Field notes',
    date: '21.03.24',
    readTime: '3 min read',
    title: 'On listening before asking',
    excerpt: 'A few reminders from the road about finding the story underneath the brief.',
    image: '/images/film-weave.jpg',
  },
  {
    id: 'small-crew-big-room',
    category: 'Working practice',
    date: '14.11.23',
    readTime: '5 min read',
    title: 'Small crews, bigger rooms',
    excerpt: 'Why a lighter footprint often leaves more space for the unscripted moments that matter.',
    image: '/images/film-clay.jpg',
  },
  {
    id: 'first-light',
    category: 'Field notes',
    date: '29.06.23',
    readTime: '4 min read',
    title: 'Leave room for first light',
    excerpt: 'A note on opening a frame with enough space for the world to enter.',
    image: '/images/film-coast.jpg',
  },
];