// scheduleData.js - بيانات جدول الحصص الأسبوعي المستوحى بدقة من دفتر الطالب
export const PERIOD_HEADERS = [
  {
    id: "morning",
    title: "الحصة الأولى / الصبح",
    time: "الفترة الصباحية (08:00 ص - 01:00 م)",
    icon: "Sun"
  },
  {
    id: "afternoon",
    title: "الحصة الثانية / الظهيرة والدروس",
    time: "فترة بعد الظهر (02:00 م - 07:00 م)",
    icon: "Clock"
  },
  {
    id: "evening",
    title: "الحصة الثالثة / المساء بليل",
    time: "الفترة المسائية (08:00 م - 12:00 م)",
    icon: "Moon"
  }
];

export const DEFAULT_WEEK_DAYS = [
  {
    id: "saturday",
    name: "السبت",
    dayIndex: 6, // ترتيب الأسبوع من السبت
    badge: "بداية الأسبوع",
    slots: [
      {
        id: "sat-1",
        period: "morning",
        type: "subject",
        subjectId: "chemistry",
        title: "مراجعة الكيمياء الصبح",
        note: "مراجعة الباب الأول وتثبيت المعادلات"
      },
      {
        id: "sat-2",
        period: "afternoon",
        type: "locked",
        title: "(من 2 م الى 9 م) مقفول",
        note: "دروس وسنتر خارج البيت"
      },
      {
        id: "sat-3",
        period: "evening",
        type: "subject",
        subjectId: "geology",
        title: "جيولوجيا (ملاحظة الهامش)",
        note: "مذاكرة خفيفة وتلخيص"
      }
    ]
  },
  {
    id: "sunday",
    name: "الأحد",
    dayIndex: 0,
    badge: "يوم التركيز",
    slots: [
      {
        id: "sun-1",
        period: "morning",
        type: "subject",
        subjectId: "physics",
        title: "فيزياء الصبح",
        note: "تطبيقات كيرشوف وقوانين أوم"
      },
      {
        id: "sun-2",
        period: "afternoon",
        type: "free",
        title: "استراحة وشحن طاقة",
        note: "غداء وصلاة"
      },
      {
        id: "sun-3",
        period: "evening",
        type: "backlog",
        title: "ممكن بواقي (تصفية المتراكم)",
        note: "تخليص المتراكم في الفيزياء والمواد"
      }
    ]
  },
  {
    id: "monday",
    name: "الإثنين",
    dayIndex: 1,
    badge: "يوم اللغات والجيولوجيا",
    slots: [
      {
        id: "mon-1",
        period: "morning",
        type: "subject",
        subjectId: "english",
        title: "الصبح ⬅️ لغة إنجليزية (E)",
        note: "حفظ كلمات وحل تمارين القواعد"
      },
      {
        id: "mon-2",
        period: "afternoon",
        type: "locked",
        title: "(من 4 م الى 9 م) مقفول",
        note: "مواعيد دروس وسنتر"
      },
      {
        id: "mon-3",
        period: "evening",
        type: "subject",
        subjectId: "geology",
        title: "بليل ⬅️ جيولوجيا",
        note: "التراكيب الجيولوجية والفوالق"
      }
    ]
  },
  {
    id: "tuesday",
    name: "الثلاثاء",
    dayIndex: 2,
    badge: "يوم الكيمياء والعربي",
    slots: [
      {
        id: "tue-1",
        period: "morning",
        type: "subject",
        subjectId: "chemistry",
        title: "الصبح ⬅️ كيمياء",
        note: "حل وتثبيت الباب الثاني"
      },
      {
        id: "tue-2",
        period: "afternoon",
        type: "subject",
        subjectId: "biology",
        title: "أحياء (ملاحظة الهامش)",
        note: "مراجعة رسومات وفصل الدعامة"
      },
      {
        id: "tue-3",
        period: "evening",
        type: "subject",
        subjectId: "arabic",
        title: "بليل ⬅️ عربي",
        note: "الوحدة الأولى نحو وبلاغة"
      }
    ]
  },
  {
    id: "wednesday",
    name: "الأربعاء",
    dayIndex: 3,
    badge: "تصفية وإنجاز",
    slots: [
      {
        id: "wed-1",
        period: "morning",
        type: "subject",
        subjectId: "english",
        title: "لغة إنجليزية (E)",
        note: "حل قطعة فهم وترجمة"
      },
      {
        id: "wed-2",
        period: "afternoon",
        type: "backlog",
        title: "بواقي (تصفية المتراكم)",
        note: "إنهاء أي جزء مؤجل"
      },
      {
        id: "wed-3",
        period: "evening",
        type: "subject",
        subjectId: "physics",
        title: "فيزياء (ملاحظة الهامش)",
        note: "شيت ومسائل مجمعة"
      }
    ]
  },
  {
    id: "thursday",
    name: "الخميس",
    dayIndex: 4,
    badge: "يوم الكيمياء والأحياء",
    slots: [
      {
        id: "thu-1",
        period: "morning",
        type: "subject",
        subjectId: "chemistry",
        title: "الصبح ⬅️ كيمياء",
        note: "مراجعة وتلخيص شامل"
      },
      {
        id: "thu-2",
        period: "afternoon",
        type: "free",
        title: "راحة وترتيب أسبوعي",
        note: "تنظيم المكتب وجدول المذاكرة"
      },
      {
        id: "thu-3",
        period: "evening",
        type: "subject",
        subjectId: "biology",
        title: "بليل ⬅️ أحياء",
        note: "فصل المناعة والـ DNA"
      }
    ]
  },
  {
    id: "friday",
    name: "الجمعة",
    dayIndex: 5,
    badge: "تصفير المتراكم الأسبوعي",
    slots: [
      {
        id: "fri-1",
        period: "morning",
        type: "free",
        title: "صلاة الجمعة واستراحة",
        note: "يوم الجمعة المبارك"
      },
      {
        id: "fri-2",
        period: "afternoon",
        type: "backlog",
        title: "بواقي (تصفية شاملة)",
        note: "تصفير كل ما تبقى من الأسبوع"
      },
      {
        id: "fri-3",
        period: "evening",
        type: "backlog",
        title: "بواقي ومراجعة شاملة",
        note: "مراجعة امتحانات الأسبوع والملاحظات"
      }
    ]
  }
];
