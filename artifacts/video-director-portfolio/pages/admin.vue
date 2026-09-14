<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import {
  ADMIN_CREDENTIALS_KEY,
  ADMIN_SESSION_KEY,
  cloneSiteContent,
  defaultSiteContent,
  type HeroSlide,
  type SiteContent,
  type StoryPost,
} from '~/data/site-content';
import { useSiteContent } from '~/composables/useSiteContent';

type Credentials = {
  email: string;
  password: string;
  recoveryCode: string;
};

const defaultCredentials: Credentials = {
  email: 'admin@mageye.com',
  password: 'Mageye2026!',
  recoveryCode: 'MAGEYE-RESET',
};

const { content, loadContent, saveContent, resetContent } = useSiteContent();
const editable = ref<SiteContent>(cloneSiteContent(defaultSiteContent));
const activeSection = ref('overview');
const previewMode = ref<'desktop' | 'mobile'>('desktop');
const toast = ref('');
const menuOpen = ref(false);
const loggedIn = ref(false);
const loginStep = ref<'login' | 'recovery'>('login');
const loginForm = ref({ email: '', password: '', recoveryCode: '' });
const loginError = ref('');
const credentials = ref<Credentials>({ ...defaultCredentials });
const securityForm = ref({ email: '', password: '', recoveryCode: '' });
const newPostKind = ref<'event' | 'news'>('event');
const currentPostId = ref('');
const editorHtml = ref('');
const editorIsSource = ref(false);
const editorSurface = ref<HTMLElement | null>(null);
const postSearch = ref('');
const newFilmTitle = ref('');
const previewPostId = ref('');

const sections = [
  { id: 'overview', label: 'Overview', icon: '⌂' },
  { id: 'hero', label: 'Hero slides', icon: '✦' },
  { id: 'profile', label: 'Profile', icon: '◌' },
  { id: 'films', label: 'Films', icon: '▣' },
  { id: 'posts', label: 'Events & news', icon: '▤' },
  { id: 'contact', label: 'Contact', icon: '↗' },
  { id: 'security', label: 'Login & recovery', icon: '⌁' },
];

const posts = computed(() =>
  editable.value.posts.filter((post) => {
    const query = postSearch.value.toLowerCase().trim();
    return !query || `${post.title} ${post.category} ${post.kind}`.toLowerCase().includes(query);
  }),
);
const editingPost = computed(() => editable.value.posts.find((post) => post.id === currentPostId.value) ?? null);
const selectedPreviewPost = computed(
  () => editable.value.posts.find((post) => post.id === previewPostId.value) ?? editable.value.posts[0] ?? null,
);
const publishedCount = computed(() => editable.value.posts.filter((post) => post.published).length);

const notify = (message: string) => {
  toast.value = message;
  window.setTimeout(() => {
    toast.value = '';
  }, 2600);
};

const loadCredentials = () => {
  if (!import.meta.client) return;
  try {
    const stored = window.localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (stored) credentials.value = { ...defaultCredentials, ...(JSON.parse(stored) as Partial<Credentials>) };
  } catch {
    credentials.value = { ...defaultCredentials };
  }
  securityForm.value = {
    email: credentials.value.email,
    password: credentials.value.password,
    recoveryCode: credentials.value.recoveryCode,
  };
};

const commit = async (message = 'Changes saved for every visitor') => {
  try {
    await saveContent(editable.value);
    notify(message);
  } catch {
    notify('Could not save. Check that the content service is running.');
  }
};

const showSection = (section: string) => {
  activeSection.value = section;
  menuOpen.value = false;
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' });
};

const login = () => {
  loginError.value = '';
  if (
    loginForm.value.email.trim().toLowerCase() !== credentials.value.email.toLowerCase() ||
    loginForm.value.password !== credentials.value.password
  ) {
    loginError.value = 'That email or password does not match.';
    return;
  }
  loggedIn.value = true;
  if (import.meta.client) window.localStorage.setItem(ADMIN_SESSION_KEY, 'active');
};

const recover = () => {
  loginError.value = '';
  if (loginForm.value.recoveryCode.trim().toUpperCase() !== credentials.value.recoveryCode.toUpperCase()) {
    loginError.value = 'The recovery code is not correct.';
    return;
  }
  loginForm.value.password = credentials.value.password;
  loginStep.value = 'login';
  loginError.value = `Recovery accepted. Your current password is ${credentials.value.password}`;
};

const logout = () => {
  loggedIn.value = false;
  if (import.meta.client) window.localStorage.removeItem(ADMIN_SESSION_KEY);
};

const saveSecurity = () => {
  if (!securityForm.value.email || !securityForm.value.password || !securityForm.value.recoveryCode) return;
  credentials.value = { ...securityForm.value };
  if (import.meta.client) window.localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(credentials.value));
  notify('Login details updated');
};

const handleUpload = (event: Event, target: 'profile' | 'hero' | 'film' | 'post', id?: string) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const result = String(reader.result);
    if (target === 'profile') editable.value.profile.image = result;
    if (target === 'hero' && id) {
      const slide = editable.value.heroSlides.find((item) => item.id === id);
      if (slide) slide.image = result;
    }
    if (target === 'film' && id) {
      const film = editable.value.films.find((item) => item.id === id);
      if (film) film.image = result;
    }
    if (target === 'post' && id) {
      const post = editable.value.posts.find((item) => item.id === id);
      if (post) post.image = result;
    }
    notify('Image loaded. Save changes to keep it.');
  };
  reader.readAsDataURL(file);
};

const addHero = () => {
  const slide: HeroSlide = {
    id: `hero-${Date.now()}`,
    eyebrow: 'New story · Mageye Studio',
    heading: 'A new|story begins here.',
    subheading: 'Write a short sentence that introduces this visual chapter.',
    image: '/images/hero-dawn.jpg',
    ctaLabel: 'Explore',
    ctaHref: '#projects',
  };
  editable.value.heroSlides.push(slide);
};

const removeHero = (id: string) => {
  if (editable.value.heroSlides.length <= 1) return;
  editable.value.heroSlides = editable.value.heroSlides.filter((slide) => slide.id !== id);
};

const addFilm = () => {
  const title = newFilmTitle.value.trim() || 'Untitled film';
  editable.value.films.unshift({
    id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
    title,
    type: 'Film',
    year: new Date().getFullYear().toString(),
    runtime: '—',
    price: 99,
    imdbUrl: '',
    image: '/images/posters/kimote-enhanced.jpg',
    color: '#596d65',
    description: 'Add a short film description.',
    body: 'Add the full film story here.',
    director: editable.value.profile.name,
    writer: editable.value.profile.name,
    cast: [],
    trailerUrl: '',
  });
  newFilmTitle.value = '';
  notify('New film added');
};

const removeFilm = (id: string) => {
  editable.value.films = editable.value.films.filter((film) => film.id !== id);
};

const newPost = () => {
  const post: StoryPost = {
    id: `post-${Date.now()}`,
    kind: newPostKind.value,
    category: newPostKind.value === 'event' ? 'Event' : 'News',
    date: 'Add date',
    title: newPostKind.value === 'event' ? 'New event story' : 'New news story',
    excerpt: 'Write a short summary for the card.',
    image: '/images/events/uganda-film-festival-2026.jpg',
    source: '',
    sourceName: 'Mageye Studio',
    sourceCredit: 'Photo credit',
    body: '<h2>Start your story</h2><p>Write the full story here. You can use the editor toolbar or switch to HTML.</p>',
    videoUrl: '',
    buttonLabel: '',
    buttonUrl: '',
    author: editable.value.profile.name,
    published: true,
  };
  editable.value.posts.unshift(post);
  openPost(post.id);
  activeSection.value = 'posts';
};

const removePost = (id: string) => {
  editable.value.posts = editable.value.posts.filter((post) => post.id !== id);
  if (currentPostId.value === id) {
    currentPostId.value = '';
    editorHtml.value = '';
  }
};

const openPost = async (id: string) => {
  currentPostId.value = id;
  const post = editable.value.posts.find((item) => item.id === id);
  editorHtml.value = post?.body ?? '';
  editorIsSource.value = false;
  await nextTick();
  if (editorSurface.value) editorSurface.value.innerHTML = editorHtml.value;
};

const syncEditor = () => {
  if (!editorIsSource.value && editorSurface.value) editorHtml.value = editorSurface.value.innerHTML;
};

const execFormat = (command: string, value?: string) => {
  if (editorIsSource.value) return;
  editorSurface.value?.focus();
  document.execCommand(command, false, value);
  syncEditor();
};

const insertLink = () => {
  const url = window.prompt('Link URL', 'https://');
  if (url) execFormat('createLink', url);
};

const insertImage = () => {
  const url = window.prompt('Image URL');
  if (url) execFormat('insertHTML', `<img src="${url}" alt="" />`);
};

const insertVideo = () => {
  const url = window.prompt('YouTube URL');
  if (!url) return;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^?&/]+)/);
  const videoId = match?.[1];
  if (videoId) execFormat('insertHTML', `<div data-youtube="${videoId}"><p><strong>YouTube video:</strong> ${url}</p></div>`);
};

const insertButton = () => {
  const label = window.prompt('Button label', 'Learn more');
  const url = window.prompt('Button URL', 'https://');
  if (label && url) execFormat('insertHTML', `<p><a href="${url}" class="story-editor-button">${label}</a></p>`);
};

const savePost = async () => {
  const post = editingPost.value;
  if (!post) return;
  syncEditor();
  post.body = editorHtml.value;
  await commit('Story saved for every visitor');
};

const updatePreviewPost = (id: string) => {
  previewPostId.value = id;
};

const restoreDefaults = async () => {
  if (!window.confirm('Restore the original portfolio content in this browser?')) return;
  try {
    await resetContent();
    editable.value = cloneSiteContent(defaultSiteContent);
    notify('Original content restored for every visitor');
  } catch {
    notify('Could not restore defaults. Check that the content service is running.');
  }
};

watch(editorIsSource, async (isSource) => {
  await nextTick();
  if (!isSource && editorSurface.value) editorSurface.value.innerHTML = editorHtml.value;
});

onMounted(async () => {
  await loadContent();
  loadCredentials();
  editable.value = cloneSiteContent(content.value);
  previewPostId.value = editable.value.posts[0]?.id ?? '';
  if (window.localStorage.getItem(ADMIN_SESSION_KEY) === 'active') loggedIn.value = true;
});

useHead({
  title: 'Admin studio — Mageye',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});
</script>

<template>
  <div class="admin-shell">
    <section v-if="!loggedIn" class="admin-login">
      <div class="admin-login-art">
        <div class="admin-login-orbit" aria-hidden="true"></div>
        <div class="admin-login-copy">
          <p class="admin-kicker">Mageye Studio · private workspace</p>
          <h1>Make room<br /><em>for the story.</em></h1>
          <p>Manage the portfolio, publish stories and keep every public detail in your hands.</p>
        </div>
      </div>
      <div class="admin-login-panel">
        <div class="admin-login-brand">
          <img src="/images/hassan-mageye.png" alt="" class="admin-logo" />
          <span>Mageye <small>ADMIN</small></span>
        </div>
        <div v-if="loginStep === 'login'">
          <p class="admin-kicker">Welcome back</p>
          <h2>Sign in to your studio</h2>
          <p class="admin-muted">This is a private, browser-only editor. No database or external account is used.</p>
          <form class="admin-form admin-login-form" @submit.prevent="login">
            <label>Email<input v-model="loginForm.email" type="email" autocomplete="username" placeholder="admin@mageye.com" /></label>
            <label>Password<input v-model="loginForm.password" type="password" autocomplete="current-password" placeholder="••••••••" /></label>
            <p v-if="loginError" class="admin-error">{{ loginError }}</p>
            <button class="admin-primary" type="submit">Enter admin studio <span>↗</span></button>
          </form>
          <button class="admin-text-button" type="button" @click="loginStep = 'recovery'; loginError = ''">Forgot email or password?</button>
          <div class="admin-demo">
            <span>Demo login</span>
            <strong>{{ credentials.email }}</strong>
            <strong>{{ credentials.password }}</strong>
            <small>Recovery code: {{ credentials.recoveryCode }}</small>
          </div>
        </div>
        <div v-else>
          <p class="admin-kicker">Account recovery</p>
          <h2>Use your recovery code</h2>
          <p class="admin-muted">Enter the recovery code saved in your admin settings. The current password will be shown here so you can sign in again.</p>
          <form class="admin-form admin-login-form" @submit.prevent="recover">
            <label>Recovery code<input v-model="loginForm.recoveryCode" type="text" placeholder="MAGEYE-RESET" /></label>
            <p v-if="loginError" class="admin-error">{{ loginError }}</p>
            <button class="admin-primary" type="submit">Recover access <span>↗</span></button>
          </form>
          <button class="admin-text-button" type="button" @click="loginStep = 'login'; loginError = ''">Back to sign in</button>
        </div>
      </div>
    </section>

    <div v-else class="admin-app">
      <aside class="admin-sidebar" :class="{ 'is-open': menuOpen }">
        <div class="admin-sidebar-top">
          <a href="/" class="admin-brand">
            <img src="/images/hassan-mageye.png" alt="" class="admin-logo" />
            <span>Mageye <small>STUDIO</small></span>
          </a>
          <button class="admin-sidebar-close" type="button" @click="menuOpen = false">×</button>
        </div>
        <div class="admin-workspace-label">Content workspace</div>
        <nav class="admin-nav" aria-label="Admin navigation">
          <button v-for="item in sections" :key="item.id" type="button" :class="{ active: activeSection === item.id }" @click="showSection(item.id)">
            <span class="admin-nav-icon">{{ item.icon }}</span><span>{{ item.label }}</span>
            <i v-if="item.id === 'posts'">{{ editable.posts.length }}</i>
          </button>
        </nav>
        <div class="admin-sidebar-bottom">
          <a href="/" class="admin-view-site">View live site <span>↗</span></a>
          <button type="button" class="admin-logout" @click="logout">Sign out</button>
          <p>Content saves to this browser only.</p>
        </div>
      </aside>

      <main class="admin-main">
        <header class="admin-topbar">
          <button type="button" class="admin-menu-toggle" @click="menuOpen = !menuOpen">☰ <span>Menu</span></button>
          <div>
            <p class="admin-kicker">Mageye Studio / Admin</p>
            <h1>{{ sections.find((item) => item.id === activeSection)?.label }}</h1>
          </div>
          <div class="admin-top-actions">
            <span class="admin-saved-dot">Local draft</span>
            <button type="button" class="admin-primary admin-save-top" @click="commit()">Save changes <span>↗</span></button>
          </div>
        </header>

        <div class="admin-content">
          <section v-if="activeSection === 'overview'" class="admin-section">
            <div class="admin-welcome">
              <div>
                <p class="admin-kicker">Your control room</p>
                <h2>Good work happens<br /><em>in the details.</em></h2>
                <p>Keep the public portfolio current without touching code. Add a story, change a price, update a contact detail, then preview it before you save.</p>
              </div>
              <div class="admin-welcome-mark">M<span>·</span></div>
            </div>
            <div class="admin-stat-grid">
              <button type="button" @click="showSection('hero')"><strong>{{ editable.heroSlides.length }}</strong><span>Hero slides</span><i>Manage ↗</i></button>
              <button type="button" @click="showSection('films')"><strong>{{ editable.films.length }}</strong><span>Films in archive</span><i>Manage ↗</i></button>
              <button type="button" @click="showSection('posts')"><strong>{{ publishedCount }}</strong><span>Published stories</span><i>Manage ↗</i></button>
              <button type="button" @click="showSection('contact')"><strong>01</strong><span>Public contact point</span><i>Update ↗</i></button>
            </div>
            <div class="admin-overview-grid">
              <div class="admin-card admin-quick-card">
                <div class="admin-card-heading"><div><p class="admin-kicker">Quick actions</p><h3>What do you want to change?</h3></div></div>
                <div class="admin-quick-actions">
                  <button type="button" @click="showSection('posts'); newPostKind = 'event'; newPost()"><span>＋</span><strong>Add event</strong><small>Publish a new event story</small></button>
                  <button type="button" @click="showSection('posts'); newPostKind = 'news'; newPost()"><span>＋</span><strong>Write news</strong><small>Create an editorial post</small></button>
                  <button type="button" @click="showSection('films')"><span>▣</span><strong>Edit films</strong><small>Prices, posters and credits</small></button>
                  <button type="button" @click="showSection('profile')"><span>◌</span><strong>Update profile</strong><small>Bio, portrait and role</small></button>
                </div>
              </div>
              <div class="admin-card admin-checklist">
                <div class="admin-card-heading"><div><p class="admin-kicker">Before you leave</p><h3>Publishing checklist</h3></div></div>
                <p><span>01</span> Save your changes</p>
                <p><span>02</span> Check the desktop preview</p>
                <p><span>03</span> Switch to mobile and check the crop</p>
                <p><span>04</span> Open the live site</p>
              </div>
            </div>
          </section>

          <section v-if="activeSection === 'hero'" class="admin-section">
            <div class="admin-section-intro"><div><p class="admin-kicker">Home page / opening frame</p><h2>Hero slides</h2><p>Build the first impression of the portfolio. Upload a file or use an image URL for each slide.</p></div><button class="admin-secondary" type="button" @click="addHero">＋ Add slide</button></div>
            <div class="admin-hero-list">
              <article v-for="(slide, index) in editable.heroSlides" :key="slide.id" class="admin-card admin-hero-editor">
                <div class="admin-card-heading"><div><span class="admin-index">0{{ index + 1 }}</span><h3>Slide {{ index + 1 }}</h3></div><button v-if="editable.heroSlides.length > 1" class="admin-delete" type="button" @click="removeHero(slide.id)">Remove</button></div>
                <div class="admin-editor-grid">
                  <div class="admin-image-field"><img :src="slide.image" alt="" /><label class="admin-upload-button">Upload image<input type="file" accept="image/*" @change="handleUpload($event, 'hero', slide.id)" /></label><input v-model="slide.image" type="url" placeholder="Or paste image URL" /></div>
                  <div class="admin-form"><label>Eyebrow<input v-model="slide.eyebrow" type="text" /></label><label>Heading <small>Use | for a line break</small><input v-model="slide.heading" type="text" /></label><label>Subheading<textarea v-model="slide.subheading" rows="3"></textarea></label><div class="admin-two-col"><label>Button label<input v-model="slide.ctaLabel" type="text" /></label><label>Button link<input v-model="slide.ctaHref" type="text" /></label></div></div>
                </div>
              </article>
            </div>
          </section>

          <section v-if="activeSection === 'profile'" class="admin-section">
            <div class="admin-section-intro"><div><p class="admin-kicker">Identity / public biography</p><h2>Profile details</h2><p>This information powers the director profile on the public home page.</p></div></div>
            <div class="admin-card admin-profile-editor">
              <div class="admin-profile-image-field"><img :src="editable.profile.image" alt="" /><label class="admin-upload-button">Upload portrait<input type="file" accept="image/*" @change="handleUpload($event, 'profile')" /></label><input v-model="editable.profile.image" type="url" placeholder="Or paste portrait URL" /></div>
              <div class="admin-form"><label>Name<input v-model="editable.profile.name" type="text" /></label><label>Role / title<input v-model="editable.profile.role" type="text" /></label><label>Location<input v-model="editable.profile.location" type="text" /></label><label>Biography<textarea v-model="editable.profile.bio" rows="10"></textarea></label></div>
            </div>
            <div class="admin-card admin-project-editor"><div class="admin-card-heading"><div><p class="admin-kicker">Coming soon</p><h3>Upcoming project</h3></div></div><div class="admin-form admin-two-col"><label>Title<input v-model="editable.upcomingProject.title" type="text" /></label><label>Type<input v-model="editable.upcomingProject.type" type="text" /></label><label class="admin-full">Description<textarea v-model="editable.upcomingProject.description" rows="4"></textarea></label></div></div>
          </section>

          <section v-if="activeSection === 'films'" class="admin-section">
            <div class="admin-section-intro"><div><p class="admin-kicker">Catalogue / commerce</p><h2>Film archive</h2><p>Edit every field that appears on the film archive, film detail page and purchase request.</p></div><div class="admin-inline-add"><input v-model="newFilmTitle" type="text" placeholder="New film title" @keyup.enter="addFilm" /><button class="admin-secondary" type="button" @click="addFilm">＋ Add film</button></div></div>
            <div class="admin-film-list">
              <article v-for="(film, index) in editable.films" :key="film.id" class="admin-card admin-film-editor">
                <div class="admin-film-heading"><div class="admin-film-thumb"><img :src="film.image" alt="" /></div><div><span class="admin-index">0{{ index + 1 }}</span><h3>{{ film.title }}</h3><p>{{ film.type }} · {{ film.year }}</p></div><button class="admin-delete" type="button" @click="removeFilm(film.id)">Remove</button></div>
                 <div class="admin-form admin-two-col"><label>Title<input v-model="film.title" type="text" /></label><label>Type<input v-model="film.type" type="text" /></label><label>Year<input v-model="film.year" type="text" /></label><label>Runtime<input v-model="film.runtime" type="text" /></label><label>Price <small>USD</small><input v-model.number="film.price" type="number" min="0" step="1" /></label><label>Poster URL<input v-model="film.image" type="url" /></label><label class="admin-full">Trailer MP4 URL<input v-model="film.trailerUrl" type="url" placeholder="https://…/trailer.mp4" /></label><label class="admin-full">Upload poster<input type="file" accept="image/*" @change="handleUpload($event, 'film', film.id)" /></label><label class="admin-full">Short description<textarea v-model="film.description" rows="3"></textarea></label><label class="admin-full">Full story<textarea v-model="film.body" rows="5"></textarea></label><label>Director<input v-model="film.director" type="text" /></label><label>Writer<input v-model="film.writer" type="text" /></label><label>Producer<input v-model="film.producer" type="text" /></label><label>Cast <small>Comma separated</small><input :value="film.cast.join(', ')" type="text" @input="film.cast = ($event.target as HTMLInputElement).value.split(',').map((name) => name.trim()).filter(Boolean)" /></label><label class="admin-full">Recognition<textarea v-model="film.recognition" rows="3"></textarea></label></div>
              </article>
            </div>
          </section>

          <section v-if="activeSection === 'posts'" class="admin-section admin-posts-section">
            <div class="admin-section-intro"><div><p class="admin-kicker">Editorial / publishing</p><h2>Events & news</h2><p>Create rich stories with headings, subheadings, images, YouTube video embeds, links and call-to-action buttons.</p></div><div class="admin-post-actions"><select v-model="newPostKind"><option value="event">Event</option><option value="news">News</option></select><button class="admin-secondary" type="button" @click="newPost">＋ New {{ newPostKind }}</button></div></div>
            <div class="admin-post-workspace">
              <aside class="admin-card admin-post-list"><div class="admin-post-list-top"><input v-model="postSearch" type="search" placeholder="Search stories…" /><span>{{ editable.posts.length }}</span></div><button v-for="post in posts" :key="post.id" type="button" class="admin-post-row" :class="{ active: currentPostId === post.id }" @click="openPost(post.id)"><span class="admin-post-type">{{ post.kind }}</span><strong>{{ post.title }}</strong><small>{{ post.date }} · {{ post.published ? 'Published' : 'Draft' }}</small></button></aside>
              <div v-if="editingPost" class="admin-post-editor">
                <div class="admin-post-editor-top"><div><span class="admin-index">{{ editingPost.kind }}</span><h3>Edit story</h3></div><button class="admin-delete" type="button" @click="removePost(editingPost.id)">Delete story</button></div>
                <div class="admin-card admin-post-fields"><div class="admin-form admin-two-col"><label>Title<input v-model="editingPost.title" type="text" /></label><label>Category<input v-model="editingPost.category" type="text" /></label><label>Date / date range<input v-model="editingPost.date" type="text" /></label><label>Author<input v-model="editingPost.author" type="text" /></label><label class="admin-full">Card excerpt<textarea v-model="editingPost.excerpt" rows="3"></textarea></label><label>Image URL<input v-model="editingPost.image" type="url" /></label><label>Upload image<input type="file" accept="image/*" @change="handleUpload($event, 'post', editingPost.id)" /></label><label>Source name<input v-model="editingPost.sourceName" type="text" /></label><label>Source URL<input v-model="editingPost.source" type="url" /></label><label>Photo credit<input v-model="editingPost.sourceCredit" type="text" /></label><label>YouTube URL <small>Optional hero video</small><input v-model="editingPost.videoUrl" type="url" placeholder="https://youtube.com/watch?v=…" /></label><label>Button label<input v-model="editingPost.buttonLabel" type="text" /></label><label>Button URL<input v-model="editingPost.buttonUrl" type="url" /></label><label class="admin-checkbox admin-full"><input v-model="editingPost.published" type="checkbox" /> Publish this story on the home page</label></div></div>
                <div class="admin-card admin-rich-editor"><div class="admin-rich-toolbar"><button type="button" title="Heading" @click="execFormat('formatBlock', 'h2')">H2</button><button type="button" title="Subheading" @click="execFormat('formatBlock', 'h3')">H3</button><button type="button" title="Bold" @click="execFormat('bold')"><b>B</b></button><button type="button" title="Italic" @click="execFormat('italic')"><i>I</i></button><button type="button" title="Bulleted list" @click="execFormat('insertUnorderedList')">• List</button><button type="button" title="Quote" @click="execFormat('formatBlock', 'blockquote')">“</button><button type="button" title="Link" @click="insertLink">↗ Link</button><button type="button" title="Insert image" @click="insertImage">▧ Image</button><button type="button" title="Insert YouTube video" @click="insertVideo">▶ YouTube</button><button type="button" title="Insert button" @click="insertButton">＋ Button</button><button type="button" class="admin-source-toggle" :class="{ active: editorIsSource }" @click="editorIsSource = !editorIsSource">&lt;/&gt; HTML</button></div><textarea v-if="editorIsSource" v-model="editorHtml" class="admin-html-source" rows="18"></textarea><div v-else ref="editorSurface" class="admin-editor-surface" contenteditable="true" spellcheck="true" @input="syncEditor"><p>Start writing…</p></div><div class="admin-editor-foot"><span>Rich text supports headings, links, lists, images, video embeds and buttons.</span><button class="admin-primary" type="button" @click="savePost">Save story</button></div></div>
              </div>
              <div v-else class="admin-card admin-empty-state"><span>✦</span><h3>Choose a story to edit</h3><p>Or create a new event or news post to start writing.</p></div>
            </div>
          </section>

          <section v-if="activeSection === 'contact'" class="admin-section">
            <div class="admin-section-intro"><div><p class="admin-kicker">Enquiries / social</p><h2>Contact details</h2><p>These details are used by the public contact section and email links.</p></div></div>
            <div class="admin-card admin-form admin-two-col admin-contact-form"><label>Email<input v-model="editable.contact.email" type="email" /></label><label>Availability line<input v-model="editable.contact.availability" type="text" /></label><label>Instagram URL<input v-model="editable.contact.instagram" type="url" /></label><label>Instagram label<input v-model="editable.contact.instagramLabel" type="text" /></label><label>LinkedIn URL<input v-model="editable.contact.linkedin" type="url" /></label><label>LinkedIn label<input v-model="editable.contact.linkedinLabel" type="text" /></label><label class="admin-full">Footer location / note<input v-model="editable.contact.footerNote" type="text" /></label></div>
          </section>

          <section v-if="activeSection === 'security'" class="admin-section">
            <div class="admin-section-intro"><div><p class="admin-kicker">Private workspace</p><h2>Login & recovery</h2><p>There is no server account here. These values are stored locally in this browser, like a simple static CMS.</p></div></div>
            <div class="admin-card admin-security-card"><div class="admin-security-note"><span>⌁</span><div><strong>Keep your recovery code somewhere safe.</strong><p>If you forget the email or password, use it on the admin login screen to reveal your current password.</p></div></div><div class="admin-form"><label>Admin email<input v-model="securityForm.email" type="email" /></label><label>Admin password<input v-model="securityForm.password" type="text" /></label><label>Recovery code<input v-model="securityForm.recoveryCode" type="text" /></label><button class="admin-primary" type="button" @click="saveSecurity">Save login settings <span>↗</span></button></div></div>
            <div class="admin-danger-zone"><div><p class="admin-kicker">Reset</p><h3>Restore original demo content</h3><p>Use this only if you want to remove the edits saved in this browser.</p></div><button class="admin-danger" type="button" @click="restoreDefaults">Restore defaults</button></div>
          </section>
        </div>
      </main>

      <aside class="admin-preview-panel">
        <div class="admin-preview-header"><div><p class="admin-kicker">Live preview</p><h2>Public view</h2></div><div class="admin-preview-switcher"><button type="button" :class="{ active: previewMode === 'desktop' }" @click="previewMode = 'desktop'">Desktop</button><button type="button" :class="{ active: previewMode === 'mobile' }" @click="previewMode = 'mobile'">Mobile</button></div></div>
        <div class="admin-preview-stage">
          <div class="admin-device" :class="`is-${previewMode}`">
            <div class="admin-device-bar"><span></span><span></span><span></span><small>{{ previewMode === 'desktop' ? 'mageye.studio' : '9:41' }}</small></div>
            <div class="admin-public-preview">
              <div class="admin-preview-hero" :style="{ backgroundImage: `linear-gradient(180deg, rgba(8,25,38,.16), rgba(8,25,38,.9)), url(${editable.heroSlides[0]?.image})` }"><div><small>{{ editable.heroSlides[0]?.eyebrow }}</small><h3>{{ editable.heroSlides[0]?.heading?.replace('|', ' ') }}</h3><p>{{ editable.heroSlides[0]?.subheading }}</p><button>{{ editable.heroSlides[0]?.ctaLabel }} ↗</button></div></div>
              <div class="admin-preview-profile"><img :src="editable.profile.image" alt="" /><div><small>Director's profile</small><h3>{{ editable.profile.name }}</h3><p>{{ editable.profile.bio }}</p></div></div>
              <div class="admin-preview-section"><small>Selected projects</small><h3>FILMS</h3><div class="admin-preview-film-row"><img v-for="film in editable.films.slice(0, 3)" :key="film.id" :src="film.image" :alt="film.title" /></div></div>
              <div class="admin-preview-section admin-preview-stories"><div class="admin-preview-section-heading"><div><small>Events & news</small><h3>STORIES</h3></div><select :value="selectedPreviewPost?.id" @change="updatePreviewPost(($event.target as HTMLSelectElement).value)"><option v-for="post in editable.posts" :key="post.id" :value="post.id">{{ post.title }}</option></select></div><img v-if="selectedPreviewPost" :src="selectedPreviewPost.image" alt="" /><h4 v-if="selectedPreviewPost">{{ selectedPreviewPost.title }}</h4><p v-if="selectedPreviewPost">{{ selectedPreviewPost.excerpt }}</p></div>
              <div class="admin-preview-contact"><small>Contact</small><h3>MAKE ROOM<br /><em>FOR THE STORY.</em></h3><a :href="`mailto:${editable.contact.email}`">{{ editable.contact.email }}</a></div>
            </div>
          </div>
        </div>
      </aside>
    </div>
    <Transition name="toast"><div v-if="toast" class="admin-toast">{{ toast }}</div></Transition>
  </div>
</template>