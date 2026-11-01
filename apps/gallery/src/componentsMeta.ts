import manifestData from '../../../packages/ui/components.json';
import type { PropItem } from './components/ComponentPage';

export interface ComponentPropDoc {
  name: string;
  type: string;
  allowedValues?: string[];
  defaultValue?: string;
  required: boolean;
  description: string;
  example?: string;
}

export interface ComponentDoc {
  name: string;
  importPath: string;
  description: string;
  category: 'Foundation' | 'Actions' | 'Forms' | 'Display';
  variants?: string[];
  sizes?: string[];
  whenToUse: string[];
  whenNotToUse: string[];
  accessibilityNotes: string[];
  props: ComponentPropDoc[];
  example: string;
}

export interface DesignSystemManifest {
  name: string;
  version: string;
  description: string;
  components: ComponentDoc[];
}

export const manifest = manifestData as unknown as DesignSystemManifest;

export function getComponentDoc(name: string): ComponentDoc {
  const doc = manifest.components.find((c) => c.name === name);
  if (!doc) {
    throw new Error(`Component "${name}" was not found in components.json manifest`);
  }
  return doc;
}

export function formatPropsForGallery(props: ComponentPropDoc[]): PropItem[] {
  return props.map((p) => {
    let typeDisplay = p.type;
    if (p.allowedValues && p.allowedValues.length > 0) {
      typeDisplay = p.allowedValues.map((v) => `'${v}'`).join(' | ');
    }
    return {
      name: p.name,
      type: typeDisplay,
      default: p.defaultValue ?? 'None',
      description: p.description,
      example: p.example,
    };
  });
}
