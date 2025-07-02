**Product Requirements Document (PRD)**

**Product Name:** SupaSmile
**Objective:** Erstellen einer spielerischen Web-Anwendung zur Echtzeit-Reaktion auf Witze mit Emojis, die von Benutzern bewertet werden können.

---

### 1. Features

#### 1.1 Echtzeit-Witzanzeige
- Anzeige eines aktuellen Witzes auf der Homepage.
- Witz wird periodisch aktualisiert oder bei Admin-Aktion geändert.

#### 1.2 Emoji-Reaktionen
- Benutzer können mithilfe von Emojis (😂, 🙃, 😐, 😤, 😮) auf den Witz reagieren.
- Reaktionen werden in Echtzeit an alle Benutzer gesendet.

#### 1.3 Admin Interface
- Einfache Admin-Zugangsmöglichkeit, um zum nächsten Witz zu wechseln. 
- Button für "nächsten Witz"

---

### 2. Database Design

#### 2.1 Tables

1. **Jokes Table**
    - **Fields**:
        - `id`: Eindeutige Witz-ID (int).
        - `text`: Witztext (varchar).
        - `created_at`: Zeitstempel der Erstellung (timestamp).

2. **Reactions Table**
    - **Fields**:
        - `id`: Eindeutige Reaktions-ID (int).
        - `joke_id`: Eindeutige Witz-ID, zu welchem die Reaktion gehört (int).
        - `emoji`: Typ der Emoji-Reaktion (varchar).
        - `reaction_count`: Anzahl solcher Reaktionen (int).

---

### 3. Realtime Channels (must use @supabase/supabase-js "^2.49.7" due to realtime bug in latest version)

1. **Joke Updates Channel**
    - Beobachtung der `Jokes`-Tabelle auf Änderungen am aktuellen Witz.

2. **Reaction Updates Channel**
    - Beobachtung der `Reactions`-Tabelle für Echtzeit-Updates der Emoji-Reaktionen.

---

### 4. Application Routes

1. **Home Route (`/`)**:
    - Zeigt den aktuellen Witz und Emoji-Reaktionsmöglichkeiten.
    - Echtzeit-Update der Reaktionen.

2. **Admin Interface (`/protected`)**:
    - Zugang zum Admin-Bereich.
    - Funktionalität zum Weiterschalten zum nächsten Witz.

---

### 5. User Flow

#### 5.1 Client Flow (Benutzerzugang)
1. Benutzer öffnet die Homepage (`/`).
2. Der aktuelle Witz wird angezeigt.
3. Benutzer wählt durch Klick einen Emoji zur Reaktion.
4. Emoji-Reaktion wird sofort in Echtzeit sichtbar.
5. Bei Witzänderungen wird der neue Witz sofort angezeigt.

#### 5.2 Host Flow (Adminzugang)
1. Admin navigiert zum Admin Interface (`/protected`).
2. Klick auf „Next Joke“-Button ermöglicht Anzeige eines neuen Witzes.
3. Änderungen werden sofort an alle Clients übertragen.

---

**Weitere Überlegungen:**
- Keine Authentifizierung erforderlich für Benutzer.
- Admin-Zugriff über einfache Route ohne tiefgehenden Authentifizierungsprozess.
- Minimaler Komplexitätsansatz zur effizienten Echtzeit-Synchronisation.
