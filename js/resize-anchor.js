/**
 * resize-anchor.js
 * Loaded via theme inject.bottom in themes/butterfly/_config.yml
 *
 * Two features for post/article pages:
 *
 * 1. Disable sticky nav
 *    The Butterfly theme adds .nav-fixed / .nav-visible to #page-header
 *    on scroll, making the nav bar follow the user. On post pages this
 *    is distracting — we use a MutationObserver to strip those classes
 *    immediately, keeping the nav at the page top only.
 *
 * 2. Preserve reading position on window resize
 *    When the browser window changes size, text reflow shifts content.
 *    We record which heading is at the viewport top on the first resize
 *    event, then scroll it back into place 300 ms after the last event.
 *    Using behavior:'instant' avoids visible animation during resize.
 */

(() => {
  const container = document.querySelector('.post-content')
  if (!container) return

  /* ==========================================
     Disable sticky nav on post pages.
     The nav stays at the top of the page only;
     it will NOT follow the user when scrolling down.
     ========================================== */
  const header = document.getElementById('page-header')
  if (header) {
    header.classList.remove('nav-fixed', 'nav-visible')
    new MutationObserver(() => {
      if (header.classList.contains('nav-fixed') || header.classList.contains('nav-visible')) {
        header.classList.remove('nav-fixed', 'nav-visible')
      }
    }).observe(header, { attributes: true, attributeFilter: ['class'] })
  }

  /* ==========================================
     Preserve reading position across window resizes.
     ========================================== */
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  if (!headings.length) return

  let savedTarget = null
  let resizeTimer = null

  const findCurrentHeading = () => {
    const threshold = window.scrollY + 100
    let current = null
    for (const h of headings) {
      if (h.offsetTop <= threshold) current = h
      else break
    }
    return current
  }

  window.addEventListener('resize', () => {
    if (!savedTarget) {
      savedTarget = findCurrentHeading()
    }

    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      if (savedTarget) {
        const top = savedTarget.getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top: top - 80, behavior: 'instant' })
        savedTarget = null
      }
    }, 300)
  })
})()
