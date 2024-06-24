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

const testNodesDto = [
  {
    "id": 1,
    "betriebspunktName": "OSRD",
    "fullName": "SNCF main station",
    "positionX": 42,
    "positionY": 42,
    "ports": [],
    "transitions": [],
    "connections": [],
    "resourceId": 1,
    "perronkanten": 10,
    "connectionTime": 5,
    "trainrunCategoryHaltezeiten": {
      "HaltezeitIPV": {
        "haltezeit": 3,
        "no_halt": false
      },
      "HaltezeitA": {
        "haltezeit": 2,
        "no_halt": false
      },
      "HaltezeitB": {
        "haltezeit": 2,
        "no_halt": false
      },
      "HaltezeitC": {
        "haltezeit": 1,
        "no_halt": false
      },
      "HaltezeitD": {
        "haltezeit": 1,
        "no_halt": false
      },
      "HaltezeitUncategorized": {
        "haltezeit": 0,
        "no_halt": true
      }
    },
    "symmetryAxis": 0,
    "warnings": null,
    "labelIds": []
  },
  {
    "id": 2,
    "betriebspunktName": "NGE",
    "fullName": "SBB main station",
    "positionX": 700,
    "positionY": 250,
    "ports": [],
    "transitions": [],
    "connections": [],
    "resourceId": 1,
    "perronkanten": 10,
    "connectionTime": 5,
    "trainrunCategoryHaltezeiten": {
      "HaltezeitIPV": {
        "haltezeit": 3,
        "no_halt": false
      },
      "HaltezeitA": {
        "haltezeit": 2,
        "no_halt": false
      },
      "HaltezeitB": {
        "haltezeit": 2,
        "no_halt": false
      },
      "HaltezeitC": {
        "haltezeit": 1,
        "no_halt": false
      },
      "HaltezeitD": {
        "haltezeit": 1,
        "no_halt": false
      },
      "HaltezeitUncategorized": {
        "haltezeit": 0,
        "no_halt": true
      }
    },
    "symmetryAxis": 0,
    "warnings": null,
    "labelIds": []
  }
];

function NGE() {
  const frameRef = useRef(null);

  useEffect(() => {
    const frame = frameRef.current;

    function handleFrameLoad() {
      frame.removeEventListener('load', handleFrameLoad);

      const ngeRoot = frame.contentDocument.createElement('sbb-root');
      frame.contentDocument.body.appendChild(ngeRoot);

      // listens to create and update operations
      ngeRoot.addEventListener('trainrunSectionOperation', (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('TrainrunSectionOperation received', event.detail);
      });

      // listens to delete operation
      ngeRoot.addEventListener('trainrunOperation', (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('TrainrunOperation received', event.detail);
      });

      // get netzgrafik model from NGE
      let netzgrafikDto = ngeRoot.netzgrafikDto;

      // set new netzgrafik model with new nodes
      netzgrafikDto.nodes = testNodesDto;
      ngeRoot.netzgrafikDto = netzgrafikDto;
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
