<template>
  <canvas
    ref="canvas"
    class="fixed inset-0 pointer-events-none z-50"
    :style="{ width: '100%', height: '100%' }"
  ></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);
let animationFrame: number;
let particles: any[] = [];
const colors = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
];

const props = defineProps<{
  duration?: number; // milliseconds
  particleCount?: number;
}>();

const emit = defineEmits<{
  (e: "done"): void;
}>();

onMounted(() => {
  if (!canvas.value) return;
  const ctx = canvas.value.getContext("2d");
  if (!ctx) return;

  const resizeCanvas = () => {
    if (canvas.value) {
      canvas.value.width = window.innerWidth;
      canvas.value.height = window.innerHeight;
    }
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Create particles
  const count = props.particleCount || 150;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.value.width,
      y: Math.random() * canvas.value.height - canvas.value.height,
      size: Math.random() * 6 + 2,
      speedX: Math.random() * 6 - 3,
      speedY: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    });
  }

  const startTime = Date.now();
  const animate = () => {
    if (!canvas.value || !ctx) return;
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

    let alive = false;
    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.y < canvas.value!.height + 100) {
        alive = true;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (alive && (!props.duration || Date.now() - startTime < props.duration)) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      emit("done");
    }
  };

  animate();

  onUnmounted(() => {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", resizeCanvas);
  });
});
</script>
