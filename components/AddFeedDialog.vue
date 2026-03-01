<script setup lang="ts">
import { X, Plus, Loader2 } from "lucide-vue-next";

const emit = defineEmits<{
  close: [];
  added: [];
}>();

const name = ref("");
const url = ref("");
const error = ref("");
const loading = ref(false);

async function handleSubmit() {
  error.value = "";
  loading.value = true;

  try {
    await $fetch("/api/feeds", {
      method: "POST",
      body: { name: name.value.trim(), url: url.value.trim() },
    });
    emit("added");
    emit("close");
  } catch (e: any) {
    error.value = e?.data?.statusMessage ?? "Fehler beim Hinzufügen";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="emit('close')" />
    <div class="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Feed hinzufügen</h2>
        <button
          class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Form -->
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div
          v-if="error"
          class="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm"
        >
          {{ error }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name des Feeds</label>
          <input
            v-model="name"
            type="text"
            required
            placeholder="z.B. Golem.de"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">RSS-URL</label>
          <input
            v-model="url"
            type="url"
            required
            placeholder="https://www.golem.de/rss.php"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div class="flex gap-3 pt-1">
          <button
            type="button"
            class="flex-1 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            @click="emit('close')"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Loader2 v-if="loading" :size="16" class="animate-spin" />
            <Plus v-else :size="16" />
            {{ loading ? "Wird hinzugefügt..." : "Hinzufügen" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
