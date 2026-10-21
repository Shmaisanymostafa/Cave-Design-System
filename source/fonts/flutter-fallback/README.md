# Local Flutter Arabic fallback

Noto Sans Arabic WOFF2 subset used by the pinned Flutter 3.47.6 engine when
Almarai/Poppins do not cover a glyph. Source:
https://fonts.gstatic.com/s/notosansarabic/v28/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyvvnCBFQLaig.woff2

License: OFL.txt from https://github.com/google/fonts/tree/main/ofl/notosansarabic.

The gallery bootstrap points the engine's fontFallbackBaseUrl to this local
folder. Browser tests assert no missing assets or external requests for supported
English/Arabic examples. Check fallback filenames again when upgrading Flutter.
This font is for the optional gallery, not a mandatory UI library dependency.
