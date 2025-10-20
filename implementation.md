# Maparea Componentelor shadcn/ui pentru Platforma Mateos

## Componente Premium Lipsă din Maparea Inițială

### **Componente pentru UX Premium:**

**1. Carousel** - Pentru showcase-uri profesori, testimoniale, galerii
- Marketplace: Carousel cu profesori top-rated
- Dashboard: Carousel cu statistici animate
- Profil profesor: Carousel cu certificări și diplome

**2. Command** - Search avansat și navigare rapidă
- Dashboard: Command palette pentru acțiuni rapide
- Marketplace: Search inteligent profesori
- Admin: Command pentru acțiuni administrative

**3. Context Menu** - Meniuri contextuale elegante
- Card-uri profesori: Click dreapta pentru acțiuni rapide
- Calendar: Context menu pentru sloturi
- Dashboard: Context menu pentru card-uri

**4. Drawer** - Panouri laterale moderne
- Mobile: Drawer pentru navigare
- Dashboard: Drawer pentru filtre avansate
- Profil: Drawer pentru editare rapidă

**5. Menubar** - Bară de meniu premium
- Header: Menubar pentru navigare principală
- Admin: Menubar pentru acțiuni administrative

**6. Navigation Menu** - Navigare sofisticată
- Header principal: Navigation menu cu dropdown-uri
- Dashboard: Navigation menu pentru secțiuni

**7. Popover** - Informații contextuale elegante
- Card-uri profesori: Popover cu preview rapid
- Calendar: Popover cu detalii lecții
- Dashboard: Popover cu statistici detaliate

**8. Resizable** - Panouri redimensionabile
- Dashboard: Panouri redimensionabile pentru layout personalizat
- Admin: Panouri pentru analize și rapoarte

**9. Sheet** - Panouri laterale moderne
- Mobile: Sheet pentru navigare
- Dashboard: Sheet pentru setări rapide
- Profil: Sheet pentru editare

**10. Toggle** - Butoane toggle elegante
- Dashboard: Toggle pentru view modes
- Setări: Toggle pentru preferințe
- Filtre: Toggle pentru opțiuni

**11. Toggle Group** - Grupuri de toggle-uri
- Dashboard: Toggle group pentru filtre
- Calendar: Toggle group pentru view modes
- Admin: Toggle group pentru opțiuni

### **Componente pentru Interacțiuni Premium:**

**12. Input OTP** - Pentru verificări 2FA
- Login: OTP pentru verificare email
- Setări: OTP pentru activare 2FA
- Admin: OTP pentru acțiuni sensibile

**13. KBD** - Afișare shortcut-uri tastatură
- Dashboard: KBD pentru shortcut-uri
- Command: KBD pentru navigare rapidă
- Help: KBD pentru ghiduri

**14. Spinner** - Loading states elegante
- Dashboard: Spinner pentru loading
- Forms: Spinner pentru submit
- Calendar: Spinner pentru sincronizare

### **Componente pentru Layout Premium:**

**15. Aspect Ratio** - Pentru imagini și video-uri
- Profil profesori: Aspect ratio pentru cover images
- Dashboard: Aspect ratio pentru statistici vizuale
- Marketplace: Aspect ratio pentru card-uri profesori

**16. Scroll Area** - Scroll personalizat
- Dashboard: Scroll area pentru conținut lung
- Calendar: Scroll area pentru evenimente
- Chat: Scroll area pentru mesaje

**17. Collapsible** - Conținut expandabil
- Dashboard: Collapsible pentru secțiuni
- FAQ: Collapsible pentru întrebări
- Profil: Collapsible pentru detalii

### **Componente pentru Feedback Premium:**

**18. Alert Dialog** - Dialog-uri de confirmare elegante
- Delete actions: Alert dialog pentru confirmare
- Logout: Alert dialog pentru confirmare
- Admin: Alert dialog pentru acțiuni critice

**19. Field** - Câmpuri de formular avansate
- Forms: Field pentru validare avansată
- Dashboard: Field pentru filtre
- Admin: Field pentru configurare

**20. Item** - Elemente de listă sofisticate
- Dashboard: Item pentru listele de acțiuni
- Admin: Item pentru utilizatori
- Calendar: Item pentru evenimente

## Blocks Premium Recomandate:

### **Pentru Login/Authentification:**
- **login-01** până la **login-05** - Pentru pagini de autentificare premium
- **signup-01** până la **signup-05** - Pentru înregistrare elegantă
- **otp-01** până la **otp-05** - Pentru verificări OTP

### **Pentru Dashboard:**
- **dashboard-01** - Pentru dashboard principal premium
- **sidebar-01** până la **sidebar-16** - Pentru navigare sofisticată

### **Pentru Calendar:**
- **calendar-01** până la **calendar-32** - Pentru calendar-uri avansate

### **Pentru Products/Marketplace:**
- **products-01** - Pentru vitrina profesori premium

## Implementare Premium Recomandată:

### **1. Dashboard Premium:**
```
- Carousel pentru statistici animate
- Command palette pentru acțiuni rapide
- Resizable panouri pentru layout personalizat
- Popover pentru detalii rapide
- Toggle group pentru filtre avansate
- Scroll area pentru conținut lung
```

### **2. Marketplace Premium:**
```
- Carousel pentru profesori top-rated
- Command pentru search avansat
- Context menu pentru acțiuni rapide
- Popover pentru preview profesori
- Aspect ratio pentru imagini profesori
- Hover card pentru detalii expandate
```

### **3. Calendar Premium:**
```
- Calendar avansat cu multiple view modes
- Popover pentru detalii lecții
- Context menu pentru acțiuni sloturi
- Toggle group pentru filtre
- Sheet pentru programare rapidă
- Alert dialog pentru confirmări
```

### **4. Admin Premium:**
```
- Menubar pentru navigare principală
- Command pentru acțiuni administrative
- Resizable panouri pentru analize
- Alert dialog pentru acțiuni critice
- Field pentru configurare avansată
- Item pentru listele de utilizatori
```

### **5. Mobile Premium:**
```
- Drawer pentru navigare mobilă
- Sheet pentru panouri laterale
- Toggle pentru view modes
- Input OTP pentru verificări
- Spinner pentru loading states
- Collapsible pentru conținut expandabil
```

## Maparea Componentelor shadcn/ui pentru Platforma Mateos

### 1. Pagină de Autentificare/Înregistrare
- **Card** - Container principal pentru formulare
- **Form** - Formulare de login și înregistrare
- **Input** - Câmpuri email și parolă
- **Button** - Butoane de autentificare și înregistrare
- **Label** - Etichete pentru câmpuri
- **Alert** - Mesaje de eroare și validare
- **Separator** - Separare între secțiuni
- **Radio Group** - Selectare rol (Părinte/Profesor)
- **Checkbox** - Termeni și condiții
- **Badge** - Indicator rol selectat
- **Input OTP** - Verificare 2FA
- **Alert Dialog** - Confirmări importante

### 2. Dashboard Principal

#### Dashboard Părinte
**Secțiunea de Sus (Hero Section):**
- **Card** - Card-uri cu statistici
- **Badge** - Indicatori status
- **Progress** - Progress bar pentru lecții rămase
- **Avatar** - Avataruri copii
- **Button** - Acțiuni rapide
- **Carousel** - Statistici animate
- **Command** - Command palette pentru acțiuni rapide
- **Popover** - Detalii rapide statistici

**Secțiunea Copii:**
- **Card** - Card-uri pentru fiecare copil
- **Avatar** - Avatar/inițiale copil
- **Badge** - Materii studiate și nivel
- **Progress** - Progress bar pentru materii
- **Button** - "Vezi detalii" și "Programează lecție"
- **Separator** - Separare între card-uri
- **Context Menu** - Acțiuni rapide pe card-uri
- **Hover Card** - Preview detalii copil
- **Toggle Group** - Filtre pentru copii

**Secțiunea Pachete/Abonamente:**
- **Card** - Card-uri pentru pachete active
- **Progress** - Lecții consumate vs total
- **Badge** - Status plată și tip pachet
- **Button** - "Reînnoiește" și "Cumpără mai multe"
- **Alert** - Alerte pentru expirări
- **Carousel** - Showcase pachete disponibile
- **Popover** - Detalii pachete

**Calendar/Programare:**
- **Calendar** - Calendar interactiv
- **Card** - Card-uri pentru lecții programate
- **Badge** - Status lecții (Confirmată/În așteptare/Anulată)
- **Button** - "Programează Lecție Nouă"
- **Dialog** - Modal pentru detalii lecție
- **Select** - Filtre pe copil, materie, profesor
- **Sheet** - Panou programare rapidă
- **Context Menu** - Acțiuni pe sloturi calendar
- **Toggle Group** - View modes calendar

**Notificări și Mesaje:**
- **Badge** - Număr notificări necitite
- **Card** - Feed de notificări
- **Alert** - Tipuri diferite de notificări
- **Button** - Acțiuni rapide
- **Separator** - Separare între notificări
- **Scroll Area** - Scroll pentru notificări lungi
- **Collapsible** - Grupuri notificări

#### Dashboard Profesor
**Secțiunea de Sus:**
- **Card** - Card-uri cu statistici
- **Badge** - Status și indicatori
- **Progress** - Progres și rating
- **Carousel** - Statistici animate
- **Command** - Acțiuni rapide

**Profil Public:**
- **Card** - Preview profil public
- **Avatar** - Fotografie/avatar
- **Badge** - Materii predate și status
- **Button** - "Editează Profil"
- **Progress** - Rating și progres
- **Aspect Ratio** - Cover image profil
- **Sheet** - Editare rapidă profil

**Programul Meu:**
- **Calendar** - Calendar săptămânal
- **Card** - Sloturi și lecții
- **Badge** - Status sloturi (disponibil/ocupat/blocat)
- **Button** - Acțiuni de programare
- **Dialog** - Modal pentru setări disponibilitate
- **Context Menu** - Acțiuni pe sloturi
- **Toggle Group** - Filtre disponibilitate

**Lecțiile Mele:**
- **Card** - Card-uri cu lecții
- **Avatar** - Avatar elev
- **Badge** - Tip lecție și status
- **Button** - "Start Lecție"
- **Form** - Formular post-lecție
- **Progress** - Progres elev
- **Alert Dialog** - Confirmări importante
- **Spinner** - Loading states

**Grupurile Mele:**
- **Card** - Card-uri pentru grupuri
- **Avatar** - Avataruri elevi
- **Badge** - Nivel și capacitate
- **Progress** - Progres prin curriculum
- **Button** - "Vezi detalii grup"
- **Carousel** - Showcase grupuri
- **Popover** - Detalii grupuri

**Cereri Noi:**
- **Card** - Card-uri pentru cereri
- **Alert** - Notificări cereri noi
- **Button** - "Acceptă" / "Respinge"
- **Dialog** - Modal pentru justificare
- **Alert Dialog** - Confirmări acțiuni

#### Dashboard Elev
**Secțiunea de Sus:**
- **Card** - Card principal
- **Progress** - Progress overall
- **Badge** - XP și badges
- **Carousel** - Progres animat

**Lecțiile Mele:**
- **Card** - Card-uri simple pentru lecții
- **Avatar** - Avatar profesor
- **Badge** - Materie și status
- **Button** - "Intră în clasă"
- **Progress** - Countdown până la lecție
- **Popover** - Detalii lecție

**Materiile Mele:**
- **Card** - Card-uri per materie
- **Progress** - Progress bar
- **Badge** - Nivel curent
- **Avatar** - Avatar profesor
- **Toggle Group** - Filtre materii

**Teme și Materiale:**
- **Card** - Listă de teme
- **Badge** - Status teme
- **Button** - Acțiuni pentru teme
- **Separator** - Separare între teme
- **Scroll Area** - Scroll pentru teme lungi
- **Collapsible** - Grupuri teme

**Progresul Meu:**
- **Card** - Card-uri pentru progres
- **Progress** - Grafice progres
- **Badge** - Badge-uri câștigate
- **Chart** - Grafice vizuale
- **Carousel** - Progres animat

#### Dashboard Administrator
**Control Panel Complet:**
- **Card** - Card-uri pentru KPIs
- **Chart** - Grafice statistici
- **Badge** - Indicatori status
- **Progress** - Progres și rate
- **Carousel** - Statistici animate
- **Command** - Acțiuni administrative
- **Menubar** - Navigare principală

**Gestionare Profesori:**
- **Table** - Tabel cu profesori
- **Badge** - Status profesori
- **Button** - Acțiuni (Aprobare/Respingere)
- **Dialog** - Modal moderare profil
- **Alert** - Cereri noi evidențiate
- **Alert Dialog** - Confirmări acțiuni critice
- **Field** - Filtre avansate
- **Item** - Lista profesori

**Gestionare Grupuri:**
- **Card** - Card-uri pentru grupuri
- **Badge** - Status completare
- **Button** - Acțiuni grup
- **Dialog** - Modal creare grup manual
- **Alert** - Sugestii de grupare
- **Context Menu** - Acțiuni pe grupuri

**Gestionare Utilizatori:**
- **Table** - Tabel utilizatori
- **Input** - Căutare și filtrare
- **Select** - Filtre
- **Button** - Acțiuni bulk
- **Dialog** - Modal modificări
- **Command** - Search avansat utilizatori
- **Field** - Filtre complexe

**Programare și Calendar:**
- **Calendar** - Calendar master
- **Alert** - Conflicte și suprapuneri
- **Button** - Tool reprogramare
- **Dialog** - Modal reprogramare în masă
- **Context Menu** - Acțiuni calendar
- **Toggle Group** - View modes

**Rapoarte și Analize:**
- **Card** - Card-uri pentru analytics
- **Chart** - Grafice diverse
- **Table** - Tabel date
- **Button** - Export rapoarte
- **Select** - Filtre perioadă
- **Resizable** - Panouri redimensionabile
- **Scroll Area** - Scroll pentru date mari

**Setări Platformă:**
- **Card** - Card-uri pentru setări
- **Form** - Formulare configurare
- **Input** - Câmpuri tarife
- **Button** - Salvare setări
- **Alert** - Confirmări modificări
- **Field** - Configurare avansată
- **Toggle** - Opțiuni platformă

### 3. Marketplace/Vitrina Profesori
**Filtrare și Căutare:**
- **Input** - Bară de căutare
- **Select** - Dropdown multi-select materii
- **Checkbox** - Filtre nivel/clasă
- **Slider** - Experiență și rating
- **Button** - Sortare și resetare filtre
- **Command** - Search avansat
- **Toggle Group** - Filtre rapide

**Card-uri Profesori:**
- **Card** - Card-uri elegante profesori
- **Avatar** - Fotografie profesională
- **Badge** - Materii și rating
- **Button** - "Vezi Profil"
- **Hover Card** - Expand cu detalii
- **Progress** - Rating vizual
- **Aspect Ratio** - Imagini profesori
- **Context Menu** - Acțiuni rapide

**Hover/Click pe Card:**
- **Hover Card** - Expand cu animație
- **Accordion** - Certificări și diplome
- **Card** - Secțiune recenzii
- **Button** - "Programează cu [Nume]"
- **Calendar** - Calendar disponibilitate
- **Carousel** - Showcase profesori
- **Popover** - Preview rapid

### 4. Pagina de Profil Detaliat Profesor
**Header Section:**
- **Card** - Container principal
- **Avatar** - Fotografie mare
- **Badge** - "Verificat", "Top Rated"
- **Button** - "Programează Lecție"
- **Aspect Ratio** - Cover image

**Despre Mine:**
- **Card** - Secțiune bio
- **Accordion** - Educație și certificări
- **Separator** - Separare secțiuni
- **Carousel** - Certificări și diplome

**Materii și Niveluri:**
- **Card** - Grid organizat
- **Badge** - Materii și niveluri
- **Button** - Acțiuni materii
- **Toggle Group** - Filtre materii

**Disponibilitate și Programare:**
- **Calendar** - Calendar interactiv
- **Badge** - Sloturi disponibile
- **Dialog** - Modal booking
- **Button** - Acțiuni programare
- **Context Menu** - Acțiuni sloturi
- **Sheet** - Programare rapidă

**Recenzii și Rating:**
- **Card** - Container recenzii
- **Progress** - Rating overall
- **Avatar** - Avatar elev
- **Badge** - Rating stele
- **Pagination** - Navigare recenzii
- **Button** - "Vezi toate"
- **Scroll Area** - Scroll recenzii
- **Carousel** - Recenzii featured

**Statistici Publice:**
- **Card** - Card-uri statistici
- **Progress** - Rate de succes
- **Badge** - Ani experiență
- **Chart** - Grafice performanță

### 5. Flow de Cumpărare Pachete
**Pasul 1: Selectare Copil**
- **Card** - Grid cu card-uri copii
- **Avatar** - Avatar copil
- **Button** - Selectare copil
- **Carousel** - Showcase copii

**Pasul 2: Selectare Materie**
- **Card** - Grid materii
- **Button** - Selectare materie
- **Input** - Căutare materii
- **Command** - Search materii

**Pasul 3: Selectare Tip Lecție**
- **Card** - Card-uri mari opțiuni
- **Badge** - Tip lecție
- **Button** - Selectare tip
- **Separator** - Separare opțiuni
- **Toggle Group** - Comparație opțiuni

**Pasul 5: Selectare Profesor**
- **Card** - Mini-versiune marketplace
- **Avatar** - Avatar profesor
- **Badge** - Rating și disponibilitate
- **Button** - Selectare profesor
- **Popover** - Preview profesor
- **Carousel** - Showcase profesori

**Pasul 6: Programare**
- **Calendar** - Calendar disponibilitate
- **Card** - Sloturi selectabile
- **Button** - Confirmare programare
- **Context Menu** - Acțiuni sloturi

**Pasul 7: Checkout**
- **Card** - Sumar comandă sidebar
- **Form** - Formular plată
- **Input** - Detalii facturare
- **Checkbox** - Termeni și condiții
- **Button** - "Finalizează Plată"
- **Alert Dialog** - Confirmări importante
- **Spinner** - Loading plată

**Pasul 8: Confirmare**
- **Card** - Mesaj succes
- **Alert** - Confirmare achiziție
- **Button** - Next steps
- **Carousel** - Animație succes

### 6. Sistem de Programare Lecții
**Interface Modal/Page:**
- **Calendar** - Calendar săptămânal/lunar
- **Card** - Sloturi disponibile
- **Badge** - Status și tip lecție
- **Avatar** - Profesor
- **Dialog** - Pop-up confirmare
- **Form** - Formular programare
- **Button** - "Confirmă Programare"
- **Alert** - Mesaje succes
- **Context Menu** - Acțiuni sloturi
- **Toggle Group** - View modes

**Opțiuni Avansate:**
- **Checkbox** - Programare recurentă
- **Select** - Sugestii inteligente
- **Dialog** - Modal opțiuni avansate
- **Sheet** - Panou opțiuni

### 7. Flow Invitație Copil
**Părinte generează link:**
- **Dialog** - Modal generare link
- **Form** - Formular detalii copil
- **Input** - Preview link
- **Button** - Opțiuni partajare
- **Badge** - Expirare link
- **Alert Dialog** - Confirmări

**Copilul accesează link:**
- **Card** - Landing page
- **Form** - Formular simplu
- **Input** - Email și parolă
- **Checkbox** - Consimțământ
- **Button** - "Alătură-te"
- **Alert** - Mesaje validare
- **Aspect Ratio** - Imagini educaționale

### 8. Interfață Post-Lecție (Profesor)
**Formular structured:**
- **Form** - Formular complet
- **Radio Group** - Prezență
- **Input** - Durata efectivă
- **Textarea** - Subiecte acoperite
- **Slider** - Progres elev
- **Textarea** - Teme date
- **Textarea** - Note pentru părinte
- **Textarea** - Note private
- **Checkbox** - Recomandări
- **Button** - "Salvează Raport"
- **Alert Dialog** - Confirmări
- **Spinner** - Loading salvare

**După salvare:**
- **Alert** - Confirmare salvare
- **Card** - Raport în dashboard

### 9. Sistem de Notificări
**Bell Icon cu Badge:**
- **Badge** - Număr necitite
- **Dropdown Menu** - Dropdown la click
- **Card** - Listă notificări
- **Alert** - Tipuri notificări
- **Button** - Acțiuni rapide
- **Separator** - Separare categorii
- **Scroll Area** - Scroll notificări
- **Collapsible** - Grupuri notificări

**Setări Notificări:**
- **Card** - Container setări
- **Switch** - Toggle per tip
- **Select** - Frecvență digest
- **Input** - Quiet hours
- **Toggle Group** - Opțiuni rapide

### 10. Secțiune Recenzii/Feedback
**Formular Recenzie:**
- **Form** - Formular complet
- **Progress** - Rating overall
- **Slider** - Rating pe criterii
- **Textarea** - Descriere experiență
- **Checkbox** - "Postează anonim"
- **Button** - "Publică Recenzie"
- **Alert Dialog** - Confirmări
- **Spinner** - Loading publicare

**Moderare:**
- **Alert** - Filtru automat
- **Button** - Acțiuni moderare
- **Card** - Răspuns profesor
- **Context Menu** - Acțiuni moderare

### 11. Pagină Setări (per rol)
**Setări Părinte:**
- **Tabs** - Tab-uri principale
- **Card** - Container-uri setări
- **Form** - Formulare editare
- **Input** - Câmpuri profil
- **Avatar** - Fotografie profil
- **Button** - Acțiuni setări
- **Alert** - Confirmări modificări
- **Sheet** - Editare rapidă
- **Toggle** - Preferințe
- **Field** - Configurare avansată

**Setări Profesor:**
- **Card** - Container-uri setări
- **Form** - Formulare profil public
- **Calendar** - Gestionare disponibilitate
- **Select** - Preferințe lecții
- **Input** - Detalii financiare
- **Switch** - 2FA și securitate
- **Input OTP** - Verificări 2FA
- **Aspect Ratio** - Cover image

**Setări Elev:**
- **Card** - Container-uri simplificate
- **Form** - Formulare profil
- **Select** - Preferințe materii
- **Switch** - Notificări
- **Toggle Group** - Preferințe

### 12. Secțiune Ajutor/Suport
**Pagină FAQ:**
- **Input** - Căutare
- **Accordion** - Categorii FAQ
- **Card** - Container întrebări
- **Button** - "Contactează-ne"
- **Command** - Search FAQ
- **Collapsible** - Grupuri întrebări

**Contact Suport:**
- **Form** - Formular contact
- **Input** - Câmpuri formular
- **Select** - Dropdown categorii
- **Textarea** - Mesaj
- **Button** - "Trimite"
- **Alert Dialog** - Confirmări
- **Spinner** - Loading trimitere

## Rezumat Componente shadcn/ui Folosite

**Componente Principale (folosite în majoritatea secțiunilor):**
- **Card** - Container principal pentru toate secțiunile
- **Button** - Acțiuni și navigare
- **Badge** - Indicatori status și categorii
- **Avatar** - Imagini profil utilizatori
- **Form** - Formulare în toată aplicația
- **Input** - Câmpuri de introducere date
- **Alert** - Mesaje și notificări
- **Dialog** - Modale și popup-uri
- **Progress** - Indicatori progres și rating

**Componente Specializate:**
- **Calendar** - Programare și calendar
- **Table** - Listări și date tabulare
- **Chart** - Grafice și statistici
- **Sidebar** - Navigare principală
- **Tabs** - Organizare conținut
- **Accordion** - Conținut expandabil
- **Dropdown Menu** - Meniuri dropdown
- **Select** - Dropdown-uri și filtre
- **Checkbox** - Selecții multiple
- **Radio Group** - Selecții unice
- **Switch** - Toggle-uri
- **Slider** - Controale cu valori
- **Textarea** - Câmpuri text lung
- **Separator** - Separare vizuală
- **Pagination** - Navigare pagini
- **Hover Card** - Card-uri hover
- **Tooltip** - Informații suplimentare
- **Skeleton** - Loading states
- **Empty** - Stări goale
- **Sonner** - Toast notifications

**Componente Premium:**
- **Carousel** - Showcase-uri și galerii
- **Command** - Search avansat și navigare rapidă
- **Context Menu** - Meniuri contextuale elegante
- **Drawer** - Panouri laterale moderne
- **Menubar** - Bară de meniu premium
- **Navigation Menu** - Navigare sofisticată
- **Popover** - Informații contextuale elegante
- **Resizable** - Panouri redimensionabile
- **Sheet** - Panouri laterale moderne
- **Toggle** - Butoane toggle elegante
- **Toggle Group** - Grupuri de toggle-uri
- **Input OTP** - Verificări 2FA
- **KBD** - Afișare shortcut-uri tastatură
- **Spinner** - Loading states elegante
- **Aspect Ratio** - Pentru imagini și video-uri
- **Scroll Area** - Scroll personalizat
- **Collapsible** - Conținut expandabil
- **Alert Dialog** - Dialog-uri de confirmare elegante
- **Field** - Câmpuri de formular avansate
- **Item** - Elemente de listă sofisticate

Această mapare completă oferă o structură premium pentru implementarea întregii interfețe Mateos folosind componentele shadcn/ui, asigurând o experiență utilizator de nivel enterprise și aspect premium modern.

