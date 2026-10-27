
import './style.css';

import { translations } from './data/translations';
import {
  experiences,
  researchAreas,
  projects
} from './data/portfolio';

type Language = 'en' | 'zh' | 'vi';
type TranslationKey = keyof typeof translations.en;

const STORAGE_KEY = 'bamboo-portfolio-language';

const languageOptions: {
  code: Language;
  label: string;
  nativeLabel: string;
}[] = [
  { code: 'en', label: 'EN', nativeLabel: 'English' },
  { code: 'zh', label: '中文', nativeLabel: '简体中文' },
  { code: 'vi', label: 'VI', nativeLabel: 'Tiếng Việt' }
];

function isLanguage(value: string | null): value is Language {
  return value === 'en' || value === 'zh' || value === 'vi';
}

function getSavedLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLanguage(saved)) return saved;
  } catch {
    // Sử dụng tiếng Anh nếu localStorage không khả dụng.
  }

  return 'en';
}

let currentLanguage: Language = getSavedLanguage();

function t(key: TranslationKey): string {
  return translations[currentLanguage][key];
}

function escapeHTML(value: string): string {
  return value.replace(/[&<>"']/g, character => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    return entities[character];
  });
}

function languageSwitcher(): string {
  return `
    <div
      class="language-switcher"
      role="group"
      aria-label="${escapeHTML(t('languageLabel'))}"
    >
      ${languageOptions.map(option => `
        <button
          class="language-option ${option.code === currentLanguage ? 'is-active' : ''}"
          type="button"
          data-language="${option.code}"
          aria-pressed="${option.code === currentLanguage}"
          title="${escapeHTML(option.nativeLabel)}"
        >${option.label}</button>
      `).join('')}
    </div>
  `;
}

function renderExperienceCards(): string {
  return experiences.map((item, index) => `
    <article class="experience-card">
      <span class="card-index">
        ${String(index + 1).padStart(2, '0')}
      </span>
      <h3>${t(item.titleKey)}</h3>
      <p>${t(item.descriptionKey)}</p>
    </article>
  `).join('');
}

function renderResearchCards(): string {
  return researchAreas.map(item => `
    <article class="research-card">
      <span class="research-symbol" aria-hidden="true">
        ${escapeHTML(item.symbol)}
      </span>
      <h3>${t(item.titleKey)}</h3>
      <p>${t(item.descriptionKey)}</p>
    </article>
  `).join('');
}

function renderProjectCards(): string {
  return projects.map(item => {
    const id = escapeHTML(item.id);
    const githubUrl = item.githubUrl?.trim() ?? '';

    // Chỉ hiển thị liên kết GitHub dạng tài khoản/repository.
    const validGithubUrl =
      /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/.test(githubUrl);

    const safeGithubUrl = validGithubUrl
      ? escapeHTML(githubUrl)
      : '';

    return `
      <article class="project-card" id="project-${id}">
        <div class="project-art project-art-${item.art}">
          <span class="project-art-label">
            ${escapeHTML(item.artLabel)}
          </span>

          ${item.art === 'forest' ? `
            <span class="project-art-mark">B.</span>
          ` : ''}

          ${item.art === 'data' ? `
            <div class="data-bars" aria-hidden="true">
              <i></i><i></i><i></i><i></i><i></i><i></i><i></i>
            </div>
          ` : ''}

          ${item.art === 'research' ? `
            <span class="research-orbit" aria-hidden="true"></span>
          ` : ''}
        </div>

        <div class="project-copy">
          <p class="project-category">${t(item.categoryKey)}</p>
          <h3>${t(item.titleKey)}</h3>
          <p>${t(item.descriptionKey)}</p>

          <div class="project-tech">
            ${item.technologies.map(technology => `
              <span>${escapeHTML(technology)}</span>
            `).join('')}
          </div>

          <div class="project-actions">
            <button
              type="button"
              class="project-detail-btn"
              data-project-detail="${id}"
              aria-expanded="false"
              aria-controls="details-${id}"
            >${t('projectViewDetails')}</button>

            ${safeGithubUrl ? `
              <a
                class="project-github"
                href="${safeGithubUrl}"
                target="_blank"
                rel="noopener noreferrer"
              >${t('projectGithub')} ↗</a>
            ` : ''}
          </div>

          <div
            class="project-details"
            id="details-${id}"
            hidden
          >
            <h4>${t('projectObjective')}</h4>
<p>${t(item.objectiveKey)}</p>

<h4>${t('projectMethodology')}</h4>
<p>${t(item.methodologyKey)}</p>

<h4>${t('projectOutcome')}</h4>
<p>${t(item.outcomeKey)}</p>
          </div>

          <span class="project-status">${t(item.statusKey)}</span>
        </div>
      </article>
    `;
  }).join('');
}
function initScrollReveal(): void {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  const elements = app.querySelectorAll<HTMLElement>(`
    .hero-content,
    .section-heading,
    .about-copy,
    .about-visual,
    .experience-card,
    .current-focus,
    .research-card,
    .project-card,
    .contact-content
  `);

  const showAll = (): void => {
    elements.forEach(element => {
      element.classList.remove('reveal-on-scroll');
      element.classList.add('is-visible');
    });
  };

  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !('IntersectionObserver' in window)
  ) {
    showAll();
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    }
  );

  elements.forEach(element => {
    element.classList.remove('is-visible');
    element.classList.add('reveal-on-scroll');
    observer.observe(element);
  });
}
function initParallax(): void {
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero) return;

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const isMobile = window.matchMedia(
    '(hover: none), (max-width: 768px)'
  ).matches;

  if (reduceMotion || isMobile) {
    hero.style.removeProperty('--hero-parallax-y');
    return;
  }

  let ticking = false;

  const updateParallax = (): void => {
    const rect = hero.getBoundingClientRect();

    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const offset = Math.max(
        -24,
        Math.min(24, rect.top * -0.06)
      );

      hero.style.setProperty(
        '--hero-parallax-y',
        `${offset}px`
      );
    }

    ticking = false;
  };

  const onScroll = (): void => {
    if (ticking) return;

    ticking = true;
    window.requestAnimationFrame(updateParallax);
  };

  window.addEventListener('scroll', onScroll, {
    passive: true
  });

  updateParallax();
}

function renderPage(): void {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) {
    console.error('Không tìm thấy #app trong index.html.');
    return;
  }

  document.documentElement.lang =
    currentLanguage === 'zh' ? 'zh-CN' : currentLanguage;

  document.title =
    currentLanguage === 'zh'
      ? '个人作品集 | 探索与研究'
      : currentLanguage === 'vi'
        ? 'Portfolio cá nhân | Học hỏi và nghiên cứu'
        : 'Personal Portfolio | Exploration & Research';

  app.innerHTML = `
    <header class="site-header">
      <nav class="navbar section-container" aria-label="${escapeHTML(t('navHome'))}">
        <a class="brand" href="#home" aria-label="Bamboo portfolio home">
          BAMBOO<span>.</span>
        </a>

        <div class="nav-links">
          <a href="#home">${t('navHome')}</a>
          <a href="#about">${t('navAbout')}</a>
          <a href="#experience">${t('navExperience')}</a>
          <a href="#research">${t('navResearch')}</a>
          <a href="#projects">${t('navProjects')}</a>
          <a href="#contact">${t('navContact')}</a>
        </div>

        ${languageSwitcher()}
      </nav>
    </header>

    <main>
      <section class="hero" id="home">
        <div class="hero-content section-container">
          <p class="hero-label">${t('heroLabel')}</p>

          <h1>
            ${t('heroLine1')}
            <br />
            <span>${t('heroLine2')}</span>
          </h1>

          <p class="hero-description">
            ${t('heroDescription')}
          </p>

          <div class="hero-actions">
            <a class="button button-primary" href="#projects">
              ${t('heroPrimary')}
            </a>
            <a class="button button-secondary" href="#contact">
              ${t('heroSecondary')}
            </a>
          </div>

          <a class="scroll-indicator" href="#about">
            ${t('scrollText')} ↓
          </a>
        </div>
      </section>

      <section class="about section-container" id="about">
        <div class="section-heading">
          <p class="section-label">${t('aboutLabel')}</p>
          <h2>${t('aboutTitle')}</h2>
        </div>

        <div class="about-grid">
          <div class="about-copy">
            <p>${t('aboutParagraph1')}</p>
            <p>${t('aboutParagraph2')}</p>

            <div class="about-tags">
              <span>${t('aboutTag1')}</span>
              <span>${t('aboutTag2')}</span>
              <span>${t('aboutTag3')}</span>
            </div>
          </div>

          <div class="about-visual">
            <div class="about-image-placeholder" role="img"
              aria-label="${escapeHTML(t('forestAlt'))}">
              <span class="about-image-mark">B.</span>
            </div>
            <p class="about-image-caption">${t('aboutImageCaption')}</p>
          </div>
        </div>
      </section>

      <section class="experience section-container" id="experience">
        <div class="section-heading">
          <p class="section-label">${t('experienceLabel')}</p>
          <h2>${t('experienceTitle')}</h2>
          <p>${t('experienceDescription')}</p>
        </div>

        <div class="experience-grid">
          ${renderExperienceCards()}
        </div>

        <div class="current-focus">
          <p class="section-label">${t('statusLabel')}</p>
          <p>${t('statusText')}</p>
        </div>
      </section>

      <section class="research section-container" id="research">
        <div class="section-heading">
          <p class="section-label">${t('researchLabel')}</p>
          <h2>${t('researchTitle')}</h2>
          <p>${t('researchDescription')}</p>
        </div>

        <div class="research-grid">
          ${renderResearchCards()}
        </div>
      </section>

      <section class="projects section-container" id="projects">
        <div class="section-heading">
          <p class="section-label">${t('projectsLabel')}</p>
          <h2>${t('projectsTitle')}</h2>
          <p>${t('projectsDescription')}</p>
        </div>

        <div class="projects-grid">
          ${renderProjectCards()}
        </div>

        <p class="project-note">${t('projectNote')}</p>
      </section>

      <section class="contact section-container" id="contact">
        <div class="contact-content">
          <p class="section-label">${t('contactLabel')}</p>
          <h2>${t('contactTitle')}</h2>
          <p>${t('contactDescription')}</p>

          <a
            class="button button-primary"
            href="mailto:your-email@example.com"
          >${t('contactButton')}</a>

          <p class="contact-note">${t('contactEmailNote')}</p>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="section-container footer-inner">
        <p>${t('footerText')}</p>
        <a href="#home">${t('backToTop')}</a>
      </div>
    </footer>
  `;

// Chuyển ngôn ngữ.
app.querySelectorAll<HTMLButtonElement>('[data-language]')
  .forEach(button => {
    button.addEventListener('click', () => {
      const language = button.dataset.language;

      if (language && isLanguage(language)) {
        setLanguage(language);
      }
    });
  });

  // Mở và đóng chi tiết dự án.
  app.querySelectorAll<HTMLButtonElement>('[data-project-detail]')
    .forEach(button => {
      button.addEventListener('click', () => {
        const projectId = button.dataset.projectDetail;

        if (!projectId) return;

        const details = app.querySelector<HTMLElement>(
          `#details-${CSS.escape(projectId)}`
        );

        if (!details) return;

        const isOpening = details.hidden;
        details.hidden = !isOpening;

        button.setAttribute(
          'aria-expanded',
          String(isOpening)
        );

        button.textContent = isOpening
          ? t('projectHideDetails')
          : t('projectViewDetails');
      });
    });
      // Khởi tạo hiệu ứng sau khi HTML đã được render.
  initScrollReveal();
  initParallax();
}

function setLanguage(language: Language): void {
  currentLanguage = language;

  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Chuyển ngôn ngữ vẫn hoạt động trong phiên hiện tại.
  }

  renderPage();
}

renderPage();
