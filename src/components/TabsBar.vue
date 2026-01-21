<template>
  <div class="flex gap-2 bg-slate-100 p-2 rounded-2xl w-fit mx-auto">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="px-5 py-2 rounded-xl text-sm font-medium transition"
      :class="
        tab.id === activeTab
          ? 'bg-slate-900 text-white shadow'
          : 'text-slate-600 hover:bg-white'
      "
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: "TabBar",
  data() {
    return {
      activeTab: "goals",
      tabs: [
        { id: "goals", label: "Goals" },
        { id: "stats", label: "Stats" },
        { id: "profile", label: "Profile" }, // keep in mind ✔️
      ],
    };
  },
};
</script>
