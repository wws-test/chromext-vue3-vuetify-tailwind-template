<template>
  <div class="bg-gradient-to-r from-[#0d9488] to-[#14b8a6] p-4 ">
    <div class="grid">
      <button
        v-for="(quote, index) in quotes"
        :key="index"
        class="grid-item"
        @click="handleClick"
      >
        {{ quote }}
      </button>
    </div>
  </div>
</template>

<script>
import { handleClick1 } from '@/entry/popup.js';

export default {
  data() {
    return {
      quotes: [
        "Quote 1",
        "Quote 2",
        "Quote 3",
        "Quote 4",
        "Quote 5",
        "Quote 6",
        "Quote 7",
        "Quote 8",
        "Quote 9",
        "Quote 10",
        "Quote 11",
        "Quote 12",
        "Quote 13",
        "Quote 14",
        "Quote 15",
        "Quote 16"
      ]
    };
  },

  methods: {
    handleClick() {
      handleClick1();
    }
  }
};
</script>

<style>
.quote-display {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0d9488;
  padding: 4rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #2dd4bf;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #fff;
  border-radius: 0.25rem;
  transition: background-color 0.3s ease;
}

.grid-item:hover {
  background-color: #14b8a6;
}
</style>
