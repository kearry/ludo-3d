// __mocks__/three.ts

import * as THREE from 'three'

const mockThree = {
    Mesh: function Mesh({ children, 'data-testid': testid, position, material }: THREE.MeshProps & { 'data-testid'?: string }) {
      return (
        <div data-testid={testid} data-position={JSON.stringify(position)} data-material={JSON.stringify(material)}>
          {children}
        </div>
      )
    },
  BoxGeometry: function BoxGeometry(width: number, height: number, depth: number) {
    return { width, height, depth }
  },
  SphereGeometry: function SphereGeometry(radius: number, widthSegments: number, heightSegments: number) {
    return { radius, widthSegments, heightSegments }
  },
  MeshStandardMaterial: function MeshStandardMaterial(parameters: THREE.MeshStandardMaterialParameters) {
    return parameters
  },
  Vector3: function Vector3(x: number, y: number, z: number) {
    return { x, y, z, set: jest.fn(), add: jest.fn() }
  },
  Quaternion: function Quaternion() {
    return { setFromEuler: jest.fn() }
  },
  Euler: function Euler(x: number, y: number, z: number) {
    return { x, y, z }
  },
}

export default {
  ...jest.requireActual('three'),
  ...mockThree,
}