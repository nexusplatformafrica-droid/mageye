export type Film = {
  id: string;
  title: string;
  type: string;
  year: string;
  runtime: string;
  price: number;
  imdbUrl: string;
  image: string;
  color: string;
  description: string;
  body: string;
  director: string;
  writer: string;
  producer?: string;
  cast: string[];
  recognition?: string;
  trailerUrl?: string;
};

export const trailerUrls: Record<string, string> = {
  'bedroom chains': 'https://pub-eb00261df49f466a9e5efee154650b48.r2.dev/media/admin/02c0593d-4e27-4354-8f02-acc7325c5d43-Bedroom_Chains_Trailer_Final.mp4',
  "tinka's story": 'https://pub-eb00261df49f466a9e5efee154650b48.r2.dev/media/admin/6f42ad8e-0620-48d9-8928-62cc0d1ca170-TINKA_S_STORY_OFFICIAL_TRAILER__1_.mp4',
};

export const getFilmTrailerUrl = (film: Film) =>
  film.trailerUrl || trailerUrls[film.title.trim().toLowerCase()] || '';

export type Event = {
  id: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  source: string;
  sourceName: string;
  sourceCredit: string;
};

export const films: Film[] = [
  {
    id: 'kimote',
    title: 'Kimote',
    type: 'Drama',
    year: '2025',
    runtime: '—',
    price: 99,
    imdbUrl: 'https://www.imdb.com/title/tt36166805/',
    image: '/images/posters/kimote-enhanced.jpg',
    color: '#596d65',
    description: 'A Ugandan drama centered on barkcloth craftsmanship, cultural inheritance and the tension between preserving ancestral tradition and pursuing a changing future.',
    body: 'Kimote is a Ugandan drama centered on barkcloth craftsmanship, cultural inheritance and the tension between preserving ancestral tradition and pursuing a changing future. Mageye is credited as writer, director and producer.',
    director: 'Mageye Hassan',
    writer: 'Mageye Hassan',
    producer: 'Mageye Hassan',
    cast: ['Felix Bwanika Baale', 'Blace Katukunda', 'Sarah Kisauzi'],
    recognition: 'Best Film in an Indigenous Language at the 2025 Uganda Film Festival; Special Mention at the 2025 Mashariki African Film Festival; screened at the Silicon Valley African Film Festival; and selected as Uganda’s official submission to the 98th Academy Awards for Best International Feature Film.',
  },
  {
    id: 'bedroom-chains',
    title: 'Bedroom Chains',
    type: 'Drama',
    year: '2022',
    runtime: '1h 44m',
    price: 99,
    imdbUrl: 'https://www.imdb.com/title/tt22098864/',
    image: '/images/posters/bedroom-chains-enhanced.jpg',
    color: '#bd8b60',
    description: 'Natasha returns to Uganda and sparks a movement of liberation for women.',
    body: 'Natasha, an extrovert, faced discrimination from her father for being a girl. She was sent to India and later returned to Uganda, where her presence sparked a movement of liberation for women.',
    director: 'Mageye Hassan',
    writer: 'Mageye Hassan',
    cast: ['Tyler Aboko', 'Deep Bhojkar', 'Zziwa Ddungu'],
    trailerUrl: trailerUrls['bedroom chains'],
  },
  {
    id: 'tinkas-story',
    title: "Tinka's Story",
    type: 'Thriller',
    year: '2022',
    runtime: '—',
    price: 99,
    imdbUrl: 'https://www.imdb.com/title/tt22169848/',
    image: '/images/posters/tinkas-story-enhanced.jpg',
    color: '#59646c',
    description: "A Ugandan thriller directed and written by Mageye Hassan.",
    body: "Tinka's Story is a Ugandan thriller directed and written by Mageye Hassan. IMDb lists Tania Shakirah Kankindi, Aggie Kebirungi and Jayant Maru among the principal cast.",
    director: 'Mageye Hassan',
    writer: 'Mageye Hassan',
    cast: ['Tania Shakirah Kankindi', 'Aggie Kebirungi', 'Jayant Maru'],
    trailerUrl: trailerUrls["tinka's story"],
  },
  {
    id: 'devils-chest',
    title: "Devil's Chest",
    type: 'Drama',
    year: '2017',
    runtime: '2h 23m',
    price: 99,
    imdbUrl: 'https://www.imdb.com/title/tt12560552/',
    image: '/images/posters/devils-chest-enhanced.jpg',
    color: '#7e8e91',
    description: "Devil's Chest is a drama released in 2017.",
    body: "IMDb currently lists no plot synopsis for Devil's Chest.",
    director: 'Mageye Hassan',
    writer: 'Mageye Hassan',
    cast: ['Ritah Atuhaire', 'Brenda Ayiyochan', 'George Ivan Bamwenda'],
  },
  {
    id: 'galz-about-town',
    title: 'Galz About Town',
    type: 'Drama',
    year: '2015',
    runtime: '—',
    price: 99,
    imdbUrl: 'https://www.imdb.com/title/tt6649904/',
    image: '/images/posters/galz-about-town-enhanced.jpg',
    color: '#b7bd91',
    description: 'Galz About Town is a drama released in 2015.',
    body: 'IMDb currently lists no plot synopsis for Galz About Town.',
    director: 'Mageye Hassan',
    writer: 'Waheedah Mwagale',
    cast: ['Mutebi Farooq', 'Dennis Josiah', 'Nisha Kalema'],
  },
  {
    id: 'kings-virgin',
    title: "King's Virgin",
    type: 'Drama',
    year: '2013',
    runtime: '—',
    price: 99,
    imdbUrl: 'https://www.imdb.com/title/tt23623944/',
    image: '/images/posters/kings-virgin-enhanced.jpg',
    color: '#d7bfa2',
    description: "King's Virgin is a drama released in 2013.",
    body: "IMDb currently lists no plot synopsis for King's Virgin.",
    director: 'Prince Joe Nakibinge',
    writer: 'Mageye Hassan',
    cast: ['Mageye Hassan', 'Yasin Lubowa', 'Joan Nakanyike'],
  },
];

export const upcomingProject = {
  title: 'The Silence We Flee',
  type: 'Thriller',
  description: 'An upcoming thriller written and directed by Hassan Mageye. The film follows Naomi as she flees danger while carrying evidence that places her in the path of powerful forces, combining themes of survival, displacement, immigration and pursuit.',
};

export const events: Event[] = [
  {
    id: 'uganda-film-festival-2026',
    category: 'Film festival',
    date: '21—28.08.26',
    title: 'Uganda Film Festival launches nationwide screenings',
    excerpt: 'The 13th Uganda Film Festival brought local screenings, workshops and industry forums to audiences across the country ahead of its Awards Gala.',
    image: '/images/events/uganda-film-festival-2026.jpg',
    source: 'https://chimpreports.com/uganda-film-festival-launches-nationwide-screenings-and-industry-trainings',
    sourceName: 'ChimpReports',
    sourceCredit: 'Photo: ChimpReports',
  },
  {
    id: 'bedroom-chains-screening',
    category: 'Public screening',
    date: '03.06.22',
    title: 'Excitement as Multichoice Uganda Screens Bedroom Chains Ahead Of the Uganda Film Festival',
    excerpt: 'MultiChoice Uganda and the Uganda Communications Commission screened Bedroom Chains ahead of the Uganda Film Festival, where the film received multiple nominations.',
    image: 'https://redpepper.co.ug/wp-content/uploads/2022/06/DSC01219.jpg',
    source: 'https://redpepper.co.ug/excitement-as-multichoice-uganda-screens-bedroom-chains-ahead-of-the-uganda-film-festival/118817/',
    sourceName: 'Red Pepper',
    sourceCredit: 'Photo: Red Pepper',
  },
  {
    id: 'african-stage-feature',
    category: 'Press feature',
    date: '13.07.18',
    title: 'Is this time for Ugandan film on the African stage?',
    excerpt: 'Sqoop examines the growing ambition of Uganda’s film industry, with Hassan Mageye’s Devil’s Chest among the films carrying Ugandan stories into a wider African conversation.',
    image: '/images/devils-chest-hero.png',
    source: 'https://www.sqoop.co.ug/201807/features/is-this-time-for-ugandan-film-on-the-african-stage.html',
    sourceName: 'Sqoop',
    sourceCredit: 'Photo: Devil’s Chest still · Sqoop / courtesy',
  },
  {
    id: 'uganda-film-festival-2026-awards',
    category: 'Awards gala',
    date: '29.08.26',
    title: 'Adui, Small Gods and Damalie Shine at Uganda Film Festival Award',
    excerpt: 'The Uganda Communications Commission reports on the close of the 13th Uganda Film Festival in Kampala, where Ugandan films and filmmakers were recognised across the awards.',
    image: 'https://www.ucc.co.ug/wp-content/uploads/2026/09/Thumbnail-web-1.jpg',
    source: 'https://www.ucc.co.ug/adui-small-gods-and-damalie-shine-at-uganda-film-festival-award',
    sourceName: 'UCC',
    sourceCredit: 'Photo: Uganda Communications Commission',
  },
];