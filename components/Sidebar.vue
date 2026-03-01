<script setup lang="ts">
import { Rss, Plus, ToggleLeft, ToggleRight } from "lucide-vue-next";

interface FeedInfo {
  id: string;
  name: string;
  url: string;
  description: string | null;
  isDefault: boolean;
  isSubscribed: boolean;
  isActive: boolean;
}

const props = defineProps<{ feeds: FeedInfo[] }>();
const emit = defineEmits<{ feedsChanged: [] }>();

const showAddDialog = ref(false);
const pending = ref<string | null>(null);

const subscribedFeeds = computed(() => props.feeds.filter((f) => f.isSubscribed));
const availableFeeds = computed(() => props.feeds.filter((f) => !f.isSubscribed));

async function toggleFeed(feed: FeedInfo) {
  if (pending.value) return;
  pending.value = feed.id;

  try {
    if (!feed.isSubscribed) {
      await $fetch(`/api/feeds/${feed.id}`, {
        method: "PATCH",
        body: { subscribe: true },
      });
    } else {
      await $fetch(`/api/feeds/${feed.id}`, {
        method: "PATCH",
        body: { isActive: !feed.isActive },
      });
    }
    emit("feedsChanged");
  } finally {
    pending.value = null;
  }
}
</script>

<template>
  <aside class="w-64 shrink-0 flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
    <!-- Header -->
    <div class="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-2">
        <Rss :size="18" class="text-blue-600" />
        <span class="font-semibold text-gray-900 dark:text-white">Feeds</span>
      </div>
    </div>

    <!-- Feed-Liste -->
    <div class="flex-1 overflow-y-auto py-2">
      <!-- Abonnierte Feeds -->
      <div v-if="subscribedFeeds.length > 0">
        <p class="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Meine Feeds</p>
        <button
          v-for="feed in subscribedFeeds"
          :key="feed.id"
          :disabled="pending === feed.id"
          class="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
          :class="{ 'opacity-50': pending === feed.id }"
          @click="toggleFeed(feed)"
        >
          <ToggleRight v-if="feed.isActive" :size="20" class="shrink-0 text-blue-600" />
          <ToggleLeft v-else :size="20" class="shrink-0 text-gray-400" />
          <span
            class="text-sm truncate"
            :class="feed.isActive ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'"
          >
            {{ feed.name }}
          </span>
        </button>
      </div>

      <!-- Verfügbare Feeds -->
      <div v-if="availableFeeds.length > 0" class="mt-3">
        <p class="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Verfügbar</p>
        <button
          v-for="feed in availableFeeds"
          :key="feed.id"
          :disabled="pending === feed.id"
          class="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
          :class="{ 'opacity-50': pending === feed.id }"
          @click="toggleFeed(feed)"
        >
          <Plus :size="20" class="shrink-0 text-gray-400" />
          <span class="text-sm truncate text-gray-500 dark:text-gray-400">{{ feed.name }}</span>
        </button>
      </div>
    </div>

    <!-- Add Feed Button -->
    <div class="px-3 py-3 border-t border-gray-200 dark:border-gray-800">
      <button
        class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
        @click="showAddDialog = true"
      >
        <Plus :size="16" />
        Feed hinzufügen
      </button>
    </div>

    <AddFeedDialog
      v-if="showAddDialog"
      @close="showAddDialog = false"
      @added="emit('feedsChanged')"
    />
  </aside>
</template>
