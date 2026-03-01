<script setup lang="ts">
import { ExternalLink } from "lucide-vue-next";

interface Article {
  id: string;
  feedName: string;
  title: string;
  link: string;
  summary: string;
  publishedAt: string;
}

const props = defineProps<{ article: Article }>();

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime()) || date.getTime() === 0) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `vor ${diffMins} Min.`;
  if (diffHours < 24) return `vor ${diffHours} Std.`;
  if (diffDays === 1) return "gestern";
  if (diffDays < 7) return `vor ${diffDays} Tagen`;
  return date.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
}
</script>

<template>
  <article
    class="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2">
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 truncate max-w-[160px]"
          >
            {{ article.feedName }}
          </span>
          <span v-if="formatDate(article.publishedAt)" class="text-xs text-gray-400 dark:text-gray-500 shrink-0">
            {{ formatDate(article.publishedAt) }}
          </span>
        </div>

        <a
          :href="article.link"
          target="_blank"
          rel="noopener noreferrer"
          class="block text-base font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 leading-snug mb-2 transition-colors"
        >
          {{ article.title }}
        </a>

        <p v-if="article.summary" class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {{ article.summary }}
        </p>
      </div>

      <a
        :href="article.link"
        target="_blank"
        rel="noopener noreferrer"
        class="shrink-0 p-1.5 text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
      >
        <ExternalLink :size="16" />
      </a>
    </div>
  </article>
</template>
