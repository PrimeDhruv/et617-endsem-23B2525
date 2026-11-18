# 08. Limitations and Future Work

### Current Limitations
1. **Local-Only Device Synchronization:** State sync operates across tabs on the same browser/device via `localStorage`. In a real-world multi-tablet deployment, a lightweight real-time backend (e.g., Supabase, WebSockets, or Firebase) would be needed for multi-device sync across different physical hardware.
2. **Simplified Factor Model:** Photosynthesis in nature involves complex stomatal conductance, light wavelengths, and photoinhibition. Bubble Lab uses a 3-factor limiting model tailored specifically to Classes 3–5.
3. **Audio Cues Omitted:** Sound effects for bubbling were intentionally excluded to prevent audio chaos in a shared multi-grade classroom.

### Next 5 Improvements
1. **Multi-device WebRTC/WebSocket Sync:** Real-time peer-to-peer sync so tablet groups can beam their trials directly to the teacher's projector screen.
2. **Multilingual Localisation:** Hindi, Marathi, and Tamil language toggles for rural Indian primary schools.
3. **Interactive Light Spectrum:** Wavelength filter (red, blue, green light) to extend the lab for Class 6–8 learners.
4. **Teacher Audio Notes:** Allow teachers to record a 10-second voice note feedback instead of typing.
5. **Classroom Printable Lab Sheets:** One-click PDF export of team trial tables and bar charts.
