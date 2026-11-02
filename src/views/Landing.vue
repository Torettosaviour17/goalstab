<template>
  <div class="gt-landing min-h-screen overflow-x-hidden" :class="light ? 'gt-light' : 'gt-dark'">
    <div class="gt-glow pointer-events-none fixed inset-0"></div>
    <header class="sticky top-0 z-50 border-b border-current/10 backdrop-blur-xl gt-header">
      <nav class="mx-auto max-w-7xl px-5 sm:px-8 h-20 flex items-center justify-between gap-3">
        <router-link to="/" class="flex items-center gap-3 font-black text-xl tracking-tight"><img src="/mainlogo.png" alt="" class="w-10 h-10 object-contain"/><span>Goal<span class="gt-gradient">Tabs</span></span></router-link>
        <div class="hidden lg:flex items-center gap-8 text-sm font-semibold opacity-75"><a href="#features" class="hover:text-blue-400">Features</a><a href="#how-it-works" class="hover:text-blue-400">How it works</a><a href="#security" class="hover:text-blue-400">Security</a><a href="#faq" class="hover:text-blue-400">FAQs</a><a href="#contact" class="hover:text-blue-400">Contact</a></div>
        <div class="flex items-center gap-2 sm:gap-4"><button @click="toggleTheme" class="gt-outline rounded-full h-10 px-3 text-sm font-bold" :aria-label="light ? 'Switch to dark mode' : 'Switch to light mode'">{{ light ? '☾ Dark' : '☀ Light' }}</button><router-link to="/login" class="hidden sm:inline font-semibold text-sm hover:text-blue-400">Sign in</router-link><router-link to="/register" class="gt-button text-sm px-4 sm:px-6 py-3 rounded-full font-bold">Get started ↗</router-link></div>
      </nav>
    </header>
    <main>
      <section class="relative mx-auto max-w-7xl px-5 sm:px-8 pt-20 lg:pt-28 pb-24 grid lg:grid-cols-2 gap-14 items-center">
        <div class="relative z-10 gt-rise">
          <span class="gt-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>Make every goal count</span>
          <h1 class="mt-8 text-5xl sm:text-6xl xl:text-[5.4rem] font-black tracking-[-.055em] leading-[1.05]">Big dreams.<br/><span class="gt-gradient">Smarter savings.</span><br/>Your way.</h1>
          <p class="mt-7 text-lg leading-8 gt-muted max-w-xl">Turn your plans into progress. Create savings goals, keep an eye on your transactions and understand your financial journey — all from one beautifully simple dashboard.</p>
          <div class="flex flex-wrap gap-4 mt-9"><router-link to="/register" class="gt-button rounded-2xl px-8 py-4 font-bold shadow-xl">Start your journey <span class="ml-2">↗</span></router-link><a href="#features" class="gt-outline rounded-2xl px-8 py-4 font-bold">Explore GoalTabs ↓</a></div>
          <div class="mt-12 flex flex-wrap gap-6 text-sm gt-muted"><span>✓ Personal savings goals</span><span>✓ Progress insights</span><span>✓ Device security</span></div>
        </div>
        <div class="relative gt-rise gt-delay">
          <div class="absolute -inset-7 rounded-full bg-gradient-to-tr from-blue-600/20 to-violet-500/20 blur-3xl"></div>
          <div class="relative gt-panel gt-border border rounded-[2rem] p-4 sm:p-6 shadow-2xl gt-float">
            <div class="flex items-center justify-between gap-3 mb-5"><div class="flex items-center gap-3"><img src="/mainlogo.png" alt="" class="w-9 h-9"/><div><p class="font-extrabold">GoalTabs dashboard</p><p class="text-xs gt-muted">Product UI preview · sample data</p></div></div><span class="gt-chip rounded-full text-xs px-3 py-2">Overview</span></div>
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="gt-tile rounded-2xl p-4"><p class="text-xs gt-muted">Active goals</p><p class="text-3xl font-black mt-2">03</p><p class="text-xs text-blue-400 mt-2">↗ Building momentum</p></div>
              <div class="gt-tile rounded-2xl p-4"><p class="text-xs gt-muted">Goals achieved</p><p class="text-3xl font-black mt-2">02 <span class="text-xl">🏆</span></p><p class="text-xs text-emerald-400 mt-2">Milestones reached</p></div>
            </div>
            <div class="space-y-3">
              <div v-for="goal in previewGoals" :key="goal.title" class="gt-tile gt-border border rounded-2xl p-4">
                <div class="flex justify-between items-start gap-3"><div class="flex items-center gap-3"><span class="text-2xl">{{ goal.icon }}</span><div><p class="font-bold text-sm">{{ goal.title }}</p><p class="gt-muted text-xs mt-1">{{ goal.category }}</p></div></div><span class="text-[11px] rounded-full px-2 py-1 font-semibold" :class="goal.progress === 100 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'">{{ goal.progress === 100 ? 'Achieved' : 'In progress' }}</span></div>
                <div class="flex justify-between text-xs mt-4 mb-2"><span class="gt-muted">Progress</span><span class="font-bold">{{ goal.progress }}%</span></div>
                <div class="h-2 rounded-full bg-slate-500/20 overflow-hidden"><div class="h-full rounded-full" :class="goal.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'" :style="{ width: goal.progress + '%' }"></div></div>
                <p class="text-xs gt-muted mt-2">₦{{ goal.saved.toLocaleString() }} of ₦{{ goal.target.toLocaleString() }}</p>
              </div>
            </div>
            <p class="gt-muted text-[11px] mt-4 text-center">Interface-inspired preview with fictional goals and balances.</p>
          </div>
        </div>
      </section>
      <section id="features" class="gt-section py-24"><div class="mx-auto max-w-7xl px-5 sm:px-8"><div class="max-w-2xl"><span class="gt-eyebrow">Everything in one place</span><h2 class="gt-heading">More clarity. <span class="gt-gradient">More momentum.</span></h2><p class="gt-muted mt-5 text-lg leading-8">Built to make everyday financial planning feel effortless.</p></div><div class="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-12"><article v-for="feature in features" :key="feature.title" class="gt-feature gt-panel gt-border border rounded-3xl p-7"><div class="gt-icon">{{ feature.icon }}</div><h3 class="font-extrabold text-xl mt-7">{{ feature.title }}</h3><p class="gt-muted mt-3 leading-7">{{ feature.description }}</p></article></div></div></section>
      <section id="how-it-works" class="max-w-7xl mx-auto px-5 sm:px-8 py-28 grid lg:grid-cols-2 gap-14 items-center"><div class="relative"><div class="gt-panel gt-border border rounded-[2rem] p-5 sm:p-8 shadow-2xl"><div class="flex justify-between items-center gap-3"><div><p class="text-xs gt-muted">GOALS / COMPLETED</p><h3 class="text-2xl font-black mt-2">Your achievements</h3></div><span class="text-4xl">🏆</span></div><div class="mt-7 space-y-4"><div v-for="goal in achievedGoals" :key="goal.title" class="gt-tile rounded-2xl p-5 flex gap-4 items-center"><span class="text-3xl">{{ goal.icon }}</span><div class="flex-1 min-w-0"><p class="font-bold">{{ goal.title }}</p><p class="text-xs gt-muted mt-1">Target reached · ₦{{ goal.target.toLocaleString() }}</p></div><span class="text-emerald-400 font-bold text-xs">✓ 100%</span></div></div><p class="text-xs gt-muted mt-5">Sample achievements · not actual user data</p></div><div class="absolute bottom-5 left-5 right-5 sm:right-auto gt-panel gt-border border rounded-2xl p-5 shadow-xl"><p class="font-bold">A little progress every day.</p><p class="gt-muted text-sm mt-1">Your future starts with a plan.</p></div></div><div><span class="gt-eyebrow">Simple from day one</span><h2 class="gt-heading">Your goals, <span class="gt-gradient">in motion.</span></h2><div class="space-y-8 mt-9"><div v-for="(step, i) in steps" :key="step.title" class="flex gap-5"><div class="gt-step shrink-0">{{ String(i + 1).padStart(2, '0') }}</div><div><h3 class="font-bold text-xl">{{ step.title }}</h3><p class="gt-muted mt-2 leading-7">{{ step.description }}</p></div></div></div><router-link to="/register" class="gt-button inline-flex mt-10 rounded-2xl px-7 py-4 font-bold">Create your account ↗</router-link></div></section>
      <section id="security" class="gt-section py-24"><div class="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 items-center"><div><span class="gt-eyebrow">Built with care</span><h2 class="gt-heading">Your space. <span class="gt-gradient">Your security.</span></h2><p class="gt-muted text-lg leading-8 mt-6">Sign in with your account credentials and use supported device authentication options, including passkeys and an optional app PIN on compatible installed mobile devices.</p><p class="gt-muted mt-4">Available options depend on your device and browser. Keep your credentials private.</p></div><div class="grid sm:grid-cols-2 gap-4"><div v-for="item in security" :key="item.title" class="gt-panel gt-border border rounded-3xl p-7"><div class="text-3xl">{{ item.icon }}</div><h3 class="font-bold mt-5">{{ item.title }}</h3><p class="gt-muted text-sm mt-3 leading-6">{{ item.description }}</p></div></div></div></section>
      <section id="faq" class="max-w-4xl mx-auto px-5 sm:px-8 py-28"><div class="text-center"><span class="gt-eyebrow">Good to know</span><h2 class="gt-heading">Questions? <span class="gt-gradient">Answered.</span></h2></div><div class="mt-12 space-y-3"><details v-for="item in faqs" :key="item.q" class="gt-panel gt-border border rounded-2xl p-6 group"><summary class="font-bold cursor-pointer flex justify-between gap-4 list-none">{{ item.q }}<span class="text-blue-400 group-open:rotate-45 transition-transform">＋</span></summary><p class="gt-muted leading-7 mt-4">{{ item.a }}</p></details></div></section>
      <section id="contact" class="max-w-7xl mx-auto px-5 sm:px-8 pb-24"><div class="gt-cta rounded-[2rem] px-7 sm:px-16 py-16 sm:py-20 text-center text-white relative overflow-hidden"><div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_55%)]"></div><div class="relative"><span class="uppercase tracking-[.3em] text-xs font-bold text-blue-100">Your future is calling</span><h2 class="text-4xl sm:text-6xl font-black tracking-tight mt-5">Make room for your<br/>next big thing.</h2><p class="text-blue-100 mt-6 max-w-xl mx-auto text-lg">Your next goal starts with one small step. Make it count with GoalTabs.</p><div class="flex flex-wrap justify-center gap-4 mt-9"><router-link to="/register" class="rounded-2xl px-8 py-4 bg-white text-blue-700 font-extrabold hover:bg-blue-50 transition">Get started for free ↗</router-link><a href="mailto:support@goalstab.com" class="rounded-2xl px-8 py-4 border border-white/40 font-bold hover:bg-white/10 transition">Contact us ✉</a></div></div></div></section>
    </main>
    <footer class="gt-footer border-t gt-border"><div class="max-w-7xl mx-auto px-5 sm:px-8 py-12 flex flex-col md:flex-row justify-between gap-8"><div><div class="flex items-center gap-3 font-black text-xl"><img src="/mainlogo.png" alt="" class="w-8 h-8"/>GoalTabs.</div><p class="gt-muted text-sm mt-3">Plan with purpose. Grow with confidence.</p><p class="gt-muted text-xs mt-5">© {{ new Date().getFullYear() }} GoalTabs. All rights reserved.</p></div><div class="flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold"><a href="#features">Features</a><a href="#faq">FAQs</a><a href="#contact">Contact</a><router-link to="/terms">Terms</router-link><router-link to="/privacy">Privacy</router-link><router-link to="/login">Sign in</router-link></div></div></footer>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
const light = ref(false);
const toggleTheme = () => { light.value = !light.value; localStorage.setItem('goaltabs-landing-theme', light.value ? 'light' : 'dark'); };
onMounted(() => { const saved = localStorage.getItem('goaltabs-landing-theme'); light.value = saved === 'light' || (!saved && window.matchMedia('(prefers-color-scheme: light)').matches); });
const previewGoals = [
{ icon: '💻', title: 'New laptop', category: 'Electronics', saved: 186000, target: 300000, progress: 62 },
{ icon: '✈️', title: 'Holiday fund', category: 'Travel', saved: 90000, target: 200000, progress: 45 },
{ icon: '🎓', title: 'Course fees', category: 'Education', saved: 150000, target: 150000, progress: 100 }
];
const achievedGoals = [
{ icon: '🎓', title: 'Course fees', target: 150000 },
{ icon: '📱', title: 'New phone', target: 240000 }
];
const features = [
{ icon: '🎯', title: 'Goals that mean something', description: 'Create savings targets for the milestones that matter to you. Give every goal a name and a clear destination.' },
{ icon: '📊', title: 'Insights you can understand', description: 'See your financial picture with helpful analytics and progress views designed for clarity.' },
{ icon: '💳', title: 'Transactions, organized', description: 'Review your account activity and keep important details within easy reach.' },
{ icon: '📱', title: 'Made for your device', description: 'Enjoy a responsive experience on desktop and mobile, including an installable web app.' },
{ icon: '🔐', title: 'Security that fits', description: 'Use your account password and supported device unlock features on compatible devices.' },
{ icon: '✨', title: 'A dashboard that feels good', description: 'Bring goals, activity and account settings together in one clean, focused workspace.' }
];
const steps = [
{ title: 'Create your space', description: 'Sign up, personalize your account and get familiar with your dashboard.' },
{ title: 'Define what matters', description: 'Create goals with targets that match your priorities and plans.' },
{ title: 'Keep moving forward', description: 'Follow your progress, review your activity and adjust your plans as life changes.' }
];
const security = [
{ icon: '🔑', title: 'Account sign-in', description: 'Secure account access with password authentication.' },
{ icon: '👆', title: 'Device unlock', description: 'Supported passkeys and biometrics on compatible devices.' },
{ icon: '🔢', title: 'Optional app PIN', description: 'An extra unlock option for the installed mobile experience.' },
{ icon: '⚙️', title: 'Your preferences', description: 'Manage available account and device options from Settings.' }
];
const faqs = [
{ q: 'What is GoalTabs?', a: 'GoalTabs is a personal savings and financial-goal management experience that helps you organize goals, review activity and follow progress.' },
{ q: 'Can I use GoalTabs on my phone?', a: 'Yes. The responsive web app works on mobile, and supported browsers let you install it as a progressive web app.' },
{ q: 'Does GoalTabs support fingerprint or face unlock?', a: 'On compatible devices, you can configure supported device authentication options from the security settings of the installed mobile app.' },
{ q: 'How do I get started?', a: 'Select Get started to create an account, then visit your dashboard to explore goals, analytics and account settings.' },
{ q: 'How can I contact the team?', a: 'Use the Contact us link to email the GoalTabs support team.' }
];
</script>
<style scoped>
.gt-landing{font-family:Inter,ui-sans-serif,system-ui,sans-serif;transition:background .35s,color .35s;scroll-behavior:smooth}
.gt-dark{--gt-bg:#080d1b;--gt-text:#f8faff;--gt-panel:#121b30;--gt-tile:#19233b;--gt-border:rgba(255,255,255,.1);--gt-muted:#a4b0c7;--gt-section:#0d1527;background:var(--gt-bg);color:var(--gt-text)}
.gt-light{--gt-bg:#f8faff;--gt-text:#14213b;--gt-panel:#fff;--gt-tile:#eff3fb;--gt-border:rgba(30,60,110,.12);--gt-muted:#53627b;--gt-section:#edf3ff;background:var(--gt-bg);color:var(--gt-text)}
.gt-muted{color:var(--gt-muted)}.gt-panel{background:var(--gt-panel)}.gt-tile{background:var(--gt-tile)}.gt-border{border-color:var(--gt-border)}.gt-section{background:var(--gt-section)}.gt-header{background:var(--gt-bg);border-color:var(--gt-border)}.gt-footer{border-color:var(--gt-border)}.gt-glow{background:radial-gradient(ellipse at 80% 15%,rgba(66,103,255,.11),transparent 45%);z-index:0}.gt-landing>header,.gt-landing>main,.gt-landing>footer{position:relative;z-index:1}.gt-gradient{background:linear-gradient(100deg,#3b82f6,#8b5cf6,#0ea5e9);background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:gt-shine 8s ease infinite}.gt-button,.gt-cta{background:linear-gradient(120deg,#2563eb,#6d28d9)}.gt-button{color:#fff;transition:transform .25s,box-shadow .25s}.gt-button:hover{transform:translateY(-3px);box-shadow:0 16px 35px rgba(59,130,246,.25)}.gt-outline,.gt-chip{border:1px solid var(--gt-border);background:var(--gt-panel)}.gt-eyebrow{font-size:.78rem;letter-spacing:.22em;text-transform:uppercase;color:#60a5fa;font-weight:800}.gt-heading{font-size:clamp(2.5rem,5vw,4rem);font-weight:900;letter-spacing:-.045em;line-height:1.12;margin-top:1rem}.gt-feature{transition:transform .3s,border-color .3s,box-shadow .3s}.gt-feature:hover{transform:translateY(-7px);border-color:rgba(96,165,250,.5);box-shadow:0 18px 40px rgba(24,45,100,.12)}.gt-icon{font-size:2rem;width:3.7rem;height:3.7rem;display:grid;place-items:center;background:var(--gt-tile);border-radius:1.1rem}.gt-step{width:3.4rem;height:3.4rem;display:grid;place-items:center;border-radius:1rem;background:var(--gt-tile);color:#60a5fa;font-weight:900}.gt-rise{animation:gt-rise .8s both}.gt-delay{animation-delay:.18s}.gt-float{animation:gt-float 7s ease-in-out infinite}@keyframes gt-rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:translateY(0)}}@keyframes gt-float{50%{transform:translateY(-12px)}}@keyframes gt-shine{50%{background-position:100% center}}@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
</style>