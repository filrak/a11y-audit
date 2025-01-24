<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Accessibility Audit Tool</h1>
    
    <form @submit.prevent="runAudit" class="mb-6">
      <div class="flex gap-2">
        <input 
          v-model="url" 
          type="url" 
          placeholder="Enter website URL" 
          required
          class="flex-1 p-2 border rounded"
        />
        <button 
          type="submit" 
          :disabled="isLoading"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ isLoading ? 'Running...' : 'Run Audit' }}
        </button>
      </div>
    </form>

    <div v-if="results" class="text-lg font-semibold mb-4" :class="{'text-green-600': !results.issues?.length, 'text-red-600': results.issues?.length}">
      {{ results.issues?.length ? 'Failed WCAG 2.2 AA Audit' : 'Passed WCAG 2.2 AA Audit' }}
    </div>

    <div v-if="error" class="text-red-500 mb-4">
      {{ error }}
    </div>

    <div v-if="results" class="space-y-4">
      <h2 class="text-xl font-semibold">Audit Results</h2>
      <div v-if="results.issues?.length" class="space-y-4">
        <div 
          v-for="(issue, index) in results.issues" 
          :key="index"
          class="p-4 border rounded flex gap-4"
        >
          <div class="w-1/4">
            <img 
              v-if="issue.selector" 
              width="150px"
              :src="`/screenshots/issue_${index + 1}.png`" 
              :alt="`Screenshot of issue ${index + 1}`"
              class="w-full rounded border"
            />
          </div>
          <div class="flex-1">
            <p class="font-medium">{{ issue.runnerExtras.help }}</p>
            <p class="text-sm text-gray-600 pt-2">Context: {{ issue.context }}</p>
            <p class="text-sm text-gray-600">Selector: {{ issue.selector }}</p>
            <a :href="issue.runnerExtras.helpUrl" class="text-sm text-blue-500 cursor-pointer">Learn more about this issue and how to fix it </a>
          </div>
        </div>
      </div>
      <div v-else class="text-green-500">
        No accessibility issues found!
      </div>
    </div>
  </div>
</template>

<script setup>
const url = ref('https://alokai.com')
const results = ref(null)
const isLoading = ref(false)
const error = ref(null)

async function runAudit() {
  isLoading.value = true
  error.value = null
  results.value = null
  
  try {
    const response = await fetch('/api/audit', {
      method: 'POST',
      body: JSON.stringify({ url: url.value }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    console.log(data.results)

    if (!response.ok) throw new Error(data.message || 'Failed to run audit')
    
    results.value = data.results
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}
</script>
