<script setup>
import { ref, onMounted } from 'vue'

const notes = ref([])

// 从本地存储加载笔记
const loadNotes = () => {
  const savedNotes = localStorage.getItem('dev-notes')
  if (savedNotes) {
    notes.value = JSON.parse(savedNotes)
  }
}

// 保存笔记到本地存储
const saveNotes = () => {
  localStorage.setItem('dev-notes', JSON.stringify(notes.value))
}

// 删除笔记
const deleteNote = (index) => {
  notes.value.splice(index, 1)
  saveNotes()
}

onMounted(() => {
  loadNotes()
})
</script>

<template>
  <div class="note-list">
    <h2>我的开发笔记</h2>
    <div v-if="notes.length === 0" class="empty-state">
      <p>还没有笔记，点击右上角添加第一条笔记吧！</p>
    </div>
    <div v-else class="notes-container">
      <div v-for="(note, index) in notes" :key="index" class="note-card">
        <h3>{{ note.title }}</h3>
        <p class="note-content">{{ note.content }}</p>
        <div class="note-meta">
          <span class="note-date">{{ note.date }}</span>
          <button @click="deleteNote(index)" class="delete-btn">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.empty-state {
  text-align: center;
  color: #666;
  margin-top: 50px;
}

.notes-container {
  display: grid;
  gap: 20px;
  margin-top: 20px;
}

.note-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.note-card h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2em;
}

.note-content {
  color: #555;
  line-height: 1.6;
  margin: 0 0 15px 0;
}

.note-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-date {
  color: #888;
  font-size: 0.9em;
}

.delete-btn {
  background: #ff4757;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.delete-btn:hover {
  background: #ff3742;
}
</style>