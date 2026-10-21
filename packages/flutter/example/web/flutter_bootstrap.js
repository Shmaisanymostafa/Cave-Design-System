{{flutter_js}}
{{flutter_build_config}}
_flutter.loader.load({onEntrypointLoaded:async(engineInitializer)=>{const appRunner=await engineInitializer.initializeEngine({fontFallbackBaseUrl:new URL('font-fallback/',document.baseURI).href});await appRunner.runApp();parent.postMessage({type:'cave:flutter-ready'},location.origin);}});