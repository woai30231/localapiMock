<script setup>
import { ref } from 'vue'

const emit = defineEmits(['note-added'])

const newNote = ref({
  title: '',
  content: ''
})

const addNote = () => {
  if (newNote.value.title.trim() && newNote.value.content.trim()) {
    const note = {
      ...newNote.value,
      date: new Date().toLocaleString('zh-CN')
    }
    
    // 获取现有笔记
    const existingNotes = JSON.parse(localStorage.getItem('dev-notes') || '[]')
    existingNotes.unshift(note)
    localStorage.setItem('dev-notes', JSON.stringify(existingNotes))
    
    // 重置表单
    newNote.value = { title: '', content: '' }
    
    // 通知父组件
    emit('note-added')
  }
}
</script>

<template>
  <div class="add-note">
    <h3>添加新笔记</h3>
    <form @submit.prevent="addNote" class="note-form">
      <div class="form-group">
        <label for="note-title">标题：</label>
        <input
          id="note-title"
          v-model="newNote.title"
          type="text"
          placeholder="输入笔记标题"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="note-content">内容：</label>
        <textarea
          id="note-content"
          v-model="newNote.content"
          placeholder="输入笔记内容..."
          rows="4"
          required
        ></textarea>
      </div>
      
      <button type="submit" class="add-btn">添加笔记</button>
    </form>
  </div>
</template>

<style scoped>
.add-note {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-note h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.note-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.add-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
}

.add-btn:hover {
  background: #0056b3;
}
</style>