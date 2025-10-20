# Plan de Îmbunătățiri Vizuale și Accesibilitate - Platforma Mateos

## 📋 Prezentare Generală

Acest document conține toate îmbunătățirile vizuale și de accesibilitate care vor fi implementate în platforma Mateos folosind componente premium shadcn/ui. Documentul este destinat echipei de backend pentru a înțelege schimbările și impactul acestora.

---

## 🎨 Principii de Design Premium

### 1. **Consistență Vizuală**
- Utilizare uniformă a componentelor shadcn/ui în toată aplicația
- Spațiere și padding consistente (sistem de spacing: 4, 8, 12, 16, 24, 32, 48, 64px)
- Tipografie ierarhizată și clară
- Paleta de culori restrânsă și consistentă

### 2. **Microinteracțiuni**
- Animații subtile pentru hover, focus, active states
- Tranziții fluide între stări (150-300ms)
- Feedback vizual imediat la acțiuni utilizator
- Loading states elegante (Spinner, Skeleton)

### 3. **Accesibilitate (A11y)**
- Contrast minim WCAG AA (4.5:1 pentru text normal, 3:1 pentru text mare)
- Navigare completă cu tastatura (Tab, Enter, Escape, Arrow keys)
- ARIA labels și roles pentru screen readers
- Focus states vizibile și clare
- Support pentru prefers-reduced-motion

### 4. **Responsive Design**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- Touch-friendly targets (minimum 44x44px)
- Drawer/Sheet pentru mobile navigation

---

## 🔧 Componente Premium Noi (care lipseau)

### **1. Carousel** 
**Folosit în:**
- Dashboard Părinte: Statistici animate ale copiilor
- Marketplace: Showcase profesori top-rated
- Dashboard Profesor: Showcase certificări și diplome
- Profil Profesor: Galerie imagini și recenzii featured

**Beneficii:**
- Prezentare elegantă a conținutului dinamic
- Economie de spațiu vertical
- UX modern și engaging
- Auto-play opțional pentru statistici

**Accesibilitate:**
- Butoane navigare vizibile
- Indicator dots pentru pozitie
- Pauză la hover pentru utilizatori cu dizabilități
- Keyboard navigation (← →)

---

### **2. Command** (⌘K Palette)
**Folosit în:**
- Dashboard: Command palette pentru acțiuni rapide (⌘K sau Ctrl+K)
- Marketplace: Search avansat profesori cu fuzzy matching
- Admin: Command pentru acțiuni administrative rapide

**Beneficii:**
- Acces rapid la orice funcționalitate
- Productivitate crescută pentru power users
- Search intelligent cu suggestions
- Keyboard shortcuts premium

**Accesibilitate:**
- Keyboard-first interface
- Visual feedback pentru rezultate
- ESC pentru închidere
- Arrow keys pentru navigare

---

### **3. Context Menu** (Click Dreapta)
**Folosit în:**
- Card-uri profesori: Click dreapta pentru "Salvează", "Programează", "Compară"
- Calendar: Context menu pe sloturi pentru acțiuni rapide
- Dashboard: Context menu pe card-uri copii/lecții

**Beneficii:**
- Acțiuni rapide fără a părăsi pagina
- UX familiar (desktop-like)
- Economie de spațiu în UI
- Power user features

**Accesibilitate:**
- Alternative cu butoane vizibile pentru mobile/touch
- Keyboard trigger cu Shift+F10
- Clear visual cues

---

### **4. Drawer** (Mobile Navigation)
**Folosit în:**
- Mobile: Drawer principal pentru navigare
- Dashboard Mobile: Drawer pentru filtre avansate
- Profil Mobile: Drawer pentru editare rapidă

**Beneficii:**
- Navigation premium pe mobile
- Overlay smooth cu backdrop blur
- Swipe-to-close gesture
- Full-screen sau partial overlay

**Accesibilitate:**
- Touch-friendly close button
- Swipe gesture pentru închidere
- Focus trap când e deschis
- ESC pentru închidere

---

### **5. Menubar** (Bară de meniu stilo aplicație desktop)
**Folosit în:**
- Header Principal: Menubar cu dropdown-uri nested
- Admin: Menubar pentru secțiuni administrative

**Beneficii:**
- Look premium, desktop-app-like
- Organizare ierarhică clară
- Dropdown-uri nested pentru structuri complexe
- Hover states elegante

**Accesibilitate:**
- Keyboard navigation (Tab, Arrow keys)
- ARIA menubar role
- Focus management
- Visual active states

---

### **6. Popover** (Informații Contextuale)
**Folosit în:**
- Card-uri profesori: Popover cu preview rapid (hover sau click)
- Calendar: Popover cu detalii lecții la hover pe slot
- Dashboard: Popover cu statistici detaliate la hover pe grafice
- Forms: Popover pentru help text și validări

**Beneficii:**
- Informații on-demand fără a încărca UI-ul
- Tooltip-uri mai complexe cu conținut rich
- Interacțiuni elegante
- Lazy loading pentru conținut

**Accesibilitate:**
- Trigger cu hover SAU click (dual support)
- Close cu ESC sau click outside
- ARIA labeling
- Focus management

---

### **7. Resizable** (Panouri Redimensionabile)
**Folosit în:**
- Dashboard Admin: Panouri redimensionabile pentru layout personalizat
- Dashboard Profesor: Split view pentru lecții și calendar
- Admin Rapoarte: Panouri pentru grafice și tabele

**Beneficii:**
- Personalizare layout de către utilizator
- Maximizare eficiență pentru power users
- State persistent (salvat în localStorage)
- Drag handles vizibile

**Accesibilitate:**
- Clear visual handles
- Keyboard resize cu Arrow keys
- Min/max constraints
- Double-click pentru reset

---

### **8. Sheet** (Side Panel Modern)
**Folosit în:**
- Mobile: Sheet pentru navigare (alternativă la Drawer)
- Dashboard: Sheet pentru setări rapide și filtre
- Profil: Sheet pentru editare formular
- Calendar: Sheet pentru programare rapidă

**Beneficii:**
- Slide-in animations smooth
- Overlay partial sau full
- Multiple positions (top, bottom, left, right)
- Gesture support

**Accesibilitate:**
- ESC pentru închidere
- Focus trap
- Swipe gestures
- Clear close button

---

### **9. Toggle & Toggle Group**
**Folosit în:**
- Dashboard: Toggle Group pentru view modes (Grid/List/Calendar)
- Calendar: Toggle Group pentru view modes (Day/Week/Month)
- Filtre: Toggle Group pentru opțiuni multiple
- Setări: Toggle pentru preferințe on/off

**Beneficii:**
- Alternative elegantă la Radio Buttons
- Visual feedback clar (selected state)
- Grupare logică a opțiunilor
- Single sau multiple selection

**Accesibilitate:**
- ARIA radio group role
- Keyboard navigation (Arrow keys)
- Clear selected state
- Focus indicators

---

### **10. Input OTP** (2FA și Verificări)
**Folosit în:**
- Login: OTP pentru verificare email/telefon
- Setări: OTP pentru activare 2FA
- Admin: OTP pentru acțiuni sensibile (delete users, etc.)

**Beneficii:**
- UX modern pentru coduri de verificare
- Auto-focus între inputs
- Paste support (6-digit codes)
- Visual feedback

**Accesibilitate:**
- Keyboard navigation
- Paste from clipboard
- Clear error states
- Screen reader support

---

### **11. Aspect Ratio** (Imagini și Video-uri)
**Folosit în:**
- Profil Profesor: Cover images (16:9 sau 21:9)
- Card-uri Profesori: Avatar în raport 1:1
- Dashboard: Imagini în statistici vizuale
- Marketplace: Preview imagini profesori

**Beneficii:**
- Imagini consistente fără distorsiuni
- Lazy loading cu placeholder blur
- Responsive images
- Optimizare performance

**Accesibilitate:**
- Alt text pentru toate imaginile
- Loading states
- Fallback pentru imagini lipsă
- Proper contrast pentru overlay text

---

### **12. Scroll Area** (Scroll Customizat)
**Folosit în:**
- Dashboard: Scroll area pentru liste lungi de notificări
- Calendar: Scroll area pentru evenimente
- Chat/Mesaje: Scroll area pentru conversații
- Tables: Scroll area pentru tabele largi

**Beneficii:**
- Scrollbar customizat consistent cross-browser
- Smooth scrolling
- Scroll shadows pentru indicare conținut
- Performance optimizat (virtual scrolling optional)

**Accesibilitate:**
- Native keyboard scrolling
- Screen reader compatible
- Visible scroll indicators
- Touch scroll support

---

### **13. Collapsible** (Conținut Expandabil)
**Folosit în:**
- Dashboard: Collapsible pentru secțiuni (notificări vechi, etc.)
- FAQ: Collapsible pentru întrebări (alternativă la Accordion)
- Profil: Collapsible pentru detalii suplimentare
- Notificări: Collapsible pentru grupuri de notificări

**Beneficii:**
- Economie spațiu vertical
- Progressive disclosure
- Smooth expand/collapse animations
- State persistent opțional

**Accesibilitate:**
- ARIA expanded state
- Keyboard toggle (Enter/Space)
- Focus management
- Visual indicators (chevron)

---

### **14. Hover Card** (Preview on Hover)
**Folosit în:**
- Card-uri profesori: Hover card cu detalii expandate
- Dashboard: Hover card pentru detalii copii
- Utilizatori: Hover card pentru preview profil rapid

**Beneficii:**
- Preview rapid fără click
- Delay configurable (evită false triggers)
- Rich content (imagini, text, badges)
- Alternative la tooltips simple

**Accesibilitate:**
- Trigger cu click pentru touch devices
- ESC pentru închidere
- Focus management
- Screen reader support

---

### **15. Pagination** (Navigare Pagini)
**Folosit în:**
- TeachersPage: Pagination pentru lista de profesori
- Admin Users: Pagination pentru utilizatori
- Recenzii: Pagination pentru lista de recenzii

**Beneficii:**
- Navigation clară pentru liste lungi
- Ellipsis pentru multe pagini
- First/Last/Next/Previous buttons
- Current page highlight

**Accesibilitate:**
- Keyboard navigation
- ARIA current page
- Clear focus states
- Screen reader announcements

---

### **16. Slider** (Controale cu Valori)
**Folosit în:**
- Filtre Marketplace: Slider pentru experiență (0-20 ani)
- Filtre Marketplace: Slider pentru rating (1-5 stele)
- Post-Lecție: Slider pentru progres elev (0-100%)
- Recenzii: Slider pentru rating pe criterii

**Beneficii:**
- Input vizual și intuitiv
- Range selection
- Step control
- Real-time preview

**Accesibilitate:**
- Keyboard control (Arrow keys)
- ARIA slider role
- Value announcements
- Clear min/max labels

---

### **17. KBD** (Keyboard Shortcuts Display)
**Folosit în:**
- Command Palette: KBD pentru shortcut-uri (⌘K, ⌘P, etc.)
- Help Section: KBD pentru ghid tastatură
- Tooltips: KBD pentru shortcuts în tooltips

**Beneficii:**
- Visual reprezentare shortcuts
- Educație utilizatori pentru productivity
- Look premium
- Platform-aware (⌘ pentru Mac, Ctrl pentru Windows)

**Accesibilitate:**
- Screen reader text alternative
- Platform detection
- Clear visual style

---

### **18. Spinner** (Loading States Elegante)
**Folosit în:**
- Buttons: Spinner în butoane la submit (replaces text)
- Forms: Spinner pentru loading
- Dashboard: Spinner pentru fetching data
- Pages: Full-page spinner pentru loading

**Beneficii:**
- Feedback vizual elegant pentru loading
- Size variations (sm, md, lg)
- Color variations
- Alternative la Skeleton pentru loading rapid

**Accesibilitate:**
- ARIA live region
- Screen reader text "Loading..."
- Non-blocking
- Timeout pentru erori

---

## 📦 Blocks Premium pentru Pagini Întregi

### **1. Login Blocks (login-01 până la login-05)**

**Ce primim:**
- Layout complet pentru autentificare
- Split-screen design (formular + hero image)
- Social login buttons (Google, Facebook, etc.)
- "Remember me" și "Forgot password"
- Animații și tranziții premium

**Implementare:**
- `LoginPage.tsx` - folosește **login-02** (split-screen modern)
- `RegisterPage.tsx` - folosește **signup-02** (similar styling)

**Beneficii:**
- First impression premium
- Credibilitate crescută
- UX smooth pentru onboarding
- Mobile responsive

---

### **2. Dashboard Block (dashboard-01)**

**Ce primim:**
- Layout complet cu sidebar + header + content area
- Metrics cards responsive
- Charts și grafice (Line, Bar, Area, Pie)
- Recent activity feed
- Quick actions panel

**Implementare:**
- `DashboardPage.tsx` - bază pentru toate dashboard-urile
- Customizat pentru fiecare rol (Parent, Teacher, Student, Admin)

**Beneficii:**
- Look profesional enterprise-grade
- Data visualization premium
- Responsive layout
- Dark mode ready

---

### **3. Sidebar Blocks (sidebar-01 până la sidebar-16)**

**Ce primim:**
- Multiple variante de sidebar (collapsible, floating, fixed)
- Navigation tree cu nested items
- User profile section
- Search/Command integration
- Collapsible sections

**Implementare:**
- `Layout.tsx` și `Sidebar.tsx` - folosește **sidebar-07** (collapsible + floating)
- Variante pentru desktop vs mobile

**Beneficii:**
- Navigation premium
- Space-efficient
- Customizable per user
- Brand consistency

---

### **4. Calendar Blocks (calendar-20, calendar-26, calendar-27)**

**Ce primim:**
- Calendar complet interactiv
- Multiple view modes (Day, Week, Month, Year)
- Event creation și editing inline
- Drag & drop pentru rescheduling
- Color coding pentru tipuri evenimente
- Timezone support

**Implementare:**
- `ConsultationsPage.tsx` - calendar view folosește **calendar-26**
- `TeacherAvailabilityCalendar.tsx` - folosește **calendar-20**

**Beneficii:**
- Google Calendar-like UX
- Drag & drop premium
- Color coding clear
- Mobile gestures

---

### **5. Products Block (products-01)**

**Ce primim:**
- Grid layout pentru produse/profesori
- Filters sidebar (multi-select)
- Sort options
- Pagination
- Quick view modal

**Implementare:**
- `TeachersPage.tsx` (Marketplace) - folosește **products-01** adaptat

**Beneficii:**
- E-commerce-grade UX
- Filtering premium
- Mobile responsive
- Quick actions

---

## 🎯 Pagini și Componente - Îmbunătățiri Detaliate

### **1. LoginPage & RegisterPage**

#### Îmbunătățiri:
1. **Layout Premium:**
   - Split-screen design (50% formular, 50% hero image/brand)
   - Hero image cu overlay gradient
   - Brand messaging pe partea dreaptă
   - Formular centrat elegant pe stânga

2. **Formular Îmbunătățit:**
   - Input-uri cu icons (Mail, Lock, User)
   - Show/Hide password toggle cu icon
   - Input validation în timp real (green check, red X)
   - Error messages inline sub câmpuri
   - Success states cu animații

3. **Features Noi:**
   - Social login buttons (Google, Facebook) - placeholders pentru viitor
   - "Remember me" checkbox cu descriere
   - "Forgot password?" link prominent
   - "Already have account?" cu link la login
   - Loading state în butoane (Spinner + disabled)

4. **Animații:**
   - Fade-in la încărcare
   - Slide-up pentru formular
   - Shake pentru erori
   - Success checkmark animat

5. **Accesibilitate:**
   - Label-uri clare pentru toate inputs
   - ARIA labels pentru screen readers
   - Focus trap în formular
   - Keyboard navigation (Tab order logic)
   - Error announcements pentru screen readers

#### Fișiere afectate:
- `src/pages/auth/LoginPage.tsx`
- `src/pages/auth/RegisterPage.tsx`

---

### **2. ParentDashboard**

#### Îmbunătățiri:

##### **A. Hero Section (Top Stats):**
1. **Stats Cards cu Carousel:**
   - Carousel pentru statistici multiple (swipe pe mobile)
   - Cards cu gradient backgrounds
   - Icons animate (lecții completate, lecții viitoare, copii înregistrați)
   - Micro-animații la hover
   - Quick actions în cards (CTAs)

2. **Command Palette:**
   - Shortcut global ⌘K sau Ctrl+K
   - Quick actions: "Programează lecție", "Invită copil", "Vezi abonamente"
   - Search profesori rapid
   - Recent pages navigation

##### **B. Secțiunea Copii:**
1. **Cards Premium:**
   - Hover Card pentru preview detalii copil
   - Context Menu (click dreapta) pentru acțiuni rapide
   - Badges colorate pentru materii (color coding per materie)
   - Progress bars animate pentru progres
   - Avatar cu status indicator (lecție în curs, offline)

2. **Quick Actions:**
   - Button group pentru "Vezi detalii" / "Programează lecție"
   - Popover pentru filtre rapide
   - Toggle Group pentru view modes (Grid vs List)

##### **C. Secțiunea Pachete/Abonamente:**
1. **Cards Premium:**
   - Progress ring pentru lecții consumate
   - Badge pentru status (Active, Expiring Soon, Expired)
   - Alert colorat pentru expirări
   - Carousel pentru pachete disponibile (swipe pentru mai multe)

2. **Call-to-Action:**
   - Button primary pentru "Cumpără pachet nou"
   - Button secondary pentru "Reînnoiește"
   - Popover cu detalii pachete la hover

##### **D. Calendar și Lecții:**
1. **Calendar Premium:**
   - View modes: Day, Week, Month (Toggle Group)
   - Color coding pentru status lecții
   - Popover cu detalii la hover pe evenimente
   - Context Menu pentru acțiuni pe lecții
   - Drag & drop pentru reprogramare (cu confirmare)

2. **Filtre Avansate:**
   - Sheet lateral pentru filtre (swipe din stânga pe mobile)
   - Multi-select pentru copii, materii, profesori
   - Date range picker
   - Reset filters button

##### **E. Notificări:**
1. **Feed Premium:**
   - Scroll Area customizat pentru listă lungă
   - Collapsible pentru grupuri (Today, Yesterday, This Week)
   - Badge cu unread count
   - Alert variations pentru tipuri (Info, Warning, Success, Error)
   - Quick actions inline (Marchează ca citit, Șterge)

#### Fișiere afectate:
- `src/components/dashboards/ParentDashboard.tsx`
- `src/components/parent/ChildrenList.tsx`

---

### **3. TeacherDashboard**

#### Îmbunătățiri:

##### **A. Stats Overview:**
1. **Carousel Stats:**
   - Lecții azi, săptămâna asta, luna aceasta
   - Rating overall cu stars animate
   - Venituri (dacă disponibil)
   - Elevi activi

2. **Quick Actions Panel:**
   - Command Palette pentru acțiuni rapide
   - "Marchează disponibilitate", "Vezi cereri noi", "Rapoarte lecții"

##### **B. Profil Public Preview:**
1. **Card Premium:**
   - Aspect Ratio pentru cover image (16:9)
   - Avatar mare cu edit trigger
   - Badges pentru materii cu color coding
   - Rating stars cu popover pentru breakdown
   - Sheet pentru editare rapidă profil (swipe din dreapta)

##### **C. Programul Meu (Calendar):**
1. **Calendar Avansat:**
   - Folosește calendar-26 (drag & drop events)
   - Color coding: Verde (disponibil), Roșu (ocupat), Gri (blocat)
   - Context Menu pentru sloturi (Marchează disponibil/indisponibil)
   - Sheet pentru setare recurring availability
   - Popover cu detalii lecție la hover

##### **D. Lecțiile Mele:**
1. **Lista Premium:**
   - Cards cu avatar elev
   - Badge pentru tip lecție (Individual/Grup)
   - Countdown timer pentru lecția următoare
   - Button "Start Lecție" (disabled până la -5 min)
   - Collapsible pentru lecții trecute
   - Form modal pentru raport post-lecție

2. **Post-Lecție Form:**
   - Radio Group pentru prezență
   - Slider pentru progres elev
   - Textarea rich text pentru note
   - Checkbox pentru recomandări
   - Spinner în button la submit

##### **E. Grupurile Mele:**
1. **Cards Grupuri:**
   - Avatar stack pentru elevi (max 4 vizibili + "+X mai mult")
   - Progress bar pentru progres grup
   - Badge pentru capacitate (5/8 elevi)
   - Popover cu lista completă elevi
   - Context Menu pentru acțiuni rapid

##### **F. Cereri Noi:**
1. **Alert Cards:**
   - Alert variation pentru cereri noi (highlight)
   - Avatar părinte + detalii copil
   - Button group pentru "Acceptă" / "Respinge"
   - Dialog pentru justificare (dacă respinge)
   - Toast notification la acțiune

#### Fișiere afectate:
- `src/components/dashboards/TeacherDashboard.tsx`
- `src/components/teacher/TeacherProfile.tsx`
- `src/components/consultations/CreateConsultationModal.tsx`

---

### **4. Marketplace (TeachersPage)**

#### Îmbunătățiri:

##### **A. Search și Filtre:**
1. **Command Search:**
   - Command palette cu ⌘K
   - Fuzzy search pentru profesori
   - Recent searches
   - Suggestions în timp real

2. **Filters Panel:**
   - Drawer pentru filtre pe mobile
   - Sheet pentru filtre pe desktop (collapsible)
   - Multi-select pentru materii
   - Slider pentru experiență (0-20 ani)
   - Slider pentru rating (1-5 stars)
   - Toggle Group pentru disponibilitate (Azi, Săptămâna asta, Luna asta)
   - Checkbox pentru "Verificat", "Top Rated"
   - Reset filters button

##### **B. Grid Profesori:**
1. **Cards Premium:**
   - Aspect Ratio 1:1 pentru avatar
   - Hover Card pentru preview rapid (la hover desktop, click mobile)
   - Context Menu pentru "Salvează", "Compară", "Programează"
   - Badges pentru materii (max 3 vizibile + "+X mai mult")
   - Progress bar pentru rating vizual
   - Button "Vezi Profil" primary
   - Carousel pentru certificări featured (în Hover Card)

2. **Layout:**
   - Grid responsive (1 col mobile, 2 md, 3 lg, 4 xl)
   - Skeleton cards pentru loading
   - Empty state pentru no results
   - Pagination la final

##### **C. Sort și View:**
1. **Options:**
   - Toggle Group pentru view modes (Grid vs List)
   - Dropdown pentru sort (Rating, Experiență, Preț, Disponibilitate)
   - Results count display

#### Fișiere afectate:
- `src/pages/TeachersPage.tsx`
- `src/components/teachers/TeacherCard.tsx`

---

### **5. Profil Profesor (Public)**

#### Îmbunătățiri:

##### **A. Header Section:**
1. **Hero Premium:**
   - Cover image cu Aspect Ratio 21:9
   - Avatar mare overlay peste cover
   - Badges "Verificat", "Top Rated" floating
   - Button "Programează Lecție" floating sticky
   - Name + Title typography premium

##### **B. About Section:**
1. **Bio:**
   - Typography rich cu paragraphs
   - Collapsible pentru bio lung (Read more)
   - Accordion pentru Educație și Certificări
   - Carousel pentru diplome și certificări (imagini)

##### **C. Materii și Niveluri:**
1. **Grid:**
   - Badge-uri mari pentru materii
   - Nested badges pentru niveluri
   - Color coding per materie
   - Toggle Group pentru filtrare

##### **D. Calendar Disponibilitate:**
1. **Calendar Interactiv:**
   - Folosește calendar-20
   - Badge pentru sloturi disponibile
   - Click pentru booking
   - Sheet pentru formular programare
   - Context Menu pentru opțiuni

##### **E. Recenzii:**
1. **Section Premium:**
   - Rating overall cu breakdown (5 stars, 4 stars, etc.) - Progress bars
   - Carousel pentru featured reviews
   - Cards pentru recenzii cu Avatar reviewer
   - Collapsible pentru recenzii vechi
   - Pagination pentru multe recenzii
   - Scroll Area pentru container

##### **F. Statistici:**
1. **Stats Cards:**
   - Chart pentru lecții per lună
   - Progress pentru rate succes
   - Badges pentru ani experiență
   - Counter animate pentru numere

#### Fișiere afectate:
- `src/pages/public/TeacherProfilePage.tsx`

---

### **6. Flow Cumpărare Pachete (Checkout)**

#### Îmbunătățiri:

##### **Stepper Premium:**
1. **Progress Indicator:**
   - Stepper cu steps vizibile
   - Current step highlight
   - Completed steps cu checkmark
   - Click pe step pentru back navigation

##### **Pasul 1: Selectare Copil**
1. **Grid:**
   - Cards mari pentru copii
   - Avatar + nume + materii actuale
   - Radio implicit sau click pe card
   - Carousel pentru mulți copii

##### **Pasul 2: Selectare Materie**
1. **Grid:**
   - Cards pentru materii cu icons
   - Badge pentru nivel recomandat
   - Command pentru search rapid

##### **Pasul 3: Tip Lecție**
1. **Comparison:**
   - Cards mari side-by-side
   - Toggle Group implicit (Individual vs Grup)
   - Table comparison pentru features
   - Popover pentru detalii

##### **Pasul 5: Selectare Profesor**
1. **Mini-Marketplace:**
   - Reused TeacherCard component
   - Filters minimale
   - Carousel pentru top 3 recomandări
   - Popover preview

##### **Pasul 6: Programare**
1. **Calendar:**
   - Calendar interactive
   - Multi-select pentru lecții multiple
   - Badge count pentru lecții selectate
   - Sheet pentru rezumat

##### **Pasul 7: Checkout**
1. **Form Premium:**
   - Sticky sidebar cu sumar comandă
   - Card pentru totals
   - Input-uri cu validation live
   - Checkbox pentru terms
   - Alert Dialog pentru confirmare finală
   - Spinner în button la procesare

##### **Pasul 8: Success**
1. **Celebrare:**
   - Checkmark animat mare
   - Confetti animation (opțional)
   - Card cu detalii comandă
   - Next steps cu buttons
   - Countdown pentru primirea email

#### Fișiere afectate:
- `src/pages/CheckoutPage.tsx`
- `src/components/subscriptions/CheckoutFlow.tsx`

---

### **7. Notificații (NotificationCenter)**

#### Îmbunătățiri:

##### **A. Bell Icon + Badge:**
1. **Header:**
   - Badge cu unread count
   - Pulse animation pentru noi notificări
   - Popover dropdown la click

##### **B. Dropdown Panel:**
1. **Layout:**
   - Header cu "Notifications" + "Mark all as read"
   - Tabs pentru "All", "Unread", "Mentions"
   - Scroll Area pentru listă
   - Collapsible pentru grupuri (Today, Yesterday, This week, Older)
   - Empty state pentru no notifications

2. **Items:**
   - Cards cu avatar sender
   - Badge pentru tip notificare (color coded)
   - Timestamp relative (2 min ago, 1 hour ago)
   - Quick actions (Mark read, Delete) cu Context Menu
   - Click pe notificare pentru navigate to relevant page

##### **C. Setări Notificări:**
1. **Panel în Settings:**
   - Switch pentru fiecare tip notificare
   - Select pentru frecvență digest (Instant, Daily, Weekly)
   - Input pentru quiet hours
   - Toggle Group pentru canale (Email, Push, In-app)

#### Fișiere afectate:
- `src/components/NotificationCenter.tsx`

---

### **8. Profil și Setări**

#### Îmbunătățiri:

##### **A. Layout:**
1. **Tabs:**
   - Side tabs pentru secțiuni (Profile, Security, Notifications, Preferences)
   - Active state clear

##### **B. Profil Section:**
1. **Form:**
   - Avatar upload cu preview
   - Aspect Ratio pentru cover (opcional)
   - Input-uri cu validation
   - Sheet pentru editare rapidă (mobile)
   - Button group pentru Save/Cancel

##### **C. Security:**
1. **Two-Factor:**
   - Switch pentru enable 2FA
   - Input OTP pentru setup
   - Dialog pentru confirm disable

2. **Password:**
   - Current + New + Confirm
   - Password strength meter (Progress bar)
   - Requirements checklist

##### **D. Notifications:**
1. **Preferences:**
   - Switch pentru fiecare tip
   - Toggle Group pentru channels

##### **E. Preferences:**
1. **Options:**
   - Toggle pentru Dark Mode
   - Select pentru Language
   - Select pentru Timezone
   - Checkbox pentru features

#### Fișiere afectate:
- `src/pages/ProfilePage.tsx`
- `src/components/profile/ProfileSettings.tsx`

---

### **9. Layout Global (Sidebar + Header)**

#### Îmbunătățiri:

##### **A. Sidebar:**
1. **Desktop:**
   - Folosește sidebar-07 (collapsible floating)
   - Collapse/Expand cu smooth animation
   - Icons + text (text hidden când collapsed)
   - Active page highlight
   - User profile la bottom cu Popover pentru quick actions

2. **Mobile:**
   - Drawer sau Sheet pentru navigation
   - Hamburger menu în header
   - Overlay backdrop blur
   - Swipe to close

##### **B. Header:**
1. **Layout:**
   - Logo + page title (breadcrumbs opțional)
   - Command search (⌘K trigger)
   - Notifications bell
   - User avatar cu Dropdown Menu (Profile, Settings, Logout)

##### **C. Navigation:**
1. **Navigation Menu:**
   - Dropdown pentru secțiuni cu sub-pages
   - Keyboard navigation
   - Hover states

#### Fișiere afectate:
- `src/components/Layout.tsx`
- `src/components/Sidebar.tsx`
- `src/components/Header.tsx`

---

### **10. Admin Dashboard**

#### Îmbunătățiri:

##### **A. Overview:**
1. **Metrics:**
   - Carousel pentru KPIs
   - Charts pentru trends (Line, Bar)
   - Resizable panels pentru layout custom

##### **B. Gestionare Profesori:**
1. **Table:**
   - Data table cu sorting și filtering
   - Badge pentru status (Pending, Approved, Rejected)
   - Context Menu pentru acțiuni
   - Dialog pentru moderare profil
   - Alert Dialog pentru acțiuni critice

##### **C. Gestionare Utilizatori:**
1. **Search:**
   - Command pentru search avansat
   - Filters în Sheet lateral

2. **Table:**
   - Checkbox pentru bulk actions
   - Pagination
   - Field pentru filtre complexe

##### **D. Rapoarte:**
1. **Analytics:**
   - Charts premium
   - Resizable panels
   - Export buttons (CSV, PDF)
   - Date range picker

#### Fișiere afectate:
- `src/components/dashboards/AdminDashboard.tsx`
- `src/pages/admin/UsersManagementPage.tsx`
- `src/pages/admin/TeachersManagementPage.tsx`

---

## 🚀 Prioritizare Implementare

### **Faza 1: Fundație (Săptămâna 1)**
1. ✅ Instalare componente premium lipsă
2. ✅ Implementare Login Block (login-02)
3. ✅ Implementare Sidebar Block (sidebar-07)
4. ✅ Implementare Dashboard base layout

**Impact:** First impressions + navigation

### **Faza 2: Core Features (Săptămâna 2)**
1. ✅ ParentDashboard refactoring (Carousel, Command, Popover)
2. ✅ TeacherDashboard refactoring
3. ✅ Calendar premium (calendar-26)
4. ✅ Notifications premium

**Impact:** Daily usage, productivity

### **Faza 3: Marketplace (Săptămâna 3)**
1. ✅ TeachersPage refactoring (Hover Card, Context Menu, Command)
2. ✅ TeacherProfile premium
3. ✅ Filters și search premium

**Impact:** Discovery, conversii

### **Faza 4: Transactional (Săptămâna 4)**
1. ✅ Checkout flow premium
2. ✅ Calendar booking
3. ✅ Payment forms

**Impact:** Conversii, revenue

### **Faza 5: Polish (Săptămâna 5)**
1. ✅ ProfilePage și Settings
2. ✅ Admin Dashboard
3. ✅ Micro-animations
4. ✅ Dark mode refinement
5. ✅ Accessibility audit

**Impact:** Profesionalism, retention

---

## 📊 Metrici de Success

### **UX Metrics:**
- ⬇️ Time to complete task (programare lecție: 5 min → 2 min)
- ⬆️ Task completion rate (checkout: 60% → 85%)
- ⬆️ User satisfaction score (NPS: 7 → 9)

### **Technical Metrics:**
- ⬆️ Lighthouse Performance score (70 → 90)
- ⬆️ Accessibility score (75 → 95)
- ⬇️ Page load time (3s → 1.5s)

### **Business Metrics:**
- ⬆️ Conversion rate (marketplace → booking: 8% → 15%)
- ⬆️ User retention (month 1: 40% → 60%)
- ⬆️ Average session duration (5 min → 8 min)

---

## 🎨 Design Tokens

### **Colors:**
```css
/* Primary */
--primary: 222.2 47.4% 11.2%;
--primary-foreground: 210 40% 98%;

/* Secondary */
--secondary: 210 40% 96.1%;
--secondary-foreground: 222.2 47.4% 11.2%;

/* Accent */
--accent: 210 40% 96.1%;
--accent-foreground: 222.2 47.4% 11.2%;

/* Semantic */
--success: 142 71% 45%;
--warning: 38 92% 50%;
--error: 0 72% 51%;
--info: 199 89% 48%;
```

### **Typography:**
```css
/* Headings */
--font-heading: "Inter", sans-serif;
--font-body: "Inter", sans-serif;
--font-mono: "Fira Code", monospace;

/* Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### **Spacing:**
```css
/* Scale */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### **Animations:**
```css
/* Durations */
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;

/* Easings */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

---

## ♿ Accessibility Checklist

### **Keyboard Navigation:**
- [ ] Tab order logic pe toate paginile
- [ ] Focus visible pe toate elementele interactive
- [ ] ESC închide modale și popover-uri
- [ ] Arrow keys pentru navigation menus și lists
- [ ] Enter/Space pentru activare buttons și toggle-uri

### **Screen Readers:**
- [ ] ARIA labels pentru toate inputs
- [ ] ARIA roles pentru componente custom
- [ ] ARIA live regions pentru notificări și alerts
- [ ] Alt text pentru toate imaginile
- [ ] Skip to main content link

### **Visual:**
- [ ] Contrast minim 4.5:1 pentru text normal
- [ ] Contrast minim 3:1 pentru text mare și UI components
- [ ] Focus indicators vizibile (2px outline)
- [ ] No information by color alone
- [ ] Text resizable până la 200% fără loss of functionality

### **Motor:**
- [ ] Click targets minimum 44x44px
- [ ] No hover-only actions (alternative cu click)
- [ ] No time-based interactions fără opțiune extend
- [ ] Forms cu autocomplete attributes

### **Cognitive:**
- [ ] Consistent navigation
- [ ] Clear error messages cu suggestions
- [ ] Confirmare pentru destructive actions
- [ ] Progress indicators pentru multi-step flows

---

## 🌙 Dark Mode

### **Strategy:**
- CSS variables pentru theme switching
- `prefers-color-scheme` detection
- User preference persistent în localStorage
- Smooth transition între themes (no flash)

### **Components Support:**
- Toate componentele shadcn/ui au dark mode built-in
- Custom components cu variante dark
- Images cu adaptive brightness (filter opțional)
- Charts cu color schemes pentru dark mode

---

## 📱 Mobile Responsive

### **Breakpoints:**
```tsx
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
}
```

### **Mobile-First Adaptations:**
1. **Navigation:**
   - Sidebar → Drawer/Sheet
   - Dropdown Menu → Sheet
   - Tabs → Scrollable tabs

2. **Forms:**
   - Stacked layout
   - Full-width inputs
   - Touch-friendly buttons (min 44px height)

3. **Tables:**
   - Horizontal scroll cu shadows
   - Cards view alternative
   - Sticky column pentru important data

4. **Modals:**
   - Full-screen pe mobile
   - Sheet pentru forms
   - Bottom sheet pentru quick actions

---

## 🧪 Testing Strategy

### **Unit Tests:**
- Components cu Vitest
- Hooks cu Testing Library
- Utils și helpers

### **Integration Tests:**
- User flows cu Playwright
- Accessibility cu axe-core
- Visual regression cu Chromatic

### **Manual Testing:**
- Keyboard navigation
- Screen reader (NVDA, JAWS, VoiceOver)
- Mobile devices (iOS Safari, Android Chrome)
- Cross-browser (Chrome, Firefox, Safari, Edge)

---

## 📝 Documentation pentru Backend

### **API Impact:**
Majoritatea îmbunătățirilor sunt frontend-only, DAR:

1. **Notificări:**
   - Necesită grup notifications API (group by date)
   - Necesită mark all as read endpoint
   - Necesită unread count endpoint real-time (SignalR existent OK)

2. **Preferințe Utilizator:**
   - Salvare layout preferences (sidebar collapsed, theme, etc.)
   - Endpoint: `PATCH /api/users/me/preferences`

3. **Search Avansat:**
   - Command palette necesită search endpoint optimizat
   - Fuzzy search pentru profesori
   - Recent searches storage

4. **Calendar:**
   - Drag & drop reschedule necesită endpoint optimizat
   - Bulk availability update pentru profesori

### **No Breaking Changes:**
- Toate îmbunătățirile sunt backward compatible
- DTOs existente rămân neschimbate
- API endpoints existente rămân funcționale

---

## 🚀 Next Steps

1. ✅ Review acest document cu echipa backend
2. ✅ Aprobare design direction
3. ✅ Instalare componente premium
4. ✅ Implementare Faza 1 (Login + Sidebar + Dashboard layout)
5. ⏳ Iterare și refinare pe bază de feedback

---

## 📞 Contact

Pentru întrebări despre implementare:
- Frontend Lead: [Numele tău]
- Design Questions: [Numele tău]
- Backend Integration: [Backend Lead]

---

**Ultima actualizare:** 20 Octombrie 2025
**Versiune document:** 1.0
**Status:** 📝 Draft → În Implementare

