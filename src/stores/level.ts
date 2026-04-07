import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

export const useLevelStore = defineStore("level", () => {
  const xp = ref(0);
  const lastLevel = ref(1);

  // LEVEL CALCULATION
  const level = computed(() => Math.floor(xp.value / 100) + 1);

  // TITLE SYSTEM
  const title = computed(() => {
    if (level.value >= 10) return "Wealth Builder";
    if (level.value >= 5) return "Consistent Saver";
    return "Beginner Saver";
  });

  // XP PROGRESS %
  const progress = computed(() => xp.value % 100);

  // XP LEFT
  const xpToNextLevel = computed(() => 100 - progress.value);

  // LEVEL UP DETECTION
  const levelUp = ref(false);

  watch(level, (newLevel, oldLevel) => {
    if (newLevel > oldLevel) {
      levelUp.value = true;
      setTimeout(() => (levelUp.value = false), 3000);
    }
    lastLevel.value = newLevel;
  });

  // ACTIONS
  const addXP = (amount: number) => {
    xp.value += amount;
  };

  return {
    xp,
    level,
    title,
    progress,
    xpToNextLevel,
    levelUp,
    addXP,
  };
});
