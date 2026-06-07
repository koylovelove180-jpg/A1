import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  HeartPulse,
  Maximize2,
  Menu,
  Minimize2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Timer,
  Trophy,
  X,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const lessonData = [
  {
    id: 1,
    type: 'cover',
    title: 'ความรู้เบื้องต้นเกี่ยวกับการประกอบอาหาร',
    subtitle: 'เอกสารประกอบการเรียนเชิงวิชาการ / E-Learning Module (หลักสูตร 4 ชั่วโมง)',
    author: 'รวบรวมโดย: อ. กฤดิทร สุขกมล',
    course: 'รายวิชา: การประกอบอาหารเบื้องต้น',
    details: 'หมวดวิชาคหกรรมศาสตร์ แผนกอาหารและโภชนาการ\nเอกสารประกอบการสอนฉบับมาตรฐาน\nภาคเรียนที่ 1 ปีการศึกษา 2569',
    image: '[https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=80&fm=webp](https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=80&fm=webp)'
  },
  {
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
    type: 'quiz-interactive',
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

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const currentPage = lessonData[activeIndex];
  const progress = ((activeIndex + 1) / lessonData.length) * 100;
  const isQuizPage = currentPage.type === 'quiz-interactive';

  const goToPage = useCallback((index) => {
    setActiveIndex(Math.min(Math.max(index, 0), lessonData.length - 1));
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((index) => Math.min(index + 1, lessonData.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goPrevious = useCallback(() => {
    setActiveIndex((index) => Math.max(index - 1, 0));
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
      className="min-h-screen bg-slate-50 text-slate-900"
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
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelect={goToPage}
      />

      <main className="lg:pl-80">
        <div className="mx-auto min-h-screen max-w-7xl px-4 pb-28 pt-20 sm:px-6 lg:px-10 lg:pt-10">
          <div className="mb-6 hidden justify-end lg:flex">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              {isFullscreen ? 'ออกจากเต็มจอ' : 'เต็มจอ'}
            </button>
          </div>

          <ContentRenderer page={currentPage} />
        </div>
      </main>

      <BottomNavigation
        activeIndex={activeIndex}
        total={lessonData.length}
        onNext={goNext}
        onPrevious={goPrevious}
      />
    </div>
  );
}

function MobileHeader({ isFullscreen, onMenuClick, onFullscreenClick }) {
  return (
    <header className="fixed inset-x-0 top-1 z-40 flex items-center justify-between border-b border-white/70 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-xl lg:hidden">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-2xl bg-slate-100 p-3 text-slate-700 transition hover:bg-orange-100 hover:text-orange-600"
        aria-label="เปิดเมนูบทเรียน"
      >
        <Menu size={22} />
      </button>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">E-Learning</p>
        <p className="text-sm font-bold text-slate-900">การประกอบอาหาร</p>
      </div>
      <button
        type="button"
        onClick={onFullscreenClick}
        className="rounded-2xl bg-slate-100 p-3 text-slate-700 transition hover:bg-orange-100 hover:text-orange-600"
        aria-label="สลับโหมดเต็มจอ"
      >
        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>
    </header>
  );
}

function Sidebar({ activeIndex, isOpen, onClose, onSelect }) {
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
                <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-950">การประกอบอาหารเบื้องต้น</h1>
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
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(index)}
                  className={`group flex w-full gap-3 rounded-2xl p-3 text-left transition ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-glow'
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
                    <span className={`mt-1 block text-xs ${isActive ? 'text-orange-50' : 'text-slate-400'}`}>
                      {item.type}
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

function BottomNavigation({ activeIndex, total, onNext, onPrevious }) {
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === total - 1;

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
          disabled={isLast}
          className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

function ContentRenderer({ page }) {
  switch (page.type) {
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
      return <QuizPage page={page} />;
    default:
      return null;
  }
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

function QuizPage({ page }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const currentQuestion = page.questions[currentQuestionIndex];
  const percentage = Math.round((score / page.questions.length) * 100);
  const hasPassed = percentage >= 60;

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
        <PageEyebrow label="Post-Test" />
        <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-5xl">{page.title}</h2>
        <p className="mt-4 text-lg leading-8 text-slate-600">{page.subtitle}</p>

        {showResult ? (
          <div className="mt-10 rounded-[2rem] bg-gradient-to-br from-slate-950 to-slate-800 p-8 text-center text-white">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500 shadow-glow">
              <Trophy size={42} />
            </div>
            <p className="text-lg text-orange-100">คะแนนรวม</p>
            <h3 className="mt-2 text-6xl font-extrabold">
              {score}/{page.questions.length}
            </h3>
            <p className={`mt-5 text-2xl font-bold ${hasPassed ? 'text-emerald-300' : 'text-red-300'}`}>
              {hasPassed ? 'ผ่านเกณฑ์การประเมิน' : 'ยังไม่ผ่านเกณฑ์การประเมิน'}
            </p>
            <p className="mt-3 text-slate-300">เกณฑ์ผ่าน 60% คะแนนของคุณคือ {percentage}%</p>
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

            <h3 className="text-2xl font-bold leading-relaxed text-slate-950">{currentQuestion.q}</h3>
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

export default App;
