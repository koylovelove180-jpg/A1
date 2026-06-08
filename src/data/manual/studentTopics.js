export const studentTopics = [
  {
    id: 'getting-started',
    titleKey: 'manual.student.gettingStarted.title',
    summaryKey: 'manual.student.gettingStarted.summary',
    appRoute: '/student',
    tags: ['home', 'start'],
    sections: [
      {
        id: 'overview',
        headingKey: 'manual.student.gettingStarted.s1.heading',
        bodyKey: 'manual.student.gettingStarted.s1.body',
      },
      {
        id: 'steps',
        headingKey: 'manual.student.gettingStarted.s2.heading',
        steps: [
          'manual.student.gettingStarted.s2.step1',
          'manual.student.gettingStarted.s2.step2',
          'manual.student.gettingStarted.s2.step3',
        ],
        tipKey: 'manual.student.gettingStarted.s2.tip',
      },
    ],
  },
  {
    id: 'pretest',
    titleKey: 'manual.student.pretest.title',
    summaryKey: 'manual.student.pretest.summary',
    appRoute: '/student',
    tags: ['pretest', 'quiz', 'music'],
    sections: [
      {
        id: 'quiz',
        headingKey: 'manual.student.pretest.s1.heading',
        bodyKey: 'manual.student.pretest.s1.body',
        steps: [
          'manual.student.pretest.s1.step1',
          'manual.student.pretest.s1.step2',
          'manual.student.pretest.s1.step3',
        ],
      },
      {
        id: 'music-intro',
        headingKey: 'manual.student.pretest.s2.heading',
        bodyKey: 'manual.student.pretest.s2.body',
        steps: [
          'manual.student.pretest.s2.step1',
          'manual.student.pretest.s2.step2',
          'manual.student.pretest.s2.step3',
        ],
        noteKey: 'manual.student.pretest.s2.note',
      },
    ],
  },
  {
    id: 'lessons-navigation',
    titleKey: 'manual.student.lessons.title',
    summaryKey: 'manual.student.lessons.summary',
    appRoute: '/student',
    tags: ['lessons', 'navigation'],
    sections: [
      {
        id: 'nav',
        headingKey: 'manual.student.lessons.s1.heading',
        steps: [
          'manual.student.lessons.s1.step1',
          'manual.student.lessons.s1.step2',
          'manual.student.lessons.s1.step3',
        ],
      },
      {
        id: 'fullscreen',
        headingKey: 'manual.student.lessons.s2.heading',
        bodyKey: 'manual.student.lessons.s2.body',
      },
    ],
  },
  {
    id: 'post-test',
    titleKey: 'manual.student.postTest.title',
    summaryKey: 'manual.student.postTest.summary',
    appRoute: '/student',
    tags: ['posttest', 'quiz'],
    sections: [
      {
        id: 'requirements',
        headingKey: 'manual.student.postTest.s1.heading',
        bodyKey: 'manual.student.postTest.s1.body',
        steps: [
          'manual.student.postTest.s1.step1',
          'manual.student.postTest.s1.step2',
          'manual.student.postTest.s1.step3',
        ],
        noteKey: 'manual.student.postTest.s2.note',
      },
    ],
  },
  {
    id: 'announcements-faq',
    titleKey: 'manual.student.announcements.title',
    summaryKey: 'manual.student.announcements.summary',
    appRoute: '/student',
    tags: ['announcement', 'faq'],
    sections: [
      {
        id: 'announcements',
        headingKey: 'manual.student.announcements.s1.heading',
        bodyKey: 'manual.student.announcements.s1.body',
      },
      {
        id: 'faq',
        headingKey: 'manual.student.announcements.s2.heading',
        bodyKey: 'manual.student.announcements.s2.body',
      },
    ],
  },
  {
    id: 'mobile-desktop-tips',
    titleKey: 'manual.student.devices.title',
    summaryKey: 'manual.student.devices.summary',
    appRoute: '/student',
    tags: ['mobile', 'desktop'],
    sections: [
      {
        id: 'mobile',
        headingKey: 'manual.student.devices.s1.heading',
        steps: [
          'manual.student.devices.s1.step1',
          'manual.student.devices.s1.step2',
        ],
      },
      {
        id: 'desktop',
        headingKey: 'manual.student.devices.s2.heading',
        bodyKey: 'manual.student.devices.s2.body',
      },
    ],
  },
];

export const studentTopicMap = Object.fromEntries(studentTopics.map((topic) => [topic.id, topic]));
