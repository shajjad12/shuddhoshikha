/**
 * syllabus.js — Shuddhoshikha
 * Master JSON syllabus schema.
 * Each subject contains chapters, and each chapter contains MCQ + CQ counts.
 * This drives Chapter-wise Preparation, Mock Test, and Board Question Bank.
 */

export const SYLLABUS = {
  physics: {
    label: 'পদার্থবিজ্ঞান',
    chapters: [
      { id: 'phy-1',  label: 'ভৌত রাশি ও পরিমাপ',         mcqCount: 40, cqCount: 10 },
      { id: 'phy-2',  label: 'গতি',                         mcqCount: 55, cqCount: 12 },
      { id: 'phy-3',  label: 'নিউটনের গতিসূত্র ও মহাকর্ষ', mcqCount: 60, cqCount: 15 },
      { id: 'phy-4',  label: 'কাজ, শক্তি ও ক্ষমতা',        mcqCount: 48, cqCount: 10 },
      { id: 'phy-5',  label: 'পদার্থের অবস্থা ও চাপ',       mcqCount: 35, cqCount: 8  },
      { id: 'phy-6',  label: 'বস্তুর উপর তাপের প্রভাব',    mcqCount: 42, cqCount: 10 },
      { id: 'phy-7',  label: 'তরঙ্গ ও শব্দ',                mcqCount: 50, cqCount: 12 },
      { id: 'phy-8',  label: 'আলোর প্রতিফলন',               mcqCount: 38, cqCount: 9  },
      { id: 'phy-9',  label: 'আলোর প্রতিসরণ',               mcqCount: 44, cqCount: 11 },
      { id: 'phy-10', label: 'স্থির তড়িৎ',                  mcqCount: 52, cqCount: 14 },
    ],
  },
  chemistry: {
    label: 'রসায়ন',
    chapters: [
      { id: 'che-1', label: 'রসায়নের ধারণা',              mcqCount: 30, cqCount: 8  },
      { id: 'che-2', label: 'পদার্থের অবস্থা',              mcqCount: 38, cqCount: 9  },
      { id: 'che-3', label: 'মোলের ধারণা ও রাসায়নিক বিক্রিয়া', mcqCount: 55, cqCount: 14 },
      { id: 'che-4', label: 'পর্যায় সারণি',                mcqCount: 45, cqCount: 10 },
      { id: 'che-5', label: 'রাসায়নিক বন্ধন',              mcqCount: 60, cqCount: 15 },
      { id: 'che-6', label: 'জারণ-বিজারণ',                  mcqCount: 42, cqCount: 10 },
      { id: 'che-7', label: 'এসিড-ক্ষার সমতা',              mcqCount: 48, cqCount: 12 },
      { id: 'che-8', label: 'জৈব রসায়ন',                   mcqCount: 50, cqCount: 13 },
    ],
  },
  biology: {
    label: 'জীববিজ্ঞান',
    chapters: [
      { id: 'bio-1', label: 'কোষ ও এর গঠন',                mcqCount: 45, cqCount: 11 },
      { id: 'bio-2', label: 'কোষ বিভাজন',                   mcqCount: 40, cqCount: 10 },
      { id: 'bio-3', label: 'জীবনীশক্তি',                   mcqCount: 35, cqCount: 8  },
      { id: 'bio-4', label: 'অণুজীব',                       mcqCount: 38, cqCount: 9  },
      { id: 'bio-5', label: 'শৈবাল ও ছত্রাক',               mcqCount: 32, cqCount: 7  },
      { id: 'bio-6', label: 'ব্রায়োফাইটা ও টেরিডোফাইটা',    mcqCount: 28, cqCount: 6  },
      { id: 'bio-7', label: 'নগ্নবীজী ও আবৃতবীজী উদ্ভিদ',   mcqCount: 42, cqCount: 10 },
      { id: 'bio-8', label: 'টিস্যু ও টিস্যুতন্ত্র',        mcqCount: 50, cqCount: 12 },
    ],
  },
  hmath: {
    label: 'উচ্চতর গণিত',
    chapters: [
      { id: 'hm-1', label: 'ম্যাট্রিক্স ও নির্ণায়ক',        mcqCount: 45, cqCount: 12 },
      { id: 'hm-2', label: 'ভেক্টর',                         mcqCount: 40, cqCount: 10 },
      { id: 'hm-3', label: 'সরলরেখা',                        mcqCount: 38, cqCount: 9  },
      { id: 'hm-4', label: 'বৃত্ত',                          mcqCount: 42, cqCount: 10 },
      { id: 'hm-5', label: 'পরাবৃত্ত',                       mcqCount: 35, cqCount: 8  },
      { id: 'hm-6', label: 'ত্রিকোণমিতিক অনুপাত',           mcqCount: 50, cqCount: 13 },
      { id: 'hm-7', label: 'সীমা ও ধারাবাহিকতা',            mcqCount: 48, cqCount: 12 },
      { id: 'hm-8', label: 'অন্তরীকলন',                     mcqCount: 55, cqCount: 14 },
      { id: 'hm-9', label: 'যোগজীকরণ',                      mcqCount: 52, cqCount: 13 },
    ],
  },
  bangla: {
    label: 'বাংলা',
    chapters: [
      { id: 'ban-1', label: 'গদ্য — বাংলা ভাষার ইতিহাস',   mcqCount: 30, cqCount: 8  },
      { id: 'ban-2', label: 'গদ্য — লালসালু',               mcqCount: 35, cqCount: 9  },
      { id: 'ban-3', label: 'গদ্য — বিভিন্ন রচনা',          mcqCount: 28, cqCount: 7  },
      { id: 'ban-4', label: 'পদ্য — কবিতা সংকলন',           mcqCount: 40, cqCount: 10 },
      { id: 'ban-5', label: 'ব্যাকরণ — শব্দ ও পদ',          mcqCount: 45, cqCount: 8  },
      { id: 'ban-6', label: 'ব্যাকরণ — বাক্য ও বিরাম চিহ্ন', mcqCount: 38, cqCount: 7  },
      { id: 'ban-7', label: 'নির্মিতি — রচনা ও পত্র',       mcqCount: 20, cqCount: 12 },
    ],
  },
  english: {
    label: 'English',
    chapters: [
      { id: 'eng-1', label: 'Reading Comprehension',       mcqCount: 35, cqCount: 10 },
      { id: 'eng-2', label: 'Vocabulary & Usage',          mcqCount: 50, cqCount: 8  },
      { id: 'eng-3', label: 'Grammar — Parts of Speech',   mcqCount: 45, cqCount: 9  },
      { id: 'eng-4', label: 'Grammar — Tense & Voice',     mcqCount: 48, cqCount: 10 },
      { id: 'eng-5', label: 'Grammar — Narration',         mcqCount: 40, cqCount: 8  },
      { id: 'eng-6', label: 'Writing — Paragraph & Essay', mcqCount: 15, cqCount: 14 },
      { id: 'eng-7', label: 'Writing — Letter & Email',    mcqCount: 12, cqCount: 12 },
    ],
  },
  math: {
    label: 'গণিত',
    chapters: [
      { id: 'mat-1', label: 'বাস্তব সংখ্যা',               mcqCount: 40, cqCount: 10 },
      { id: 'mat-2', label: 'সেট ও ফাংশন',                 mcqCount: 38, cqCount: 9  },
      { id: 'mat-3', label: 'বীজগাণিতিক রাশি',             mcqCount: 45, cqCount: 11 },
      { id: 'mat-4', label: 'সূচক ও লগারিদম',              mcqCount: 42, cqCount: 10 },
      { id: 'mat-5', label: 'সমান্তর ও গুণোত্তর ধারা',     mcqCount: 35, cqCount: 8  },
      { id: 'mat-6', label: 'ত্রিকোণমিতি',                 mcqCount: 48, cqCount: 12 },
      { id: 'mat-7', label: 'জ্যামিতি',                    mcqCount: 50, cqCount: 13 },
      { id: 'mat-8', label: 'পরিমিতি',                     mcqCount: 35, cqCount: 8  },
      { id: 'mat-9', label: 'পরিসংখ্যান',                  mcqCount: 30, cqCount: 7  },
    ],
  },
  ict: {
    label: 'তথ্য ও যোগাযোগ প্রযুক্তি',
    chapters: [
      { id: 'ict-1', label: 'তথ্য ও যোগাযোগ প্রযুক্তি',    mcqCount: 40, cqCount: 10 },
      { id: 'ict-2', label: 'কম্পিউটার',                    mcqCount: 45, cqCount: 11 },
      { id: 'ict-3', label: 'সংখ্যাপদ্ধতি ও ডিজিটাল ডিভাইস', mcqCount: 50, cqCount: 13 },
      { id: 'ict-4', label: 'ওয়েব ডিজাইন',                 mcqCount: 38, cqCount: 9  },
      { id: 'ict-5', label: 'প্রোগ্রামিং',                  mcqCount: 55, cqCount: 14 },
      { id: 'ict-6', label: 'ডেটাবেজ ম্যানেজমেন্ট',         mcqCount: 42, cqCount: 10 },
    ],
  },
  history: {
    label: 'ইতিহাস',
    chapters: [
      { id: 'his-1', label: 'প্রাচীন বাংলার ইতিহাস',       mcqCount: 35, cqCount: 9  },
      { id: 'his-2', label: 'মধ্যযুগের বাংলা',              mcqCount: 38, cqCount: 9  },
      { id: 'his-3', label: 'ব্রিটিশ শাসন',                 mcqCount: 42, cqCount: 10 },
      { id: 'his-4', label: 'পাকিস্তান আমল',                mcqCount: 40, cqCount: 10 },
      { id: 'his-5', label: 'মুক্তিযুদ্ধ ১৯৭১',             mcqCount: 50, cqCount: 13 },
    ],
  },
  civics: {
    label: 'পৌরনীতি',
    chapters: [
      { id: 'civ-1', label: 'পৌরনীতির ধারণা',              mcqCount: 30, cqCount: 8  },
      { id: 'civ-2', label: 'রাষ্ট্র ও সরকার',              mcqCount: 38, cqCount: 9  },
      { id: 'civ-3', label: 'নাগরিকতা',                     mcqCount: 35, cqCount: 8  },
      { id: 'civ-4', label: 'বাংলাদেশের সংবিধান',           mcqCount: 45, cqCount: 11 },
      { id: 'civ-5', label: 'নির্বাচন ব্যবস্থা',            mcqCount: 40, cqCount: 10 },
    ],
  },
  economics: {
    label: 'অর্থনীতি',
    chapters: [
      { id: 'eco-1', label: 'অর্থনীতির ধারণা',             mcqCount: 32, cqCount: 8  },
      { id: 'eco-2', label: 'চাহিদা ও যোগান',               mcqCount: 45, cqCount: 11 },
      { id: 'eco-3', label: 'উৎপাদন ও ব্যয়',               mcqCount: 40, cqCount: 10 },
      { id: 'eco-4', label: 'বাজার ব্যবস্থা',               mcqCount: 38, cqCount: 9  },
      { id: 'eco-5', label: 'জাতীয় আয়',                   mcqCount: 42, cqCount: 10 },
      { id: 'eco-6', label: 'মুদ্রা ও ব্যাংকিং',            mcqCount: 48, cqCount: 12 },
    ],
  },
  accounting: {
    label: 'হিসাববিজ্ঞান',
    chapters: [
      { id: 'acc-1', label: 'হিসাববিজ্ঞান পরিচিতি',        mcqCount: 30, cqCount: 8  },
      { id: 'acc-2', label: 'লেনদেন ও হিসাব',               mcqCount: 40, cqCount: 10 },
      { id: 'acc-3', label: 'জাবেদা',                       mcqCount: 45, cqCount: 11 },
      { id: 'acc-4', label: 'খতিয়ান',                      mcqCount: 42, cqCount: 10 },
      { id: 'acc-5', label: 'রেওয়ামিল',                    mcqCount: 38, cqCount: 9  },
      { id: 'acc-6', label: 'আর্থিক বিবরণী',                mcqCount: 50, cqCount: 13 },
    ],
  },
};

/* Board examination years & boards */
export const BOARDS = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'যশোর', 'কুমিল্লা', 'সিলেট', 'বরিশাল', 'দিনাজপুর', 'ময়মনসিংহ'];
export const YEARS  = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];
export const Q_TYPES = ['MCQ', 'CQ', 'দুটোই'];
