# Prompt pentru Interfața Platformei Mateos

Salut! Vreau să creez o interfață modernă și intuitivă pentru platforma educațională Mateos.

## Structura Generală

Platforma ar trebui să aibă următoarele componente principale:

### 1. Pagină de Autentificare/Înregistrare
- Formular de login elegant cu email și parolă
- Opțiune de "Am uitat parola"
- Buton vizibil pentru înregistrare nouă
- Selectare rol la înregistrare: **Părinte** (principal) sau **Profesor** (necesită aprobare)
- Design responsive și modern cu gradient subtil
- Logo Mateos centrat în partea superioară
- Validare în timp real a câmpurilor

### 2. Dashboard Principal (diferit pentru fiecare rol)

#### Dashboard Părinte
După autentificare, părintele vede:

**Secțiunea de Sus (Hero Section):**
- Salut personalizat: "Bună, [Nume Părinte]!"
- Card-uri cu statistici quick overview:
  - Număr de copii înregistrați (cu avataruri)
  - Lecții rămase din pachet/abonament
  - Următoarea lecție programată (cu countdown)
  - Balanță/status plată

**Secțiunea Copii:**
- Grid de card-uri (stil modern, cu shadow și hover effects)
- Fiecare card conține:
  - Avatar/inițiale copil
  - Nume și clasă
  - Materii studiate (badge-uri colorate)
  - Progress bar pentru fiecare materie
  - Buton "Vezi detalii" și "Programează lecție"
  - Indicator de nivel (Începător/Mediu/Avansat)
- Buton "+ Adaugă Copil" (generează link de invitație)

**Secțiunea Pachete/Abonamente:**
- Card-uri pentru pachete active:
  - Tip pachet (Individual/Grup 3/Grup 6)
  - Materie
  - Lecții consumate vs total (progress visual)
  - Data expirării
  - Status plată
  - Buton "Reînnoiește" sau "Cumpără mai multe"
- Buton proeminent "Cumpără Pachet Nou"

**Calendar/Programare:**
- Calendar vizual interactiv cu:
  - Lecții programate (codificate pe culori după materie)
  - Profesori alocați
  - Status: Confirmată/În așteptare/Anulată
  - Click pe lecție → detalii complete + opțiuni de reprogramare
- Filtre: Vezi pe copil, pe materie, pe profesor
- Buton "Programează Lecție Nouă"

**Notificări și Mesaje:**
- Badge cu număr de notificări necitite
- Feed de notificări:
  - Confirmări de lecții
  - Rapoarte post-lecție de la profesori
  - Reminder-uri pentru lecții viitoare
  - Alerte balanță scăzută
  - Updates despre grupuri (locuri disponibile)

#### Dashboard Profesor
După autentificare, profesorul vede:

**Secțiunea de Sus:**
- Salut: "Bună, Prof. [Nume]!"
- Statistici:
  - Lecții predate săptămâna aceasta
  - Lecții programate în viitor
  - Rating mediu
  - Venituri estimate (lunar)

**Profil Public:**
- Preview la cum arată profilul public
- Status: "Activ" / "În moderare" / "Incomplet"
- Buton "Editează Profil"
- Card cu:
  - Fotografie/avatar
  - Materii predate (badge-uri)
  - Experiență în ani
  - Rating și număr recenzii
  - Scurtă descriere bio

**Programul Meu:**
- Calendar săptămânal cu:
  - Sloturi disponibile (verde)
  - Lecții confirmate (albastru)
  - Lecții în așteptare (galben)
  - Timp blocat (gri)
- Funcționalitate drag-and-drop pentru a seta disponibilitatea
- Setări pentru recurrență (săptămânal)

**Lecțiile Mele:**
- Listă/carduri cu lecții:
  - Următoarea lecție (evidențiată)
  - Detalii elev (nume, clasă, nivel)
  - Materie și subiect planificat
  - Tip (Individual/Grup)
  - Buton "Start Lecție" (când e timpul)
  - Formular post-lecție: prezență, notițe, teme, progres

**Grupurile Mele:**
- Card-uri pentru fiecare mini-grup:
  - Nume grup (ex: "Matematică 8 - Grup A")
  - Lista elevilor (3 sau 6, cu avataruri)
  - Nivel mediu
  - Progres prin curriculum
  - Următoarea întâlnire
  - Buton "Vezi detalii grup"

**Cereri Noi:**
- Notificări pentru:
  - Cereri noi de înregistrare la lecții
  - Propuneri de grupuri de la admin
  - Buton "Acceptă" / "Respinge" cu justificare

#### Dashboard Elev
Interfață simplificată și prietenoasă:

**Secțiunea de Sus:**
- Salut: "Bună, [Nume Elev]!"
- Ilustrație motivațională
- Progress overall (XP/badges gamification - opțional)

**Lecțiile Mele:**
- Card-uri simple:
  - Următoarea lecție (mare, evidențiată)
  - Profesorul meu (avatar și nume)
  - Materie și subiect
  - Countdown până la lecție
  - Buton "Intră în clasă" (când e timpul)

**Materiile Mele:**
- Card-uri per materie:
  - Icon materie
  - Progress bar
  - Nivel curent
  - Profesor asociat
  - Lecții completate

**Teme și Materiale:**
- Listă de teme primite:
  - De la care profesor
  - Termen limită
  - Status: De făcut/Trimis/Verificat
- Materiale de studiu partajate de profesori

**Progresul Meu:**
- Grafice simple și vizuale:
  - Prezență la lecții
  - Progres per materie
  - Badge-uri câștigate
- Istoric lecții cu notițele profesorului

#### Dashboard Administrator
**Control Panel Complet:**
- Statistici generale (KPIs):
  - Utilizatori activi (părinți/elevi/profesori)
  - Lecții programate săptămâna aceasta
  - Venituri (lunar/anual)
  - Rate de retenție
  - Conversie cereri → înregistrări

**Gestionare Profesori:**
- Tabel cu toți profesorii:
  - Status (Activ/Inactiv/În moderare)
  - Materii
  - Rating
  - Număr lecții predate
  - Venituri generate
  - Acțiuni: Aprobare/Respingere/Suspendare/Editare
- Cereri noi de profesori (cu evidențiere)
- Formular de moderare profil

**Gestionare Grupuri:** (Pentru admin)
- Lista tuturor grupurilor:
  - Status completare (3/3 sau 4/6 etc.)
  - Materie și nivel
  - Profesor alocat
  - Program
  - Acțiuni: Editare/Dizolvare/Realocare
- Algoritm sugestii de grupare:
  - Elevi în așteptare (nivel, clasă, disponibilitate)
  - Propuneri automate de grupare
  - Buton "Creare Grup Manual"

**Gestionare Utilizatori:**
- Căutare și filtrare:
  - Părinți: nr copii, abonamente active, istoric plăți
  - Elevi: clasă, materii, profesori, prezență
  - Profesori: specialități, disponibilitate, performanță
- Acțiuni bulk: notificări, modificări tarife, etc.

**Programare și Calendar:**
- Calendar master cu toate lecțiile
- Conflicte și suprapuneri (evidențiate)
- Tool de reprogramare în masă

**Rapoarte și Analize:**
- Dashboard de analytics:
  - Grafice prezență
  - Consumul pachetelor
  - Conversie și funnel
  - Performanță profesori
  - Retenție elevi
  - Venituri per categorie
- Export rapoarte (PDF/Excel)

**Setări Platformă:**
- Tarife și pachete:
  - Editare prețuri (Individual/Grup3/Grup6)
  - Durate sloturi (60/90 min)
  - Număr lecții per pachet
  - Reduceri și promoții
- Template-uri email/SMS
- Politici și termeni
- Integrări (Stripe, Zoom, etc.)

### 3. Marketplace/Vitrina Profesori
Pagină publică accesibilă înainte sau după autentificare:

**Filtrare și Căutare:**
- Bară de căutare proeminentă
- Filtre în sidebar:
  - Materie (dropdown multi-select)
  - Nivel/clasă (checkboxes)
  - Experiență (slider)
  - Rating (stele)
  - Disponibilitate (calendar/zile)
  - Tip lecție (Individual/Grup)
- Sortare: Relevanță/Rating/Experiență/Preț

**Card-uri Profesori:**
Grid de card-uri elegante, fiecare conține:
- Fotografie profesională
- Nume complet (prenume și inițiala familiei până la booking)
- Materii (badge-uri colorate)
- Rating (stele + număr recenzii)
- Experiență în ani
- Educație (iconițe pentru diplome/certificări)
- Snippet din bio (2-3 linii)
- Indicator disponibilitate ("Locuri disponibile" în verde)
- Preț de pornire ("De la X lei/lecție")
- Buton "Vezi Profil"

**Hover/Click pe Card:**
Expand cu animație smooth, arată:
- Bio completă
- Specializări detaliate
- Certificări și diplome (accordion)
- Video intro (opțional)
- Calendarului cu disponibilitate
- Secțiune recenzii (primele 3, cu "Vezi toate")
- Buton mare "Programează cu [Nume]" (redirect la booking)

### 4. Pagina de Profil Detaliat Profesor
La click pe "Vezi Profil":

**Header Section:**
- Cover image (background)
- Fotografie mare centrată
- Nume complet
- Rating prominent cu număr recenzii
- Badge-uri: "Verificat", "Top Rated", etc.
- Buton CTA: "Programează Lecție"

**Despre Mine:**
- Bio completă (rich text)
- Experiență detaliată (timeline)
- Educație și certificări (lista expandabilă)
- Specializări și puncte forte

**Materii și Niveluri:**
- Grid organizat:
  - Materia (ex: Matematică)
  - Niveluri acceptate (cls. 5-12)
  - Subtopicuri (Algebră, Geometrie, etc.)

**Disponibilitate și Programare:**
- Calendar interactiv săptămânal
- Sloturi verzi = disponibile
- Click pe slot → afișare modal de booking
- Afișare timezone

**Recenzii și Rating:**
- Rating overall (stele mari)
- Breakdown pe criterii:
  - Claritatea explicațiilor
  - Răbdarea
  - Eficiența
  - Pregătire
- Lista de recenzii:
  - Avatar elev (inițiale, anonimizat)
  - Rating stele
  - Text recenzie
  - Data
  - Răspuns profesor (opțional)
- Paginare/Load more

**Statistici Publice:**
- Număr total de lecții predate
- Ani de experiență
- Rate de succes (% elevi care și-au îmbunătățit nota)
- Materii predate

### 5. Flow de Cumpărare Pachete
La click pe "Cumpără Pachet":

**Pasul 1: Selectare Copil**
- Dacă părintele are mai mulți copii:
  - Grid cu card-uri copii
  - Select pentru cine cumperi
- Dacă e primul copil: skip la pasul 2

**Pasul 2: Selectare Materie**
- Grid de materii populare (iconițe și nume)
- Căutare pentru alte materii
- Click pe materie → next

**Pasul 3: Selectare Tip Lecție**
- Card-uri mari pentru fiecare opțiune:
  - **Individual**: "1-la-1 cu profesorul"
    - Atenție personalizată
    - Ritm adaptat
    - Flexibilitate maximă
    - Preț: X lei/lecție
  - **Grup 3**: "Mini-grup 3 elevi"
    - Interacțiune cu colegi
    - Preț redus
    - Socializare
    - Preț: Y lei/lecție
  - **Grup 6**: "Grup standard 6 elevi"
    - Cel mai accesibil
    - Dinamică de clasă
    - Preț: Z lei/lecție
- Comparator side-by-side

**Pasul 5: Selectare Profesor (opțional)**
- "Alege profesor sau lasă-ne să recomandăm"
- Dacă alege: mini-versiune marketplace filtrat pe materie
- Dacă skip: platformă alocă automat

**Pasul 6: Programare (dacă are profesor)**
- Calendar cu disponibilitatea profesorului
- Selectare slot(uri) recurente sau individual
- Timezone awareness

**Pasul 7: Checkout**
- Sumar comandă (sidebar):
  - Copil
  - Materie
  - Tip + număr lecții
  - Durată lecție
  - Profesor (dacă selectat)
  - Preț total
  - Reduceri aplicate
- Formular plată (Stripe):
  - Card nou sau salvat
  - Detalii facturare (pre-populat cu date părinte)
  - Checkbox: "Salvează cardul pentru viitor"
- Termeni și condiții:
  - Checkbox: "Accept T&C și Politica de Confidențialitate"
  - Checkbox: "Acord procesare date copil pentru servicii educaționale"
- Buton mare: "Finalizează Plată (X lei)"

**Pasul 8: Confirmare**
- Mesaj de succes cu animație
- Sumar achiziție
- Next steps:
  - Dacă nu are profesor: "Căutăm profesor potrivit..."
  - Dacă nu a programat: "Programează prima lecție"
  - Link rapid la dashboard
- Email de confirmare trimis

### 6. Sistem de Programare Lecții

**Intrare:** Buton "Programează Lecție" (din dashboard sau profil profesor)

**Interface Modal/Page:**
- Calendar săptămânal/lunar
- Sloturi disponibile colorate
- Afișare:
  - Durata slotului
  - Tip lecție
  - Profesor (nume + avatar)
  - Lecții rămase în pachet (indicator)
- Selectare slot → pop-up confirmare:
  - Data și ora (cu timezone)
  - Detalii profesor și copil
  - Consumă 1 lecție din pachet X
  - Note opționale pentru profesor
  - Buton "Confirmă Programare"
- După confirmare:
  - Mesaj succes
  - Notificare către profesor
  - Email/SMS reminder setat automat
  - Adăugare în calendarul personal (iCal/Google)

**Opțiuni Avansate:**
- Programare recurentă (ex: Luni și Miercuri, ora 17:00, 4 săptămâni)
- Sugestii inteligente bazate pe istoric și disponibilitate

### 7. Flow Invitație Copil

**Părinte generează link:**
- Din dashboard: Buton "+ Adaugă Copil"
- Modal:
    -nume/prenume/clasa/nivel aprox
  - Preview la link unic: `mateos.com/join/abc123xyz`
  - Opțiuni de partajare:
    - Copiere link
    - Trimite prin email (introduce email copil)
    - QR code (pentru scan)
  - Sunt deja setate:
    - Expirare link (7zile)

**Copilul accesează link:**
- Landing page prietenoasă:
  - "Ai fost invitat de [Nume Părinte] să te alături Mateos!"
  - Ilustrație educațională
  - Formular simplu:
    - Email
    - Parolă
  - Checkbox: "Am citit și înțeles cum se folosesc datele mele" (limbaj pentru copii)
  - Buton: "Alătură-te"
- Validare → creare cont elev legat de părinte
- Redirect automat la dashboard elev cu tutorial ghidat

### 8. Interfață Post-Lecție (Profesor)

După finalizarea lecției, profesorul completează:

**Formular structured:**
- **Prezență:** Radio buttons:
  - Prezent
  - Absent (cu justificare checkbox: anunțat/neanunțat)
- **Durata efectivă:** Pre-populat cu durata standard, editabil
- **Subiecte acoperite:** Textarea cu bullet points sugerate
- **Progres elev:** Slider/rating (1-5 stele) pe criterii:
  - Înțelegere material
  - Participare activă
  - Îndeplinire teme anterioare
- **Teme date:** Textarea cu descriere + opțional deadline
- **Note pentru părinte:** Textarea (vizibil pentru părinte)
- **Note private:** Textarea (doar pentru profesor)
- **Recomandări:** Checkboxes:
  - Necesită lecții suplimentare
  - Gata pentru nivel următor
  - Altele (textarea)
- Buton: "Salvează Raport"

**După salvare:**
- Raportul apare instant în dashboard-ul părintelui
- Notificare trimisă către părinte
- Se actualizează statisticile elevului

### 9. Sistem de Notificări

**Bell Icon cu Badge** (număr necitite) în header:

**Dropdown la click:**
- Listă notificări grupate pe categorii:
  - **Urgent** (roșu): Anulări, probleme plată
  - **Programări** (albastru): Confirmări, reminder-uri
  - **Rapoarte** (verde): Rapoarte post-lecție noi
  - **Sistem** (gri): Updates, mesaje admin
- Fiecare notificare:
  - Icon relevant
  - Titlu bold
  - Descriere scurtă
  - Timestamp relativ (acum 2h, ieri, etc.)
  - Dot pentru necitit
  - Click → expand cu detalii + acțiuni rapide
- Footer:
  - "Vezi toate"
  - "Marchează toate ca citite"
  - "Setări notificări"

**Setări Notificări:**
- Toggle per tip:
  - Email (pentru ce evenimente?)
  - SMS (pentru ce evenimente?)
  - Push (dacă e app mobil)
  - In-app
- Frecvență digest (instant/zilnic/săptămânal)
- Quiet hours (nu trimite între 22:00-08:00)

### 10. Secțiune Recenzii/Feedback

**Părintele/Elevul lasă recenzie pentru profesor:**

**Trigger:**
- După X lecții completate (ex: 3 lecții)
- Request prin notificare: "Cum a fost experiența cu Prof. [Nume]?"

**Formular Recenzie:**
- Rating overall (stele mari, 1-5)
- Rating pe criterii (stele sau slider):
  - Claritatea explicațiilor
  - Răbdarea și încurajarea
  - Punctualitatea
  - Pregătirea materialelor
  - Eficiența lecțiilor
- Textarea: "Descrie experiența ta" (opțional)
- Checkbox: "Postează anonim" (afișează doar inițiale)
- Preview: cum va arăta recenzia publicată
- Buton: "Publică Recenzie"

**Moderare:**
- Recenziile trec prin filtru automat (limbaj ofensator)
- Admin poate modera/șterge dacă necesar
- Profesorul poate răspunde la recenzii

### 11. Pagină Setări (per rol)

**Setări Părinte:**

**Tabs:**
- **Profil Personal:**
  - Edit: Nume, telefon, email, parolă
  - Fotografie profil (opțional)
- **Copiii Mei:**
  - Listă copii cu butoane edit/remove
  - Adaugă copil nou
- **Plăți și Facturare:**
  - Carduri salvate (adaugă/șterge)
  - Istoric facturi (download PDF)
  - Setări auto-reînnoire
- **Notificări:**
  - Preferințe descrise mai sus
- **Confidențialitate:**
  - Gestionare consimțăminte
  - Vizualizare date personale
  - Export date (GDPR)
  - Ștergere cont (cu warning)
- **Suport:**
  - Link FAQ
  - Formular contact support
  - Chat live (dacă disponibil)

**Setări Profesor:**
- **Profil Public:** Edit toate câmpurile profil
- **Disponibilitate:** Gestionare calendar
- **Preferințe Lecții:** Niveluri acceptate, materii, tipuri (individual/grup)
- **Financiare:** Detalii cont bancar pentru plăți
- **Notificări**
- **Securitate:** 2FA, parolă
- **Confidențialitate**

**Setări Elev:**
- **Profil:** Nume, fotografie, parolă
- **Preferințe:** Materii favorite, obiective
- **Notificări** (simplificat)
- **Confidențialitate** (limbaj adaptat vârstei)

### 12. Secțiune Ajutor/Suport

**Pagină FAQ:**
- Căutare
- Categorii:
  - Început (Cum mă înregistrez? Cum funcționează?)
  - Programări și Pachete
  - Plăți și Facturare
  - Profesori
  - Grupuri
  - Probleme Tehnice
  - GDPR și Confidențialitate
- Acordion cu întrebări/răspunsuri
- "Nu ai găsit răspuns? Contactează-ne"

**Contact Suport:**
- Formular:
  - Nume (pre-populat)
  - Email (pre-populat)
  - Subiect (dropdown categorii)
  - Mesaj (textarea)
  - Attach files (screenshots)
  - Buton: "Trimite"
- Alternativ: Email direct, telefon, chat live

---

## Design System și Principii UI/UX

### Paleta de Culori
- **Primar:** Albastru educațional (#2563EB - trust, profesionalism)
- **Secundar:** Verde (#10B981 - succes, progres)
- **Accent:** Portocaliu/Galben (#F59E0B - energie, motivație)
- **Neutral:** Griuri (#F3F4F6, #E5E7EB, #6B7280, #1F2937)
- **Semantic:**
  - Succes: Verde (#10B981)
  - Warning: Galben (#F59E0B)
  - Eroare: Roșu (#EF4444)
  - Info: Albastru deschis (#3B82F6)

### Tipografie
- **Headings:** Font modern, geometric (ex: Poppins, Inter)
- **Body:** Sans-serif lizibil (ex: Inter, Open Sans)
- **Numere/Cifre:** Tabular pentru aliniere

### Componente Refolosite
- **Card:** Shadow, radius 8-12px, padding consistent, hover lift
- **Button:**
  - Primary: bg-primary, text-white, hover-darker
  - Secondary: outline, hover-fill
  - Sizes: sm, md, lg
- **Badge:** Rounded-full, text-xs, colorat pe categorie
- **Avatar:** Circular, fallback la inițiale, size variants
- **Progress Bar:** Smooth, animated, color-coded
- **Calendar:** Grid clean, hover states clare, multi-select
- **Modal:** Backdrop blur, centered, animație fade/slide
- **Toast/Snackbar:** Pentru feedback instantaneu (succes/eroare)
- **Dropdown:** Shadow, max-height cu scroll, keyboard navigation
- **Form Inputs:** Consistent padding, focus state evident, labels clare, helper text, error states

### Interacțiuni și Animații
- **Hover:** Lift effect (translateY + shadow) pe carduri
- **Click:** Scale down slight (0.98)
- **Loading:** Skeleton screens sau spinner elegant (nu blocking dacă posibil)
- **Transitions:** 200-300ms, easing natural (ease-out)
- **Page transitions:** Smooth, fără flicker

### Responsiveness
- **Mobile First:** Design pornind de la mobil
- **Breakpoints:**
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Grid adaptiv:** 1 col (mobile) → 2 col (tablet) → 3-4 col (desktop)
- **Navigation:** Hamburger menu pe mobil, full nav pe desktop
- **Touch-friendly:** Butoane/tap targets min 44x44px

### Accessibility (A11y)
- **Contrast:** WCAG AA minim (4.5:1 pentru text)
- **Keyboard:** Toate acțiunile accesibile prin tastatură
- **Screen readers:** Aria labels, semantic HTML
- **Focus visible:** Ring evident pe focus
- **Error messages:** Clare, descriptive, asociate cu field-ul