<script setup lang="ts">
import { Loader2, RefreshCw, Newspaper } from "lucide-vue-next";

const props = defineProps<{ feedsKey: number }>();

interface Article {
  id: string;
  feedId: string;
  feedName: string;
  title: string;
  link: string;
  summary: string;
  publishedAt: string;
}

const articles = ref<Article[]>([]);
const loading = ref(true);
const refreshing = ref(false);

async function fetchArticles(showRefreshing = false) {
  if (showRefreshing) refreshing.value = true;
  else loading.value = true;

  try {
    const data = await $fetch<Article[]>("/api/articles");
    articles.value = data ?? [];
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
}

watch(() => props.feedsKey, () => fetchArticles(), { immediate: true });
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ articles.length > 0 ? `${articles.length} Artikel` : "Artikel" }}
      </h2>
      <button
        :disabled="refreshing"
        class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        @click="fetchArticles(true)"
      >
        <RefreshCw :size="14" :class="refreshing ? 'animate-spin' : ''" />
        Aktualisieren
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
      <Loader2 :size="28" class="animate-spin" />
      <p class="text-sm">Artikel werden geladen...</p>
    </div>

    <!-- Leer -->
    <div v-else-if="articles.length === 0" class="flex flex-col items-center justify-center h-64 gap-3 text-center">
      <Newspaper :size="40" class="text-gray-200 dark:text-gray-700" />
      <div>
        <p class="text-gray-500 dark:text-gray-400 font-medium">Keine Artikel</p>
        <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">
          Aktiviere Feeds in der Seitenleiste, um Artikel zu sehen.
        </p>
      </div>
    </div>

    <!-- Artikel -->
    <div v-else class="space-y-3">
      <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
    </div>
  </div>
</template>
