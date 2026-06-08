import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Flame,
  HelpCircle,
  HeartPulse,
  Lock,
  Maximize2,
  Menu,
  Minimize2,
  PlayCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Timer,
  Trophy,
  Unlock,
  X,
  XCircle,
  ZoomIn,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LocaleThemeControls from '../components/dashboard/LocaleThemeControls';
import PreTestQuizFlow from '../components/PreTestQuizFlow';
import AnnouncementContent from '../components/AnnouncementContent';
import { useAppLocale } from '../i18n/AppLocaleProvider';
import { lessonData } from '../data/lessonData';
import { useLessonControls } from '../hooks/useLessonControls';
import { isPageLocked } from '../utils/lessonAccess';
import { isAnnouncementEmpty } from '../utils/announcementHtml';
import { clearPretestMusicCompleted } from '../utils/pretestMusicStorage';

const _removedLessonData = [
  {
    id: 1,
    type: 'home',
    title: 'ระบบบทเรียนออนไลน์ การประกอบอาหารเบื้องต้น',
    subtitle: 'เริ่มจากแบบทดสอบก่อนเรียน จากนั้นรออาจารย์เปิดบทเรียนเพื่อเรียนเนื้อหาและทำแบบทดสอบหลังเรียน'
  },
  {
    id: 2,
    type: 'quiz-interactive',
    quizMode: 'pre',
    title: 'แบบทดสอบก่อนเรียน (Pre-Test)',
    subtitle: 'วัดระดับความรู้พื้นฐานก่อนเข้าสู่บทเรียน จำนวน 10 ข้อ',
    questions: [
      {
        q: "ก่อนเริ่มเรียน ข้อใดใกล้เคียงกับความหมายของ 'การประกอบอาหาร' มากที่สุด?",
        options: [
          'การจัดจานอาหารให้มีสีสันสวยงาม',
          'การนำวัตถุดิบมาผ่านกระบวนการเตรียมและปรุงให้เหมาะสมต่อการบริโภค',
          'การเก็บอาหารไว้ให้นานที่สุดโดยไม่ต้องใช้ความร้อน',
          'การเลือกซื้อวัตถุดิบจากตลาดเท่านั้น'
        ],
        answer: 1
      },
      {
        q: 'ข้อใดเป็นเหตุผลสำคัญที่ต้องทำอาหารให้สุกด้วยความร้อน?',
        options: [
          'เพื่อเพิ่มน้ำหนักของอาหาร',
          'เพื่อทำลายเชื้อโรคและทำให้อาหารปลอดภัยขึ้น',
          'เพื่อทำให้อาหารทุกชนิดมีรสหวาน',
          'เพื่อเปลี่ยนอาหารทุกชนิดให้เก็บได้นานตลอดไป'
        ],
        answer: 1
      },
      {
        q: 'ครัวร้อนมักรับผิดชอบงานประเภทใด?',
        options: [
          'สลัดและอาหารเย็นเท่านั้น',
          'ขนมอบและไอศกรีมเท่านั้น',
          'อาหารที่ต้องปรุงและเสิร์ฟร้อน เช่น อบ ทอด ปิ้ง ย่าง',
          'การจัดดอกไม้และตกแต่งโต๊ะอาหาร'
        ],
        answer: 2
      },
      {
        q: 'ครัวเย็นควรให้ความสำคัญกับเรื่องใดเป็นพิเศษ?',
        options: [
          'การควบคุมอุณหภูมิและสุขอนามัย',
          'การใช้ไฟแรงตลอดเวลา',
          'การอบด้วยเตาอุณหภูมิสูง',
          'การทอดอาหารในน้ำมันมาก'
        ],
        answer: 0
      },
      {
        q: 'ลักษณะเด่นของงานเบเกอรี่คือข้อใด?',
        options: [
          'ไม่ต้องชั่งตวงวัตถุดิบ',
          'ใช้การกะปริมาณด้วยสายตาเป็นหลัก',
          'ต้องใช้ความแม่นยำในการชั่งตวงและควบคุมขั้นตอน',
          'ต้องเสิร์ฟแบบเย็นเท่านั้น'
        ],
        answer: 2
      },
      {
        q: 'ข้อใดเป็นวิธีประกอบอาหารด้วยความร้อนแห้ง?',
        options: ['นึ่ง', 'ตุ๋น', 'ปิ้ง', 'ลวก'],
        answer: 2
      },
      {
        q: 'ข้อใดเป็นวิธีประกอบอาหารด้วยความร้อนชื้น?',
        options: ['อบ', 'ย่าง', 'นึ่ง', 'ทอด'],
        answer: 2
      },
      {
        q: 'การลวกผักที่ดีควรทำอย่างไรหลังนำผักขึ้นจากน้ำเดือด?',
        options: [
          'พักไว้กลางแดด',
          'แช่น้ำเย็นทันทีเพื่อหยุดความร้อน',
          'นำไปทอดต่อทันที',
          'ปิดฝาทิ้งไว้ในหม้อ'
        ],
        answer: 1
      },
      {
        q: 'ข้อใดเป็นข้อควรระวังของการทอดอาหาร?',
        options: [
          'อาหารอาจอมน้ำมันมากเกินไป',
          'อาหารจะไม่มีวันสุก',
          'อาหารจะเสียคุณค่าทางอาหารทั้งหมดทันที',
          'อาหารจะไม่มีสีและกลิ่น'
        ],
        answer: 0
      },
      {
        q: 'การนึ่งช่วยสงวนคุณค่าทางอาหารได้ดีเพราะเหตุใด?',
        options: [
          'อาหารสัมผัสน้ำโดยตรงตลอดเวลา',
          'สารอาหารไม่ละลายทิ้งไปกับน้ำต้มโดยตรง',
          'ต้องใช้น้ำมันจำนวนมาก',
          'ใช้ไฟแรงจนอาหารไหม้'
        ],
        answer: 1
      }
    ]
  },
  {
    id: 3,
    type: 'cover',
    title: 'ความรู้เบื้องต้นเกี่ยวกับการประกอบอาหาร',
    subtitle: 'เอกสารประกอบการเรียนเชิงวิชาการ / E-Learning Module (หลักสูตร 4 ชั่วโมง)',
    author: 'รวบรวมโดย: อ. กฤดิทร สุขกมล',
    course: 'รายวิชา: การประกอบอาหารเบื้องต้น',
    details: 'หมวดวิชาคหกรรมศาสตร์ แผนกอาหารและโภชนาการ\nเอกสารประกอบการสอนฉบับมาตรฐาน\nภาคเรียนที่ 1 ปีการศึกษา 2569',
    image: '[https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=80&fm=webp](https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=80&fm=webp)'
  },
  {
    id: 4,
    type: 'article',
    title: 'ความหมายของการประกอบอาหาร',
    image: '[https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80&fm=webp](https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80&fm=webp)',
    sections: [
      {
        subtitle: 'การประกอบอาหารคืออะไร?',
        content: 'การประกอบอาหาร หมายถึงกระบวนการนำวัตถุดิบและอาหารดิบมาทำให้สุกด้วยความร้อน เพื่อทำให้อาหารมีคุณสมบัติที่เหมาะสมและมีคุณค่าแก่การบริโภค กระบวนการนี้ไม่ได้มีแค่การตั้งไฟ แต่ครอบคลุมตั้งแต่กระบวนการคัดเลือกวัตถุดิบที่สดใหม่ การล้างทำความสะอาด การหั่นเตรียม (Mise en place) การปรุงด้วยเทคนิคความร้อนที่เหมาะสม การจัดเสิร์ฟที่สวยงาม และการเก็บรักษาอย่างถูกวิธี'
      },
      {
        subtitle: 'องค์ประกอบแห่งความสำเร็จ',
        content: 'การประกอบอาหารที่ดีจะต้องคำนึงถึง "ความสะอาดและถูกสุขลักษณะ" เป็นหัวใจสำคัญสูงสุด องค์ประกอบที่สำคัญเริ่มต้นตั้งแต่ตัว "ผู้ประกอบอาหาร" ที่ต้องมีสุขอนามัยที่ดี อุปกรณ์ที่ใช้ต้องสะอาด ตำรับอาหารต้องได้มาตรฐาน เครื่องปรุงต้องช่วยส่งเสริมคุณค่า รสชาติ กลิ่น และเนื้อสัมผัสที่ดี รวมไปถึงศิลปะและทักษะในการประกอบอาหาร รูปแบบการเสิร์ฟ ภาชนะบรรจุ และการคำนวณช่วงเวลาในการเสิร์ฟที่แม่นยำ'
      },
      {
        subtitle: 'ผลลัพธ์ที่ได้จากการประกอบอาหาร',
        content: 'อาหารที่ผ่านการปรุงสุกอย่างถูกต้องตามหลักวิชาการ เมื่อรับประทานเข้าไปแล้วจะมีประโยชน์สูงสุดต่อร่างกาย ทำให้ร่างกายเจริญเติบโต ซ่อมแซมส่วนที่สึกหรอ ส่งผลดีต่อทั้งสุขภาพกาย (ปราศจากโรคภัย) และสุขภาพใจ (ความสุขจากการได้รับประทานอาหารที่รสชาติดี)'
      }
    ]
  },
  {
    id: 5,
    type: 'cards-grid',
    title: 'ประโยชน์ 5 ประการของการประกอบอาหาร',
    subtitle: 'เจาะลึกเหตุผลสำคัญทางวิทยาศาสตร์และโภชนาการที่เราต้องนำอาหารมาปรุงสุก',
    items: [
      {
        icon: 'ShieldCheck',
        title: '1. ทำให้อาหารสุก สะอาด ปราศจากเชื้อโรค',
        desc: 'อาหารที่สุกด้วยการปรุงผ่านความร้อนสูงและเป็นเวลานานพอสมควร ทำให้แน่ใจได้ว่าแบคทีเรีย เชื้อโรค และพยาธิที่แฝงมากับวัตถุดิบถูกทำลายไปแล้ว จึงจะสะอาดเพียงพอสำหรับการรับประทานอย่างปลอดภัย ถูกสุขลักษณะ'
      },
      {
        icon: 'HeartPulse',
        title: '2. สงวนคุณค่าทางโภชนาการ',
        desc: 'แม้ความร้อนจะทำลายสารอาหารบางชนิด โดยเฉพาะ "วิตามินที่ละลายน้ำได้ เช่น วิตามิน B และ C" แต่การเลือกเทคนิคที่ถูกต้อง (เช่น การนึ่งแทนการต้มน้ำทิ้ง) จะช่วยสงวนคุณค่าทางอาหารไว้ให้ร่างกายดูดซึมได้มากที่สุด'
      },
      {
        icon: 'Sparkles',
        title: '3. ทำให้อาหารย่อยง่ายขึ้น',
        desc: 'ความร้อนทำให้โปรตีนในเนื้อสัตว์คลายตัวและแป้งสุกตัว เครื่องปรุงรสที่ใช้มีผลโดยตรงต่อความนุ่มของเนื้อสัมผัส ทำให้กระเพาะอาหารและลำไส้ของเราทำงานเบาลงและย่อยได้ง่ายขึ้น'
      },
      {
        icon: 'Flame',
        title: '4. รสชาติและกลิ่นดีขึ้น (เกิดปฏิกิริยาเคมี)',
        desc: 'ความร้อนก่อให้เกิดปฏิกิริยา Maillard (การเกิดสีน้ำตาลและกลิ่นหอม) ทำให้อาหารมีการเปลี่ยนแปลงทางเคมี ส่งผลให้รสชาติ กลิ่น และสีสันเปลี่ยนไปในทางที่ดีขึ้น กระตุ้นความอยากอาหาร'
      },
      {
        icon: 'Timer',
        title: '5. ป้องกันการเน่าเสีย เก็บได้นานขึ้น',
        desc: 'เอนไซม์และแบคทีเรียคือตัวการสำคัญที่ทำให้อาหารเน่าเสีย ความร้อนจากการประกอบอาหารจะช่วยยับยั้งและทำลายการทำงานของพวกมัน ช่วยยืดอายุการเก็บรักษาอาหารได้นานขึ้น'
      }
    ]
  },
  {
    id: 6,
    type: 'split-advanced',
    title: 'ครัวร้อน (Hot Kitchen)',
    highlight: 'ศูนย์กลางการปรุงสุกและการควบคุมอุณหภูมิความร้อน',
    content: 'ครัวร้อนเป็นหัวใจหลักของร้านอาหาร รับผิดชอบการปรุงอาหารที่เสิร์ฟในลักษณะอาหารร้อน เช่น อาหารอบ ทอด ปิ้ง ย่าง เมนูจานหลัก (Main Course) งานในส่วนนี้มีความกดดันสูง ต้องทำงานแข่งกับเวลา ดูแลการผลิตอาหารให้มีการสิ้นเปลืองและเน่าเสียน้อยที่สุด ควบคุมปริมาณ รสชาติ และอุณหภูมิให้ได้มาตรฐานขณะส่งถึงมือลูกค้า',
    departments: [
      'Soup & Stock (แผนกซุปและเคี่ยวน้ำสต็อกพื้นฐาน)',
      'Meat & Seafood (แผนกจัดการเนื้อสัตว์และอาหารทะเลสด)',
      'Vegetable & Starch (แผนกผักสดและคาร์โบไฮเดรต/มันฝรั่ง/พาสต้า)',
      'Sauce (แผนกปรุงซอสร้อนที่เป็นหัวใจของรสชาติ)',
      'Breakfast & Chip (แผนกอาหารเช้าและของทอด)'
    ],
    image: '[https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80&fm=webp](https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80&fm=webp)'
  },
  {
    id: 7,
    type: 'split-advanced',
    title: 'ครัวเย็น (Cold Kitchen / Garde Manger)',
    highlight: 'ศิลปะแห่งความสดใหม่ การจัดแต่ง และการควบคุมอุณหภูมิ',
    content: 'ครัวเย็นรับผิดชอบการปรุงและตกแต่งอาหารที่ไม่ต้องใช้ความร้อนในขั้นตอนสุดท้าย เช่น เมนูเรียกน้ำย่อย (Appetizer) อาหารประเภทเนื้อปรุงสุกเสิร์ฟเย็น (Cold Cut) เช่น แฮม ไส้กรอก ชีสบอร์ด การจัดเตรียมครัวเย็นต้องเน้นเรื่องสุขอนามัยขั้นสูงสุด และต้องควบคุมอุณหภูมิในห้องให้เย็นเสมอเพื่อป้องกันการเติบโตของแบคทีเรีย',
    departments: [
      'Butcher (แผนกชำแหละ ตัดแต่ง และเตรียมเนื้อสัตว์/ปลาสด)',
      'Sandwich & Canape (แผนกประกอบแซนด์วิชและคานาเป้ชิ้นพอดีคำ)',
      'Cold Sauce & Dressing (แผนกทำซอสเย็น มายองเนส และน้ำสลัด)',
      'Cold Cut (แผนกสไลด์เนื้อปรุงสุกเสิร์ฟเย็นและชีส)',
      'Various Salads & Vegetable (แผนกสลัดและจัดเตรียมผักสด)'
    ],
    image: '[https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80&fm=webp](https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80&fm=webp)'
  },
  {
    id: 8,
    type: 'split-advanced',
    title: 'ครัวเบเกอรี่ (Bakery & Pastry Kitchen)',
    highlight: 'ความแม่นยำ วิทยาศาสตร์ และศิลปะในการอบขนม',
    content: 'เป็นครัวที่รับผิดชอบในการทำขนมอบ ขนมปัง ขนมเค้ก คุกกี้ พาย งานด้านเบเกอรี่คือวิทยาศาสตร์ที่ต้องใช้การชั่งตวงที่แม่นยำ 100% (Scaling) หน้าที่ของบุคลากรนอกจากจะต้องผลิตแล้ว ยังต้องดูแลให้ขนมทุกอย่างมีปริมาตร เนื้อสัมผัส และอุณหภูมิที่เหมาะสม จัดตกแต่งสำหรับโอกาสพิเศษต่างๆ ให้สวยงาม',
    departments: [
      'Pastry (เพสตรี้/ขนมอบประดิษฐ์สไตล์ฝรั่งเศส ทาร์ต เอแคลร์)',
      'Bakery (เบเกอรี่/ขนมปัง ยีสต์ โดว์)',
      'Frozen Dessert (ของหวานแช่แข็ง/ไอศกรีม/ซอร์เบต์)',
      'Cold Dessert (ของหวานเสิร์ฟเย็น/พานาคอตต้า/มูส)'
    ],
    image: '[https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80&fm=webp](https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80&fm=webp)'
  },
  {
    id: 9,
    type: 'methods',
    title: 'เทคนิคการประกอบอาหารด้วยความร้อนแห้ง',
    subtitle: 'การปิ้ง ย่าง เผา อบ (Dry Heat Cooking Methods)',
    items: [
      {
        name: '1. การปิ้ง (Grill)',
        desc: 'การนำอาหารวางลงบนตะแกรงเหล็กเหนือเตาถ่านที่มีความร้อนไม่มาก ปิ้งกลับไปมาในเวลาสั้นๆ ใช้ได้ทั้งอาหารสดและแห้ง ช่วยให้อาหารมีกลิ่นควันอ่อนๆ',
        image: '[https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80&fm=webp](https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80&fm=webp)'
      },
      {
        name: '2. การย่าง (Roast / BBQ)',
        desc: 'คล้ายการปิ้งแต่ใช้เวลานานกว่าและชิ้นเนื้อใหญ่กว่า เพื่อให้อาหารสุกระอุทั่วถึงกัน มักทาน้ำมันหรือห่อใบตองเพื่อกันไหม้และเพิ่มกลิ่นหอม ย่างข้างละ 2 นาทีแล้วพลิก',
        image: '[https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80&fm=webp](https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80&fm=webp)'
      },
      {
        name: '3. การเผา (Burn)',
        desc: 'ทำให้อาหารสุกโดยใช้ไฟแรง วางของที่จะเผาลงบนไฟโดยตรงหรือสัมผัสความร้อนใกล้ชิด พลิกกลับไปมาให้สุกทั้งด้านนอกและด้านใน',
        image: '[https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80&fm=webp](https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80&fm=webp)'
      },
      {
        name: '4. การอบ (Bake / Roast in Oven)',
        desc: 'ใช้อากาศร้อนหมุนเวียนจากเตาอบ (เช่น อุณหภูมิ 190 องศาฯ สำหรับไก่อบ ใช้เวลา 20-30 นาที) ต้องอุ่นเตาอบให้ร้อนก่อนเสมอ (Pre-heat 15 นาที)',
        image: '[https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80&fm=webp](https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80&fm=webp)'
      }
    ],
    pros: 'ข้อดี: เป็นวิธีการประกอบอาหารที่ช่วย "สงวนคุณค่าทางโภชนาการ" ไว้ได้มาก ผิวอาหารจะหอม มีสีเข้มสวยงาม (Maillard reaction) และดูน่ารับประทาน',
    cons: 'ข้อเสีย: หากใช้เวลาในการทำนานเกินไป จะทำให้อาหารสูญเสียน้ำ แห้งกระด้างเกินไป ดูไม่น่ารับประทานและเสียรสชาติ'
  },
  {
    id: 10,
    type: 'methods',
    title: 'เทคนิคการประกอบอาหารด้วยของเหลว / ความร้อนชื้น',
    subtitle: 'การต้ม ลวก นึ่ง ตุ๋น (Moist Heat Cooking Methods)',
    items: [
      {
        name: '5. การต้ม (Boil)',
        desc: 'ใส่อาหารในน้ำเดือด (100°C) จนสุก เหมาะสำหรับเคี่ยวเนื้อสัตว์ให้เปื่อย (ข้อเสีย: วิตามินที่ละลายน้ำได้ เช่น B และ C มักละลายทิ้งไปกับน้ำต้ม)',
        image: '[https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80&fm=webp](https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80&fm=webp)'
      },
      {
        name: '6. การลวก (Blanch)',
        desc: 'ทำให้อาหารกึ่งสุกกึ่งดิบในน้ำเดือดจัดระยะสั้นๆ แล้ว "แช่น้ำเย็นทันที" เพื่อหยุดความร้อน ช่วยสงวนวิตามินและสีสันของผัก (ไม่เหมาะกับผักเนื้อแข็ง)',
        image: '[https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=600&q=80&fm=webp](https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=600&q=80&fm=webp)'
      },
      {
        name: '7. การนึ่ง (Steam)',
        desc: 'ใช้ไอน้ำจากน้ำเดือดในหม้อนึ่ง/ลังถึง วางอาหารชั้นบนปิดฝาให้สนิท สารอาหารไม่สัมผัสน้ำโดยตรง จึง "สงวนคุณค่าทางอาหารได้ดีกว่าการต้ม"',
        image: '[https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80&fm=webp](https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80&fm=webp)'
      },
      {
        name: '8. การตุ๋น (Simmer / Double Boiler)',
        desc: 'มักใช้หม้อ 2 ชั้นซ้อนกัน ใช้ไฟอ่อน อาหารจะสุกนุ่มละลายในปาก ปราศจากเชื้อโรค เหมาะสำหรับเด็กทารก ผู้ป่วย ผู้สูงอายุ (ข้อเสีย: ใช้เวลาปรุงนาน)',
        image: '[https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80&fm=webp](https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80&fm=webp)'
      }
    ]
  },
  {
    id: 11,
    type: 'methods',
    title: 'เทคนิคการประกอบอาหารด้วยน้ำมัน',
    subtitle: 'การผัด ทอด เจียว คั่ว รวน (Fat-Based Cooking)',
    items: [
      {
        name: '9. การผัด (Stir-Frying)',
        desc: 'ใช้น้ำมันเล็กน้อย ใช้ไฟแรง นำเนื้อหรือผักลงกระทะ ใช้ตะหลิวคนกลับไปมาในระยะเวลาสั้นๆ ปริมาณไขมันน้อยกว่าทอด (ข้อเสีย: ถ้านานไปสีจะไม่สวย)',
        image: '[https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80&fm=webp](https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80&fm=webp)'
      },
      {
        name: '10. การทอด (Frying)',
        desc: 'นำอาหารลงไปทอดในน้ำมันร้อนๆ ปริมาณมาก ควรทอดด้านหนึ่งให้สุกก่อนค่อยกลับด้าน อาหารมีกลิ่นหอม สีสวย กรอบ (ข้อเสีย: อมไขมันสูง)',
        image: '[https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?auto=format&fit=crop&w=600&q=80&fm=webp](https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?auto=format&fit=crop&w=600&q=80&fm=webp)'
      },
      {
        name: 'เพิ่มเติม 1: การเจียว',
        desc: 'ทำอาหารให้สุกในน้ำมันโดย "ใช้ไฟอ่อน" วัตถุดิบมักถูกซอยละเอียด ใส่ตอนน้ำมันยังไม่ร้อนจัด เจียวจนเหลืองกรอบ เช่น กระเทียมเจียว',
        image: '[https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=600&q=80&fm=webp](https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=600&q=80&fm=webp)'
      },
      {
        name: 'เพิ่มเติม 2: การคั่ว และ การรวน',
        desc: 'คั่ว: "ไม่ใช้น้ำมัน" ใส่ภาชนะแห้ง ใช้ไฟอ่อนคนตลอดจนหอมกรอบ | รวน: คล้ายคั่วแต่ "ใส่น้ำมันเล็กน้อย" ปรุงรสเค็ม เพื่อถนอมเนื้อสัตว์',
        image: '[https://images.unsplash.com/photo-1558222218-b7b54eede3f3?auto=format&fit=crop&w=600&q=80&fm=webp](https://images.unsplash.com/photo-1558222218-b7b54eede3f3?auto=format&fit=crop&w=600&q=80&fm=webp)'
      }
    ]
  },
  {
    id: 12,
    type: 'quiz-interactive',
    quizMode: 'post',
    title: 'แบบทดสอบประเมินความรู้ (Post-Test)',
    subtitle: 'ทดสอบความเข้าใจหลังการเรียนการสอน จำนวน 10 ข้อ',
    questions: [
      {
        q: "ข้อใดคือความหมายที่ครบถ้วนที่สุดของ 'การประกอบอาหาร'?",
        options: [
          "การใช้ความร้อนทำให้อาหารสุกและมีสีสันสวยงาม",
          "การทำอาหารดิบให้สุกด้วยความร้อน เพื่อความเหมาะสม ปลอดภัย และมีคุณค่า",
          "การหั่นเตรียมวัตถุดิบและจัดจานให้สวยงาม",
          "การถนอมอาหารเพื่อยืดอายุการเก็บรักษาให้นานที่สุด"
        ],
        answer: 1
      },
      {
        q: "วิตามินชนิดใดที่มักจะสูญเสียไปได้ง่ายที่สุดในขั้นตอนการประกอบอาหารแบบต้มทิ้ง?",
        options: ["วิตามิน A และ D", "วิตามิน E และ K", "วิตามิน B และ C", "แคลเซียม และ ธาตุเหล็ก"],
        answer: 2
      },
      {
        q: "ข้อใดคือลักษณะงานหลักที่อยู่ในความรับผิดชอบของ 'ครัวเย็น (Cold Kitchen)'?",
        options: [
          "การอบขนมปังและทำเค้ก",
          "การเคี่ยวน้ำสต็อกและทำน้ำซุป",
          "การทอดอาหารและทำอาหารเช้า",
          "การทำสลัด อาหารเรียกน้ำย่อย และหั่นเนื้อ Cold cut"
        ],
        answer: 3
      },
      {
        q: "แผนก 'Soup & Stock' มักจะถูกจัดให้อยู่ในครัวประเภทใด?",
        options: ["ครัวร้อน (Hot Kitchen)", "ครัวเย็น (Cold Kitchen)", "ครัวเบเกอรี่ (Bakery Kitchen)", "แผนกจัดเลี้ยง (Banquet)"],
        answer: 0
      },
      {
        q: "ข้อใดคือวิธีการประกอบอาหารด้วย 'ความร้อนแห้ง (Dry Heat)' ทั้งหมด?",
        options: ["ต้ม, ลวก, นึ่ง, ตุ๋น", "ปิ้ง, ย่าง, เผา, อบ", "ผัด, ทอด, เจียว, รวน", "อบ, นึ่ง, ผัด, ต้ม"],
        answer: 1
      },
      {
        q: "ตามทฤษฎีการประกอบอาหาร ก่อนนำไก่เข้า 'อบ (Bake)' ควรทำสิ่งใดก่อนเป็นอันดับแรก?",
        options: ["นำไก่ไปต้มให้สุกครึ่งหนึ่ง", "อุ่นเตาอบให้ร้อนล่วงหน้าประมาณ 15 นาที (Pre-heat)", "นำไก่ไปแช่แข็งเพื่อให้หนังกรอบ", "ราดน้ำเย็นจัดลงบนตัวไก่"],
        answer: 1
      },
      {
        q: "เทคนิคการประกอบอาหารแบบใด ที่ช่วยสงวนคุณค่าทางอาหารได้ดีที่สุดเพราะสารอาหารไม่ละลายน้ำ?",
        options: ["การต้ม (Boil)", "การนึ่ง (Steam)", "การตุ๋น (Simmer)", "การลวก (Blanch)"],
        answer: 1
      },
      {
        q: "การนำผักลงไปต้มในน้ำเดือดจัดระยะสั้นๆ แล้วรีบตักขึ้น 'แช่น้ำเย็นจัดทันที' คือเทคนิคใด?",
        options: ["การต้ม (Boil)", "การนึ่ง (Steam)", "การลวก (Blanch)", "การตุ๋น (Simmer)"],
        answer: 2
      },
      {
        q: "ข้อใดคือความแตกต่างระหว่าง 'การคั่ว' และ 'การรวน'?",
        options: [
          "การคั่วใช้ไฟแรงมาก ส่วนการรวนใช้ไฟอ่อน",
          "การคั่วทำในเตาอบ ส่วนการรวนทำในกระทะ",
          "การคั่วไม่ใช้น้ำมันเลย ส่วนการรวนจะใส่น้ำมันเล็กน้อยและปรุงรสเค็ม",
          "ไม่มีความแตกต่าง เป็นคำเรียกที่ใช้แทนกันได้"
        ],
        answer: 2
      },
      {
        q: "การประกอบอาหารวิธีใด ที่เหมาะสำหรับเด็กทารกและผู้ป่วย เพราะอาหารสุกนุ่มเปื่อยที่สุด?",
        options: ["การย่าง (Roast)", "การตุ๋น (Simmer ด้วยหม้อ 2 ชั้น)", "การผัด (Stir-Frying)", "การเผา (Burn)"],
        answer: 1
      }
    ]
  }
];

const iconMap = {
  ShieldCheck,
  HeartPulse,
  Sparkles,
  Flame,
  Timer,
};

function imageUrl(value) {
  const match = value?.match(/\((https?:\/\/[^)]+)\)/);
  return match?.[1] ?? value;
}

function quizImageSrc(value, size = 'thumb') {
  let src = imageUrl(value);
  if (src.startsWith('/')) {
    src = `${import.meta.env.BASE_URL}${src.slice(1)}`;
  }
  if (size === 'full' && src.includes('images.unsplash.com')) {
    return src.replace(/w=\d+/, 'w=1200').replace(/q=\d+/, 'q=80');
  }
  return src;
}

function StudentApp() {
  const { t } = useAppLocale();
  const { settings, loading: settingsLoading } = useLessonControls();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [lockNotice, setLockNotice] = useState('');
  const currentPage = lessonData[activeIndex];
  const progress = ((activeIndex + 1) / lessonData.length) * 100;
  const isQuizPage = currentPage.type === 'quiz-interactive';
  const preTestIndex = lessonData.findIndex((page) => page.quizMode === 'pre');
  const preTestPageId = preTestIndex >= 0 ? lessonData[preTestIndex].id : null;

  useEffect(() => {
    if (preTestPageId == null) return undefined;

    if (activeIndex !== preTestIndex) {
      clearPretestMusicCompleted(preTestPageId);
    }

    return undefined;
  }, [activeIndex, preTestIndex, preTestPageId]);

  const goToPage = useCallback((index) => {
    const nextIndex = Math.min(Math.max(index, 0), lessonData.length - 1);
    const nextPage = lessonData[nextIndex];

    if (isPageLocked(nextPage, settings)) {
      setLockNotice('บทเรียนส่วนนี้ยังล็อกอยู่ กรุณาทำ Pre-Test และรออาจารย์เปิดบทเรียน');
      setIsSidebarOpen(false);
      return;
    }

    setLockNotice('');
    setActiveIndex(nextIndex);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [settings]);

  const goNext = useCallback(() => {
    setActiveIndex((index) => {
      const nextIndex = Math.min(index + 1, lessonData.length - 1);
      const nextPage = lessonData[nextIndex];

      if (isPageLocked(nextPage, settings)) {
        setLockNotice('รออาจารย์ผู้สอนเปิดบทเรียนก่อน จึงจะไปหน้าถัดไปได้');
        return index;
      }

      setLockNotice('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return nextIndex;
    });
  }, [settings]);

  const goPrevious = useCallback(() => {
    setActiveIndex((index) => Math.max(index - 1, 0));
    setLockNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.();
      return;
    }

    await document.exitFullscreen?.();
  };

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => {
    if (isPageLocked(currentPage, settings)) {
      setActiveIndex(0);
    }
  }, [settings, currentPage]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (isQuizPage) return;

      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault();
        goNext();
      }

      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        goPrevious();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrevious, isQuizPage]);

  const handleTouchStart = (event) => {
    if (isQuizPage) return;
    setTouchStartX(event.changedTouches[0].clientX);
  };

  const handleTouchEnd = (event) => {
    if (isQuizPage || touchStartX === null) return;

    const deltaX = touchStartX - event.changedTouches[0].clientX;
    if (Math.abs(deltaX) > 70) {
      if (deltaX > 0) goNext();
      if (deltaX < 0) goPrevious();
    }

    setTouchStartX(null);
  };

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-slate-200">
        <div
          className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <MobileHeader
        isFullscreen={isFullscreen}
        onMenuClick={() => setIsSidebarOpen(true)}
        onFullscreenClick={toggleFullscreen}
      />

      <Sidebar
        activeIndex={activeIndex}
        courseTitle={settings.courseTitle}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelect={goToPage}
        settings={settings}
      />

      <main className="lg:pl-80">
        <div className="mx-auto min-h-screen max-w-7xl px-4 pb-28 pt-20 sm:px-6 lg:px-10 lg:pt-10">
          <div className="mb-6 hidden items-center justify-end gap-3 lg:flex">
            <LocaleThemeControls />
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              {isFullscreen ? t('student.header.exitFullscreen') : t('student.header.fullscreenBtn')}
            </button>
          </div>

          {lockNotice && (
            <div className="mb-6 rounded-3xl border border-orange-200 bg-orange-50 p-4 text-sm font-semibold text-orange-800 shadow-sm">
              {lockNotice}
            </div>
          )}

          <ContentRenderer
            onSelectPage={goToPage}
            page={currentPage}
            preTestIndex={preTestIndex}
            settings={settings}
            settingsLoading={settingsLoading}
          />
        </div>
      </main>

      <BottomNavigation
        activeIndex={activeIndex}
        settings={settings}
        total={lessonData.length}
        onNext={goNext}
        onPrevious={goPrevious}
      />
    </div>
  );
}

function MobileHeader({ isFullscreen, onMenuClick, onFullscreenClick }) {
  const { t } = useAppLocale();

  return (
    <header className="fixed inset-x-0 top-1 z-40 flex items-center justify-between gap-2 border-b border-white/70 bg-white/85 px-3 py-3 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 lg:hidden">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-2xl bg-slate-100 p-3 text-slate-700 transition hover:bg-orange-100 hover:text-orange-600 dark:bg-slate-800 dark:text-slate-200"
        aria-label={t('student.header.menu')}
      >
        <Menu size={22} />
      </button>
      <div className="min-w-0 flex-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">E-Learning</p>
        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{t('student.header.brand')}</p>
      </div>
      <div className="flex items-center gap-1">
        <LocaleThemeControls compact />
        <button
          type="button"
          onClick={onFullscreenClick}
          className="rounded-2xl bg-slate-100 p-3 text-slate-700 transition hover:bg-orange-100 hover:text-orange-600 dark:bg-slate-800 dark:text-slate-200"
          aria-label={isFullscreen ? t('student.header.exitFullscreen') : t('student.header.fullscreen')}
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>
    </header>
  );
}

function Sidebar({ activeIndex, courseTitle, isOpen, onClose, onSelect, settings }) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 transform border-r border-white/80 bg-white/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-100 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 inline-flex rounded-2xl bg-orange-100 p-3 text-orange-600">
                  <BookOpen size={28} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">Course Module</p>
                <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-950">{courseTitle}</h1>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-slate-100 p-2 text-slate-500 lg:hidden"
                aria-label="ปิดเมนูบทเรียน"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <nav className="custom-scrollbar flex-1 space-y-2 overflow-y-auto p-4">
            {lessonData.map((item, index) => {
              const isActive = index === activeIndex;
              const locked = isPageLocked(item, settings);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(index)}
                  className={`group flex w-full gap-3 rounded-2xl p-3 text-left transition ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-glow'
                      : locked
                        ? 'bg-slate-100 text-slate-400 hover:bg-slate-100'
                        : 'bg-slate-50 text-slate-700 hover:bg-orange-50 hover:text-orange-700'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-orange-500 shadow-sm'
                    }`}
                  >
                    {item.id}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold leading-snug">{item.title}</span>
                    <span className={`mt-1 flex items-center gap-1 text-xs ${isActive ? 'text-orange-50' : 'text-slate-400'}`}>
                      {locked ? <Lock size={12} /> : null}
                      {locked ? 'ล็อกไว้รออาจารย์เปิด' : item.type}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {isOpen && (
        <button
          type="button"
          aria-label="ปิดเมนู"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  );
}

function BottomNavigation({ activeIndex, settings, total, onNext, onPrevious }) {
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === total - 1;
  const nextPage = lessonData[Math.min(activeIndex + 1, total - 1)];
  const isNextLocked = !isLast && isPageLocked(nextPage, settings);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/80 bg-white/90 px-4 py-3 shadow-[0_-16px_40px_-28px_rgba(15,23,42,0.5)] backdrop-blur-xl lg:left-80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirst}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="min-w-28 rounded-2xl bg-slate-900 px-4 py-2 text-center text-white shadow-xl">
          <p className="text-xs text-slate-300">หน้า</p>
          <p className="text-sm font-bold">
            {activeIndex + 1} / {total}
          </p>
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={isLast || isNextLocked}
          className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
        >
          {isNextLocked ? (
            <>
              <Lock size={18} />
              <span className="hidden sm:inline">รออาจารย์เปิด</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ContentRenderer({ onSelectPage, page, preTestIndex, settings, settingsLoading }) {
  if (settingsLoading) {
    return (
      <section className="mx-auto max-w-3xl rounded-[2rem] bg-white p-10 text-center shadow-xl">
        <p className="text-lg font-semibold text-slate-600">กำลังโหลดการตั้งค่าห้องเรียน...</p>
      </section>
    );
  }

  if (isPageLocked(page, settings)) {
    return <LockedContentGate onGoHome={() => onSelectPage(0)} settings={settings} />;
  }

  switch (page.type) {
    case 'home':
      return (
        <HomePage
          onStartPreTest={() => onSelectPage(preTestIndex)}
          settings={settings}
        />
      );
    case 'cover':
      return <CoverPage page={page} />;
    case 'article':
      return <ArticlePage page={page} />;
    case 'cards-grid':
      return <CardsGridPage page={page} />;
    case 'split-advanced':
      return <SplitAdvancedPage page={page} />;
    case 'methods':
      return <MethodsPage page={page} />;
    case 'quiz-interactive':
      if (page.quizMode === 'pre') {
        return <PreTestQuizFlow page={page} settings={settings} QuizPage={QuizPage} />;
      }
      return <QuizPage page={page} />;
    default:
      return null;
  }
}

function HomePage({ onStartPreTest, settings }) {
  const { t } = useAppLocale();
  const contentUnlocked = settings.contentUnlocked;
  const studentSteps = [
    {
      icon: BookOpen,
      title: t('student.home.step1.title'),
      desc: t('student.home.step1.desc'),
    },
    {
      icon: ClipboardCheck,
      title: t('student.home.step2.title'),
      desc: settings.preTestRequired
        ? t('student.home.step2.descRequired')
        : t('student.home.step2.descOptional'),
    },
    {
      icon: Unlock,
      title: t('student.home.step3.title'),
      desc: t('student.home.step3.desc'),
    },
  ];

  const faqItems = [
    { q: t('student.faq.q1'), a: t('student.faq.a1') },
    { q: t('student.faq.q2'), a: t('student.faq.a2') },
    {
      q: t('student.faq.q3'),
      a: settings.preTestRequired ? t('student.faq.a3Required') : t('student.faq.a3Optional'),
    },
    {
      q: t('student.faq.q4'),
      a: settings.postTestUnlocked ? t('student.faq.a4Open') : t('student.faq.a4Closed'),
    },
  ];

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 p-6 text-white shadow-2xl sm:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <PageEyebrow label={t('student.home.eyebrow')} light />
            <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              {settings.courseTitle}
            </h2>
            <p className="mt-3 text-lg text-orange-100">{settings.classroomName}</p>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-orange-50">
              {t('student.home.heroDesc')}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onStartPreTest}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-600"
              >
                <PlayCircle size={22} />
                {t('student.home.startPretest')}
              </button>
              <Link
                to="/manual/student"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-4 font-bold text-white transition hover:bg-white/20"
                title={t('student.home.manualTitle')}
              >
                <HelpCircle size={22} />
                {t('student.home.manual')}
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
            <div className={`mb-5 inline-flex rounded-2xl p-4 ${contentUnlocked ? 'bg-emerald-400/20 text-emerald-200' : 'bg-white/10 text-orange-200'}`}>
              {contentUnlocked ? <Unlock size={34} /> : <Lock size={34} />}
            </div>
            <h3 className="text-2xl font-extrabold">{contentUnlocked ? t('student.home.unlockedTitle') : t('student.home.lockedTitle')}</h3>
            <p className="mt-3 leading-8 text-slate-200">
              {contentUnlocked
                ? settings.postTestUnlocked ? t('student.home.unlockedWithPost') : t('student.home.unlockedNoPost')
                : t('student.home.lockedDesc')}
            </p>
          </div>
        </div>
      </div>

      {!isAnnouncementEmpty(settings.announcement) ? (
        <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6 text-orange-950 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">{t('student.home.announcement')}</p>
          <AnnouncementContent
            content={settings.announcement}
            htmlEnabled={settings.announcementHtmlEnabled === true}
          />
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-3">
        {studentSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article key={step.title} className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/70">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <Icon size={24} />
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-500">{t('student.home.stepLabel', { n: index + 1 })}</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-950">{step.title}</h3>
              <p className="mt-3 leading-8 text-slate-600">{step.desc}</p>
            </article>
          );
        })}
      </div>

      <div className="rounded-3xl border border-orange-100 bg-orange-50 p-5 text-orange-900">
        <p className="font-bold">{t('student.home.note.title')}</p>
        <p className="mt-2 leading-8">
          {t('student.home.note.body')}
        </p>
      </div>

      <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
            <HelpCircle size={26} />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">{t('student.faq.eyebrow')}</p>
            <h3 className="text-2xl font-extrabold text-slate-950">{t('student.faq.title')}</h3>
          </div>
        </div>
        <div className="space-y-3">
          {faqItems.map((item) => (
            <article key={item.q} className="rounded-2xl bg-slate-50 p-4">
              <h4 className="font-bold text-slate-950">{item.q}</h4>
              <p className="mt-2 leading-7 text-slate-600">{item.a}</p>
            </article>
          ))}
        </div>
        <Link
          to="/manual/student/announcements-faq"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
        >
          <HelpCircle size={18} />
          {t('student.faq.openManual')}
        </Link>
      </section>
    </section>
  );
}

function LockedContentGate({ onGoHome, settings }) {
  const { t } = useAppLocale();

  return (
    <section className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 text-center shadow-2xl shadow-slate-200/80 dark:bg-slate-900 dark:shadow-none">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-500 dark:bg-slate-800">
        <Lock size={40} />
      </div>
      <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white">{t('student.locked.title')}</h2>
      <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
        {settings?.preTestRequired !== false
          ? t('student.locked.bodyRequired')
          : t('student.locked.bodyOptional')}
      </p>
      <button
        type="button"
        onClick={onGoHome}
        className="mt-7 rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
      >
        {t('student.locked.backHome')}
      </button>
    </section>
  );
}

function CoverPage({ page }) {
  return (
    <section className="relative isolate min-h-[calc(100vh-8rem)] overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl">
      <img
        src={imageUrl(page.image)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/70 to-orange-950/55" />
      <div className="relative z-10 flex min-h-[calc(100vh-8rem)] items-end p-6 sm:p-10 lg:p-14">
        <div className="max-w-4xl text-white">
          <span className="mb-5 inline-flex rounded-full bg-orange-500/90 px-4 py-2 text-sm font-bold shadow-xl shadow-orange-950/30">
            หลักสูตร 4 ชั่วโมง
          </span>
          <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-7xl">{page.title}</h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-orange-50 sm:text-2xl">{page.subtitle}</p>
          <div className="mt-8 grid gap-4 rounded-3xl border border-white/15 bg-white/10 p-5 text-sm leading-relaxed backdrop-blur-md sm:grid-cols-2 sm:text-base">
            <p className="font-semibold">{page.author}</p>
            <p className="font-semibold">{page.course}</p>
            <p className="whitespace-pre-line text-white/85 sm:col-span-2">{page.details}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArticlePage({ page }) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8 lg:p-10">
        <PageEyebrow label="บทเรียน" />
        <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">{page.title}</h2>
        <div className="mt-8 space-y-6">
          {page.sections.map((section) => (
            <article key={section.subtitle} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <h3 className="text-xl font-bold text-orange-600">{section.subtitle}</h3>
              <p className="mt-3 text-base leading-8 text-slate-700">{section.content}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="lg:sticky lg:top-8 lg:self-start">
        <div className="overflow-hidden rounded-3xl bg-white p-3 shadow-xl shadow-slate-200/70">
          <img
            src={imageUrl(page.image)}
            alt={page.title}
            className="h-[360px] w-full rounded-[1.35rem] object-cover lg:h-[620px]"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}

function CardsGridPage({ page }) {
  return (
    <section>
      <div className="mx-auto max-w-4xl text-center">
        <PageEyebrow label="ประโยชน์สำคัญ" />
        <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-5xl">{page.title}</h2>
        <p className="mt-4 text-lg leading-8 text-slate-600">{page.subtitle}</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {page.items.map((item) => {
          const Icon = iconMap[item.icon] ?? Sparkles;
          return (
            <article key={item.title} className="group rounded-3xl border border-white bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-5 inline-flex rounded-2xl bg-orange-100 p-4 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                <Icon size={30} />
              </div>
              <h3 className="text-xl font-bold leading-snug text-slate-950">{item.title}</h3>
              <p className="mt-4 leading-8 text-slate-600">{item.desc}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SplitAdvancedPage({ page }) {
  return (
    <section className="grid items-center gap-8 lg:grid-cols-2">
      <div className="order-2 lg:order-1">
        <PageEyebrow label="ประเภทของครัว" />
        <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-5xl">{page.title}</h2>
        <div className="mt-6 rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-500 to-amber-500 p-6 text-white shadow-glow">
          <p className="text-xl font-bold leading-relaxed">{page.highlight}</p>
        </div>
        <p className="mt-6 text-lg leading-9 text-slate-700">{page.content}</p>
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/70">
          <h3 className="text-xl font-bold text-slate-950">แผนกที่เกี่ยวข้อง</h3>
          <ul className="mt-5 space-y-3">
            {page.departments.map((department) => (
              <li key={department} className="flex gap-3 rounded-2xl bg-slate-50 p-3 text-slate-700">
                <CheckCircle2 className="mt-1 shrink-0 text-orange-500" size={20} />
                <span className="leading-7">{department}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-2xl shadow-slate-200/80">
          <img
            src={imageUrl(page.image)}
            alt={page.title}
            className="h-[340px] w-full rounded-[1.5rem] object-cover sm:h-[460px] lg:h-[680px]"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}

function MethodsPage({ page }) {
  return (
    <section>
      <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-2xl sm:p-10">
        <PageEyebrow label="เทคนิคการปรุง" light />
        <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">{page.title}</h2>
        <p className="mt-4 text-lg leading-8 text-orange-100">{page.subtitle}</p>
      </div>

      <div className="mt-8 grid gap-6">
        {page.items.map((item, index) => (
          <article key={item.name} className="grid overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70 md:grid-cols-[0.9fr_1.1fr]">
            <img
              src={imageUrl(item.image)}
              alt={item.name}
              className="h-64 w-full object-cover md:h-full"
              loading="lazy"
              decoding="async"
            />
            <div className="p-6 sm:p-8">
              <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-600">
                Method {index + 1}
              </span>
              <h3 className="mt-4 text-2xl font-extrabold text-slate-950">{item.name}</h3>
              <p className="mt-4 text-lg leading-9 text-slate-700">{item.desc}</p>
            </div>
          </article>
        ))}
      </div>

      {(page.pros || page.cons) && (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {page.pros && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 shadow-sm">
              <div className="mb-3 inline-flex rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-lg font-semibold leading-8">{page.pros}</p>
            </div>
          )}
          {page.cons && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-900 shadow-sm">
              <div className="mb-3 inline-flex rounded-2xl bg-red-100 p-3 text-red-600">
                <XCircle size={24} />
              </div>
              <p className="text-lg font-semibold leading-8">{page.cons}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function QuizImageLightbox({ question, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const src = quizImageSrc(question.image, 'full');
  const isSvg = src.endsWith('.svg');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={question.imageAlt || 'ดูรูปประกอบคำถาม'}
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-slate-900/80 p-2.5 text-white transition hover:bg-slate-900"
          aria-label="ปิดรูปใหญ่"
        >
          <X size={22} />
        </button>

        <div className={`flex min-h-[40vh] items-center justify-center ${isSvg ? 'bg-orange-50/80 p-6' : 'bg-slate-100 p-4 sm:p-6'}`}>
          <img
            src={src}
            alt={question.imageAlt || ''}
            className="max-h-[70vh] max-w-full object-contain"
            decoding="async"
          />
        </div>

        <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
          {question.imageCaption && (
            <p className="text-base font-bold text-slate-950">{question.imageCaption}</p>
          )}
          {question.imageAlt && (
            <p className="mt-2 text-sm leading-7 text-slate-600">{question.imageAlt}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function QuizQuestionMedia({ question }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const thumbSrc = quizImageSrc(question.image, 'thumb');
  const isSvg = thumbSrc.endsWith('.svg');

  useEffect(() => {
    setIsLightboxOpen(false);
    setImageError(false);
  }, [question.image, question.q]);

  return (
    <>
      <figure className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-md">
        <button
          type="button"
          onClick={() => !imageError && setIsLightboxOpen(true)}
          disabled={imageError}
          className="group relative block w-full cursor-zoom-in text-left disabled:cursor-not-allowed"
          aria-label={question.imageAlt ? `ดูรูปใหญ่: ${question.imageAlt}` : 'ดูรูปประกอบขนาดใหญ่'}
        >
          {imageError ? (
            <div className="flex h-56 flex-col items-center justify-center gap-2 bg-slate-100 px-4 text-center sm:h-72 md:h-80">
              <p className="font-semibold text-slate-600">โหลดรูปไม่สำเร็จ</p>
              <p className="text-sm text-slate-500">กรุณารีเฟรชหน้า หรือทำข้อสอบต่อจากคำถามและคำใบ้</p>
            </div>
          ) : (
            <>
              <img
                src={thumbSrc}
                alt={question.imageAlt || ''}
                className={`w-full object-contain ${
                  isSvg
                    ? 'h-56 bg-orange-50/60 p-4 sm:h-72 md:h-80'
                    : 'h-56 bg-slate-100 sm:h-72 md:h-80'
                }`}
                loading="eager"
                decoding="async"
                onError={() => setImageError(true)}
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-slate-950/75 to-transparent px-4 py-4 text-sm font-bold text-white opacity-95 transition group-hover:from-slate-950/90">
                <ZoomIn size={18} />
                แตะเพื่อดูรูปใหญ่
              </span>
            </>
          )}
        </button>
        {question.imageCaption && (
          <figcaption className="border-t border-slate-100 px-4 py-3 text-sm leading-7 text-slate-600">
            {question.imageCaption}
          </figcaption>
        )}
      </figure>

      <QuizImageLightbox
        question={question}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}

function QuizPage({ page }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const currentQuestion = page.questions[currentQuestionIndex];
  const percentage = Math.round((score / page.questions.length) * 100);
  const hasPassed = percentage >= 60;
  const isPreTest = page.quizMode === 'pre';
  const readiness =
    percentage >= 80
      ? 'มีพื้นฐานแข็งแรง พร้อมต่อยอดบทเรียน'
      : percentage >= 60
        ? 'เข้าใจภาพรวมดี ควรเรียนเพื่อเติมรายละเอียด'
        : percentage >= 40
          ? 'มีพื้นฐานบางส่วน ควรทบทวนตามบทเรียนอย่างครบถ้วน'
          : 'ควรเริ่มเรียนจากพื้นฐาน เพื่อสร้างความเข้าใจทีละขั้น';

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  }, [page.id]);

  const handleOptionClick = (optionIndex) => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);
    if (optionIndex === currentQuestion.answer) {
      setScore((value) => value + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === page.questions.length - 1) {
      setShowResult(true);
      return;
    }

    setCurrentQuestionIndex((index) => index + 1);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  return (
    <section className="mx-auto max-w-4xl">
      <div className="rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-200/80 sm:p-8 lg:p-10">
        <PageEyebrow label={isPreTest ? 'Pre-Test' : 'Post-Test'} />
        <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-5xl">{page.title}</h2>
        <p className="mt-4 text-lg leading-8 text-slate-600">{page.subtitle}</p>

        {isPreTest && !showResult && (
          <p className="mt-5 rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 text-base leading-8 text-orange-900">
            แบบทดสอบนี้ออกแบบให้เข้าใจง่าย — ดูรูปประกอบแล้วเลือกคำตอบที่ดูเหมาะที่สุด ไม่ต้องกังวลหากยังไม่แน่ใจ
          </p>
        )}

        {showResult ? (
          <div className="mt-10 rounded-[2rem] bg-gradient-to-br from-slate-950 to-slate-800 p-8 text-center text-white">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500 shadow-glow">
              <Trophy size={42} />
            </div>
            <p className="text-lg text-orange-100">คะแนนรวม</p>
            <h3 className="mt-2 text-6xl font-extrabold">
              {score}/{page.questions.length}
            </h3>
            {isPreTest ? (
              <>
                <p className="mt-5 text-2xl font-bold text-orange-200">
                  ระดับความรู้ก่อนเรียนของคุณคือ {percentage}%
                </p>
                <p className="mt-3 text-slate-300">{readiness}</p>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  ไม่ต้องกังวลกับคะแนน — เป้าหมายคือวัดจุดเริ่มต้นก่อนเข้าบทเรียน
                </p>
              </>
            ) : (
              <>
                <p className={`mt-5 text-2xl font-bold ${hasPassed ? 'text-emerald-300' : 'text-red-300'}`}>
                  {hasPassed ? 'ผ่านเกณฑ์การประเมิน' : 'ยังไม่ผ่านเกณฑ์การประเมิน'}
                </p>
                <p className="mt-3 text-slate-300">เกณฑ์ผ่าน 60% คะแนนของคุณคือ {percentage}%</p>
              </>
            )}
            <button
              type="button"
              onClick={restartQuiz}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-600"
            >
              <RotateCcw size={20} />
              Restart Quiz
            </button>
          </div>
        ) : (
          <div className="mt-10">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-600">
                คำถาม {currentQuestionIndex + 1} / {page.questions.length}
              </span>
              <span className="text-sm font-semibold text-slate-500">คะแนนปัจจุบัน {score}</span>
            </div>

            <div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / page.questions.length) * 100}%` }}
              />
            </div>

            {currentQuestion.image && (
              <QuizQuestionMedia question={currentQuestion} />
            )}

            <h3 className={`text-2xl font-bold leading-relaxed text-slate-950 ${currentQuestion.image ? 'mt-6' : ''}`}>
              {currentQuestion.q}
            </h3>

            {currentQuestion.hint && (
              <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-base leading-8 text-slate-600">
                {currentQuestion.hint}
              </p>
            )}

            <div className="mt-6 space-y-3">
              {currentQuestion.options.map((option, optionIndex) => {
                const isCorrect = optionIndex === currentQuestion.answer;
                const isSelected = optionIndex === selectedOption;
                const answeredClass = isAnswered
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                    : isSelected
                      ? 'border-red-300 bg-red-50 text-red-900'
                      : 'border-slate-100 bg-slate-50 text-slate-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50';

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(optionIndex)}
                    className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left font-semibold leading-7 transition ${answeredClass}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm text-white">
                      {optionIndex + 1}
                    </span>
                    <span className="flex-1">{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="shrink-0 text-emerald-600" size={22} />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="shrink-0 text-red-600" size={22} />}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 sm:w-auto"
              >
                {currentQuestionIndex === page.questions.length - 1 ? 'ดูผลคะแนน' : 'Next Question'}
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function PageEyebrow({ label, light = false }) {
  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] ${
        light ? 'bg-white/10 text-orange-200' : 'bg-orange-100 text-orange-600'
      }`}
    >
      {label}
    </span>
  );
}

export default StudentApp;
