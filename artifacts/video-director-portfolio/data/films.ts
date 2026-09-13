export type Film = {
  id: string;
  title: string;
  type: string;
  year: string;
  runtime: string;
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
    id: 'tide-lines',
    title: 'Tide Lines',
    type: 'Documentary short',
    year: '2024',
    runtime: '12 min',
    image: '/images/film-tide.jpg',
    color: '#d7bfa2',
    description: 'A quiet portrait of the people who read the lake before the weather arrives.',
    body: 'On the shore of Lake Victoria, a small fishing community reads the water as carefully as a map. Tide Lines stays close to the everyday rituals that make a life on the lake possible, allowing the weather, the work and the silences between people to shape the film.',
    credits: ['Director — Amara Kato', 'Producer — Kijani Films', 'Cinematography — Wanjiku Muriuki'],
  },
  {
    id: 'earth-speaks',
    title: 'Earth Speaks',
    type: 'Brand film / Kijani',
    year: '2023',
    runtime: '02:14',
    image: '/images/film-earth.jpg',
    color: '#b7bd91',
    description: 'A study in hands, heat and the slow patience of making something last.',
    body: 'For Kijani, the camera follows material from soil to finished object. The film is built from tactile details and unhurried gestures, giving a contemporary craft practice enough space to speak in its own voice.',
    credits: ['Director — Amara Kato', 'Client — Kijani Studio', 'Production — Small Hours'],
  },
  {
    id: 'blue-hour',
    title: 'Blue Hour',
    type: 'Documentary short',
    year: '2023',
    runtime: '08 min',
    image: '/images/film-coast.jpg',
    color: '#7e8e91',
    description: 'A coastal portrait about memory, salt air and the people who stay with the tide.',
    body: 'Blue Hour is a coastal portrait made in the space between the last light and the first dark. It follows three generations of one family and the coastline they keep returning to, looking for the memories held by place.',
    credits: ['Director — Amara Kato', 'Sound — Achieng Oduor', 'Production — Amara Kato Studio'],
  },
  {
    id: 'in-the-making',
    title: 'In the Making',
    type: 'Brand film / Kijani',
    year: '2023',
    runtime: '03:40',
    image: '/images/film-clay.jpg',
    color: '#bd8b60',
    description: 'A tactile study of craft, patience and the hands that keep a material alive.',
    body: 'A portrait of the hands behind a living material. In the Making lets clay, heat and repetition carry the narrative, creating a film about process that feels as considered as the objects it reveals.',
    credits: ['Director — Amara Kato', 'Client — Kijani Studio', 'Art Direction — Njeri Maina'],
  },
  {
    id: 'after-the-rain',
    title: 'After the Rain',
    type: 'Music film',
    year: '2022',
    runtime: '04:16',
    image: '/images/film-song.jpg',
    color: '#596d65',
    description: 'A moving portrait of rhythm, friendship and the first song after a storm.',
    body: 'After the Rain follows a group of friends as the city starts again. Music, movement and wet streets become one continuous language in a portrait made to feel close, immediate and alive.',
    credits: ['Director — Amara Kato', 'Artist — Nia Wambui', 'Production — Small Hours'],
  },
  {
    id: 'the-weavers',
    title: 'The Weavers',
    type: 'Editorial portrait',
    year: '2021',
    runtime: '10 min',
    image: '/images/film-weave.jpg',
    color: '#9b7654',
    description: 'A quiet look at the patterns passed between generations by hand.',
    body: 'The Weavers looks at a family practice passed from one generation to the next. The film is patient with pattern, repetition and the conversations that happen while hands are busy.',
    credits: ['Director — Amara Kato', 'Editor — M. Wekesa', 'Production — Amara Kato Studio'],
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
];