import type { Directive } from "vue";

interface ClickOutsideElement extends HTMLElement {
  _clickOutside?: (event: Event) => void;
}

const clickOutside: Directive = {
  mounted(el: ClickOutsideElement, binding) {
    el._clickOutside = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };
    document.addEventListener("click", el._clickOutside);
  },
  unmounted(el: ClickOutsideElement) {
    if (el._clickOutside) {
      document.removeEventListener("click", el._clickOutside);
    }
  },
};

export default clickOutside;
