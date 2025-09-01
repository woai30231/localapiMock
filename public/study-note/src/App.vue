<script setup>
import { ref } from 'vue'
import AddNote from './components/AddNote.vue'
import NoteList from './components/NoteList.vue'

const refreshTrigger = ref(0)

const handleNoteAdded = () => {
  refreshTrigger.value++
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>📝 开发笔记系统</h1>
      <p>记录你的开发心得和知识点</p>
    </header>
    
    <main class="app-main">
      <AddNote @note-added="handleNoteAdded" />
      <NoteList :key="refreshTrigger" />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.app {
  min-height: 100vh;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px;
  text-align: center;
}

.app-header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.app-header p {
  font-size: 1.1em;
  opacity: 0.9;
}

.app-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  margin-top: -20px;
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2em;
  }
  
  .app-main {
    padding: 15px;
  }
}
</style>
