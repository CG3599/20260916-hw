/**
 * Personal Portfolio Website Interactive Logic
 * Handles Profile Customization, LocalStorage Persistence,
 * Dynamic Typewriter, Mouse Glow, Smooth Scrolling, and Clipboard Copy.
 */

// Default Profile Data
const DEFAULT_PROFILE = {
  name: 'Alex Chen',
  title: '全端開發者 & UI/UX 探索者',
  email: 'alex.chen.dev@example.com',
  bio: '熱愛探索科技與視覺設計的完美交匯點，擅長運用現代化技術構建高效、具美感且直覺的數位產品與互動介面。'
};

// Elements
const el = {
  pageTitle: document.getElementById('page-title'),
  navName: document.getElementById('nav-name'),
  brandBadge: document.getElementById('brand-badge'),
  displayName: document.getElementById('display-name'),
  displayBio: document.getElementById('display-bio'),
  cardName: document.getElementById('card-name'),
  cardTitle: document.getElementById('card-title'),
  monogramCircle: document.getElementById('monogram-circle'),
  footerName: document.getElementById('footer-name'),
  currentYear: document.getElementById('current-year'),
  displayEmail: document.getElementById('display-email'),
  cursorGlow: document.getElementById('cursor-glow'),
  
  // Modal & Form
  editModal: document.getElementById('edit-modal'),
  openEditBtn: document.getElementById('open-edit-modal-btn'),
  inlineEditBtn: document.getElementById('inline-edit-btn'),
  closeModalBtn: document.getElementById('close-modal-btn'),
  resetDefaultBtn: document.getElementById('reset-default-btn'),
  profileForm: document.getElementById('profile-form'),
  inputName: document.getElementById('input-name'),
  inputTitle: document.getElementById('input-title'),
  inputEmail: document.getElementById('input-email'),
  inputBio: document.getElementById('input-bio'),

  // Copy & Toast
  copyEmailBox: document.getElementById('copy-email-box'),
  copyEmailBtn: document.getElementById('copy-email-btn'),
  toast: document.getElementById('toast'),
  toastMsg: document.getElementById('toast-msg'),

  // Typewriter
  roleTypewriter: document.getElementById('role-typewriter')
};

// --------------------------------------------------------------------------
// 1. Profile State & Storage
// --------------------------------------------------------------------------
function getStoredProfile() {
  try {
    const saved = localStorage.getItem('user_portfolio_profile');
    if (saved) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
    }
  } catch (err) {
    console.error('Failed to read profile from localStorage:', err);
  }
  return { ...DEFAULT_PROFILE };
}

function saveProfile(data) {
  try {
    localStorage.setItem('user_portfolio_profile', JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save profile to localStorage:', err);
  }
}

// Extract Monogram / Initials from name
function getMonogram(name) {
  if (!name) return 'A';
  const trimmed = name.trim();
  const words = trimmed.split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  // For single words or Chinese characters
  return trimmed.length > 2 ? trimmed.substring(0, 2) : trimmed;
}

// Render Profile to DOM
function applyProfile(profile) {
  const monogram = getMonogram(profile.name);

  // Document Title & Nav
  el.pageTitle.textContent = `${profile.name} | 個人形象專屬網站`;
  el.navName.textContent = profile.name;
  el.brandBadge.textContent = monogram.charAt(0);

  // Hero Section
  const nameSpan = el.displayName.querySelector('.name-gradient');
  if (nameSpan) {
    nameSpan.textContent = profile.name;
  }
  el.displayBio.textContent = profile.bio;

  // Hero Visual Card
  el.cardName.textContent = profile.name;
  el.cardTitle.textContent = profile.title;
  el.monogramCircle.textContent = monogram;

  // Contact & Footer
  el.displayEmail.textContent = profile.email;
  el.footerName.textContent = profile.name;
}

// --------------------------------------------------------------------------
// 2. Modal Management
// --------------------------------------------------------------------------
function openModal() {
  const current = getStoredProfile();
  el.inputName.value = current.name;
  el.inputTitle.value = current.title;
  el.inputEmail.value = current.email;
  el.inputBio.value = current.bio;

  el.editModal.classList.add('active');
  el.editModal.setAttribute('aria-hidden', 'false');
  el.inputName.focus();
}

function closeModal() {
  el.editModal.classList.remove('active');
  el.editModal.setAttribute('aria-hidden', 'true');
}

// --------------------------------------------------------------------------
// 3. Toast Notifications
// --------------------------------------------------------------------------
let toastTimeout = null;
function showToast(message) {
  el.toastMsg.textContent = message;
  el.toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    el.toast.classList.remove('show');
  }, 3200);
}

// --------------------------------------------------------------------------
// 4. Typewriter Dynamic Effect
// --------------------------------------------------------------------------
const typewriterPhrases = [
  '卓越的數位體驗',
  '現代全端應用系統',
  '精緻直覺的 UI/UX',
  '高效能雲端架構'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 110;

function handleTypewriter() {
  const currentPhrase = typewriterPhrases[phraseIndex];

  if (isDeleting) {
    el.roleTypewriter.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 60;
  } else {
    el.roleTypewriter.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 120;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    typeSpeed = 1800; // Pause at full text
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
    typeSpeed = 400; // Pause before typing new word
  }

  setTimeout(handleTypewriter, typeSpeed);
}

// --------------------------------------------------------------------------
// 5. Mouse Ambient Glow Follower
// --------------------------------------------------------------------------
function setupCursorFollower() {
  if (!el.cursorGlow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;
    el.cursorGlow.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(animate);
  }
  animate();
}

// --------------------------------------------------------------------------
// 6. Copy Email to Clipboard
// --------------------------------------------------------------------------
async function copyEmailToClipboard() {
  const email = el.displayEmail.textContent.trim();
  try {
    await navigator.clipboard.writeText(email);
    showToast(`已複製 Email：${email}`);
  } catch (err) {
    // Fallback for older browsers
    const tempInput = document.createElement('input');
    tempInput.value = email;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`已複製 Email：${email}`);
  }
}

// --------------------------------------------------------------------------
// 7. Event Listeners & Initialization
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  if (el.currentYear) {
    el.currentYear.textContent = new Date().getFullYear();
  }

  // Load and apply profile
  const initialProfile = getStoredProfile();
  applyProfile(initialProfile);

  // Start Typewriter
  setTimeout(handleTypewriter, 800);

  // Setup cursor follower
  setupCursorFollower();

  // Modal triggers
  el.openEditBtn?.addEventListener('click', openModal);
  el.inlineEditBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal();
  });
  el.displayName?.addEventListener('click', openModal);
  el.closeModalBtn?.addEventListener('click', closeModal);

  // Close modal when clicking on backdrop
  el.editModal?.addEventListener('click', (e) => {
    if (e.target === el.editModal) {
      closeModal();
    }
  });

  // ESC key to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && el.editModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Profile Form Submit
  el.profileForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = {
      name: el.inputName.value.trim() || DEFAULT_PROFILE.name,
      title: el.inputTitle.value.trim() || DEFAULT_PROFILE.title,
      email: el.inputEmail.value.trim() || DEFAULT_PROFILE.email,
      bio: el.inputBio.value.trim() || DEFAULT_PROFILE.bio
    };

    saveProfile(updated);
    applyProfile(updated);
    closeModal();
    showToast('✨ 個人資訊已即時更新成功！');
  });

  // Reset to default
  el.resetDefaultBtn?.addEventListener('click', () => {
    if (confirm('確定要恢復預設資訊嗎？')) {
      saveProfile(DEFAULT_PROFILE);
      applyProfile(DEFAULT_PROFILE);
      closeModal();
      showToast('已恢復預設個人資訊！');
    }
  });

  // Copy Email Handlers
  el.copyEmailBox?.addEventListener('click', copyEmailToClipboard);
  el.copyEmailBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    copyEmailToClipboard();
  });

  // Smooth scroll offset adjustment for fixed navbar
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
