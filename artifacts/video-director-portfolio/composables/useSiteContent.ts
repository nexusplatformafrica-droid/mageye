import { onMounted, ref } from 'vue';
import {
  cloneSiteContent,
  defaultSiteContent,
  mergeSiteContent,
  SITE_CONTENT_KEY,
  type SiteContent,
} from '~/data/site-content';

const content = ref<SiteContent>(cloneSiteContent(defaultSiteContent));
let hasLoaded = false;

const loadContent = () => {
  if (!import.meta.client || hasLoaded) return;
  hasLoaded = true;
  try {
    const saved = window.localStorage.getItem(SITE_CONTENT_KEY);
    if (saved) content.value = mergeSiteContent(JSON.parse(saved) as Partial<SiteContent>);
  } catch {
    content.value = cloneSiteContent(defaultSiteContent);
  }
};

export const useSiteContent = () => {
  onMounted(loadContent);

  const saveContent = (next: SiteContent) => {
    content.value = cloneSiteContent(next);
    if (import.meta.client) window.localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(content.value));
  };

  const resetContent = () => {
    const next = cloneSiteContent(defaultSiteContent);
    content.value = next;
    if (import.meta.client) window.localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(next));
  };

  return { content, loadContent, saveContent, resetContent };
};