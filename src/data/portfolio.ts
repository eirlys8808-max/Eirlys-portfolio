import { translations } from './translations';

type TranslationKey = keyof typeof translations.en;

export type ExperienceItem = {
  id: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
};

export type ResearchItem = {
  id: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  symbol: string;
};


export type ProjectItem = {
  id: string;
  categoryKey: TranslationKey;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  technologies: string[];
  statusKey: TranslationKey;
  art: 'forest' | 'data' | 'research';
  artLabel: string;

   // Khóa bản dịch cho nội dung chi tiết của dự án
  objectiveKey: TranslationKey;
  methodologyKey: TranslationKey;
  outcomeKey: TranslationKey;

  // Đường dẫn mã nguồn GitHub, nếu có
  githubUrl?: string;
};

export const experiences: ExperienceItem[] = [
  {
    id: 'academic-development',
    titleKey: 'experience1Title',
    descriptionKey: 'experience1Text'
  },
  {
    id: 'technical-skills',
    titleKey: 'experience2Title',
    descriptionKey: 'experience2Text'
  },
  {
    id: 'research-exploration',
    titleKey: 'experience3Title',
    descriptionKey: 'experience3Text'
  }
];

export const researchAreas: ResearchItem[] = [
  {
    id: 'data-analytics',
    titleKey: 'research1Title',
    descriptionKey: 'research1Text',
    symbol: '⌘'
  },
  {
    id: 'smart-logistics',
    titleKey: 'research2Title',
    descriptionKey: 'research2Text',
    symbol: '↗'
  },
  {
    id: 'information-technology',
    titleKey: 'research3Title',
    descriptionKey: 'research3Text',
    symbol: '⌘'
  }
];



export const projects: ProjectItem[] = [
  {
    id: 'personal-portfolio',
    categoryKey: 'project1Category',
    titleKey: 'project1Title',
    descriptionKey: 'project1Text',
    technologies: ['TypeScript', 'Vite', 'CSS', 'Responsive Design'],
    statusKey: 'projectLink',
    art: 'forest',
    artLabel: '01 — PORTFOLIO',
       objectiveKey: 'project1ObjectiveText',
    methodologyKey: 'project1MethodologyText',
    outcomeKey: 'project1OutcomeText',
    githubUrl: ''
  },
  {
    id: 'logistics-data-exploration',
    categoryKey: 'project2Category',
    titleKey: 'project2Title',
    descriptionKey: 'project2Text',
    technologies: [
      'Python',
      'Data Analysis',
      'Data Visualization',
      'Logistics'
    ],
    statusKey: 'projectLink',
    art: 'data',
    artLabel: '02 — LOGISTICS DATA',
    objectiveKey: 'project2ObjectiveText',
    methodologyKey: 'project2MethodologyText',
    outcomeKey: 'project2OutcomeText',
    githubUrl: ''
  },
  {
    id: 'research-project',
    categoryKey: 'project3Category',
    titleKey: 'project3Title',
    descriptionKey: 'project3Text',
    technologies: [
      'Literature Review',
      'Research Design',
      'Data Analysis'
    ],
    statusKey: 'projectLink',
    art: 'research',
    artLabel: '03 — RESEARCH EXPLORATION',
        objectiveKey: 'project3ObjectiveText',
    methodologyKey: 'project3MethodologyText',
    outcomeKey: 'project3OutcomeText',
  }
];

