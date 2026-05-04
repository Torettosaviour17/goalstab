<template>
  <div
    class="min-h-screen bg-gray-950 text-gray-100 selection:bg-primary-500 selection:text-white font-sans overflow-x-hidden relative"
  >
    <!-- Background Elements -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-900/20 blur-[150px] rounded-full"
      ></div>
      <div
        class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-900/20 blur-[150px] rounded-full"
      ></div>
    </div>

    <!-- Navigation -->
    <nav
      class="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5 transition-all duration-300"
      :class="{ 'py-4': !scrolled, 'py-2': scrolled }"
    >
      <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-3 group">
          <div
            class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-600 p-[1px] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-500"
          >
            <div
              class="w-full h-full bg-gray-950 rounded-[11px] flex items-center justify-center overflow-hidden"
            >
              <img
                src="/face_logo.png"
                alt="GoalTabs"
                class="w-8 h-8 object-contain"
              />
            </div>
          </div>
          <span
            class="text-xl font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300"
            >GoalTabs</span
          >
        </router-link>
        <div
          class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400"
        >
          <a href="#features" class="hover:text-white transition-colors"
            >Platform</a
          >
          <a href="#methodology" class="hover:text-white transition-colors"
            >Methodology</a
          >
          <a href="#integration" class="hover:text-white transition-colors"
            >Integration</a
          >
        </div>
        <div class="flex items-center gap-6">
          <router-link
            to="/login"
            class="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block"
            >Sign In</router-link
          >
          <router-link
            to="/register"
            class="relative inline-flex h-10 items-center justify-center px-6 py-2 overflow-hidden font-bold text-white bg-primary-600 rounded-full hover:bg-primary-500 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
          >
            <span>Get Started</span>
            <div
              class="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]"
            >
              <div class="relative h-full w-8 bg-white/20"></div>
            </div>
          </router-link>
        </div>
      </div>
    </nav>

    <main class="relative z-10">
      <!-- Section 1: Hero -->
      <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-600/10 rounded-full blur-[100px] pointer-events-none"
        ></div>

        <div
          class="max-w-7xl mx-auto px-6 relative z-10 text-center"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: { duration: 800, ease: 'easeOut' },
          }"
        >
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
          >
            <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span
              class="text-xs font-medium text-gray-300 tracking-wide uppercase"
              >The New Standard in Wealth Building</span
            >
          </div>

          <h1
            class="text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]"
          >
            Command Your Wealth.<br />
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-gradient-x"
              >Engineer Your Future.</span
            >
          </h1>

          <p
            class="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            More than a savings app. A precision instrument for financial
            discipline. Automate your goals, track every dollar, and build
            lasting momentum.
          </p>

          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <router-link
              to="/register"
              class="w-full sm:w-auto px-8 py-4 bg-white text-gray-950 text-base font-bold rounded-full hover:bg-gray-100 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
            >
              Open Your Account
            </router-link>
            <router-link
              to="/login"
              class="w-full sm:w-auto px-8 py-4 bg-white/5 text-white text-base font-bold rounded-full border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              View Demo Terminal
            </router-link>
          </div>
        </div>

        <!-- Abstract UI Mockup -->
        <div
          class="mt-20 max-w-5xl mx-auto px-6 relative"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: { duration: 1000, delay: 200, ease: 'easeOut' },
          }"
        >
          <div
            class="absolute -inset-1 bg-gradient-to-b from-primary-500/20 to-transparent blur-xl rounded-[2.5rem]"
          ></div>
          <div
            class="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <!-- Terminal Header -->
            <div
              class="h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-gray-950/50"
            >
              <div
                class="w-3 h-3 rounded-full bg-red-500/50 border border-red-500"
              ></div>
              <div
                class="w-3 h-3 rounded-full bg-yellow-500/50 border border-yellow-500"
              ></div>
              <div
                class="w-3 h-3 rounded-full bg-success/50 border border-success"
              ></div>
              <div
                class="mx-auto text-xs text-gray-500 font-mono tracking-widest"
              >
                GOALTABS_TERMINAL_V2.4
              </div>
            </div>
            <!-- Dashboard Content -->
            <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="md:col-span-2 flex flex-col gap-6">
                <div
                  class="h-40 bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group"
                >
                  <div
                    class="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl transition-all duration-700 group-hover:scale-150"
                  ></div>
                  <div
                    class="absolute bottom-0 right-8 text-[120px] font-black text-white/[0.02] leading-none select-none"
                  >
                    NW
                  </div>
                  <span
                    class="text-gray-400 text-sm font-medium tracking-wide uppercase"
                    >Total Net Worth</span
                  >
                  <div>
                    <div
                      class="text-5xl font-black text-white tracking-tighter mb-2"
                    >
                      $142,850.00
                    </div>
                    <div
                      class="flex items-center gap-2 text-success text-sm font-bold bg-success/10 px-2 py-1 rounded w-max"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        ></path>
                      </svg>
                      +12.4% This Month
                    </div>
                  </div>
                </div>
                <div
                  class="flex-1 bg-white/5 border border-white/5 rounded-xl p-6 min-h-[200px] flex flex-col"
                >
                  <div class="flex justify-between items-center mb-6">
                    <span
                      class="text-gray-400 text-sm font-medium tracking-wide uppercase"
                      >Capital Velocity</span
                    >
                    <span
                      class="text-xs font-mono text-primary-400 bg-primary-400/10 px-2 py-1 rounded"
                      >LIVE</span
                    >
                  </div>
                  <div
                    class="flex-1 w-full flex items-end gap-2 sm:gap-3 relative"
                  >
                    <!-- Chart grid lines -->
                    <div
                      class="absolute inset-0 flex flex-col justify-between pointer-events-none"
                    >
                      <div class="w-full h-px bg-white/5"></div>
                      <div class="w-full h-px bg-white/5"></div>
                      <div class="w-full h-px bg-white/5"></div>
                    </div>
                    <div
                      v-for="i in 16"
                      :key="i"
                      class="flex-1 bg-gradient-to-t from-primary-600/30 to-primary-400/80 rounded-t-sm relative group"
                      :style="{
                        height: `${Math.random() * 70 + 20}%`,
                        opacity: i > 12 ? 1 : 0.6,
                      }"
                    >
                      <div
                        class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-xs font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-white border border-white/10 pointer-events-none z-10 whitespace-nowrap"
                      >
                        ${{ Math.floor(Math.random() * 5000 + 1000) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="md:col-span-1 flex flex-col gap-6">
                <div
                  class="flex-1 bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col gap-4"
                >
                  <div class="flex justify-between items-center">
                    <span
                      class="text-gray-400 text-sm font-medium tracking-wide uppercase"
                      >Active Directives</span
                    >
                    <div
                      class="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-gray-400"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 4v16m8-8H4"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 flex flex-col justify-center space-y-6">
                    <div class="space-y-2 group">
                      <div class="flex justify-between text-sm font-medium">
                        <span class="text-white">Emergency Fund</span
                        ><span class="text-success">90%</span>
                      </div>
                      <div
                        class="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-white/5"
                      >
                        <div
                          class="h-full bg-success w-[90%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        ></div>
                      </div>
                      <div class="text-xs text-gray-500 font-mono text-right">
                        $22,500 / $25,000
                      </div>
                    </div>
                    <div class="space-y-2 group">
                      <div class="flex justify-between text-sm font-medium">
                        <span class="text-white">House Downpayment</span
                        ><span class="text-primary-400">45%</span>
                      </div>
                      <div
                        class="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-white/5"
                      >
                        <div
                          class="h-full bg-primary-400 w-[45%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        ></div>
                      </div>
                      <div class="text-xs text-gray-500 font-mono text-right">
                        $45,000 / $100,000
                      </div>
                    </div>
                    <div class="space-y-2 group">
                      <div class="flex justify-between text-sm font-medium">
                        <span class="text-white">Porsche 911 GT3</span
                        ><span class="text-secondary-400">12%</span>
                      </div>
                      <div
                        class="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-white/5"
                      >
                        <div
                          class="h-full bg-secondary-400 w-[12%] shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        ></div>
                      </div>
                      <div class="text-xs text-gray-500 font-mono text-right">
                        $24,000 / $200,000
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="h-24 bg-gradient-to-br from-yellow-500/10 via-gray-900 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-5 flex items-center justify-between group overflow-hidden relative"
                >
                  <div
                    class="absolute right-0 top-0 w-32 h-32 bg-yellow-500/5 blur-2xl rounded-full group-hover:bg-yellow-500/10 transition-colors"
                  ></div>
                  <div class="relative z-10">
                    <div
                      class="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full bg-yellow-500"
                      ></span>
                      Premium Status
                    </div>
                    <div class="text-white font-medium text-lg">
                      GoalTabs Black
                    </div>
                  </div>
                  <svg
                    class="w-8 h-8 text-yellow-500/40 relative z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2: The Problem -->
      <section
        id="methodology"
        class="py-32 border-y border-white/5 bg-gray-950 relative"
      >
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_left,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-gray-950"
        ></div>
        <div
          class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10"
        >
          <div
            v-motion
            :initial="{ opacity: 0, x: -30 }"
            :visible="{ opacity: 1, x: 0, transition: { duration: 800 } }"
          >
            <div class="text-red-500 font-mono text-sm tracking-widest mb-4">
              THE CURRENT STATE
            </div>
            <h2
              class="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight"
            >
              Traditional banking is designed to keep your money dormant.
            </h2>
            <p class="text-gray-400 text-lg mb-10 leading-relaxed">
              Banks profit from your lack of clarity. A single checking account
              creates a false sense of security, blurring the lines between
              rent, savings, and discretionary income. The result? You spend
              more than you should.
            </p>
            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div
                  class="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 border border-red-500/20 mt-1"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 class="text-white text-lg font-bold mb-1">
                    The "Mental Accounting" Fallacy
                  </h4>
                  <p class="text-gray-500 leading-relaxed">
                    Keeping track of what money is for what purpose in your head
                    inevitably leads to overspending and missed targets.
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div
                  class="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 border border-red-500/20 mt-1"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 class="text-white text-lg font-bold mb-1">
                    Manual Transfer Fatigue
                  </h4>
                  <p class="text-gray-500 leading-relaxed">
                    Relying on willpower to move money at the end of the month
                    means savings become an afterthought, not a priority.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            class="relative"
            v-motion
            :initial="{ opacity: 0, x: 30 }"
            :visible="{
              opacity: 1,
              x: 0,
              transition: { duration: 800, delay: 200 },
            }"
          >
            <div
              class="absolute inset-0 bg-primary-600/20 blur-[100px] rounded-full"
            ></div>
            <div
              class="relative bg-gray-900 border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
              <div
                class="flex justify-between items-center mb-8 pb-6 border-b border-white/5"
              >
                <div>
                  <h3 class="text-white text-xl font-bold">
                    The GoalTabs Architecture
                  </h3>
                  <p class="text-gray-500 text-sm mt-1">
                    A systemic approach to wealth building
                  </p>
                </div>
                <span
                  class="px-3 py-1 rounded bg-success/10 text-success text-xs font-bold border border-success/20 uppercase tracking-wider"
                  >Solution</span
                >
              </div>
              <div class="space-y-4">
                <div
                  class="p-5 rounded-xl bg-gray-950 border border-white/5 flex items-center gap-5 group hover:border-primary-500/50 hover:bg-white/[0.02] transition-all"
                >
                  <div
                    class="w-12 h-12 rounded-full bg-primary-500/10 text-primary-400 flex items-center justify-center border border-primary-500/20 group-hover:scale-110 transition-transform"
                  >
                    <span class="font-mono font-bold">01</span>
                  </div>
                  <div class="flex-1">
                    <div class="text-white font-bold text-lg mb-1">
                      Compartmentalized Goals
                    </div>
                    <div class="text-sm text-gray-400">
                      Every dollar is assigned a job and a destination before it
                      hits your account.
                    </div>
                  </div>
                </div>
                <div
                  class="p-5 rounded-xl bg-gray-950 border border-white/5 flex items-center gap-5 group hover:border-secondary-500/50 hover:bg-white/[0.02] transition-all"
                >
                  <div
                    class="w-12 h-12 rounded-full bg-secondary-500/10 text-secondary-400 flex items-center justify-center border border-secondary-500/20 group-hover:scale-110 transition-transform"
                  >
                    <span class="font-mono font-bold">02</span>
                  </div>
                  <div class="flex-1">
                    <div class="text-white font-bold text-lg mb-1">
                      Algorithmic Automation
                    </div>
                    <div class="text-sm text-gray-400">
                      Configure rules to sweep cash automatically. Build wealth
                      unconsciously.
                    </div>
                  </div>
                </div>
                <div
                  class="p-5 rounded-xl bg-gray-950 border border-white/5 flex items-center gap-5 group hover:border-success/50 hover:bg-white/[0.02] transition-all"
                >
                  <div
                    class="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center border border-success/20 group-hover:scale-110 transition-transform"
                  >
                    <span class="font-mono font-bold">03</span>
                  </div>
                  <div class="flex-1">
                    <div class="text-white font-bold text-lg mb-1">
                      Real-time Coaching
                    </div>
                    <div class="text-sm text-gray-400">
                      Get alerts when you veer off course. Stay accountable to
                      your own targets.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 3: Features Grid -->
      <section id="features" class="py-32 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 relative z-10">
          <div
            class="text-center mb-24"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          >
            <div
              class="text-primary-500 font-mono text-sm tracking-widest mb-4"
            >
              THE PLATFORM
            </div>
            <h2 class="text-3xl lg:text-5xl font-bold text-white mb-6">
              Precision Engineering for Your Finances
            </h2>
            <p class="text-gray-400 text-lg max-w-2xl mx-auto">
              A suite of powerful tools designed to give you absolute clarity
              and control over your financial trajectory.
            </p>
          </div>

          <div class="grid lg:grid-cols-3 gap-6">
            <!-- Feature 1: Goals (Span 2) -->
            <div
              class="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-[2rem] p-10 hover:border-primary-500/30 transition-colors group relative overflow-hidden flex flex-col"
              v-motion
              :initial="{ opacity: 0, y: 30 }"
              :visible="{
                opacity: 1,
                y: 0,
                transition: { duration: 600, delay: 100 },
              }"
            >
              <div
                class="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-600/10 blur-[100px] rounded-full transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none"
              ></div>

              <div class="relative z-10 flex-1">
                <div
                  class="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center mb-8 shadow-inner"
                >
                  <svg
                    class="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <h3 class="text-3xl font-bold text-white mb-4">
                  Hyper-Targeted Goals
                </h3>
                <p class="text-gray-400 text-lg max-w-lg leading-relaxed mb-10">
                  Break massive financial ambitions into granular, trackable
                  milestones. Set deadlines, visualize progress, and hit your
                  targets with mathematical precision.
                </p>
              </div>

              <div
                class="relative z-10 mt-auto flex gap-6 h-40 items-end overflow-visible"
              >
                <div
                  class="w-64 bg-gray-950 border border-white/10 rounded-2xl p-5 shrink-0 -rotate-6 translate-y-6 shadow-2xl group-hover:-translate-y-2 group-hover:-rotate-3 transition-transform duration-500"
                >
                  <div class="flex justify-between items-center mb-3">
                    <div class="text-sm font-medium text-gray-300">
                      Paris Trip
                    </div>
                    <span
                      class="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded font-mono"
                      >Q3 '24</span
                    >
                  </div>
                  <div class="text-2xl font-bold text-white mb-4">
                    $4,500.00
                  </div>
                  <div
                    class="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary-500 w-[60%] shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                    ></div>
                  </div>
                  <div class="mt-2 text-xs text-right text-gray-500">
                    60% funded
                  </div>
                </div>
                <div
                  class="w-64 bg-gray-950 border border-primary-500/30 rounded-2xl p-5 shrink-0 rotate-3 -translate-y-4 shadow-2xl group-hover:-translate-y-8 group-hover:rotate-0 transition-transform duration-500 relative z-20"
                >
                  <div
                    class="absolute -top-3 -right-3 w-8 h-8 bg-success text-white rounded-full flex items-center justify-center shadow-lg transform rotate-12"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <div class="flex justify-between items-center mb-3">
                    <div class="text-sm font-medium text-gray-300">
                      Emergency Fund
                    </div>
                    <span
                      class="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded font-mono"
                      >CORE</span
                    >
                  </div>
                  <div class="text-2xl font-bold text-white mb-4">
                    $25,000.00
                  </div>
                  <div
                    class="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-success w-[100%] shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                    ></div>
                  </div>
                  <div class="mt-2 text-xs text-right text-success font-medium">
                    Target Reached
                  </div>
                </div>
              </div>
            </div>

            <!-- Feature 2: Automation (Span 1) -->
            <div
              class="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-[2rem] p-10 hover:border-secondary-500/30 transition-colors group relative overflow-hidden flex flex-col"
              v-motion
              :initial="{ opacity: 0, y: 30 }"
              :visible="{
                opacity: 1,
                y: 0,
                transition: { duration: 600, delay: 200 },
              }"
            >
              <div
                class="absolute bottom-0 right-0 w-[300px] h-[300px] bg-secondary-600/10 blur-[80px] rounded-full transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none"
              ></div>

              <div class="relative z-10 flex-1">
                <div
                  class="w-14 h-14 rounded-2xl bg-secondary-500/10 border border-secondary-500/20 text-secondary-400 flex items-center justify-center mb-8 shadow-inner"
                >
                  <svg
                    class="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-white mb-4">
                  Ruthless Automation
                </h3>
                <p class="text-gray-400 leading-relaxed">
                  Configure rules to sweep cash into your goals automatically.
                  Remove human error and emotional friction from the equation.
                </p>
              </div>

              <div
                class="relative z-10 mt-10 bg-gray-950 rounded-xl p-5 border border-white/5 space-y-4 shadow-xl"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"
                    >
                      <svg
                        class="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-white"
                      >Payday Sweep</span
                    >
                  </div>
                  <div
                    class="w-12 h-6 bg-secondary-500 rounded-full relative shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer"
                  >
                    <div
                      class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    ></div>
                  </div>
                </div>
                <div class="h-px w-full bg-white/5"></div>
                <div
                  class="flex justify-between text-xs font-mono text-gray-500"
                >
                  <span>Trigger: 1st of Month</span>
                  <span class="text-secondary-400">Active</span>
                </div>
              </div>
            </div>

            <!-- Feature 3: Analytics (Span 1) -->
            <div
              class="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-[2rem] p-10 hover:border-success/30 transition-colors group relative overflow-hidden flex flex-col"
              v-motion
              :initial="{ opacity: 0, y: 30 }"
              :visible="{
                opacity: 1,
                y: 0,
                transition: { duration: 600, delay: 300 },
              }"
            >
              <div class="relative z-10 flex-1">
                <div
                  class="w-14 h-14 rounded-2xl bg-success/10 border border-success/20 text-success flex items-center justify-center mb-8 shadow-inner"
                >
                  <svg
                    class="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-white mb-4">
                  Deep Analytics
                </h3>
                <p class="text-gray-400 leading-relaxed">
                  Granular insights into your spending velocity. Know exactly
                  where your money flows and optimize accordingly.
                </p>
              </div>

              <div class="relative z-10 mt-10 flex items-end gap-3 h-32 pt-4">
                <div
                  class="w-full bg-success/10 rounded-t-md h-[30%] group-hover:h-[40%] transition-all duration-500 ease-out"
                ></div>
                <div
                  class="w-full bg-success/20 rounded-t-md h-[50%] group-hover:h-[45%] transition-all duration-500 ease-out delay-75"
                ></div>
                <div
                  class="w-full bg-success/40 rounded-t-md h-[40%] group-hover:h-[70%] transition-all duration-500 ease-out delay-100"
                ></div>
                <div
                  class="w-full bg-success/60 rounded-t-md h-[70%] group-hover:h-[60%] transition-all duration-500 ease-out delay-150 shadow-[0_-5px_15px_rgba(16,185,129,0.2)]"
                ></div>
                <div
                  class="w-full bg-success rounded-t-md h-[90%] group-hover:h-[100%] transition-all duration-500 ease-out delay-200 shadow-[0_-5px_20px_rgba(16,185,129,0.4)] relative"
                >
                  <div
                    class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10"
                  >
                    $8.4k
                  </div>
                </div>
              </div>
            </div>

            <!-- Feature 4: Security (Span 2) -->
            <div
              class="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-[2rem] p-10 hover:border-white/30 transition-colors group relative overflow-hidden"
              v-motion
              :initial="{ opacity: 0, y: 30 }"
              :visible="{
                opacity: 1,
                y: 0,
                transition: { duration: 600, delay: 400 },
              }"
            >
              <div
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none"
              ></div>
              <div
                class="relative z-10 flex flex-col md:flex-row gap-12 items-center h-full"
              >
                <div class="flex-1">
                  <div
                    class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center mb-8 shadow-inner"
                  >
                    <svg
                      class="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      ></path>
                    </svg>
                  </div>
                  <h3 class="text-3xl font-bold text-white mb-4">
                    Bank-Grade Infrastructure
                  </h3>
                  <p class="text-gray-400 text-lg leading-relaxed mb-6">
                    Your financial data is locked down with AES-256 encryption.
                    We utilize read-only access to provide insights, meaning we
                    can never move your actual money without explicit
                    authorization.
                  </p>
                  <div class="flex items-center gap-6">
                    <div
                      class="flex items-center gap-2 text-sm text-gray-400 font-medium"
                    >
                      <svg
                        class="w-5 h-5 text-success"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      SOC2 Compliant
                    </div>
                    <div
                      class="flex items-center gap-2 text-sm text-gray-400 font-medium"
                    >
                      <svg
                        class="w-5 h-5 text-success"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      Plaid Integration
                    </div>
                  </div>
                </div>
                <div
                  class="w-full md:w-72 h-64 bg-gray-950 rounded-2xl border border-white/5 flex items-center justify-center relative shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                  <div
                    class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] group-hover:scale-110 transition-transform duration-1000"
                  ></div>

                  <div
                    class="relative z-10 w-24 h-24 rounded-full border border-white/10 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm shadow-2xl"
                  >
                    <div
                      class="absolute inset-0 rounded-full border border-white/20 animate-[spin_4s_linear_infinite]"
                    ></div>
                    <div
                      class="absolute inset-2 rounded-full border border-white/10 animate-[spin_3s_linear_infinite_reverse]"
                    ></div>
                    <svg
                      class="w-10 h-10 text-white/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 4: Data Integration / Multi-Account -->
      <section
        id="integration"
        class="py-32 border-y border-white/5 bg-gray-950 relative overflow-hidden"
      >
        <div
          class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-900/10 to-transparent pointer-events-none"
        ></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10">
          <div class="grid lg:grid-cols-2 gap-16 items-center">
            <div
              class="order-2 lg:order-1 relative"
              v-motion
              :initial="{ opacity: 0, scale: 0.95 }"
              :visible="{ opacity: 1, scale: 1, transition: { duration: 800 } }"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20 blur-[80px] rounded-full"
              ></div>
              <div
                class="relative bg-gray-900 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
              >
                <div
                  class="flex items-center justify-between mb-8 border-b border-white/5 pb-6"
                >
                  <div class="font-mono text-sm text-gray-400">
                    DATA_SOURCES
                  </div>
                  <div
                    class="flex items-center gap-2 text-xs font-bold text-success bg-success/10 px-2 py-1 rounded"
                  >
                    <span
                      class="w-2 h-2 rounded-full bg-success animate-pulse"
                    ></span>
                    SYNCED
                  </div>
                </div>

                <div class="space-y-4">
                  <div
                    class="flex items-center justify-between p-4 rounded-xl bg-gray-950 border border-white/5"
                  >
                    <div class="flex items-center gap-4">
                      <div
                        class="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-600/30 text-blue-500 font-bold"
                      >
                        C
                      </div>
                      <div>
                        <div class="text-white font-medium">Chase Checking</div>
                        <div class="text-xs text-gray-500">...4829</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-white font-medium">$12,450.00</div>
                      <div class="text-xs text-gray-500">Updated 2m ago</div>
                    </div>
                  </div>

                  <div
                    class="flex items-center justify-between p-4 rounded-xl bg-gray-950 border border-white/5"
                  >
                    <div class="flex items-center gap-4">
                      <div
                        class="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center border border-red-600/30 text-red-500 font-bold"
                      >
                        B
                      </div>
                      <div>
                        <div class="text-white font-medium">
                          Bank of America
                        </div>
                        <div class="text-xs text-gray-500">...9921</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-white font-medium">$45,200.00</div>
                      <div class="text-xs text-gray-500">Updated 5m ago</div>
                    </div>
                  </div>

                  <div
                    class="flex items-center justify-between p-4 rounded-xl bg-gray-950 border border-white/5 opacity-60"
                  >
                    <div class="flex items-center gap-4">
                      <div
                        class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 text-gray-400"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 4v16m8-8H4"
                          ></path>
                        </svg>
                      </div>
                      <div class="text-gray-400 font-medium">
                        Connect Institution
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="mt-8 pt-6 border-t border-white/5 flex items-center justify-between"
                >
                  <div class="text-sm text-gray-400">Total Liquidity</div>
                  <div class="text-2xl font-bold text-white">$57,650.00</div>
                </div>
              </div>
            </div>

            <div
              class="order-1 lg:order-2"
              v-motion
              :initial="{ opacity: 0, x: 30 }"
              :visible="{
                opacity: 1,
                x: 0,
                transition: { duration: 800, delay: 200 },
              }"
            >
              <div
                class="text-primary-500 font-mono text-sm tracking-widest mb-4"
              >
                OMNISCIENCE
              </div>
              <h2
                class="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight"
              >
                A Single Source of Truth for Your Capital.
              </h2>
              <p class="text-gray-400 text-lg mb-8 leading-relaxed">
                Connect checking accounts, savings, credit cards, and
                investments. GoalTabs aggregates your entire financial life into
                one coherent dashboard. Stop logging into six different apps to
                figure out your net worth.
              </p>
              <ul class="space-y-4 mb-10">
                <li class="flex items-center gap-3 text-gray-300">
                  <svg
                    class="w-5 h-5 text-primary-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Connect 10,000+ US and Canadian institutions
                </li>
                <li class="flex items-center gap-3 text-gray-300">
                  <svg
                    class="w-5 h-5 text-primary-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Real-time transaction syncing and categorization
                </li>
                <li class="flex items-center gap-3 text-gray-300">
                  <svg
                    class="w-5 h-5 text-primary-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Unified balance and historical charting
                </li>
              </ul>
              <router-link
                to="/register"
                class="inline-flex items-center gap-2 text-primary-400 font-bold hover:text-primary-300 transition-colors group"
              >
                Explore Integrations
                <svg
                  class="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 5: Social Proof / Quote -->
      <section class="py-32 relative">
        <div
          class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/20 via-gray-950 to-gray-950 pointer-events-none"
        ></div>
        <div
          class="max-w-4xl mx-auto px-6 relative z-10 text-center"
          v-motion
          :initial="{ opacity: 0, scale: 0.95 }"
          :visible="{ opacity: 1, scale: 1, transition: { duration: 800 } }"
        >
          <svg
            class="w-12 h-12 mx-auto text-primary-500 mb-8 opacity-50"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
            ></path>
          </svg>
          <blockquote
            class="text-2xl md:text-4xl font-medium text-white leading-tight mb-10"
          >
            "I stopped thinking about saving and started engineering it.
            GoalTabs shifted my mindset from 'hope I have enough' to 'I know
            exactly when I'll hit my target.'"
          </blockquote>
          <div class="flex items-center justify-center gap-4">
            <div
              class="w-14 h-14 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-white font-bold text-xl shadow-lg"
            >
              MJ
            </div>
            <div class="text-left">
              <div class="text-white font-bold text-lg">Marcus J.</div>
              <div class="text-sm text-primary-400 font-mono">
                Saved $45k in 18 months
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 6: FAQ -->
      <section class="py-32 border-t border-white/5 relative">
        <div class="max-w-4xl mx-auto px-6 relative z-10">
          <div
            class="text-center mb-16"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          >
            <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p class="text-gray-400">
              Everything you need to know about the platform.
            </p>
          </div>

          <div
            class="space-y-4"
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visible="{
              opacity: 1,
              y: 0,
              transition: { duration: 600, delay: 200 },
            }"
          >
            <div
              class="bg-gray-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
            >
              <h3 class="text-lg font-bold text-white mb-2">
                Is GoalTabs a bank?
              </h3>
              <p class="text-gray-400 leading-relaxed">
                No. GoalTabs is a financial tracking and automation layer that
                sits on top of your existing bank accounts. We don't hold your
                money; we organize it and direct it.
              </p>
            </div>
            <div
              class="bg-gray-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
            >
              <h3 class="text-lg font-bold text-white mb-2">
                How secure is my connection?
              </h3>
              <p class="text-gray-400 leading-relaxed">
                We use Plaid to connect to your institutions, which is the
                industry standard used by Venmo, Robinhood, and thousands of
                others. We only have read-access to your data.
              </p>
            </div>
            <div
              class="bg-gray-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
            >
              <h3 class="text-lg font-bold text-white mb-2">
                Can I create shared goals with a partner?
              </h3>
              <p class="text-gray-400 leading-relaxed">
                Yes. The Premium tier allows you to invite collaborators to
                specific goals, perfect for couples saving for a house or
                wedding together.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom CTA -->
      <section class="py-32 relative overflow-hidden border-t border-white/5">
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-primary-600/20 blur-[120px] rounded-full pointer-events-none"
        ></div>
        <div
          class="max-w-4xl mx-auto px-6 relative z-10 text-center"
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 800 } }"
        >
          <h2
            class="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
          >
            Stop Hoping. <br /><span
              class="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500"
              >Start Building.</span
            >
          </h2>
          <p class="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join the ranks of serious savers who treat their personal finances
            like a well-run corporation.
          </p>
          <router-link
            to="/register"
            class="inline-flex h-14 items-center justify-center px-10 text-lg font-bold text-white bg-primary-600 rounded-full hover:bg-primary-500 transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] hover:-translate-y-1 active:translate-y-0"
          >
            Deploy Your Dashboard Now
          </router-link>
          <p class="mt-6 text-sm text-gray-500 font-mono">
            Free to start. No credit card required.
          </p>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="py-12 border-t border-white/10 bg-gray-950 relative z-10">
      <div
        class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div class="flex items-center gap-3">
          <img
            src="/face_logo.png"
            alt="GoalTabs"
            class="w-6 h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"
          />
          <span class="text-gray-500 font-medium text-sm"
            >© {{ new Date().getFullYear() }} GoalTabs Systems. All rights
            reserved.</span
          >
        </div>
        <div class="flex gap-8">
          <router-link
            to="/terms"
            class="text-sm font-medium text-gray-500 hover:text-white transition-colors"
            >Terms</router-link
          >
          <router-link
            to="/privacy"
            class="text-sm font-medium text-gray-500 hover:text-white transition-colors"
            >Privacy</router-link
          >
          <router-link
            to="/help"
            class="text-sm font-medium text-gray-500 hover:text-white transition-colors"
            >Support</router-link
          >
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const scrolled = ref(false);

const handleScroll = () => {
  scrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.animate-gradient-x {
  background-size: 200% auto;
  animation: gradientX 4s ease infinite;
}

@keyframes gradientX {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
