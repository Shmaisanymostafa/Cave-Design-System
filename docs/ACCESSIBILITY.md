# Accessibility validation

Target: WCAG 2.2 AA for the documentation, brand tools and semantic web components.
This is a target, not a certification claim.

Automated local checks cover Chromium, Firefox and WebKit; English/Arabic; narrow
and desktop widths; full-label controls; modal focus restoration; RTL tab keys;
200% CSS zoom/reflow (distinct from human browser-zoom review); delayed script loading; configured URLs; template validation; reduced motion;
axe WCAG A/AA rules; and PNG downloads. Visual review pages compare both languages
across Light, Dark and Black. Flutter tests cover 320px layouts, 200% text scaling,
localization semantics and native tap-target/label guidelines.

Before a public release, a person should complete VoiceOver/Safari, NVDA/Firefox,
TalkBack/Android and VoiceOver/iOS sessions. Check reading order, mixed-script
announcements, validation recovery, dialog focus, system font scaling and zoom.
Automated accessibility trees and axe results do not replace those sessions.

Mirror navigation arrows where their meaning follows reading direction. Do not
mirror logos, media controls, graphs, clocks or every icon automatically. Web's
cave-icon--directional helper is opt-in. Flutter IconData should explicitly use
matchTextDirection when appropriate. Emails, phone numbers and record identifiers
need LTR isolation, while personal names may need automatic paragraph direction.
