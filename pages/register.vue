<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const name = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function handleSubmit() {
  error.value = "";
  loading.value = true;

  try {
    await $fetch("/api/auth/register", {
      method: "POST",
      body: { name: name.value, email: email.value, password: password.value },
    });
    await navigateTo("/");
  } catch (e: any) {
    error.value = e?.data?.statusMessage ?? "Registrierung fehlgeschlagen";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">elmo-news</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Konto erstellen</p>
      </div>

      <form
        class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 space-y-5"
        @submit.prevent="handleSubmit"
      >
        <div
          v-if="error"
          class="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm"
        >
          {{ error }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Name <span class="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            v-model="name"
            type="text"
            placeholder="Dein Name"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="deine@email.de"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Passwort</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="6"
            placeholder="Mindestens 6 Zeichen"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium text-sm transition-colors"
        >
          {{ loading ? "Wird erstellt..." : "Konto erstellen" }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        Bereits ein Konto?
        <NuxtLink to="/login" class="text-blue-600 hover:underline font-medium">Anmelden</NuxtLink>
      </p>
    </div>
  </div>
</template>
