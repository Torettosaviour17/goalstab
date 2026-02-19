import type { DirectiveBinding } from "vue";

interface ClickOutsideHTMLElement extends HTMLElement {
  __clickOutsideHandler__?: (event: MouseEvent) => void;
}

export default {
  beforeMount(el: ClickOutsideHTMLElement, binding: DirectiveBinding) {
    el.__clickOutsideHandler__ = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };

    // Delay listener to prevent immediate close on open
    setTimeout(() => {
      document.addEventListener("click", el.__clickOutsideHandler__!);
    }, 0);
  },

  unmounted(el: ClickOutsideHTMLElement) {
    if (el.__clickOutsideHandler__) {
      document.removeEventListener("click", el.__clickOutsideHandler__);
    }
  },
};
