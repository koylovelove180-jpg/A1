export const teacherTopics = [
  {
    id: 'login-dashboard',
    titleKey: 'manual.teacher.login.title',
    summaryKey: 'manual.teacher.login.summary',
    appRoute: '/teacher',
    tags: ['login', 'dashboard'],
    sections: [
      {
        id: 'login',
        headingKey: 'manual.teacher.login.s1.heading',
        steps: [
          'manual.teacher.login.s1.step1',
          'manual.teacher.login.s1.step2',
          'manual.teacher.login.s1.step3',
        ],
      },
      {
        id: 'dashboard',
        headingKey: 'manual.teacher.login.s2.heading',
        bodyKey: 'manual.teacher.login.s2.body',
      },
    ],
  },
  {
    id: 'classroom-controls',
    titleKey: 'manual.teacher.classroom.title',
    summaryKey: 'manual.teacher.classroom.summary',
    appRoute: '/teacher',
    tags: ['classroom', 'firestore'],
    sections: [
      {
        id: 'controls',
        headingKey: 'manual.teacher.classroom.s1.heading',
        steps: [
          'manual.teacher.classroom.s1.step1',
          'manual.teacher.classroom.s1.step2',
          'manual.teacher.classroom.s1.step3',
        ],
        tipKey: 'manual.teacher.classroom.s2.tip',
      },
    ],
  },
  {
    id: 'pretest-settings',
    titleKey: 'manual.teacher.pretestSettings.title',
    summaryKey: 'manual.teacher.pretestSettings.summary',
    appRoute: '/teacher',
    tags: ['pretest', 'music'],
    sections: [
      {
        id: 'pretest',
        headingKey: 'manual.teacher.pretestSettings.s1.heading',
        steps: ['manual.teacher.pretestSettings.s1.step1'],
      },
      {
        id: 'music',
        headingKey: 'manual.teacher.pretestSettings.s2.heading',
        steps: [
          'manual.teacher.pretestSettings.s2.step1',
          'manual.teacher.pretestSettings.s2.step2',
        ],
        warningKey: 'manual.teacher.pretestSettings.s2.warning',
      },
    ],
  },
  {
    id: 'announcements-html-qr',
    titleKey: 'manual.teacher.announcements.title',
    summaryKey: 'manual.teacher.announcements.summary',
    appRoute: '/teacher',
    tags: ['announcement', 'html', 'qr'],
    sections: [
      {
        id: 'html',
        headingKey: 'manual.teacher.announcements.s1.heading',
        steps: [
          'manual.teacher.announcements.s1.step1',
          'manual.teacher.announcements.s1.step2',
          'manual.teacher.announcements.s1.step3',
        ],
      },
      {
        id: 'qr',
        headingKey: 'manual.teacher.announcements.s2.heading',
        bodyKey: 'manual.teacher.announcements.s2.body',
      },
    ],
  },
  {
    id: 'help-video',
    titleKey: 'manual.teacher.video.title',
    summaryKey: 'manual.teacher.video.summary',
    appRoute: '/teacher',
    tags: ['video', 'help'],
    sections: [
      {
        id: 'video',
        bodyKey: 'manual.teacher.video.s1.body',
      },
    ],
  },
  {
    id: 'troubleshooting',
    titleKey: 'manual.teacher.troubleshooting.title',
    summaryKey: 'manual.teacher.troubleshooting.summary',
    appRoute: '/teacher',
    tags: ['troubleshooting', 'support'],
    sections: [
      {
        id: 'realtime',
        headingKey: 'manual.teacher.troubleshooting.s1.heading',
        steps: [
          'manual.teacher.troubleshooting.s1.step1',
          'manual.teacher.troubleshooting.s1.step2',
        ],
      },
      {
        id: 'login-issues',
        headingKey: 'manual.teacher.troubleshooting.s2.heading',
        bodyKey: 'manual.teacher.troubleshooting.s2.body',
      },
      {
        id: 'images',
        headingKey: 'manual.teacher.troubleshooting.s3.heading',
        bodyKey: 'manual.teacher.troubleshooting.s3.body',
      },
    ],
  },
];

export const teacherTopicMap = Object.fromEntries(teacherTopics.map((topic) => [topic.id, topic]));
