# 🍏 SlimMom - Health & Diet Tracker

SlimMom, kullanıcıların günlük kalori ihtiyaçlarını hesaplamalarına, tükettikleri besinleri takip etmelerine ve kan gruplarına göre tüketmemeleri gereken gıdaları öğrenmelerine yardımcı olan tam yığın (full-stack) bir web uygulamasıdır.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
[![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)](#)

---

## 🚀 Proje Hakkında

Bu proje, modern web teknolojileri kullanılarak kullanıcıların diyet süreçlerini kolaylaştırmak amacıyla geliştirilmiştir. Uygulama, kullanıcının fiziksel özelliklerine göre günlük alması gereken kalori miktarını hesaplar, tavsiye edilmeyen yiyecekleri belirler ve kişisel bir beslenme günlüğü sunar.

### 🌐 Canlı Demo & Dokümantasyon
- **Frontend (Canlı):** `[Vercel/Netlify Linkini Buraya Ekle]`
- **Backend API:** `[Render/Railway Linkini Buraya Ekle]`
- **API Dokümantasyonu (Swagger):** `[Backend-URL]/api-docs`

---

## 🛠️ Kullanılan Teknolojiler

**Frontend:**
- React (Vite)
- Redux Toolkit & Redux Persist
- Axios
- CSS Modules / Styled Components
- React Select & Lodash

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT) & bcrypt.js
- Swagger (swagger-ui-express & swagger-jsdoc)

---

## 👥 Ekip ve Görev Dağılımı

Bu proje, takım çalışması ve çevik (agile) prensipler doğrultusunda modüler olarak geliştirilmiştir. Ekip üyeleri ve projeye katkıları aşağıdaki gibidir:

### 👑 Faruk Aydın (Team Lead)
*Sorumluluk Alanı: Core & Auth (Bölüm 1) ve Layout, Sidebar & Products (Bölüm 4)*

**Frontend Geliştirmeleri:**
- Vite iskeleti, modern-normalize, Redux Store ve Axios ayarlarının yapılandırılması.
- LoginPage, RegistrationPage ve LoginForm tasarımları ve entegrasyonu.
- Form doğrulama işlemleri ve Redux Authentication Action/Operation'larının yazılması.
- Header, Logo, Navigation, UserInfo ve Loader (Spinner) bileşenlerinin oluşturulması.
- Dinamik RightSideBar verilerinin yönetimi ve responsive Navbar davranışlarının kurgulanması.

**Backend Geliştirmeleri:**
- Express & MongoDB bağlantılarının kurulması ve `.env` yapılandırması.
- Register, Login, Logout endpoint'lerinin oluşturulması (Görev 1-3).
- Auth Middleware ve Token Çifti (Access/Refresh) ile Session Modelinin kurulması (Görev 4, 12-13).
- Swagger temel kurulumu ve API dokümantasyon altyapısı (Görev 11).
- Query-string ile çalışan dinamik ürün arama endpoint'i (Görev 7).
- Ürünlerin veritabanına import edilmesi (Google Sheets/JSON aktarımı).

### 👩‍💻 Ebru Hızlı
*Sorumluluk Alanı: Calculator & Modal (Bölüm 2)*

**Frontend Geliştirmeleri:**
- MainPage ve CalculatorPage sayfalarının oluşturulması.
- DailyCaloriesForm ve CalculatorForm bileşenlerinin geliştirilmesi.
- Kalori formülü hesaplama mantığının entegrasyonu.
- Modal ve DailyCalorieIntake bileşenleri (Escape ve dışarı tıklama ile kapanma özellikleri).

**Backend Geliştirmeleri:**
- Public (herkese açık) kalori hesaplama ve yasaklı ürün getirme endpoint'i (Görev 5).
- Private (kullanıcıya özel) kalori/yasaklı ürün endpoint'i ve bu verilerin veritabanına kaydedilmesi (Görev 6).

### 👨‍💻 Ali Leo Olsen
*Sorumluluk Alanı: Diary / Günlük (Bölüm 3)*

**Frontend Geliştirmeleri:**
- DiaryPage sayfa düzeninin oluşturulması.
- DiaryDateCalendar (Takvim) bileşeninin geliştirilmesi.
- DiaryAddProductForm (Ürün ekleme formu) ve dinamik arama entegrasyonu.
- DiaryProductsList ve Item bileşenleri (Listeleme ve silme butonu aksiyonları).

**Backend Geliştirmeleri:**
- Belirli bir güne ürün ekleme endpoint'i (Görev 8).
- Belirli bir günden ürün silme endpoint'i (Görev 9).
- İlgili güne ait tüketim özetini (alınan kalori, kalan kalori vb.) getiren endpoint (Görev 10).

---

## ⚙️ Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### Ön Koşullar
- Node.js (v16 veya üzeri)
- MongoDB Atlas veya lokal MongoDB sunucusu

### Backend Kurulumu
1. Repoyu klonlayın ve backend klasörüne gidin:
   ```bash
   git clone [https://github.com/KULLANICI_ADIN/slimmoms.git](https://github.com/KULLANICI_ADIN/slimmoms.git)
   cd slimmoms/backend