<script setup lang="ts">
useSeoMeta({
  title: 'Donate — Flux Theatre Ensemble',
  description: 'Support Flux Theatre Ensemble in our 20th Anniversary Year. Your donations support collective care, long-term collaboration, and shared power.',
});
</script>

<template>
  <div class="donate-page bg-stage-950 min-h-screen pb-24">
    <!-- Hero / Intro -->
    <section class="donate-hero relative py-24 sm:py-32 overflow-hidden border-b border-stage-800/60">
      <div class="absolute inset-0 bg-gradient-to-br from-stage-950 via-stage-900 to-brand-900/10" />
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-curtain-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-stage-50">
        <p class="text-brand-400 font-medium text-sm sm:text-base uppercase tracking-[0.2em] mb-4">Support Flux</p>
        <h1 class="text-5xl sm:text-6xl font-serif font-bold leading-tight tracking-tight mb-8">
          Give to <span class="bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent">Flux</span>
        </h1>
        <p class="text-xl sm:text-2xl text-stage-200 font-serif leading-relaxed mb-6 max-w-2xl mx-auto italic">
          Celebrating our 20th Anniversary Year with a focus on collective care, long-term collaboration, and shared power.
        </p>
        <p class="text-stage-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Thanks to our creative partners and donors, over <strong>500 plays</strong> have crossed our threshold. Your unwavering support keeps our stage alive and accessible.
        </p>
        
        <div class="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://web.ovationtix.com/trs/store/3012/alldonations/10795" target="_blank" rel="noopener noreferrer" class="btn-primary text-brand-400 hover:text-brand-200 text-lg px-8 py-4 transition-transform hover:-translate-y-1 w-full sm:w-auto shadow-lg shadow-brand-500/20">
            Donate Online Now
          </a>
        </div>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Projects Support Section -->
          <div class="bg-stage-900 border border-stage-800/60 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl group hover:border-stage-700/60 transition-colors">
            <h2 class="text-2xl font-serif font-bold text-stage-50 flex items-center gap-3 mb-6">
              <svg class="w-6 h-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              What You're Funding in 2026
            </h2>
            <p class="text-stage-400 leading-relaxed mb-6">
              Your donations directly support our upcoming creative works and continuous training initiatives, including:
            </p>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li v-for="project in ['Fear & Wonder', 'Portal Project', 'Creative Emergence', 'Ongoing Core and Assembly Workshops']" :key="project" class="flex items-start gap-3">
                <svg class="w-5 h-5 text-brand-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span class="text-stage-200 font-medium">{{ project }}</span>
              </li>
            </ul>
          </div>
          
          <!-- Support & Funders -->
          <div class="bg-stage-900 border border-stage-800/60 rounded-2xl p-8 sm:p-10 shadow-xl backdrop-blur-xl">
            <h2 class="text-2xl font-serif font-bold text-stage-50 mb-6">Our Creative Partners & Funders</h2>
            <p class="text-stage-400 leading-relaxed mb-6">
              We operate alongside a collective of over 20 visionary artists, including Corey Allen, Heather Cohn, Emily Hartford, Rachael Hip-Flores, and many others, who define our creative process.
            </p>
            <p class="text-stage-400 leading-relaxed">
              We are profoundly grateful for our institutional funders: <strong>NYSCA</strong>, <strong>NYSCA-A.R.T./New York Creative Opportunity Fund</strong>, the <strong>Broadway Green Alliance</strong>, and the <strong>NYC Department of Cultural Affairs (DCLA)</strong>.
            </p>
          </div>

        </div>

        <!-- Sidebar / Details -->
        <div class="lg:col-span-1 space-y-6">
          
          <div class="bg-stage-900/60 border border-stage-800/60 rounded-2xl p-6 shadow-xl">
            <h3 class="text-sm uppercase tracking-wider font-bold text-stage-50 mb-4 whitespace-nowrap">Tax Information</h3>
            <p class="text-stage-400 text-sm leading-relaxed">
              Flux Theatre Ensemble is a <strong>501(c)(3) tax-exempt</strong> organization. All donations are tax-deductible to the fullest extent permitted by law.
            </p>
          </div>

          <div class="bg-stage-900/60 border border-stage-800/60 rounded-2xl p-6 shadow-xl">
            <h3 class="text-sm uppercase tracking-wider font-bold text-stage-50 mb-4 whitespace-nowrap">Matching Gifts</h3>
            <p class="text-stage-400 text-sm leading-relaxed">
              Double your impact! Flux is registered with <strong>Benevity</strong> for corporate matching gift programs. <br/><br/>
              <span class="text-stage-300 font-mono text-xs">EIN: 46-5362560</span>
            </p>
          </div>

          <div class="bg-stage-900/60 border border-stage-800/60 rounded-2xl p-6 shadow-xl">
            <h3 class="text-sm uppercase tracking-wider font-bold text-stage-50 mb-4 whitespace-nowrap">Donate By Mail</h3>
            <p class="text-stage-400 text-sm leading-relaxed mb-4">
              If you prefer to submit a check or donate by mail, please reach out directly for mailing instructions.
            </p>
            <a href="mailto:heather@fluxtheatre.org" class="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-medium underline underline-offset-4 transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              heather@fluxtheatre.org
            </a>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
