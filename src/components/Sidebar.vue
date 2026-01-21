<!-- <template>
  <aside class="w-64 bg-gray-800 p-4 min-h-screen">
    <h2 class="text-lg font-bold mb-4">Your Tabs</h2>
    <ul>
      <li
        v-for="tab in tabsStore.tabs"
        :key="tab.id"
        @click="tabsStore.activeTabId = tab.id"
        :class="[
          'p-2 mb-2 rounded cursor-pointer',
          tab.id === tabsStore.activeTabId
            ? 'bg-blue-600'
            : 'bg-gray-700 hover:bg-gray-600',
        ]"
      >
        {{ tab.name }}
        <button
          @click.stop="tabsStore.removeTab(tab.id)"
          class="ml-2 text-red-400"
        >
          ✕
        </button>
      </li>
    </ul>
    <input
      v-model="newTabName"
      placeholder="New tab"
      class="mt-4 p-2 w-full rounded text-black"
    />
    <button
      @click="addTab"
      class="mt-2 w-full bg-blue-600 p-2 rounded hover:bg-blue-500"
    >
      + Add Tab
    </button>
  </aside>
</template>

<script lang="ts">
import { ref } from "vue";
import { useTabsStore } from "../stores/tabs";

export default {
  setup() {
    const tabsStore = useTabsStore();
    const newTabName = ref("");

    function addTab() {
      if (newTabName.value.trim() === "") return;
      tabsStore.addTab(newTabName.value.trim());
      newTabName.value = "";
    }

    return { tabsStore, newTabName, addTab };
  },
};
</script> -->
