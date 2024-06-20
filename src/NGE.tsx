import { useRef, useEffect } from 'react';

import ngeStyles from '@osrd-project/netzgrafik-frontend/dist/netzgrafik-frontend/en/styles.css?url';
import ngeRuntime from '@osrd-project/netzgrafik-frontend/dist/netzgrafik-frontend/en/runtime.js?url';
import ngePolyfills from '@osrd-project/netzgrafik-frontend/dist/netzgrafik-frontend/en/polyfills.js?url';
import ngeVendor from '@osrd-project/netzgrafik-frontend/dist/netzgrafik-frontend/en/vendor.js?url';
import ngeMain from '@osrd-project/netzgrafik-frontend/dist/netzgrafik-frontend/en/main.js?url';

import './NGE.css';

const frameSrc = `
<!DOCTYPE html>
<html class="sbb-lean">
  <head>
    <link rel="stylesheet" href="${ngeStyles}"></link>
    <script type="module" src="${ngeRuntime}"></script>
    <script type="module" src="${ngePolyfills}"></script>
    <script type="module" src="${ngeVendor}"></script>
    <script type="module" src="${ngeMain}"></script>
  </head>
  <body></body>
</html>
`;

function NGE() {
  const frameRef = useRef(null);

  useEffect(() => {
    const frame = frameRef.current;

    function handleFrameLoad() {
      frame.removeEventListener('load', handleFrameLoad);

      const ngeRoot = frame.contentDocument.createElement('sbb-root');
      frame.contentDocument.body.appendChild(ngeRoot);
    }

    frame.addEventListener('load', handleFrameLoad);

    return () => {
      frame.removeEventListener('load', handleFrameLoad);
    };
  }, []);

  return (
    <>
      <iframe ref={frameRef} srcDoc={frameSrc}></iframe>
    </>
  );
}

export default NGE;
