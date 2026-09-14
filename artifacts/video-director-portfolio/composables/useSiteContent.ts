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

const loadContent = async () => {
  if (!import.meta.client || hasLoaded) return content.value;
  hasLoaded = true;

  try {
    const runtimeConfig = useRuntimeConfig();
    const response = await fetch(`${runtimeConfig.public.apiBase}/site-content`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Content request failed with ${response.status}`);

    const result = (await response.json()) as { content?: Partial<SiteContent> | null };
    if (result.content) {
      content.value = mergeSiteContent(result.content);
      return content.value;
    }

    // One-time migration path for edits made by the previous browser-only version.
    const saved = window.localStorage.getItem(SITE_CONTENT_KEY);
    if (saved) content.value = mergeSiteContent(JSON.parse(saved) as Partial<SiteContent>);
  } catch {
    // Keep the public site usable if the API is temporarily unavailable.
    try {
      const saved = window.localStorage.getItem(SITE_CONTENT_KEY);
      if (saved) content.value = mergeSiteContent(JSON.parse(saved) as Partial<SiteContent>);
    } catch {
      content.value = cloneSiteContent(defaultSiteContent);
    }
  }

  return content.value;
};

export const useSiteContent = () => {
  onMounted(loadContent);

  const saveContent = async (next: SiteContent) => {
    content.value = cloneSiteContent(next);
    if (!import.meta.client) return;
    const runtimeConfig = useRuntimeConfig();
    const response = await fetch(`${runtimeConfig.public.apiBase}/site-content`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content.value),
    });
    if (!response.ok) throw new Error(`Content save failed with ${response.status}`);
    window.localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(content.value));
  };

  const resetContent = async () => {
    const next = cloneSiteContent(defaultSiteContent);
    content.value = next;
    if (!import.meta.client) return;
    const runtimeConfig = useRuntimeConfig();
    const response = await fetch(`${runtimeConfig.public.apiBase}/site-content`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(next),
    });
    if (!response.ok) throw new Error(`Content reset failed with ${response.status}`);
    window.localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(next));
  };

  return { content, loadContent, saveContent, resetContent };
};