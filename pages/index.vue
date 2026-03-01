<script setup lang="ts">
import { Rss, LogOut, Loader2 } from "lucide-vue-next";

definePageMeta({ middleware: "auth" });

const { user } = useUserSession();

interface FeedInfo {
  id: string;
  name: string;
  url: string;
  description: string | null;
  isDefault: boolean;
  isSubscribed: boolean;
  isActive: boolean;
}

const feeds = ref<FeedInfo[]>([]);
const feedsLoading = ref(true);
const feedsKey = ref(0);

async function fetchFeeds() {
  const data = await $fetch<FeedInfo[]>("/api/feeds");
  feeds.value = data ?? [];
  feedsLoading.value = false;
}

function onFeedsChanged() {
  fetchFeeds();
  feedsKey.value++;
}

async function logout() {
  await $fetch("/api/auth/logout", { method: "POST" });
  await navigateTo("/login");
}

onMounted(fetchFeeds);
</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Top Nav -->
    <header class="shrink-0 flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10">
      <div class="flex items-center gap-2">
        <Rss :size="20" class="text-blue-600" />
        <span class="text-lg font-bold text-gray-900 dark:text-white">elmo-news</span>
      </div>
      <button
        class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        @click="logout"
      >
        <LogOut :size="15" />
        Abmelden
      </button>
    </header>

    <!-- Body -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar Loading -->
      <div
        v-if="feedsLoading"
        class="flex items-center justify-center w-64 shrink-0 border-r border-gray-200 dark:border-gray-800"
      >
        <Loader2 :size="20" class="animate-spin text-gray-400" />
      </div>

      <Sidebar v-else :feeds="feeds" @feeds-changed="onFeedsChanged" />

      <!-- Artikel -->
      <main class="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-950">
        <ArticleList :feeds-key="feedsKey" />
      </main>
    </div>
  </div>
</template>
