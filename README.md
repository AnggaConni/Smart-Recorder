# Smart MoM Studio

### Offline Recorder + AI Minutes of Meeting

Smart MoM Studio is an **Offline-First Progressive Web App (PWA)** for recording meetings, capturing live speech transcripts, preserving audio locally, and transforming meeting content into structured **Minutes of Meeting (MoM)** with the help of AI.

🌐 Web App
https://anggaconni.github.io/Smart-Recorder/

📦 App / Download Portal
https://anggaconni.github.io/Download/

👨‍💻 Developer
Angga Conni Saputra

---

## ✨ Why Smart MoM Studio?

Most meeting transcription tools assume that:

> Internet is available.
> The browser stays open.
> The transcription service works.
> The AI API is available.

Real meetings are not always that cooperative.

Wi-Fi can disappear.

An API can fail.

A browser can interrupt speech recognition.

A meeting can continue even when the network does not.

Smart MoM Studio is designed around a different principle:

> **The meeting should not depend on the internet.**

The application therefore separates the meeting workflow into several layers:

```text
             ┌─────────────────────┐
             │   Meeting / People  │
             └──────────┬──────────┘
                        │
                        ▼
              ┌──────────────────┐
              │ Microphone /     │
              │ Audio Input      │
              └────────┬─────────┘
                       │
              ┌────────┴─────────┐
              │                  │
              ▼                  ▼
      Speech Recognition    MediaRecorder
              │                  │
              ▼                  ▼
        Live Transcript     Local Audio
              │              Archive
              │            IndexedDB
              ▼
         Local Storage
              │
              ▼
        Offline Queue
              │
              ▼
        Gemini AI
              │
              ▼
       Minutes of Meeting
```

The application maintains two important recovery paths:

### Transcript-first path

```text
Speech Recognition
        ↓
Transcript Segments
        ↓
Local Persistence
        ↓
Chunk / Queue
        ↓
AI Processing
```

### Audio-first path

```text
Microphone
    ↓
MediaRecorder
    ↓
Local Audio Chunks
    ↓
IndexedDB
    ↓
Audio Archive
    ↓
AI Transcription Later
```

This means the transcript and the original audio can have different recovery paths.

---

# 🚀 Features

## 🎙️ Meeting Recording

Record meetings directly from the browser.

Meeting metadata can include:

* Meeting title
* Date and time
* Location
* Participants
* Agenda / context

The recorder provides live operational information including:

* Recording state
* Paused state
* Detected language
* Recording timer
* Word count
* Transcript segment count
* AI chunk count
* Automatic recognition restarts
* Buffer word count
* Engine status
* Keep-alive status

---

# 🌐 Offline-First Architecture

Smart MoM Studio does not treat offline operation as an error condition.

Instead, offline operation is part of the architecture.

When the internet is unavailable, the application can continue to:

* Record audio
* Preserve transcript segments locally
* Maintain the transcript buffer
* Store AI processing jobs in a local queue
* Generate an offline draft
* Preserve recorded audio locally
* Restore data after a browser/session interruption

When connectivity becomes available again, queued AI jobs can be processed.

Conceptually:

```text
ONLINE

Meeting
   ↓
Transcript
   ↓
AI Queue
   ↓
Gemini
   ↓
MoM


OFFLINE

Meeting
   ↓
Transcript
   ↓
Local Queue
   ↓
Wait
   ↓
Internet Returns
   ↓
Gemini
   ↓
MoM
```

The goal is simple:

> **Connectivity should delay AI processing, not destroy the meeting record.**

---

# 🧠 AI-Assisted Minutes of Meeting

Smart MoM Studio can use Google Gemini to transform transcript chunks into structured meeting content.

AI processing can be used for:

* Summarization
* Key discussion extraction
* Decision identification
* Action item extraction
* Meeting minutes generation

The application supports different MoM styles.

### Concise

Designed for short and efficient meeting records.

### Detailed

Designed for meetings where discussion context matters.

### Action-Focused

Prioritizes:

* Decisions
* Action items
* Responsibilities
* Follow-up items

---

# 🌍 Output Language

Minutes can be generated using:

* Auto
* English
* Indonesia

This is useful for multilingual meetings where the meeting language and reporting language are different.

---

# 📝 Live Transcript

The transcript interface provides tools for:

* Copying transcript content
* Exporting JSON
* Exporting TXT
* Searching within transcript
* Clearing transcript
* Assigning speaker labels
* Adding notes

Available speaker labels include:

```text
No speaker
Speaker 1
Speaker 2
Speaker 3
Speaker 4
Host
Me
```

Speaker labels are user-controlled labels.

They should not be interpreted as guaranteed biometric speaker identification.

---

# 🎧 360° Conference Microphone Support

Smart MoM Studio can be used with a single conference microphone positioned in the center of a meeting table.

A suitable setup is:

```text
             Participant
                  │
                  │

Participant ── [ 360° MIC ] ── Participant

                  │
                  │
             Participant
```

A professional conference microphone or microphone array with:

* 360° pickup
* Noise cancellation
* Echo cancellation / AEC
* Automatic gain control
* USB connectivity
* Suitable room pickup range

can substantially improve the quality of a one-microphone meeting setup.

### Important distinction

**360° audio pickup is not the same thing as speaker diarization.**

A 360° microphone attempts to capture voices from around the microphone.

It does not automatically know:

```text
"This voice belongs to Angga."
"This voice belongs to Budi."
"This voice belongs to Siti."
```

For accurate speaker attribution, additional diarization technology would be required.

---

# 🎤 Single-Mic Meeting Room Concept

One of the intended use cases is a meeting room with a single conference microphone.

Example:

```text
┌────────────────────────────────────┐
│                                    │
│        👤          👤              │
│                                    │
│              🎙️                    │
│        360° Conference Mic         │
│                                    │
│        👤          👤              │
│                                    │
└────────────────────────────────────┘
                 │
                 │ USB
                 ▼
              Laptop
                 │
                 ▼
        Smart MoM Studio
```

This architecture reduces hardware complexity.

Instead of giving every participant a microphone:

> **One good room microphone can serve as the primary audio source.**

The actual effectiveness depends on:

* Room dimensions
* Microphone quality
* Microphone placement
* Speaker distance
* Background noise
* Room acoustics
* Echo
* Speaker volume
* Browser and operating-system behavior

---

# 🔊 Local Audio Archive

Smart MoM Studio can optionally preserve raw meeting audio locally using the browser's IndexedDB storage.

The recording pipeline is conceptually:

```text
Microphone
    ↓
MediaStream
    ↓
MediaRecorder
    ↓
Audio Chunks
    ↓
IndexedDB
```

Audio is persisted in chunks rather than waiting until the entire meeting has ended.

The application periodically flushes recorded audio data into local storage.

This provides an additional recovery mechanism if transcript recognition becomes unreliable.

---

# 🤖 AI Transcription from Saved Audio

Recorded audio can later be selected from the local audio archive and submitted for AI transcription.

This creates a second route to recover meeting content:

```text
Live Speech Recognition
        OR
       Saved Audio
        ↓
      Gemini
        ↓
     Transcript
        ↓
       MoM
```

This is particularly useful when:

* Live recognition missed some content
* The meeting language was difficult to recognize
* The browser speech engine stopped unexpectedly
* A better transcript is needed after the meeting

The application therefore does not rely exclusively on live speech recognition.

---

# 🔄 Speech Recognition Resilience

Browser speech recognition can stop unexpectedly.

Smart MoM Studio uses resilience mechanisms around the recognition engine, including:

* Recognition restart handling
* Watchdog monitoring
* Local persistence
* Transcript buffering
* Automatic restart statistics

The objective is not to pretend that browser speech recognition is perfect.

The objective is:

> **When the browser speech engine fails, the application should recover as much as possible instead of silently losing the entire meeting.**

---

# 🧩 Language Detection

Smart MoM Studio includes lightweight heuristic language detection for English and Indonesian.

The detector uses language markers and linguistic patterns to estimate the dominant language.

This detection is primarily used for:

* Language indication
* Transcript classification
* Meeting language awareness

### Important

Language detection does **not** mean that the application continuously changes the speech-recognition engine automatically.

The selected recognition engine remains the primary recognition mode.

Available recognition modes include:

```text
Indonesian only
English only
```

---

# 📦 Chunk Processing

Long meetings are divided into manageable AI processing chunks.

Chunking can be influenced by:

* Automatic time interval
* Word threshold
* Manual processing

Available automatic chunk intervals include:

```text
Manual
1 minute
3 minutes
5 minutes
10 minutes
```

This prevents the application from treating an entire multi-hour meeting as one giant AI request.

A simplified workflow is:

```text
Meeting Transcript

        ↓

┌────────────────────┐
│ Chunk 1             │
└────────────────────┘
          ↓
┌────────────────────┐
│ Chunk 2             │
└────────────────────┘
          ↓
┌────────────────────┐
│ Chunk 3             │
└────────────────────┘
          ↓
        Gemini
          ↓
     Consolidation
          ↓
       Final MoM
```

---

# 📥 Offline AI Queue

When AI processing cannot happen immediately, transcript chunks can be added to a local queue.

Queue states include:

```text
pending
processing
done
error
```

This allows the application to separate:

**recording**

from

**AI processing**

Those are two different tasks.

A meeting can therefore continue even when AI processing is temporarily unavailable.

---

# 📝 Offline Draft

Smart MoM Studio includes an offline draft mode that does not require the Gemini API.

The offline draft uses local transcript content to produce a basic meeting summary.

This is useful when:

* No internet connection exists
* No Gemini API key is configured
* Immediate rough notes are needed
* AI processing will happen later

The offline draft should be understood as an **extractive/local draft**, not a replacement for full generative AI summarization.

---

# 🗂️ Local Persistence

The application stores operational data locally in the browser.

Examples include:

```text
smartmom.ui
smartmom.settings
smartmom.meta
smartmom.segments
smartmom.buffer
smartmom.queue
smartmom.moms
smartmom.stats
```

Different data types serve different purposes.

### LocalStorage

Used for lightweight application state and meeting information.

### IndexedDB

Used for larger local data such as archived audio.

This design avoids requiring a conventional backend database for the core application.

---

# 🔐 Privacy Model

Smart MoM Studio follows a local-first privacy approach.

Meeting information is kept in the browser unless the user explicitly invokes an external AI service.

The Gemini API key is stored in browser `localStorage`.

The application does not require a central Smart MoM backend database to store meeting transcripts.

### Important privacy principle

> **Local does not automatically mean anonymous or risk-free.**

Users should still follow their organization's policies regarding:

* Recording consent
* Confidential meetings
* Personal data
* Sensitive information
* AI processing
* Data retention
* External API usage

Do not assume that a meeting is appropriate for AI processing simply because the application itself stores much of the information locally.

---

# 🔑 Gemini API Key

To use Gemini-powered processing, the user can configure a Gemini API key in Settings.

The application supports configurable Gemini models.

The API key is stored in browser local storage.

### Backup behavior

The application's backup export intentionally excludes the API key.

This reduces the risk of accidentally exporting an API credential together with meeting data.

### Without an API key

The application can still be used for:

* Recording
* Local transcript capture
* Local storage
* Offline queueing
* Offline draft generation
* Audio archiving

AI processing simply requires a configured API key.

---

# ⚙️ Settings

Smart MoM Studio provides controls for:

### Gemini API

* API key
* AI model

### Automatic processing

* Auto chunk interval
* Chunk word threshold
* Auto process

### Recognition

* Recognition language
* Silence restart threshold

### Audio

* Save raw audio locally
* Wake Lock

### MoM

* MoM style
* Output language

### Data management

* Export backup
* Import backup
* Erase everything

---

# 💾 Backup & Restore

The application supports local backup and restore.

Backup data can include application state and meeting-related local data.

The API key is deliberately excluded from backup exports.

This means a restored backup should not be treated as a complete credential backup.

---

# 🧹 Erase Everything

The Settings panel provides a destructive reset mechanism.

This can remove locally stored Smart MoM data, including archived audio.

Use this option carefully.

Before erasing data from an important meeting, export the required transcript, MoM, or backup.

---

# 📤 Export

Smart MoM Studio supports exporting different meeting outputs.

### Transcript

* JSON
* TXT

### Minutes of Meeting

* Markdown
* Word
* PDF
* CSV

This makes the application suitable for both human review and downstream workflows.

---

# ⌨️ Keyboard Shortcuts

| Shortcut             | Action                 |
| -------------------- | ---------------------- |
| Ctrl/Cmd + Shift + R | Start / Stop recording |
| Ctrl/Cmd + Shift + P | Pause / Resume         |
| Ctrl/Cmd + Shift + G | Process now            |
| Ctrl/Cmd + Shift + F | Search transcript      |

---

# 📱 Progressive Web App

Smart MoM Studio is designed as a Progressive Web App.

The application includes:

```text
manifest.json
service worker
offline caching
local persistence
```

This allows the application to behave more like an installed application while still being delivered through the web.

The PWA is intended to support environments where network reliability cannot be guaranteed.

---

# 🛠️ Technology Stack

Smart MoM Studio is intentionally built using a lightweight web stack.

### Core

* HTML5
* Vanilla JavaScript
* CSS
* Tailwind CSS

### Browser APIs

* Web Speech Recognition
* MediaRecorder API
* MediaStream API
* Web Audio API
* IndexedDB
* LocalStorage
* Wake Lock API
* Service Worker API
* PWA Manifest

### External technologies

* Google Gemini API
* Tailwind CSS CDN
* Browser-native audio capabilities

The project is designed without requiring a traditional application server for the core workflow.

---

# 🏗️ Architecture Philosophy

Smart MoM Studio follows a philosophy of:

> **Pragmatic Innovation through AI-Augmented Development**

The goal is not to build the largest possible infrastructure.

The goal is to solve a real operational problem with the smallest practical architecture.

Instead of:

```text
Frontend
   ↓
Backend
   ↓
Database
   ↓
Queue Server
   ↓
Storage Server
   ↓
AI Server
```

the application attempts to do much of the work directly in the browser:

```text
Browser
 ├── UI
 ├── Recorder
 ├── Speech Recognition
 ├── Local Database
 ├── Offline Queue
 ├── Audio Archive
 └── AI Connector
```

This reduces infrastructure requirements and makes the system easier to deploy.

---

# 🌍 Intended Use Cases

Smart MoM Studio can be useful for:

* Team meetings
* Project meetings
* Workshops
* Training sessions
* Academic discussions
* Community consultations
* NGO meetings
* Government meetings
* International development meetings
* Field coordination
* Remote / hybrid meetings
* Research discussions

It can also be used as a lightweight digital meeting recorder for organizations that do not want to deploy a full enterprise meeting platform.

---

# 🎯 Recommended Meeting Workflow

## Before the meeting

1. Open Smart MoM Studio.
2. Confirm the browser is online if AI processing will be used immediately.
3. Configure Gemini API key if required.
4. Select the recognition language.
5. Enter meeting metadata.
6. Test the microphone.
7. For a room setup, place the microphone near the center of the table.
8. Confirm that browser microphone permissions are enabled.

## During the meeting

1. Start recording.
2. Keep the microphone unobstructed.
3. Monitor the recorder status.
4. Use speaker labels when useful.
5. Add notes to important discussion points.
6. Allow automatic chunking when appropriate.

## After the meeting

1. Stop recording.
2. Review the transcript.
3. Process remaining chunks.
4. Consolidate the MoM.
5. Review AI output.
6. Export the required format.
7. Keep the local audio archive if retention is required.

---

# 🧪 Example: Meeting Room Deployment

A simple deployment can consist of:

```text
┌───────────────────────────────┐
│          MEETING ROOM         │
│                               │
│ 👤       👤       👤          │
│                               │
│           🎙️                  │
│       Conference Mic          │
│                               │
│ 👤       👤       👤          │
└──────────────┬────────────────┘
               │ USB
               ▼
        Laptop / Mini PC
               │
               ▼
      Smart MoM Studio PWA
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
    Local Data      Gemini
        │             │
        └──────┬──────┘
               ▼
             MoM
```

This is one of the most practical deployment scenarios for the project.

---

# ⚠️ Limitations

Smart MoM Studio is intentionally transparent about its limitations.

## Browser Speech Recognition

Speech recognition quality depends on browser and operating-system capabilities.

Recognition may be affected by:

* Accent
* Background noise
* Multiple simultaneous speakers
* Low microphone quality
* Internet availability
* Browser implementation
* Recognition engine limitations

The resilience mechanisms reduce the impact of recognition interruptions, but they cannot guarantee perfect transcription.

---

## Speaker Identification

The application provides manual speaker labels.

It does not currently provide guaranteed biometric speaker identification.

A 360° microphone can capture the room but does not inherently know the identity of every speaker.

---

## Language Detection

Language detection is heuristic.

It should be treated as an indicator rather than a certified linguistic classifier.

---

## AI Output

AI-generated Minutes of Meeting can contain:

* Missing information
* Incorrect interpretation
* Hallucinated details
* Incorrect attribution
* Ambiguous action items

AI output should therefore be reviewed by a human before being treated as an official meeting record.

---

## Browser Storage

Local browser storage is subject to browser and device conditions.

Large audio archives should be managed carefully.

For important meetings, export the required data rather than treating browser storage as the only permanent backup.

---

# 🔒 Security Considerations

Users should understand that the Gemini API key is stored in browser local storage.

Therefore:

* Do not expose the key publicly.
* Do not commit the key to GitHub.
* Do not place the key directly into source code.
* Do not include the key in screenshots or demonstrations.
* Use an appropriate API key management strategy for organizational deployments.

A publicly deployed frontend should never assume that a client-side API key is equivalent to a server-side secret.

For production enterprise deployment, a dedicated secure backend or proxy may be more appropriate.

---

# 🚀 Deployment

Smart MoM Studio can be deployed as a static web application.

For example:

```text
GitHub Pages
        ↓
HTML / JS / CSS
        ↓
Browser
        ↓
PWA
```

No traditional backend server is required for the basic application architecture.

The repository can therefore be served using static hosting platforms such as:

* GitHub Pages
* Netlify
* Other static hosting providers

---

# 💻 Local Development

Clone the repository:

```bash
git clone https://github.com/AnggaConni/Smart-Recorder.git
```

Enter the directory:

```bash
cd Smart-Recorder
```

Then serve the project using a local HTTP server.

For example:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

Using an HTTP server is recommended rather than opening the HTML file directly, especially for testing PWA and browser APIs.

---

# 📁 Suggested Project Structure

A typical deployment can contain:

```text
Smart-Recorder/
│
├── index.html
├── manifest.json
├── sw.js
├── favicon.svg
├── thumbnail.png
│
└── README.md
```

Additional assets may be added as the application evolves.

---

# 🧭 Project Direction

Potential future development areas include:

### Advanced speaker diarization

Automatically distinguishing:

```text
Speaker A
Speaker B
Speaker C
```

from a single conference microphone.

### Better microphone integration

Optimizing the application specifically for:

* 360° conference microphones
* Microphone arrays
* Beamforming devices
* Meeting-room audio systems

### Improved transcription recovery

Using archived audio to selectively recover portions of a meeting where live recognition was weak.

### Better AI consolidation

Combining multiple transcript chunks into a single coherent meeting record while reducing duplication between chunks.

### Meeting intelligence

Potential future features may include:

* Decision tracking
* Action-item tracking
* Deadline detection
* Topic clustering
* Follow-up monitoring
* Risk extraction
* Meeting quality analytics

---

# 🤝 Contributing

Contributions, ideas, bug reports, and improvements are welcome.

Before submitting a pull request:

1. Test the application in a modern browser.
2. Check offline behavior where relevant.
3. Avoid committing API keys or secrets.
4. Document significant behavior changes.
5. Keep dependencies and licensing compatible with the project.

Because this project uses a copyleft license, contributors should review the licensing implications of incorporating third-party code and dependencies.

GitHub notes that projects should review licensing compatibility when incorporating external or AI-generated code.

---

# 📜 License

Smart MoM Studio is released under the:

## GNU Affero General Public License v3.0

SPDX identifier:

```text
AGPL-3.0
```

See the `LICENSE` file in this repository for the complete license text.

The GNU Affero GPL is designed for software that can be used over a network and includes additional copyleft requirements for network-interactive software.

Official license information:

https://www.gnu.org/licenses/agpl-3.0.html

GitHub's license tooling recognizes `AGPL-3.0` as the SPDX identifier for the GNU Affero General Public License v3.0.

---

# ⚖️ Third-Party Services

Smart MoM Studio can interact with external services such as Google Gemini.

Those services have their own:

* Terms of service
* Privacy policies
* API policies
* Usage limits
* Data handling rules

Using Smart MoM Studio with an external AI provider means that the portions of data explicitly sent to that provider are subject to that provider's policies.

The Smart MoM Studio license does not override the terms of third-party services.

---

# 📢 Disclaimer

Smart MoM Studio is provided as open-source software.

It is intended as a practical productivity and meeting-documentation tool.

It is not a guarantee of:

* Perfect transcription
* Perfect meeting minutes
* Perfect speaker identification
* Perfect data recovery
* Continuous browser operation
* AI factual accuracy

Always review important meeting records before using them as official documentation.

---

# 🌱 Philosophy

Smart MoM Studio was built around a simple idea:

> **Technology should remain useful when infrastructure becomes unreliable.**

A meeting should not disappear simply because:

* Wi-Fi disappears.
* AI is temporarily unavailable.
* A recognition engine stops.
* A browser interrupts a process.

The application therefore treats local persistence, offline operation, recovery, and human review as first-class parts of the system.

The AI is an assistant.

The meeting record belongs to the people who created it.

---

# ⭐ Project

**Smart MoM Studio**
Offline Recorder + AI Minutes

Built with:

```text
HTML5
JavaScript
PWA
Web APIs
IndexedDB
Google Gemini
```

Developed by **Angga Conni Saputra**

🌐 https://anggaconni.github.io/Smart-Recorder/

📦 https://anggaconni.github.io/Download/

📜 License: **AGPL-3.0**
